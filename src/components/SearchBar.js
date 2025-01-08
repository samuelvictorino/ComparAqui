import { useState } from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        mb: 4,
        borderRadius: '15px',
        backgroundColor: '#1E1E1E',
        boxShadow: '8px 8px 16px #141416, -8px -8px 16px #1E1E1E',
        '&:hover': {
          boxShadow: 'inset 4px 4px 8px #141416, inset -4px -4px 8px #1E1E1E'
        }
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, color: 'text.primary' }}
        placeholder="Buscar produtos para comparar preços..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={loading}
      />
      <IconButton 
        type="submit" 
        sx={{ p: '10px', color: '#00FFCC' }} 
        disabled={loading}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
