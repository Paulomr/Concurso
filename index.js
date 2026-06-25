require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

async function start() {
  // Conectar a la BD ANTES de escuchar peticiones.
  await connectDB();

  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`[Server] Escuchando en el puerto ${PORT}.`));
}

start();
