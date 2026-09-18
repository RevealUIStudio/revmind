import type { DiagramSnapshot } from '@/lib/demo-snapshot';

const SVG_WIDTH = 720;
const SVG_HEIGHT = 280;

interface GraphCanvasProps {
  snapshot: DiagramSnapshot;
}

export function GraphCanvas({ snapshot }: GraphCanvasProps) {
  const count = snapshot.nodes.length;
  const positions = snapshot.nodes.map((node, index) => {
    const x =
      count === 1 ? SVG_WIDTH / 2 : 120 + (index * (SVG_WIDTH - 240)) / Math.max(count - 1, 1);
    const y = index % 2 === 0 ? 90 : 190;
    return { id: node.id, x, y };
  });
  const byId = new Map(positions.map((p) => [p.id, p]));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      width="100%"
      role="img"
      aria-label="RevMind architecture from your knowledge graph"
      className="h-auto w-full"
    >
      <title>RevMind demo graph</title>
      {snapshot.edges.map((edge) => {
        const from = byId.get(edge.sourceId);
        const to = byId.get(edge.targetId);
        if (!from || !to) return null;
        return (
          <g key={edge.id}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--border)"
              strokeWidth="2"
            />
            <text
              x={(from.x + to.x) / 2}
              y={(from.y + to.y) / 2 - 8}
              textAnchor="middle"
              fill="var(--muted-foreground)"
              fontSize="11"
            >
              {edge.relation}
            </text>
          </g>
        );
      })}
      {snapshot.nodes.map((node, index) => {
        const pos = positions[index];
        if (!pos) return null;
        return (
          <g key={node.id}>
            <rect
              x={pos.x - 90}
              y={pos.y - 28}
              width="180"
              height="56"
              rx="8"
              fill="var(--card)"
              stroke="var(--border)"
            />
            <text
              x={pos.x}
              y={pos.y - 4}
              textAnchor="middle"
              fill="var(--foreground)"
              fontSize="14"
              fontWeight="600"
            >
              {node.name}
            </text>
            <text
              x={pos.x}
              y={pos.y + 14}
              textAnchor="middle"
              fill="var(--muted-foreground)"
              fontSize="11"
            >
              {node.kind}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
