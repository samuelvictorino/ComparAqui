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
        boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #2a2a2a',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: 'inset 4px 4px 8px #0a0a0a, inset -4px -4px 8px #2a2a2a'
        }
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #00FFCC, #FF3366)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transition: 'background 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(45deg, #FF3366, #00FFCC)'
          }
        }}
      >
        ComparAqui
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ color: 'text.secondary', transition: 'color 0.3s ease', '&:hover': { color: '#00FFCC' } }}
      >
        Compare preços, economize aqui
      </Typography>
    </Box>
  );
}
