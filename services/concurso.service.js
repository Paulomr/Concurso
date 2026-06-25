const Concurso = require('../models/concurso.model');

// Capa de acceso a datos / lógica de negocio.
async function crear(data) {
  try {
    return await Concurso.create({
      nombre: data.nombre,
      instagram: data.instagram,
      aciertos: data.aciertos,
      tiempo_ms: data.tiempo_ms,
    });
  } catch (err) {
    console.error('[Service] Error al crear concurso:', err.message);
    throw err;
  }
}

async function top(limit = 10) {
  return Concurso.find()
    .sort({ aciertos: -1, tiempo_ms: 1 })
    .limit(Number(limit) || 10)
    .lean();
}

async function existePorInstagram(instagram) {
  const doc = await Concurso.exists({ instagram });
  return Boolean(doc);
}

// Duplicado por mismo Instagram O mismo nombre.
async function existeDuplicado({ nombre, instagram }) {
  const or = [];
  if (instagram) or.push({ instagram });
  if (nombre) or.push({ nombre });
  if (!or.length) return false;
  const doc = await Concurso.exists({ $or: or });
  return Boolean(doc);
}

module.exports = { crear, top, existePorInstagram, existeDuplicado };
