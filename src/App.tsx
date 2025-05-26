import { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TaskList } from './components/TaskList/TaskList';
import { TaskForm } from './components/TaskForm/TaskForm';
import type { Task, TaskCreateInput, TaskUpdateInput } from './types/task';
import { taskService } from './services/taskService';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  const handleCreateTask = async (data: TaskCreateInput | TaskUpdateInput) => {
    if ('title' in data && data.title) {
      await taskService.createTask(data as TaskCreateInput);
      setIsFormOpen(false);
    }
  };

  const handleUpdateTask = async (data: TaskCreateInput | TaskUpdateInput) => {
    if (selectedTask) {
      await taskService.updateTask(selectedTask.id, data as TaskUpdateInput);
      setSelectedTask(undefined);
      setIsFormOpen(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Task Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedTask(undefined);
              setIsFormOpen(true);
            }}
          >
            Create Task
          </Button>
        </Box>

        <TaskList onEditTask={handleEditTask} />

        <TaskForm
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedTask(undefined);
          }}
          onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
          task={selectedTask}
        />
      </Box>
    </Container>
  );
}

export default App;
