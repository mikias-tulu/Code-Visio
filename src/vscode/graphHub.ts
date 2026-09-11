import * as vscode from 'vscode';
import type { CodeGraph } from '../core/graph/model';
import { isWebviewMessage, type HostMessage, type Surface } from '../shared/protocol';
import { Commands } from './commands';
import { renderWebviewHtml, webviewOptions } from './webviewHtml';

interface Connection {
  webview: vscode.Webview;
  listener: vscode.Disposable;
}

/**
 * Connects every open graph webview (sidebar and editor tab) to one graph source, so they
 * all show the same graph and handle the same requests.
 */
export class GraphHub implements vscode.Disposable {
  private readonly connections = new Set<Connection>();

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly getGraph: () => CodeGraph,
  ) {}

  /** Loads the graph app into `webview`; dispose the result when the webview goes away. */
  attach(webview: vscode.Webview, surface: Surface): vscode.Disposable {
    webview.options = webviewOptions(this.extensionUri);
    webview.html = renderWebviewHtml(webview, this.extensionUri, surface);

    const listener = webview.onDidReceiveMessage((message: unknown) => {
      if (!isWebviewMessage(message)) return;
      switch (message.type) {
        case 'ready':
          void post(webview, { type: 'graph', graph: this.getGraph() });
          break;
        case 'openNode':
          void this.revealNode(message.nodeId, surface);
          break;
        case 'openInEditorTab':
          void vscode.commands.executeCommand(Commands.openGraphPanel);
          break;
      }
    });

    const connection: Connection = { webview, listener };
    this.connections.add(connection);
    return new vscode.Disposable(() => {
      listener.dispose();
      this.connections.delete(connection);
    });
  }

  /** Sends a freshly built graph to every open webview. */
  refresh(): void {
    const graph = this.getGraph();
    for (const { webview } of this.connections) void post(webview, { type: 'graph', graph });
  }

  dispose(): void {
    for (const { listener } of this.connections) listener.dispose();
    this.connections.clear();
  }

  private async revealNode(nodeId: string, surface: Surface): Promise<void> {
    const node = this.getGraph().nodes.find((candidate) => candidate.id === nodeId);
    if (!node?.uri) return;

    const [line, character] = node.range ?? [0, 0];
    const position = new vscode.Position(line, character);
    await vscode.window.showTextDocument(vscode.Uri.parse(node.uri), {
      selection: new vscode.Range(position, position),
      // From an editor-tab graph, open code beside it rather than replacing the graph.
      viewColumn: surface === 'panel' ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active,
    });
  }
}

function post(webview: vscode.Webview, message: HostMessage): Thenable<boolean> {
  return webview.postMessage(message);
}
