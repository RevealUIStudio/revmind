import type { DiagramEdge, DiagramNode, DiagramSnapshot } from '@/lib/demo-snapshot';

const NODE_HEIGHT = 56;
const COLUMN_GAP = 120;
const ROW_GAP = 28;
const PAD = 48;
const MIN_NODE_WIDTH = 128;
const NAME_CHAR = 7.4;
const KIND_CHAR = 6.4;
const RELATION_CHAR = 6.6;

export interface PlacedNode {
  id: string;
  name: string;
  kind: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlacedEdge {
  id: string;
  relation: string;
  sourceId: string;
  targetId: string;
  path: string;
  labelX: number;
  labelY: number;
  labelWidth: number;
}

export interface GraphLayout {
  width: number;
  height: number;
  nodes: PlacedNode[];
  edges: PlacedEdge[];
  omittedEdgeCount: number;
}

export function nodeBoxWidth(node: Pick<DiagramNode, 'name' | 'kind'>): number {
  const nameWidth = node.name.length * NAME_CHAR;
  const kindWidth = node.kind.length * KIND_CHAR;
  return Math.max(MIN_NODE_WIDTH, Math.ceil(Math.max(nameWidth, kindWidth) + 32));
}

/**
 * Column layout: sources sit to the left of their targets so relationship
 * lines do not pass through unrelated nodes. Cycles place one node per
 * round so the loop still terminates.
 */
export function layoutGraph(snapshot: DiagramSnapshot): GraphLayout {
  const uniqueNodes: DiagramNode[] = [];
  const seen = new Set<string>();
  for (const node of snapshot.nodes) {
    if (seen.has(node.id)) continue;
    seen.add(node.id);
    uniqueNodes.push(node);
  }

  const nodeById = new Map(uniqueNodes.map((node) => [node.id, node]));
  const columns = assignColumns(uniqueNodes, snapshot.edges, nodeById);
  const placed = placeColumns(columns, nodeById);
  const edges: PlacedEdge[] = [];
  let omittedEdgeCount = 0;

  for (const edge of snapshot.edges) {
    const from = placed.get(edge.sourceId);
    const to = placed.get(edge.targetId);
    if (!from || !to) {
      omittedEdgeCount += 1;
      continue;
    }
    edges.push(placeEdge(edge, from, to));
  }

  let minX = PAD;
  let minY = PAD;
  let maxX = PAD;
  let maxY = PAD;
  for (const node of placed.values()) {
    minX = Math.min(minX, node.x - node.width / 2);
    maxX = Math.max(maxX, node.x + node.width / 2);
    minY = Math.min(minY, node.y - node.height / 2);
    maxY = Math.max(maxY, node.y + node.height / 2);
  }
  for (const edge of edges) {
    minX = Math.min(minX, edge.labelX - edge.labelWidth / 2);
    maxX = Math.max(maxX, edge.labelX + edge.labelWidth / 2);
    minY = Math.min(minY, edge.labelY - 10);
    maxY = Math.max(maxY, edge.labelY + 8);
  }

  const shiftX = PAD - minX;
  const shiftY = PAD - minY;
  if (shiftX !== 0 || shiftY !== 0) {
    for (const node of placed.values()) {
      node.x += shiftX;
      node.y += shiftY;
    }
    for (const edge of edges) {
      edge.labelX += shiftX;
      edge.labelY += shiftY;
      edge.path = shiftPath(edge.path, shiftX, shiftY);
    }
  }

  return {
    width: Math.max(maxX + shiftX + PAD, PAD * 2),
    height: Math.max(maxY + shiftY + PAD, PAD * 2),
    nodes: [...placed.values()],
    edges,
    omittedEdgeCount,
  };
}

export function boxesOverlap(a: PlacedNode, b: PlacedNode): boolean {
  const aLeft = a.x - a.width / 2;
  const aRight = a.x + a.width / 2;
  const aTop = a.y - a.height / 2;
  const aBottom = a.y + a.height / 2;
  const bLeft = b.x - b.width / 2;
  const bRight = b.x + b.width / 2;
  const bTop = b.y - b.height / 2;
  const bBottom = b.y + b.height / 2;
  return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
}

function assignColumns(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  nodeById: Map<string, DiagramNode>,
): string[][] {
  const remaining = new Set(nodes.map((node) => node.id));
  const columnOf = new Map<string, number>();
  let column = 0;

  while (remaining.size > 0 && column <= nodes.length) {
    const ready: string[] = [];
    for (const id of remaining) {
      const blocked = edges.some(
        (edge) =>
          edge.targetId === id &&
          edge.sourceId !== id &&
          remaining.has(edge.sourceId) &&
          nodeById.has(edge.sourceId),
      );
      if (!blocked) ready.push(id);
    }
    const batch = ready.length > 0 ? ready : [remaining.values().next().value as string];
    for (const id of batch) {
      columnOf.set(id, column);
      remaining.delete(id);
    }
    column += 1;
  }

  const columns: string[][] = [];
  for (const node of nodes) {
    const index = columnOf.get(node.id) ?? 0;
    const columnNodes = columns[index] ?? [];
    columnNodes.push(node.id);
    columns[index] = columnNodes;
  }
  return columns;
}

function placeColumns(
  columns: string[][],
  nodeById: Map<string, DiagramNode>,
): Map<string, PlacedNode> {
  const placed = new Map<string, PlacedNode>();
  let cursorX = PAD;

  for (const column of columns) {
    const widths = column.map((id) => nodeBoxWidth(nodeById.get(id) as DiagramNode));
    const columnWidth = Math.max(...widths, MIN_NODE_WIDTH);
    let cursorY = PAD;
    for (let index = 0; index < column.length; index += 1) {
      const id = column[index] as string;
      const node = nodeById.get(id) as DiagramNode;
      const width = widths[index] as number;
      const x = cursorX + columnWidth / 2;
      const y = cursorY + NODE_HEIGHT / 2;
      placed.set(id, {
        id,
        name: node.name,
        kind: node.kind,
        x,
        y,
        width,
        height: NODE_HEIGHT,
      });
      cursorY += NODE_HEIGHT + ROW_GAP;
    }
    cursorX += columnWidth + COLUMN_GAP;
  }

  return placed;
}

function placeEdge(edge: DiagramEdge, from: PlacedNode, to: PlacedNode): PlacedEdge {
  const labelWidth = Math.ceil(edge.relation.length * RELATION_CHAR + 16);
  if (from.id === to.id) {
    const top = from.y - from.height / 2;
    const left = from.x - 16;
    const right = from.x + 16;
    const crest = top - 28;
    return {
      id: edge.id,
      relation: edge.relation,
      sourceId: edge.sourceId,
      targetId: edge.targetId,
      path: `M ${left} ${top} C ${left} ${crest}, ${right} ${crest}, ${right} ${top}`,
      labelX: from.x,
      labelY: crest - 8,
      labelWidth,
    };
  }

  const start = boxAnchor(from, to);
  const end = boxAnchor(to, from);
  const labelX = (start.x + end.x) / 2;
  const labelY = (start.y + end.y) / 2 - 10;
  return {
    id: edge.id,
    relation: edge.relation,
    sourceId: edge.sourceId,
    targetId: edge.targetId,
    path: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
    labelX,
    labelY,
    labelWidth,
  };
}

function boxAnchor(node: PlacedNode, toward: PlacedNode): { x: number; y: number } {
  const dx = toward.x - node.x;
  const dy = toward.y - node.y;
  if (dx === 0 && dy === 0) {
    return { x: node.x, y: node.y - node.height / 2 };
  }
  const scale = 1 / Math.max(Math.abs(dx) / (node.width / 2), Math.abs(dy) / (node.height / 2));
  return { x: node.x + dx * scale, y: node.y + dy * scale };
}

function shiftPath(path: string, dx: number, dy: number): string {
  const numbers = path.match(/-?\d+(?:\.\d+)?/g);
  if (!numbers) return path;
  let index = 0;
  return path.replace(/-?\d+(?:\.\d+)?/g, () => {
    const value = Number(numbers[index]);
    const shifted = index % 2 === 0 ? value + dx : value + dy;
    index += 1;
    return String(Math.round(shifted * 100) / 100);
  });
}
