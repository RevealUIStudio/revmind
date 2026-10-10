import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '@/test-utils';

describe('NotFoundPage', () => {
  it('renders a 404 heading for unknown paths', () => {
    renderApp('/does-not-exist?from=audit');
    expect(
      screen.getByRole('heading', { level: 1, name: "This page isn't available." }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to the example graph' })).toHaveAttribute(
      'href',
      '/',
    );
  });
});
