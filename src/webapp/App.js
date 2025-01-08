import React from 'react';
import { TextField, Button, Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Tema personalizado com neomorfismo
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#141416',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '15px',
          boxShadow: '8px 8px 16px #0e0e0e, -8px -8px 16px #262626',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: '4px 4px 8px #0e0e0e, -4px -4px 8px #262626',
          '&:hover': {
            boxShadow: 'inset 4px 4px 8px #0e0e0e, inset -4px -4px 8px #262626',
          },
        },
      },
    },
  },
});

function App() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/products?q=${query}`);
      const data = await response.json();
      setResults(data.magalu); // Exemplo com resultados do Magalu
    } catch (error) {
      console.error("Erro na busca:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for products to compare prices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Compare Prices
          </Button>
        </form>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {results.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2">{product.price}</Typography>
                  {/* Outros detalhes do produto */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
