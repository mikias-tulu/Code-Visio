import type { CodeGraph } from './model';

/**
 * Checks the invariants the renderer relies on: unique ids, and every parent and edge endpoint
 * referring to an existing node. Returns human-readable problems; empty means consistent.
 */
export function validateGraph(graph: CodeGraph): string[] {
  const problems: string[] = [];

  const nodeIds = new Set<string>();
  for (const node of graph.nodes) {
    if (nodeIds.has(node.id)) problems.push(`duplicate node id "${node.id}"`);
    nodeIds.add(node.id);
  }

  for (const node of graph.nodes) {
    if (node.parent !== undefined && !nodeIds.has(node.parent)) {
      problems.push(`node "${node.id}" has unknown parent "${node.parent}"`);
    }
  }

  const edgeIds = new Set<string>();
  for (const edge of graph.edges) {
    if (edgeIds.has(edge.id)) problems.push(`duplicate edge id "${edge.id}"`);
    edgeIds.add(edge.id);
    if (!nodeIds.has(edge.source)) problems.push(`edge "${edge.id}" has unknown source "${edge.source}"`);
    if (!nodeIds.has(edge.target)) problems.push(`edge "${edge.id}" has unknown target "${edge.target}"`);
  }

  return problems;
}
