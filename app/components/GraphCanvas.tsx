import { useId } from 'react';
import type { DiagramSnapshot } from '@/lib/demo-snapshot';
import { layoutGraph } from '@/lib/graph-layout';

interface GraphCanvasProps {
  snapshot: DiagramSnapshot;
}

export function GraphCanvas({ snapshot }: GraphCanvasProps) {
  const titleId = useId();
  const markerId = `edge-arrow-${titleId.replace(/:/g, '')}`;
  const layout = layoutGraph(snapshot);

  if (layout.nodes.length === 0) {
    return <p className="text-sm text-muted-foreground">This example graph has no nodes.</p>;
  }

  const resolvedEdges = snapshot.edges.filter((edge) =>
    layout.edges.some((placed) => placed.id === edge.id),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          role="img"
          aria-labelledby={titleId}
          className="h-auto w-full"
          style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
        >
          <title id={titleId}>Example graph</title>
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 8 8"
              refX="8"
              refY="4"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="var(--muted-foreground)" />
            </marker>
          </defs>
          {layout.edges.map((edge) => (
            <g key={edge.id}>
              <path
                d={edge.path}
                fill="none"
                stroke="var(--muted-foreground)"
                strokeWidth="1.5"
                markerEnd={`url(#${markerId})`}
              />
              <rect
                x={edge.labelX - edge.labelWidth / 2}
                y={edge.labelY - 8}
                width={edge.labelWidth}
                height="16"
                rx="4"
                fill="var(--card)"
              />
              <text
                x={edge.labelX}
                y={edge.labelY + 4}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                fontSize="11"
              >
                {edge.relation}
              </text>
            </g>
          ))}
          {layout.nodes.map((node) => (
            <g key={node.id}>
              <rect
                x={node.x - node.width / 2}
                y={node.y - node.height / 2}
                width={node.width}
                height={node.height}
                rx="8"
                fill="var(--card)"
                stroke="var(--border)"
              />
              <text
                x={node.x}
                y={node.y - 4}
                textAnchor="middle"
                fill="var(--foreground)"
                fontSize="14"
                fontWeight="600"
              >
                {node.name}
              </text>
              <text
                x={node.x}
                y={node.y + 14}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                fontSize="11"
              >
                {node.kind}
              </text>
            </g>
          ))}
        </svg>
      </div>
      {snapshot.truncated ? (
        <p className="text-sm text-muted-foreground">
          This diagram shows part of the graph. Some nodes and relationships are not included.
        </p>
      ) : null}
      {layout.omittedEdgeCount > 0 ? (
        <p className="text-sm text-muted-foreground">
          Some relationships point at nodes that are not in this diagram.
        </p>
      ) : null}
      <section className="flex flex-col gap-3" aria-labelledby={`${titleId}-relationships`}>
        <h3 id={`${titleId}-relationships`} className="text-sm font-medium text-foreground">
          Relationships
        </h3>
        {resolvedEdges.length === 0 ? (
          <p className="text-sm text-muted-foreground">This example graph has no relationships.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {resolvedEdges.map((edge) => {
              const source = layout.nodes.find((node) => node.id === edge.sourceId);
              const target = layout.nodes.find((node) => node.id === edge.targetId);
              if (!source || !target) return null;
              return (
                <li key={edge.id} className="flex flex-col gap-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{source.name}</span>{' '}
                    <span className="text-muted-foreground">{edge.relation}</span>{' '}
                    <span className="font-medium">{target.name}</span>
                  </p>
                  {edge.fact ? <p className="text-sm text-muted-foreground">{edge.fact}</p> : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
