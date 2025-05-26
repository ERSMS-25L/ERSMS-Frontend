import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Stack,
  TextField,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Task, TaskStatus, TaskPriority, TaskFilters } from '../../types/task';
import { taskService } from '../../services/taskService';

const statusColors: Record<TaskStatus, 'default' | 'primary' | 'success'> = {
  pending: 'default',
  in_progress: 'primary',
  done: 'success',
};

const priorityColors: Record<TaskPriority, 'error' | 'warning' | 'info'> = {
  high: 'error',
  medium: 'warning',
  low: 'info',
};

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

export const TaskList = ({ onEditTask }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    status: undefined,
    priority: undefined,
    search: '',
  });

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadTasks = async () => {
    const filteredTasks = await taskService.getTasks(filters);
    setTasks(filteredTasks);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await taskService.deleteTask(id);
      loadTasks();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {
        (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Status"
                value={filters.status || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: (e.target.value as TaskStatus) || undefined,
                  })
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Priority"
                value={filters.priority || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priority: (e.target.value as TaskPriority) || undefined,
                  })
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        ) as any
      }

      <Stack spacing={2}>
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {task.description}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={task.status.replace('_', ' ')}
                      color={statusColors[task.status]}
                      size="small"
                    />
                    <Chip
                      label={task.priority}
                      color={priorityColors[task.priority]}
                      size="small"
                    />
                  </Stack>
                </Box>
                <Box>
                  <IconButton size="small" aria-label="edit" onClick={() => onEditTask(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
