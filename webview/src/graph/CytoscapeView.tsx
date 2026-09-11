import cytoscape from 'cytoscape';
import { useEffect, useImperativeHandle, useLayoutEffect, useRef, type Ref } from 'react';
import type { CodeGraph, GraphNode } from '../../../src/core/graph/model';
import { defaultLayout } from './layouts';
import { buildStylesheet } from './styles';
import { readTheme } from './theme';

export interface CytoscapeViewHandle {
  fit(): void;
  relayout(): void;
}

interface CytoscapeViewProps {
  graph: CodeGraph;
  onSelect(node: GraphNode | undefined): void;
  onOpen(nodeId: string): void;
  ref?: Ref<CytoscapeViewHandle>;
}

export function CytoscapeView({ graph, onSelect, onOpen, ref }: CytoscapeViewProps) {
  const container = useRef<HTMLDivElement>(null);
  const cy = useRef<cytoscape.Core>(null);

  // Cytoscape handlers are bound once per graph; read the latest callbacks through a ref.
  const callbacks = useRef({ onSelect, onOpen });
  useLayoutEffect(() => {
    callbacks.current = { onSelect, onOpen };
  });

  useEffect(() => {
    if (!container.current) return;

    const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
    const instance = cytoscape({
      container: container.current,
      elements: toElements(graph),
      style: buildStylesheet(readTheme()),
      layout: defaultLayout,
      minZoom: 0.1,
      maxZoom: 4,
    });

    instance.on('tap', 'node', (event) => callbacks.current.onSelect(nodesById.get(event.target.id())));
    instance.on('tap', (event) => {
      if (event.target === instance) callbacks.current.onSelect(undefined);
    });
    instance.on('dbltap', 'node', (event) => callbacks.current.onOpen(event.target.id()));

    // VS Code swaps classes on <body> when the color theme changes.
    const themeObserver = new MutationObserver(() => instance.style(buildStylesheet(readTheme())));
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    const resizeObserver = new ResizeObserver(() => instance.resize());
    resizeObserver.observe(container.current);

    cy.current = instance;
    return () => {
      themeObserver.disconnect();
      resizeObserver.disconnect();
      instance.destroy();
      cy.current = null;
    };
  }, [graph]);

  useImperativeHandle(
    ref,
    () => ({
      fit: () => cy.current?.fit(undefined, 24),
      relayout: () => cy.current?.layout(defaultLayout).run(),
    }),
    [],
  );

  return <div ref={container} className="graph" />;
}

function toElements(graph: CodeGraph): cytoscape.ElementDefinition[] {
  return [
    ...graph.nodes.map((node) => ({
      group: 'nodes' as const,
      data: { id: node.id, label: node.name, kind: node.kind, ...(node.parent && { parent: node.parent }) },
    })),
    ...graph.edges.map((edge) => ({
      group: 'edges' as const,
      data: { id: edge.id, source: edge.source, target: edge.target, kind: edge.kind, confidence: edge.confidence },
    })),
  ];
}
