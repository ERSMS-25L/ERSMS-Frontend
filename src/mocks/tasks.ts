import type { Task } from '../types/task';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement user authentication',
    description: 'Set up OAuth2 authentication with Google',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-04-01',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    createdBy: 'user1',
    assignedTo: 'user2',
  },
  {
    id: '2',
    title: 'Design task list UI',
    description: 'Create responsive task list component with MUI',
    status: 'done',
    priority: 'medium',
    dueDate: '2024-03-20',
    createdAt: '2024-03-14T09:00:00Z',
    updatedAt: '2024-03-16T15:30:00Z',
    createdBy: 'user1',
  },
  {
    id: '3',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-03-25',
    createdAt: '2024-03-15T11:00:00Z',
    updatedAt: '2024-03-15T11:00:00Z',
    createdBy: 'user2',
    assignedTo: 'user1',
  },
];
