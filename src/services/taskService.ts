import type { Task, TaskCreateInput, TaskUpdateInput, TaskFilters } from '../types/task';
import { mockTasks } from '../mocks/tasks';

class TaskService {
  private tasks: Task[] = [...mockTasks];

  public async getTasks(filters?: TaskFilters): Promise<Task[]> {
    let filteredTasks = [...this.tasks];

    if (filters) {
      if (filters.status) {
        filteredTasks = filteredTasks.filter((task) => task.status === filters.status);
      }
      if (filters.priority) {
        filteredTasks = filteredTasks.filter((task) => task.priority === filters.priority);
      }
      if (filters.assignedTo) {
        filteredTasks = filteredTasks.filter((task) => task.assignedTo === filters.assignedTo);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTasks = filteredTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower)
        );
      }
      if (filters.startDate) {
        filteredTasks = filteredTasks.filter((task) => task.dueDate >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredTasks = filteredTasks.filter((task) => task.dueDate <= filters.endDate!);
      }
    }

    return filteredTasks;
  }

  public async getTaskById(id: string): Promise<Task | undefined> {
    return this.tasks.find((task) => task.id === id);
  }

  public async createTask(input: TaskCreateInput): Promise<Task> {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      ...input,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user', // This will be replaced with actual user ID when auth is implemented
    };

    this.tasks.push(newTask);
    return newTask;
  }

  public async updateTask(id: string, input: TaskUpdateInput): Promise<Task | undefined> {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) return undefined;

    const updatedTask = {
      ...this.tasks[taskIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  public async deleteTask(id: string): Promise<boolean> {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) return false;

    this.tasks.splice(taskIndex, 1);
    return true;
  }
}

export const taskService = new TaskService();
