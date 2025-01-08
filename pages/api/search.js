// pages/api/search.js
import { supabase } from '../../config/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { query } = req.query

  try {
    // 1. Buscar cache no Supabase
    let { data: cachedResults } = await supabase
      .from('product_prices')
      .select('*')
      .eq('query', query)
      .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000)) // últimas 24h

    if (cachedResults?.length) {
      return res.status(200).json(cachedResults)
    }

    // 2. Se não houver cache, buscar preços via Google Apps Script
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL
    const response = await fetch(`${scriptUrl}?product=${encodeURIComponent(query)}`)
    const prices = await response.json()

    // 3. Salvar resultados no Supabase
    const { data, error } = await supabase
      .from('product_prices')
      .insert({
        query,
        prices,
        created_at: new Date()
      })

    if (error) throw error

    return res.status(200).json(prices)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
