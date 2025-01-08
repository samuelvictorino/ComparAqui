// pages/index.js
import { useState } from 'react'
import { TextField, Button, Card, Typography } from '@mui/material'

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite o nome do produto"
          margin="normal"
        />
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar Preços'}
        </Button>
      </form>

      <div className="results">
        {results.map((item, index) => (
          <Card key={index} className="result-card">
            <Typography variant="h6">{item.store}</Typography>
            <Typography variant="h4">R$ {item.price}</Typography>
            <Button variant="outlined" href={item.url} target="_blank">
              Visitar Loja
            </Button>
          </Card>
        ))}
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .results {
          margin-top: 20px;
          display: grid;
          grid-gap: 20px;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
        .result-card {
          padding: 15px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}
