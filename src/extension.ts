import * as vscode from 'vscode';
import { createDemoGraph } from './core/graph/demo';
import { Commands } from './vscode/commands';
import { GraphHub } from './vscode/graphHub';
import { showGraphPanel } from './vscode/graphPanel';
import { GraphViewProvider } from './vscode/graphViewProvider';

export function activate(context: vscode.ExtensionContext): void {
  // Until the workspace indexer lands, every view shows the built-in demo graph.
  const hub = new GraphHub(context.extensionUri, createDemoGraph);

  context.subscriptions.push(
    hub,
    vscode.window.registerWebviewViewProvider(GraphViewProvider.viewId, new GraphViewProvider(hub), {
      webviewOptions: { retainContextWhenHidden: true },
    }),
    vscode.commands.registerCommand(Commands.showGraph, () =>
      vscode.commands.executeCommand(`${GraphViewProvider.viewId}.focus`),
    ),
    vscode.commands.registerCommand(Commands.openGraphPanel, () => showGraphPanel(context.extensionUri, hub)),
    vscode.commands.registerCommand(Commands.refresh, () => hub.refresh()),
  );
}

export function deactivate(): void {}
