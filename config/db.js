const mongoose = require('mongoose');

// Conexión robusta a MongoDB. La URI se lee SOLO desde variables de entorno.
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[DB] Falta MONGODB_URI en las variables de entorno (.env).');
    process.exit(1);
  }

  // Manejo de estados de la conexión
  const conn = mongoose.connection;
  conn.on('connected', () => console.log('[DB] MongoDB conectado.'));
  conn.on('error', (err) => console.error('[DB] Error de conexión:', err.message));
  conn.on('disconnected', () => console.warn('[DB] MongoDB desconectado.'));

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  } catch (err) {
    // No fallar silenciosamente: log claro y salida.
    console.error('[DB] No se pudo conectar a MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
