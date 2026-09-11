import { randomBytes } from 'node:crypto';
import * as vscode from 'vscode';
import type { Surface } from '../shared/protocol';

/** Folder holding the bundled webview (see esbuild.mjs). */
function webviewDist(extensionUri: vscode.Uri): vscode.Uri {
  return vscode.Uri.joinPath(extensionUri, 'dist', 'webview');
}

export function webviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
  return { enableScripts: true, localResourceRoots: [webviewDist(extensionUri)] };
}

/** Page that boots the React graph app, locked down with a nonce-based CSP. */
export function renderWebviewHtml(webview: vscode.Webview, extensionUri: vscode.Uri, surface: Surface): string {
  const dist = webviewDist(extensionUri);
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(dist, 'webview.js'));
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(dist, 'webview.css'));
  const nonce = randomBytes(16).toString('base64');

  const csp = [
    "default-src 'none'",
    `script-src 'nonce-${nonce}'`,
    // Cytoscape positions its canvas layers with inline styles.
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    `img-src ${webview.cspSource} data:`,
    `font-src ${webview.cspSource}`,
  ].join('; ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${styleUri.toString()}">
  <title>Code Visio</title>
</head>
<body>
  <div id="root" data-surface="${surface}"></div>
  <script nonce="${nonce}" src="${scriptUri.toString()}"></script>
</body>
</html>`;
}
