# Code Visio

Code Visio analyzes your source code and renders an interactive graph in the VS Code sidebar: not just
which files depend on each other, but how functions, classes and methods connect. It also includes
LLM-powered explanations and Q&A about the codebase.

> **Status: M0 (scaffold).** The sidebar view, editor-tab view and build pipeline work end to end
> with a built-in demo graph. The workspace indexer comes next.

## Features (planned)

- **Graph at every level**: folders → files → classes → functions/methods, with import, call,
  inheritance and reference edges.
- **Focus mode**: put the cursor in a function to see its callers and callees.
- **Click to navigate**: double-click a node to jump to its source.
- **AI**: explain a node, summarize modules, and ask questions whose answers highlight the relevant
  path in the graph.

## Development

Requires **Node 22+** (CI uses Node 24 LTS) and VS Code 1.100+.

```bash
npm install
npm run build
```

Press **F5** in VS Code ("Run Extension") to launch an Extension Development Host. The `watch` task
rebuilds on change; reload the dev host window (`Ctrl+R`) to pick up changes.

| Script | What it does |
| --- | --- |
| `npm run build` | Bundle the extension and webview into `dist/` (esbuild) |
| `npm run watch` | Rebuild on change |
| `npm run typecheck` | Type-check the extension host and webview projects |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run test:integration` | Integration tests inside a downloaded VS Code instance |
| `npm run check` | Typecheck, lint, unit tests and build |
| `npm run package` | Produce a `.vsix` |


```
src/
  extension.ts   entry point: registers views and commands
  core/          pure logic, no `vscode` imports (graph, indexer, languages)
  llm/           LLM provider, context building, agent tools
  vscode/        VS Code glue: sidebar view, editor tab, commands, editor sync
  shared/        typed messages between extension host and webview
webview/src/     React + Cytoscape.js graph UI (graph/, panels/)
grammars/        tree-sitter .wasm grammars
test/            unit/ (Vitest), integration/ (@vscode/test-cli), fixtures/
```
