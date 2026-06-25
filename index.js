require('dotenv').config();
const path = require('path');
const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

// Conecta a la BD por petición (serverless). Si falla, pasa al manejador de errores.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

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

// Local: levanta servidor. En Vercel se exporta el app como handler.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`[Server] Escuchando en el puerto ${PORT}.`));
}

module.exports = app;
