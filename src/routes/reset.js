const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de que esta sea tu conexión SQLite

// Endpoint para borrar las tablas de la base de datos
router.delete('/reset-db', (req, res) => {
  // Lista de tablas a eliminar
  const tables = ['Gatos', 'Colonias', 'Usuarios', 'Veterinarios', 'Voluntarios', 'CasaAcogida'];

  const dropTablePromises = tables.map((table) => {
    return new Promise((resolve, reject) => {
      db.run(`DROP TABLE IF EXISTS ${table}`, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });

  Promise.all(dropTablePromises)
    .then(() => {
      res.status(200).json({ message: 'Todas las tablas fueron eliminadas exitosamente' });
    })
    .catch((err) => {
      console.error('Error al borrar las tablas:', err.message);
      res.status(500).json({ error: 'Error al borrar las tablas', details: err.message });
    });
});

module.exports = router;
