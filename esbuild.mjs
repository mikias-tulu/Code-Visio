// Bundles the extension host code (Node, CommonJS) and the graph webview (browser, IIFE).
//   node esbuild.mjs               one-off development build
//   node esbuild.mjs --watch       rebuild on change (used by the "watch" VS Code task)
//   node esbuild.mjs --production  minified build without source maps (used by vsce)
import { rmSync } from 'node:fs';
import * as esbuild from 'esbuild';

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

// Prints errors in a format the problem matcher in .vscode/tasks.json understands, and marks
// when the builds are done so the debugger waits for them before launching.
let activeBuilds = 0;
const reporter = {
  name: 'reporter',
  setup(build) {
    build.onStart(() => {
      if (activeBuilds++ === 0 && watch) console.log('[watch] build started');
    });
    build.onEnd((result) => {
      for (const { text, location } of result.errors) {
        console.error(`✘ [ERROR] ${text}`);
        if (location) console.error(`    ${location.file}:${location.line}:${location.column}:`);
      }
      if (--activeBuilds === 0 && watch) console.log('[watch] build finished');
    });
  },
};

/** @type {esbuild.BuildOptions} */
const shared = {
  bundle: true,
  minify: production,
  sourcemap: !production,
  logLevel: 'silent',
  plugins: [reporter],
};

/** @type {esbuild.BuildOptions} */
const extension = {
  ...shared,
  entryPoints: ['src/extension.ts'],
  outfile: 'dist/extension.js',
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  external: ['vscode'],
};

/** @type {esbuild.BuildOptions} */
const webview = {
  ...shared,
  entryPoints: { webview: 'webview/src/main.tsx' },
  outdir: 'dist/webview',
  platform: 'browser',
  format: 'iife',
  target: 'es2022',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development') },
};

if (!watch) rmSync('dist', { recursive: true, force: true });

const contexts = await Promise.all([esbuild.context(extension), esbuild.context(webview)]);

if (watch) {
  await Promise.all(contexts.map((context) => context.watch()));
} else {
  try {
    await Promise.all(contexts.map((context) => context.rebuild()));
  } catch {
    process.exitCode = 1;
  } finally {
    await Promise.all(contexts.map((context) => context.dispose()));
  }
}
