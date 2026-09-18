import { describe, expect, it } from 'vitest';
import { DEMO_SNAPSHOT } from '@/lib/demo-snapshot';
import { DIAGRAM_HONESTY, PRODUCT_NAME, PRODUCT_REPO } from '@/lib/honesty';

describe('RevMind honesty', () => {
  it('names the product RevMind', () => {
    expect(PRODUCT_NAME).toBe('RevMind');
    expect(PRODUCT_REPO).toBe('RevealUIStudio/revmind');
  });

  it('refuses a public Architecture SKU', () => {
    expect(DIAGRAM_HONESTY).toContain('architecture from your knowledge graph');
    expect(DIAGRAM_HONESTY).toContain('not a public Architecture SKU');
  });

  it('ships a demo snapshot with named nodes', () => {
    const names = DEMO_SNAPSHOT.nodes.map((node) => node.name);
    expect(names).toEqual(['RevealUI', 'RevMind', '@revealui/knowledge-graph']);
    expect(DEMO_SNAPSHOT.edges).toHaveLength(2);
    expect(DEMO_SNAPSHOT.truncated).toBe(false);
  });
});
