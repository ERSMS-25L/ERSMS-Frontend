import { render, screen, fireEvent } from '@testing-library/react';
import { MainLayout } from '../MainLayout';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MainLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the layout with navigation items', () => {
    renderWithRouter(<MainLayout>Test Content</MainLayout>);

    expect(screen.getByText('ERSMS')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('navigates when clicking menu items', () => {
    renderWithRouter(<MainLayout>Test Content</MainLayout>);

    fireEvent.click(screen.getByText('Tasks'));
    expect(mockNavigate).toHaveBeenCalledWith('/tasks');

    fireEvent.click(screen.getByText('Team'));
    expect(mockNavigate).toHaveBeenCalledWith('/team');
  });

  it('opens profile menu when clicking avatar', () => {
    renderWithRouter(<MainLayout>Test Content</MainLayout>);

    const avatar = screen.getByRole('button', { name: /profile/i });
    fireEvent.click(avatar);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('toggles mobile drawer when clicking menu button', () => {
    renderWithRouter(<MainLayout>Test Content</MainLayout>);

    const menuButton = screen.getByRole('button', { name: /open drawer/i });
    fireEvent.click(menuButton);

    // The drawer should be visible on mobile
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
