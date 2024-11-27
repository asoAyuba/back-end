const express = require('express');
const db = require('../db');

const router = express.Router();

// Crear una colonia
router.post('/', (req, res) => {
  const { name, location } = req.body;

  db.run(
    `INSERT INTO colonies (name, location) VALUES (?, ?)`,
    [name, location],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

module.exports = router;
