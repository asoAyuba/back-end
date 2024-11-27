const express = require('express');
const db = require('../db');

const router = express.Router();

// Obtener todos los usuarios
router.get('/', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Crear un usuario
router.post('/', (req, res) => {
  const { name, email, affiliate_code, marketing_opt_in } = req.body;

  db.run(
    `INSERT INTO users (name, email, affiliate_code, marketing_opt_in) VALUES (?, ?, ?, ?)`,
    [name, email, affiliate_code, marketing_opt_in],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

module.exports = router;
