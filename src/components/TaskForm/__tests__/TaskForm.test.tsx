import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../TaskForm';
import type { Task } from '../../../types/task';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  priority: 'medium',
  dueDate: '2024-12-31',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  createdBy: 'user1',
};

describe('TaskForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create form correctly', () => {
    render(<TaskForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Create Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Title', { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText('Description', { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText('Priority', { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date', { exact: false })).toBeInTheDocument();
  });

  it('renders edit form correctly', () => {
    render(<TaskForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} task={mockTask} />);

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('calls onSubmit with form data when submitted', async () => {
    const user = userEvent.setup();
    render(<TaskForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText('Title', { exact: false }), 'New Task');
    await user.type(screen.getByLabelText('Description', { exact: false }), 'New Description');

    // Handle priority select
    const prioritySelect = screen.getByLabelText('Priority', { exact: false });
    await user.click(prioritySelect);
    await user.click(screen.getByText('High'));

    await user.type(screen.getByLabelText('Due Date', { exact: false }), '2024-12-31');

    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New Description',
      priority: 'high',
      dueDate: '2024-12-31',
    });
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    await user.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
