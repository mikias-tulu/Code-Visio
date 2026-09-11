import type { CodeGraph, EdgeKind, GraphEdge, GraphNode, NodeKind } from './model';

/**
 * A small hand-written graph (a sketch of Code Visio's own architecture) shown until the
 * workspace indexer exists.
 */
export function createDemoGraph(): CodeGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const node = (id: string, kind: NodeKind, parent?: string, signature?: string): string => {
    nodes.push({ id, kind, name: displayName(id), parent, signature });
    return id;
  };
  const edge = (source: string, target: string, kind: EdgeKind, confidence: GraphEdge['confidence'] = 'exact'): void => {
    edges.push({ id: `${kind}:${source}->${target}`, source, target, kind, confidence });
  };

  const src = node('src', 'folder');

  const extension = node('src/extension.ts', 'file', src);
  const activate = node('src/extension.ts#activate', 'function', extension, 'activate(context: ExtensionContext): void');

  const indexerFile = node('src/indexer.ts', 'file', src);
  const indexer = node('src/indexer.ts#Indexer', 'class', indexerFile);
  const indexWorkspace = node('src/indexer.ts#Indexer.indexWorkspace', 'method', indexer, 'indexWorkspace(): Promise<void>');
  const indexFile = node('src/indexer.ts#Indexer.indexFile', 'method', indexer, 'indexFile(uri: Uri): Promise<void>');

  const storeFile = node('src/graphStore.ts', 'file', src);
  const store = node('src/graphStore.ts#Store', 'interface', storeFile);
  const graphStore = node('src/graphStore.ts#GraphStore', 'class', storeFile);
  const upsert = node('src/graphStore.ts#GraphStore.upsert', 'method', graphStore, 'upsert(facts: FileFacts): void');
  const neighbors = node('src/graphStore.ts#GraphStore.neighbors', 'method', graphStore, 'neighbors(id: string, depth: number): CodeGraph');

  const llmFile = node('src/llm.ts', 'file', src);
  const explainNode = node('src/llm.ts#explainNode', 'function', llmFile, 'explainNode(id: string): AsyncIterable<string>');

  edge(extension, indexerFile, 'imports');
  edge(extension, storeFile, 'imports');
  edge(llmFile, storeFile, 'imports');
  edge(activate, indexWorkspace, 'calls');
  edge(indexWorkspace, indexFile, 'calls');
  edge(indexFile, upsert, 'calls');
  edge(explainNode, neighbors, 'calls', 'inferred');
  edge(graphStore, store, 'implements');

  return { nodes, edges };
}

/** `src/a.ts` → `a.ts`, `src/a.ts#Class.method` → `method`. */
function displayName(id: string): string {
  const hash = id.indexOf('#');
  if (hash === -1) return id.slice(id.lastIndexOf('/') + 1);
  const member = id.slice(hash + 1);
  return member.slice(member.lastIndexOf('.') + 1);
}
