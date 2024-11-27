const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conectar a SQLite
const dbPath = path.resolve('./data', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(`Error al conectar con SQLite: ${err.message}`);
  } else {
    console.log('Conectado a SQLite.');
  }
});

// Crear tablas
const schema =`

CREATE TABLE IF NOT EXISTS Colonias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    localizacion TEXT NOT NULL,
    punto_alimentacion TEXT,
    puntos_cobijo TEXT,
    caracteristicas TEXT,
    censo_ayuntamiento INTEGER,
    numero_esterilizados INTEGER,
    numero_enfermos INTEGER,
    vulnerabilidad TEXT,
    puntos_eliminacion TEXT,
    cartel_identificativo TEXT
);

-- Tabla de Gestores (alimentadores)
CREATE TABLE IF NOT EXISTS Gestores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    id_ayuba TEXT NOT NULL UNIQUE,
    colonia_id INTEGER NOT NULL,
    FOREIGN KEY (colonia_id) REFERENCES Colonias (id)
);

-- Tabla de Gatos
CREATE TABLE IF NOT EXISTS Gatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    sexo TEXT NOT NULL CHECK (sexo IN ('Macho', 'Hembra')),
    enfermedad TEXT, -- leucemia, inmuno
    adoptable BOOLEAN NOT NULL,
    socializado BOOLEAN NOT NULL,
    esterilizado BOOLEAN NOT NULL,
    raza TEXT,
    capa TEXT,
    fecha_nacimiento DATE,
    vacunas BOOLEAN NOT NULL,
    desparasitado BOOLEAN NOT NULL,
    observaciones TEXT,
    Descripcion TEXT,
    imagen TEXT, -- Ruta de la imagen
    adoptante_id INTEGER, -- Datos del adoptante
    colonia_id INTEGER NOT NULL, -- Relación con Colonias
    FOREIGN KEY (adoptante_id) REFERENCES Usuarios (id),
    FOREIGN KEY (colonia_id) REFERENCES Colonias (id)
);

-- Tabla de Usuarios (Adoptantes o cualquier usuario del sistema)
CREATE TABLE IF NOT EXISTS Usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefono TEXT,
    direccion TEXT,
    rol TEXT NOT NULL CHECK (rol IN ('Administrador', 'Voluntario', 'Adoptante', 'Afiliado', 'Socio'))
);

CREATE TABLE IF NOT EXISTS Administradores (
    usuario_id INTEGER PRIMARY KEY,
    permisos_admin TEXT,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Voluntarios (
    usuario_id INTEGER PRIMARY KEY,
    habilidades_voluntario TEXT,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Afiliados (
    usuario_id INTEGER PRIMARY KEY,
    afiliado_codigo TEXT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Socios (
    usuario_id INTEGER PRIMARY KEY,
    socio_desde DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios (id) ON DELETE CASCADE
);

-- Tabla de Veterinarios
CREATE TABLE IF NOT EXISTS Veterinarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    zona TEXT,
    hospital TEXT
);

-- Tabla de Casas de Acogida
CREATE TABLE IF NOT EXISTS CasasAcogida (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    direccion TEXT NOT NULL,
    telefono TEXT,
    gatos INTEGER DEFAULT 0 -- Número de gatos acogidos
);

-- Tabla de Voluntarios
CREATE TABLE IF NOT EXISTS Voluntarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    direccion TEXT,
    gato_id INTEGER,
    FOREIGN KEY (gato_id) REFERENCES Gatos (id)
);
`;

db.serialize(() => {
  db.exec(schema, (err) => {
    if (err) {
      console.error('Error al crear las tablas:', err.message);
    } else {
      console.log('Tablas creadas exitosamente.');
    }
  });
});

module.exports = db;
