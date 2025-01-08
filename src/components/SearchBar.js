import { useState } from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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
        boxShadow: isFocused ? '0 0 10px #00FFCC' : '8px 8px 16px #0a0a0a, -8px -8px 16px #2a2a2a',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: 'inset 4px 4px 8px #0a0a0a, inset -4px -4px 8px #2a2a2a'
        }
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, color: 'text.primary' }}
        placeholder="Buscar produtos para comparar preços..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={loading}
      />
      <IconButton
        type="submit"
        sx={{ p: '10px', color: '#00FFCC', transition: 'color 0.3s ease', '&:hover': { color: '#FF3366' } }}
        disabled={loading}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
