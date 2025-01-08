const express = require('express');
const router = express.Router();
const { searchMagalu } = require('../services/magalu');

/**
 * @route GET /api/products
 * @desc Busca produtos em todas as plataformas.
 * @access Public
 */
router.get('/', async (req, res) => {
  const query = req.query.q;
  try {
    const magaluResults = await searchMagalu(query);
    res.json({ magalu: magaluResults });
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ error: 'Erro na busca de produtos' });
  }
});

module.exports = router;
