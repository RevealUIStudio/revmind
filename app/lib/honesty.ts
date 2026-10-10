/** Explains that the on-page graph is an example, not a customer extract. */
export const DIAGRAM_HONESTY =
  'Explore an example knowledge graph and the relationships it contains. This view uses demonstration data.' as const;

/** Product boundary required in copy and UI. */
export const SKU_HONESTY =
  'Architecture from your knowledge graph. Not a public Architecture SKU.' as const;

export const PAGE_DESCRIPTION = `${DIAGRAM_HONESTY} ${SKU_HONESTY}` as const;

export const PRODUCT_NAME = 'RevMind' as const;

export const PRODUCT_REPO = 'revealui-studio/revmind' as const;
