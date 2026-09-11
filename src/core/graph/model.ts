/** Code entities that appear as nodes in the graph. */
export type NodeKind = 'folder' | 'file' | 'class' | 'interface' | 'function' | 'method';

/**
 * Relationships drawn as edges. Containment (folder → file → class → method) is not an edge:
 * it is expressed through `GraphNode.parent` and rendered as nesting.
 */
export type EdgeKind = 'imports' | 'calls' | 'extends' | 'implements' | 'references';

/** Zero-based `[startLine, startCharacter, endLine, endCharacter]`, matching `vscode.Range`. */
export type SourceRange = [number, number, number, number];

export interface GraphNode {
  /** Stable across re-indexes, e.g. `src/auth/service.ts#AuthService.login`. */
  id: string;
  kind: NodeKind;
  name: string;
  /** Id of the containing node, if any. */
  parent?: string;
  /** URI of the declaring file (string form of `vscode.Uri`), absent for synthetic nodes. */
  uri?: string;
  range?: SourceRange;
  signature?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: EdgeKind;
  /** `exact` when resolved through imports, types or a language server; `inferred` when matched by name. */
  confidence: 'exact' | 'inferred';
}

export interface CodeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
