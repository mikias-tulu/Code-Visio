import { describe, expect, it } from 'vitest';
import { isWebviewMessage } from '../../src/shared/protocol';

describe('isWebviewMessage', () => {
  it('accepts well-formed messages', () => {
    expect(isWebviewMessage({ type: 'ready' })).toBe(true);
    expect(isWebviewMessage({ type: 'openInEditorTab' })).toBe(true);
    expect(isWebviewMessage({ type: 'openNode', nodeId: 'src/a.ts#f' })).toBe(true);
  });

  it('rejects malformed messages', () => {
    expect(isWebviewMessage(null)).toBe(false);
    expect(isWebviewMessage('ready')).toBe(false);
    expect(isWebviewMessage({ type: 'unknown' })).toBe(false);
    expect(isWebviewMessage({ type: 'openNode' })).toBe(false);
    expect(isWebviewMessage({ type: 'openNode', nodeId: 42 })).toBe(false);
  });
});
