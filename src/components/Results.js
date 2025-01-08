import { Grid, Skeleton } from '@mui/material';
import ProductCard from './ProductCard';

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
          <ProductCard result={result} />
        </Grid>
      ))}
    </Grid>
  );
}
