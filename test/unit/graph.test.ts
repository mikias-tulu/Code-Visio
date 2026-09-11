import { describe, expect, it } from 'vitest';
import { createDemoGraph } from '../../src/core/graph/demo';
import type { CodeGraph } from '../../src/core/graph/model';
import { validateGraph } from '../../src/core/graph/validate';

describe('createDemoGraph', () => {
  it('produces a consistent graph', () => {
    expect(validateGraph(createDemoGraph())).toEqual([]);
  });

  it('derives display names from ids', () => {
    const names = new Map(createDemoGraph().nodes.map((node) => [node.id, node.name]));
    expect(names.get('src')).toBe('src');
    expect(names.get('src/indexer.ts')).toBe('indexer.ts');
    expect(names.get('src/indexer.ts#Indexer')).toBe('Indexer');
    expect(names.get('src/indexer.ts#Indexer.indexFile')).toBe('indexFile');
  });
});

describe('validateGraph', () => {
  it('reports duplicate ids, unknown parents and dangling edges', () => {
    const graph: CodeGraph = {
      nodes: [
        { id: 'a', kind: 'file', name: 'a' },
        { id: 'a', kind: 'file', name: 'a again' },
        { id: 'b', kind: 'function', name: 'b', parent: 'missing-parent' },
      ],
      edges: [{ id: 'e1', source: 'a', target: 'nowhere', kind: 'calls', confidence: 'exact' }],
    };

    expect(validateGraph(graph)).toEqual([
      'duplicate node id "a"',
      'node "b" has unknown parent "missing-parent"',
      'edge "e1" has unknown target "nowhere"',
    ]);
  });
});
