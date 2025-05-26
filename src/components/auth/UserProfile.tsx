import { Avatar, Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserProfile = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    handleClose();
  };

  if (!user) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Button
        onClick={handleMenu}
        sx={{
          textTransform: 'none',
          color: 'inherit',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
        }}
      >
        <Avatar src={user.picture} alt={user.name} sx={{ width: 32, height: 32, mr: 1 }} />
        <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
          {user.name}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};
