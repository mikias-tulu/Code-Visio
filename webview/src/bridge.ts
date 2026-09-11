import type { HostMessage, WebviewMessage } from '../../src/shared/protocol';

const vscode = acquireVsCodeApi();

export function postToHost(message: WebviewMessage): void {
  vscode.postMessage(message);
}

/** Subscribes to messages from the extension host; returns an unsubscribe function. */
export function onHostMessage(handler: (message: HostMessage) => void): () => void {
  const listener = (event: MessageEvent<HostMessage>) => handler(event.data);
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
}
