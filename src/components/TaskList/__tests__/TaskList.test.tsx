import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from '../TaskList';
import { taskService } from '../../../services/taskService';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the taskService
vi.mock('../../../services/taskService', () => ({
  taskService: {
    getTasks: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

describe('TaskList', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending' as const,
      priority: 'high' as const,
      dueDate: '2024-03-20',
      createdAt: '2024-03-15T10:00:00Z',
      updatedAt: '2024-03-15T10:00:00Z',
      createdBy: 'user1',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (taskService.getTasks as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockTasks);
  });

  it('renders task list correctly', async () => {
    const onEditTask = vi.fn();
    render(<TaskList onEditTask={onEditTask} />);

    // Wait for the task to be rendered
    const taskTitle = await screen.findByText('Test Task');
    expect(taskTitle).toBeInTheDocument();

    // Check if the task description is rendered
    const taskDescription = screen.getByText('Test Description');
    expect(taskDescription).toBeInTheDocument();

    // Check if the status and priority chips are rendered
    const statusChip = screen.getByText('pending');
    const priorityChip = screen.getByText('high');
    expect(statusChip).toBeInTheDocument();
    expect(priorityChip).toBeInTheDocument();
  });

  it('calls onEditTask when edit button is clicked', async () => {
    const onEditTask = vi.fn();
    render(<TaskList onEditTask={onEditTask} />);

    // Wait for the task to be rendered
    await screen.findByText('Test Task');

    // Click the edit button
    const editButton = screen.getByLabelText(/edit/i);
    fireEvent.click(editButton);

    // Check if onEditTask was called with the correct task
    expect(onEditTask).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('filters tasks based on search input', async () => {
    const onEditTask = vi.fn();
    render(<TaskList onEditTask={onEditTask} />);

    // Wait for the task to be rendered
    await screen.findByText('Test Task');

    // Type in the search input
    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    // Check if getTasks was called with the correct filters
    expect(taskService.getTasks).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'Test',
      })
    );
  });
});
