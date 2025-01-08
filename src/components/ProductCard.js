import { Card, CardContent, Typography, Box } from '@mui/material';

export default function ProductCard({ result }) {
  return (
    <Card
      sx={{
        borderRadius: '15px',
        backgroundColor: '#1E1E1E',
        boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #2a2a2a',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '12px 12px 20px #0a0a0a, -12px -12px 20px #2a2a2a'
        }
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#00FFCC' }}>
          {result.title}
        </Typography>
        <Typography variant="h5" sx={{ color: '#FF3366' }}>
          R$ {result.price}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <span style={{ fontWeight: 'bold', color: '#00FFCC' }}>Processador:</span> {result.processor || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <span style={{ fontWeight: 'bold', color: '#00FFCC' }}>Memória:</span> {result.memory || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <span style={{ fontWeight: 'bold', color: '#00FFCC' }}>Funcionalidades:</span> {result.features || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <span style={{ fontWeight: 'bold', color: '#00FFCC' }}>Loja:</span> {result.store}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
