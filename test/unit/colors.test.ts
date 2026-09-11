import { describe, expect, it } from 'vitest';
import { toCytoscapeColor } from '../../webview/src/graph/colors';

describe('toCytoscapeColor', () => {
  it('converts 8-digit and 4-digit hex with alpha to rgba()', () => {
    expect(toCytoscapeColor('#80808059')).toBe('rgba(128, 128, 128, 0.35)');
    expect(toCytoscapeColor('#f008')).toBe('rgba(255, 0, 0, 0.53)');
  });

  it('leaves colors Cytoscape already understands unchanged', () => {
    expect(toCytoscapeColor('#1e1e1e')).toBe('#1e1e1e');
    expect(toCytoscapeColor(' rgb(1, 2, 3) ')).toBe('rgb(1, 2, 3)');
    expect(toCytoscapeColor('red')).toBe('red');
  });
});
