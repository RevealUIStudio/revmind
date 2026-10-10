import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DIAGRAM_HONESTY, PAGE_DESCRIPTION, PRODUCT_NAME, SKU_HONESTY } from '@/lib/honesty';
import { renderApp } from '@/test-utils';

describe('HomePage', () => {
  it('names the product RevMind and keeps both honesty lines', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1, name: PRODUCT_NAME })).toBeInTheDocument();
    expect(screen.getByText(DIAGRAM_HONESTY)).toBeInTheDocument();
    expect(screen.getByText(SKU_HONESTY)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Example graph' })).toBeInTheDocument();
    expect(document.title).toBe('RevMind | architecture from your knowledge graph');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      PAGE_DESCRIPTION,
    );
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'index,follow',
    );
    const source = screen.getByRole('link', { name: /Source/ });
    expect(source).toHaveAttribute('href', 'https://github.com/revealui-studio/revmind');
    expect(source).toHaveAttribute('target', '_blank');
    expect(source).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('returns from a missing page without a full reload', () => {
    renderApp('/does-not-exist');
    expect(document.title).toBe('Not found | RevMind');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex,follow',
    );
    fireEvent.click(screen.getByRole('link', { name: 'Return to the example graph' }));
    expect(screen.getByRole('heading', { level: 1, name: PRODUCT_NAME })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
    expect(document.title).toBe('RevMind | architecture from your knowledge graph');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'index,follow',
    );
  });
});
