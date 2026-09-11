import type cytoscape from 'cytoscape';
import type { NodeKind } from '../../../src/core/graph/model';
import type { GraphTheme } from './theme';

const kindShapes: Record<NodeKind, string> = {
  folder: 'round-rectangle',
  file: 'round-rectangle',
  class: 'round-rectangle',
  interface: 'round-diamond',
  function: 'ellipse',
  method: 'ellipse',
};

export function buildStylesheet(theme: GraphTheme): cytoscape.StylesheetJsonBlock[] {
  const kinds = Object.keys(theme.kinds) as NodeKind[];

  return [
    {
      selector: 'node',
      style: {
        label: 'data(label)',
        color: theme.foreground,
        'font-size': 10,
        'text-valign': 'bottom',
        'text-margin-y': 3,
        width: 14,
        height: 14,
        'border-width': 0,
      },
    },
    ...kinds.map((kind) => ({
      selector: `node[kind = "${kind}"]`,
      style: { 'background-color': theme.kinds[kind], shape: kindShapes[kind] },
    })) as cytoscape.StylesheetJsonBlock[],
    {
      // Containers (folders, files, classes) that currently hold other nodes.
      selector: ':parent',
      style: {
        'background-opacity': 0.06,
        'border-width': 1,
        'border-color': theme.border,
        'text-valign': 'top',
        'text-margin-y': -2,
        padding: '10px',
        color: theme.muted,
      },
    },
    {
      selector: 'node[kind = "class"]:parent, node[kind = "interface"]:parent',
      style: { 'border-color': theme.kinds.class, 'background-opacity': 0.1 },
    },
    {
      selector: 'node:selected',
      style: { 'border-width': 2, 'border-color': theme.focus },
    },
    {
      selector: 'edge',
      style: {
        width: 1.25,
        'curve-style': 'bezier',
        'line-color': theme.muted,
        'target-arrow-color': theme.muted,
        'target-arrow-shape': 'triangle',
        'arrow-scale': 0.8,
      },
    },
    { selector: 'edge[kind = "imports"]', style: { 'line-style': 'dashed' } },
    {
      selector: 'edge[kind = "extends"], edge[kind = "implements"]',
      style: { 'target-arrow-fill': 'hollow', 'arrow-scale': 1.1 },
    },
    { selector: 'edge[confidence = "inferred"]', style: { opacity: 0.55 } },
    {
      selector: 'edge:selected',
      style: { 'line-color': theme.focus, 'target-arrow-color': theme.focus, width: 2 },
    },
  ];
}
