import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GraphCanvas } from '@/components/GraphCanvas';
import { DEMO_SNAPSHOT, type DiagramSnapshot } from '@/lib/demo-snapshot';

describe('GraphCanvas', () => {
  it('shows demo relationships and their facts', () => {
    render(<GraphCanvas snapshot={DEMO_SNAPSHOT} />);
    expect(screen.getByRole('img', { name: 'Example graph' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Relationships' })).toBeInTheDocument();
    expect(screen.getAllByText('RevealUI').length).toBeGreaterThan(0);
    expect(
      screen.getByText('Graph engine and diagram helpers live in the platform package.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('RevMind is the standalone fleet surface for that graph.'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('publishes').length).toBeGreaterThan(0);
    expect(screen.getAllByText('consumes').length).toBeGreaterThan(0);
  });

  it('says when the snapshot is truncated or an edge has no endpoint', () => {
    const snapshot: DiagramSnapshot = {
      nodes: [{ id: 'only', kind: 'repo', name: 'Only', naturalKey: 'only', repo: null }],
      edges: [{ id: 'dangling', sourceId: 'only', targetId: 'missing', relation: 'links' }],
      truncated: true,
    };
    render(<GraphCanvas snapshot={snapshot} />);
    expect(screen.getByText(/shows part of the graph/)).toBeInTheDocument();
    expect(screen.getByText(/point at nodes that are not in this diagram/)).toBeInTheDocument();
    expect(screen.getByText('This example graph has no relationships.')).toBeInTheDocument();
  });

  it('renders an empty state when the snapshot has no nodes', () => {
    render(<GraphCanvas snapshot={{ nodes: [], edges: [], truncated: false }} />);
    expect(screen.getByText('This example graph has no nodes.')).toBeInTheDocument();
  });
});
