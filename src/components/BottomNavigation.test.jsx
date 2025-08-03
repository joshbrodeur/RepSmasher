import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNavigation from './BottomNavigation.jsx';
import '@testing-library/jest-dom';

describe('BottomNavigation', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <BottomNavigation />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Home/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Create/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Logs/i)).toBeInTheDocument();
  });
});
