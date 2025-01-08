import { Box, Typography } from '@mui/material';

export default function Header() {
  return (
    <Box 
      component="header" 
      sx={{
        textAlign: 'center',
        mb: 4,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: '15px',
        boxShadow: '8px 8px 16px #141416, -8px -8px 16px #1E1E1E'
      }}
    >
      <Typography 
        variant="h4" 
        component="h1"
        sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #00FFCC, #33ccff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        SmartCompara
      </Typography>
      <Typography 
        variant="subtitle1"
        sx={{ color: 'text.secondary' }}
      >
        Compare preços inteligentemente e economize
      </Typography>
    </Box>
  );
}
