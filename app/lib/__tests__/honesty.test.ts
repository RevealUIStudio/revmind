import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { DEMO_SNAPSHOT } from '@/lib/demo-snapshot';
import {
  DIAGRAM_HONESTY,
  PAGE_DESCRIPTION,
  PRODUCT_NAME,
  PRODUCT_REPO,
  SKU_HONESTY,
} from '@/lib/honesty';

describe('RevMind honesty', () => {
  it('names the product RevMind', () => {
    expect(PRODUCT_NAME).toBe('RevMind');
    expect(PRODUCT_REPO).toBe('revealui-studio/revmind');
  });

  it('refuses a public Architecture SKU', () => {
    expect(DIAGRAM_HONESTY).toContain('example knowledge graph');
    expect(DIAGRAM_HONESTY).toContain('demonstration data');
    expect(SKU_HONESTY).toContain('Architecture from your knowledge graph');
    expect(SKU_HONESTY).toContain('Not a public Architecture SKU');
    expect(PAGE_DESCRIPTION).toBe(`${DIAGRAM_HONESTY} ${SKU_HONESTY}`);
  });

  it('keeps the static document description aligned with the route description', () => {
    const htmlPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../index.html',
    );
    const html = readFileSync(htmlPath, 'utf8');
    expect(html).toContain(`content="${PAGE_DESCRIPTION}"`);
  });

  it('ships a demo snapshot with named nodes', () => {
    const names = DEMO_SNAPSHOT.nodes.map((node) => node.name);
    expect(names).toEqual(['RevealUI', 'RevMind', '@revealui/knowledge-graph']);
    expect(DEMO_SNAPSHOT.edges).toHaveLength(2);
    expect(DEMO_SNAPSHOT.truncated).toBe(false);
  });
});
