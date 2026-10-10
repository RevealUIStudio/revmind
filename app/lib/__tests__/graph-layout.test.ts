import { describe, expect, it } from 'vitest';
import { DEMO_SNAPSHOT, type DiagramSnapshot } from '@/lib/demo-snapshot';
import { boxesOverlap, layoutGraph, nodeBoxWidth } from '@/lib/graph-layout';

function snapshot(
  partial: Partial<DiagramSnapshot> & Pick<DiagramSnapshot, 'nodes' | 'edges'>,
): DiagramSnapshot {
  return { truncated: false, ...partial };
}

describe('graph layout', () => {
  it('gives long labels a box wide enough to hold them', () => {
    const name = '@revealui/knowledge-graph';
    const width = nodeBoxWidth({ name, kind: 'package' });
    expect(width).toBeGreaterThan(name.length * 7);
  });

  it('places the demo package to the right of both sources without overlap', () => {
    const layout = layoutGraph(DEMO_SNAPSHOT);
    const byName = new Map(layout.nodes.map((node) => [node.name, node]));
    const platform = byName.get('RevealUI');
    const product = byName.get('RevMind');
    const graph = byName.get('@revealui/knowledge-graph');
    expect(platform).toBeDefined();
    expect(product).toBeDefined();
    expect(graph).toBeDefined();
    if (!platform || !product || !graph) return;
    expect(graph.x).toBeGreaterThan(platform.x);
    expect(graph.x).toBeGreaterThan(product.x);
    expect(boxesOverlap(platform, product)).toBe(false);
    expect(boxesOverlap(platform, graph)).toBe(false);
    expect(boxesOverlap(product, graph)).toBe(false);
    expect(layout.omittedEdgeCount).toBe(0);
    for (const node of layout.nodes) {
      expect(node.x - node.width / 2).toBeGreaterThanOrEqual(0);
      expect(node.x + node.width / 2).toBeLessThanOrEqual(layout.width);
      expect(node.y - node.height / 2).toBeGreaterThanOrEqual(0);
      expect(node.y + node.height / 2).toBeLessThanOrEqual(layout.height);
    }
  });

  it('keeps a longer chain from stacking nodes on top of each other', () => {
    const nodes = Array.from({ length: 6 }, (_, index) => ({
      id: `n-${index}`,
      kind: 'repo',
      name: `Node ${index} with a longer label`,
      naturalKey: `node-${index}`,
      repo: null,
    }));
    const edges = nodes.slice(1).map((node, index) => ({
      id: `e-${index}`,
      sourceId: `n-${index}`,
      targetId: node.id,
      relation: 'depends-on',
    }));
    const layout = layoutGraph(snapshot({ nodes, edges }));
    expect(layout.nodes).toHaveLength(6);
    for (let i = 0; i < layout.nodes.length; i += 1) {
      for (let j = i + 1; j < layout.nodes.length; j += 1) {
        const left = layout.nodes[i];
        const right = layout.nodes[j];
        if (!left || !right) continue;
        expect(boxesOverlap(left, right)).toBe(false);
      }
    }
  });

  it('drops edges whose endpoints are missing and collapses duplicate ids', () => {
    const layout = layoutGraph(
      snapshot({
        nodes: [
          { id: 'a', kind: 'repo', name: 'Alpha', naturalKey: 'a', repo: null },
          { id: 'a', kind: 'repo', name: 'Alpha duplicate', naturalKey: 'a2', repo: null },
        ],
        edges: [
          { id: 'missing', sourceId: 'a', targetId: 'gone', relation: 'missing' },
          { id: 'loop', sourceId: 'a', targetId: 'a', relation: 'self' },
        ],
      }),
    );
    expect(layout.nodes).toHaveLength(1);
    expect(layout.nodes[0]?.name).toBe('Alpha');
    expect(layout.omittedEdgeCount).toBe(1);
    expect(layout.edges.map((edge) => edge.relation)).toEqual(['self']);
  });
});
