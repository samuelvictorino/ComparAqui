import { useState } from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Results from '../components/Results';
import theme from '../styles/theme';

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>ComparAqui - Compare preços, economize aqui</title>
        <meta name="description" content="Compare preços, economize aqui" />
      </Head>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Header />
          <SearchBar onSearch={handleSearch} loading={loading} />
          <Results results={searchResults} loading={loading} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
