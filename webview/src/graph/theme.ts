import type { NodeKind } from '../../../src/core/graph/model';
import { toCytoscapeColor } from './colors';

export interface GraphTheme {
  foreground: string;
  muted: string;
  border: string;
  focus: string;
  kinds: Record<NodeKind, string>;
}

function cssVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.body).getPropertyValue(name);
  return toCytoscapeColor(value.trim() || fallback);
}

/** Reads the active VS Code color theme, reusing its symbol-icon colors for node kinds. */
export function readTheme(): GraphTheme {
  return {
    foreground: cssVar('--vscode-foreground', '#cccccc'),
    muted: cssVar('--vscode-descriptionForeground', '#9d9d9d'),
    border: cssVar('--vscode-panel-border', '#80808059'),
    focus: cssVar('--vscode-focusBorder', '#0078d4'),
    kinds: {
      folder: cssVar('--vscode-symbolIcon-folderForeground', '#c5c5c5'),
      file: cssVar('--vscode-symbolIcon-fileForeground', '#c5c5c5'),
      class: cssVar('--vscode-symbolIcon-classForeground', '#ee9d28'),
      interface: cssVar('--vscode-symbolIcon-interfaceForeground', '#75beff'),
      function: cssVar('--vscode-symbolIcon-functionForeground', '#b180d7'),
      method: cssVar('--vscode-symbolIcon-methodForeground', '#b180d7'),
    },
  };
}
