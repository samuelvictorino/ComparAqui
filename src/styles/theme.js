import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00FFCC',
    },
    secondary: {
      main: '#FF3366',
    },
    background: {
      default: '#141416',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#00FFCC',
            color: '#141416'
          }
        },
      },
    },
  },
});

export default theme;
