import type { GraphNode } from '../../../src/core/graph/model';

/** Details of the selected node, shown below the graph. */
export function Inspector({ node }: { node: GraphNode }) {
  return (
    <footer className="inspector">
      <div className="kind">{node.kind}</div>
      <div className="name">{node.name}</div>
      {node.signature && <code className="signature">{node.signature}</code>}
      <div className="id">{node.id}</div>
    </footer>
  );
}
