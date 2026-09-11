import * as vscode from 'vscode';
import type { GraphHub } from './graphHub';

let current: vscode.WebviewPanel | undefined;

/** Shows the graph in a full-size editor tab, for when the sidebar is too narrow. */
export function showGraphPanel(extensionUri: vscode.Uri, hub: GraphHub): void {
  if (current) {
    current.reveal();
    return;
  }

  const panel = vscode.window.createWebviewPanel('codeVisio.graphPanel', 'Code Visio', vscode.ViewColumn.Active, {
    retainContextWhenHidden: true,
  });
  panel.iconPath = vscode.Uri.joinPath(extensionUri, 'media', 'activity-icon.svg');

  const connection = hub.attach(panel.webview, 'panel');
  panel.onDidDispose(() => {
    connection.dispose();
    current = undefined;
  });
  current = panel;
}
