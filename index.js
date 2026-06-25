require('dotenv').config();
const path = require('path');
const express = require('express');
const connectDB = require('./config/db');
const concursoRoutes = require('./routes/concurso.routes');

const app = express();

// Parseo del body: imprescindible para que req.body NO llegue undefined.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirve los archivos estáticos del frontend (aquí el propio index.html).
app.use(express.static(path.join(__dirname)));

// Favicon: responde limpio para que no caiga en el manejador de errores.
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Asegura conexión a BD antes de las rutas de API (serverless-friendly).
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// --- API ---
app.use('/api/concursos', concursoRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Catch-all SPA: cualquier ruta no-API devuelve index.html.
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Middleware global de manejo de errores (al final de todo).
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
