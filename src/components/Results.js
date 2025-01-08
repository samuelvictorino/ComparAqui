import { Grid, Card, CardContent, Typography, Skeleton } from '@mui/material';

export default function Results({ results, loading }) {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Skeleton 
              variant="rectangular" 
              height={200} 
              sx={{ borderRadius: '15px' }} 
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {results.map((result, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            sx={{
              borderRadius: '15px',
              backgroundColor: '#1E1E1E',
              boxShadow: '8px 8px 16px #141416, -8px -8px 16px #1E1E1E',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '12px 12px 20px #141416, -12px -12px 20px #1E1E1E'
              }
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {result.title}
              </Typography>
              <Typography variant="h5" color="#00FFCC">
                R$ {result.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {result.store}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
