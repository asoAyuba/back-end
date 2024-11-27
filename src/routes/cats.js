const express = require('express');
const db = require('../db'); // Importa la conexión de SQLite
const upload = require('../middleware/upload'); // Configuración multer

const router = express.Router();

// Obtener todos los gatos
router.get('/', (req, res) => {
  db.all('SELECT * FROM Gatos', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los gatos', details: err.message });
    }
    res.json(rows);
  });
});

// Obtener todos los gatos adoptables
router.get('/adoptables', (req, res) => {
  db.all("SELECT * FROM Gatos WHERE adoptable = 1", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los gatos adoptables', details: err.message });
    }
    res.json(rows);
  });
});

// Obtener un gato por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM Gatos WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener el gato', details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Gato no encontrado' });
    }
    res.json(row);
  });
});

// Crear un nuevo gato con imagen
router.post('/', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió el archivo. Asegúrate de enviar un campo llamado "imagen" como archivo.' });
  }

  const {
    nombre,
    sexo,
    enfermedad,
    adoptable,
    socializado,
    esterilizado,
    raza,
    capa,
    fecha_nacimiento,
    vacunas,
    desparasitado,
    observaciones,
    descripcion,
    colonia_id
  } = req.body;

  // Convertir valores booleanos de cadenas a verdaderos booleanos
  const parsedAdoptable = adoptable === 'true' ? true : false;
  const parsedSocializado = socializado === 'true' ? true : false;
  const parsedEsterilizado = esterilizado === 'true' ? true : false;
  const parsedVacunas = vacunas === 'true' ? true : false;
  const parsedDesparasitado = desparasitado === 'true' ? true : false;

  const imagen = req.file.path; // Ruta de la imagen subida

  if (!nombre || !sexo || colonia_id === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  // Inserta los datos en la base de datos
  db.run(
    `INSERT INTO Gatos (
      nombre, sexo, enfermedad, adoptable, socializado, esterilizado,
      raza, capa, fecha_nacimiento, vacunas, desparasitado, observaciones,
      descripcion, imagen, colonia_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      sexo,
      enfermedad,
      parsedAdoptable,
      parsedSocializado,
      parsedEsterilizado,
      raza,
      capa,
      fecha_nacimiento,
      parsedVacunas,
      parsedDesparasitado,
      observaciones,
      descripcion,
      imagen,
      colonia_id
    ],
    function (err) {
      if (err) {
        console.error('Error al crear el gato:', err.message);
        return res.status(500).json({ error: 'Error al crear el gato', details: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Gato creado exitosamente', imagen });
    }
  );
});


// Actualizar un gato
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    sexo,
    enfermedad,
    adoptable,
    socializado,
    esterilizado,
    raza,
    capa,
    fecha_nacimiento,
    vacunas,
    desparasitado,
    colonia_id,
    observaciones,
    descripcion
  } = req.body;

  db.run(
    `UPDATE Gatos SET
      nombre = ?, sexo = ?, enfermedad = ?, adoptable = ?, socializado = ?,
      esterilizado = ?, raza = ?, capa = ?, fecha_nacimiento = ?, vacunas = ?,
      desparasitado = ?, colonia_id = ?, observaciones = ?, descripcion = ?
    WHERE id = ?`,
    [
      nombre,
      sexo,
      enfermedad,
      adoptable,
      socializado,
      esterilizado,
      raza,
      capa,
      fecha_nacimiento,
      vacunas,
      desparasitado,
      colonia_id,
      observaciones,
      descripcion,
      id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar el gato', details: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Gato no encontrado' });
      }
      res.json({ message: 'Gato actualizado correctamente' });
    }
  );
});

// Borrar todos los gatos
router.delete('/all', (req, res) => {
  db.run('DELETE FROM Gatos', function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al borrar todos los gatos', details: err.message });
    }
    res.json({ message: 'Todos los gatos han sido eliminados' });
  });
});

// Eliminar un gato
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM Gatos WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el gato', details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Gato no encontrado' });
    }
    res.json({ message: 'Gato eliminado correctamente' });
  });
});

module.exports = router;
