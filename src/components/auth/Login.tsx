import { Box, Button, Container, Paper, Typography, useTheme } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const Login = () => {
  const { loginWithGoogle, isLoading, error, isAuthenticated } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.background.default,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            width: '100%',
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 3,
              textAlign: 'center',
            }}
          >
            Welcome to ERSMS
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Sign in to manage your tasks and collaborate with your team
          </Typography>
          {error && (
            <Typography
              color="error"
              sx={{
                mb: 3,
                p: 2,
                bgcolor: theme.palette.error.light,
                borderRadius: 1,
                width: '100%',
                textAlign: 'center',
              }}
            >
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={loginWithGoogle}
            disabled={isLoading}
            startIcon={<GoogleIcon />}
            sx={{
              width: '100%',
              maxWidth: 300,
              py: 1.5,
              bgcolor: '#fff',
              color: '#757575',
              '&:hover': {
                bgcolor: '#f5f5f5',
              },
              '& .MuiButton-startIcon': {
                color: theme.palette.primary.main,
              },
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};
