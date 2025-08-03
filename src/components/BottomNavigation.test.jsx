import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import BottomNavigation from './BottomNavigation.jsx';
import { navigationItems } from '../config/navigation.js';

afterEach(cleanup);

describe('BottomNavigation', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <BottomNavigation items={navigationItems} />
      </MemoryRouter>
    );

    navigationItems.forEach(({ label }) => {
      expect(screen.getByLabelText(new RegExp(label, 'i'))).toBeTruthy();
    });
  });

  it('wraps links in a nav element with accessibility attributes', () => {
    render(
      <MemoryRouter>
        <BottomNavigation items={navigationItems} />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation', { name: /bottom navigation/i });
    expect(nav).toBeTruthy();
  });

  const routes = navigationItems.map(item => ({
    path: item.path,
    label: new RegExp(item.label, 'i'),
  }));

  it.each(routes)('marks %s link as active', ({ path, label }) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <BottomNavigation items={navigationItems} />
      </MemoryRouter>
    );

    const activeLink = screen.getByLabelText(label);
    expect(activeLink).toHaveAttribute('aria-current', 'page');
    expect(activeLink).toHaveClass('text-blue-600');
  });
});
