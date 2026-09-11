import * as assert from 'node:assert';
import * as vscode from 'vscode';

const extensionId = 'mikias-tulu.code-visio';

suite('Code Visio extension', () => {
  test('activates and registers its commands', async () => {
    const extension = vscode.extensions.getExtension(extensionId);
    assert.ok(extension, `${extensionId} is not installed in the test instance`);
    await extension.activate();

    const commands = await vscode.commands.getCommands(true);
    for (const id of ['codeVisio.showGraph', 'codeVisio.openGraphPanel', 'codeVisio.refresh']) {
      assert.ok(commands.includes(id), `command ${id} is not registered`);
    }
  });

  test('opens the graph in an editor tab', async () => {
    await vscode.commands.executeCommand('codeVisio.openGraphPanel');
    const tab = vscode.window.tabGroups.activeTabGroup.activeTab;
    assert.ok(tab?.input instanceof vscode.TabInputWebview, 'active tab is not a webview');
    assert.strictEqual(tab.label, 'Code Visio');
  });
});
