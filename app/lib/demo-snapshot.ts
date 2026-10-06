/**
 * Local demo graph until `@revealui/knowledge-graph/diagram` is on npm.
 * Shape matches the package's DiagramSnapshot so the import can swap later.
 */

export interface DiagramNode {
  id: string;
  kind: string;
  name: string;
  naturalKey: string;
  repo: string | null;
}

export interface DiagramEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: string;
  fact?: string;
}

export interface DiagramSnapshot {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  truncated: boolean;
}

export const DEMO_SNAPSHOT: DiagramSnapshot = {
  nodes: [
    {
      id: 'n-revealui',
      kind: 'repo',
      name: 'RevealUI',
      naturalKey: 'RevealUIStudio/revealui',
      repo: 'RevealUIStudio/revealui',
    },
    {
      id: 'n-revmind',
      kind: 'repo',
      name: 'RevMind',
      naturalKey: 'revealui-studio/revmind',
      repo: 'revealui-studio/revmind',
    },
    {
      id: 'n-kg',
      kind: 'package',
      name: '@revealui/knowledge-graph',
      naturalKey: '@revealui/knowledge-graph',
      repo: 'RevealUIStudio/revealui',
    },
  ],
  edges: [
    {
      id: 'e-kg-from-platform',
      sourceId: 'n-revealui',
      targetId: 'n-kg',
      relation: 'publishes',
      fact: 'Graph engine and diagram helpers live in the platform package.',
    },
    {
      id: 'e-revmind-consumes',
      sourceId: 'n-revmind',
      targetId: 'n-kg',
      relation: 'consumes',
      fact: 'RevMind is the standalone fleet surface for that graph.',
    },
  ],
  truncated: false,
};
