// Messages exchanged between the extension host and the graph webview.
// Imported by both sides, so it must stay free of `vscode` and DOM dependencies.
import type { CodeGraph } from '../core/graph/model';

/** Where a graph webview is hosted. */
export type Surface = 'sidebar' | 'panel';

/** Extension host → webview. */
export type HostMessage = { type: 'graph'; graph: CodeGraph };

/** Webview → extension host. */
export type WebviewMessage =
  | { type: 'ready' }
  | { type: 'openNode'; nodeId: string }
  | { type: 'openInEditorTab' };

/** Guards the host against malformed messages from the webview. */
export function isWebviewMessage(value: unknown): value is WebviewMessage {
  if (typeof value !== 'object' || value === null) return false;
  const message = value as { type?: unknown; nodeId?: unknown };
  switch (message.type) {
    case 'ready':
    case 'openInEditorTab':
      return true;
    case 'openNode':
      return typeof message.nodeId === 'string';
    default:
      return false;
  }
}
