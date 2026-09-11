/**
 * VS Code theme colors are often 8-digit hex (`#rrggbbaa`), which Cytoscape cannot parse.
 * Converts those (and 4-digit `#rgba`) to `rgba()`; anything else is returned unchanged.
 */
export function toCytoscapeColor(color: string): string {
  const value = color.trim();
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(value);
  const long = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(value);
  const channels = long?.slice(1) ?? short?.slice(1).map((digit) => digit + digit);
  if (!channels) return value;

  const [r, g, b, a] = channels.map((hex) => parseInt(hex, 16)) as [number, number, number, number];
  return `rgba(${r}, ${g}, ${b}, ${Math.round((a / 255) * 100) / 100})`;
}
