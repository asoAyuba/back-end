const express = require('express');
const fs = require('fs'); // Importar módulo para manejar archivos
const path = require('path');

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const catRoutes = require('./src/routes/cats');
const colonyRoutes = require('./src/routes/colonies');
const partnerRoutes = require('./src/routes/partners');
const resetRouter = require('./src/routes/reset');

const app = express();
app.use(express.json());

// Asegurarse de que la carpeta 'uploads' exista
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware para servir archivos estáticos desde 'uploads'
app.use('/uploads', express.static(uploadDir));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/cats', catRoutes);
app.use('/colonies', colonyRoutes);
app.use('/partners', partnerRoutes);
app.use('/api', resetRouter); // Montar el endpoint en "/api/reset-db"

app.listen(4000, () => console.log('Microservicio corriendo en http://localhost:4000'));
