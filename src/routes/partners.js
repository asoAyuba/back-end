const express = require('express');
const db = require('../db');

const router = express.Router();

// Crear un socio
router.post('/', (req, res) => {
  const { name, email, phone, membership_status } = req.body;

  db.run(
    `INSERT INTO partners (name, email, phone, membership_status) VALUES (?, ?, ?, ?)`,
    [name, email, phone, membership_status],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

module.exports = router;
