import type * as vscode from 'vscode';
import type { GraphHub } from './graphHub';

/** The graph view in the Code Visio activity bar container. */
export class GraphViewProvider implements vscode.WebviewViewProvider {
  static readonly viewId = 'codeVisio.graphView';

  constructor(private readonly hub: GraphHub) {}

  resolveWebviewView(view: vscode.WebviewView): void {
    const connection = this.hub.attach(view.webview, 'sidebar');
    view.onDidDispose(() => connection.dispose());
  }
}
