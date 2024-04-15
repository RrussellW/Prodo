import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function Header(data) {

    const navigate = useNavigate();

    const logout = () => {
        navigate('/login');
    }

return (
  <Box 
  sx={{ 
    flexGrow: 1
   }}>
    <AppBar position="static"
    sx={{ 
        backgroundColor: 'black',
        color: 'white'
       }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{color: '#9AA8FF'}}>
          METRO
        </Typography>
        <Typography variant="h6" component="div" sx={{color: '#FDFFC3'}}>
          Events
        </Typography>
        <Typography variant="h6" component="div" sx={{flexGrow: 1, color: '#9AA8FF', marginLeft: '50px'}}>
          <span> {data.role}</span>
        </Typography>

        <Button color="inherit" sx={{color: '#FF8282'}} onClick={logout}>Logout {data.name}</Button>
      </Toolbar>
    </AppBar>
  </Box>
);
}