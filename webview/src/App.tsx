import { useEffect, useRef, useState } from 'react';
import type { CodeGraph, GraphNode } from '../../src/core/graph/model';
import type { Surface } from '../../src/shared/protocol';
import { onHostMessage, postToHost } from './bridge';
import { CytoscapeView, type CytoscapeViewHandle } from './graph/CytoscapeView';
import { Inspector } from './panels/Inspector';

export function App({ surface }: { surface: Surface }) {
  const [graph, setGraph] = useState<CodeGraph>();
  const [selected, setSelected] = useState<GraphNode>();
  const graphView = useRef<CytoscapeViewHandle>(null);

  useEffect(() => {
    const unsubscribe = onHostMessage((message) => {
      if (message.type === 'graph') {
        setGraph(message.graph);
        setSelected(undefined);
      }
    });
    postToHost({ type: 'ready' });
    return unsubscribe;
  }, []);

  return (
    <div className="app">
      <header className="toolbar">
        <span className="stats">{graph ? `${graph.nodes.length} nodes · ${graph.edges.length} edges` : 'Loading…'}</span>
        <button type="button" title="Fit graph to view" onClick={() => graphView.current?.fit()}>
          Fit
        </button>
        <button type="button" title="Re-run layout" onClick={() => graphView.current?.relayout()}>
          Layout
        </button>
        {surface === 'sidebar' && (
          <button type="button" title="Open in editor tab" onClick={() => postToHost({ type: 'openInEditorTab' })}>
            Expand
          </button>
        )}
      </header>

      <main className="canvas">
        {graph && (
          <CytoscapeView
            ref={graphView}
            graph={graph}
            onSelect={setSelected}
            onOpen={(nodeId) => postToHost({ type: 'openNode', nodeId })}
          />
        )}
      </main>

      {selected && <Inspector node={selected} />}
    </div>
  );
}
