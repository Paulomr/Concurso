require('dotenv').config();
const path = require('path');
const express = require('express');
const connectDB = require('./config/db');

async function start() {
  // Conectar a la BD ANTES de escuchar peticiones.
  await connectDB();

  const app = express();
  app.use(express.json());

  // Favicon: responde limpio para que no caiga en el manejador de errores.
  app.get('/favicon.ico', (req, res) => res.status(204).end());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  // Ruta raíz: sirve el front estático.
  app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'Concurso.html')));

  // Middleware global de manejo de errores (al final de las rutas).
  app.use((err, req, res, next) => {
    console.error('[Error]', err.stack || err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`[Server] Escuchando en el puerto ${PORT}.`));
}

start();
