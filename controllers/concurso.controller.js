const service = require('../services/concurso.service');

// Cierre de participación: 25 de junio 2026, 8:00 PM hora Colombia (UTC-5).
const FECHA_CIERRE = new Date('2026-06-25T20:00:00-05:00');

// Capa de red (HTTP). Solo orquesta req/res.
async function crear(req, res) {
  console.log('[Controller] req.body =', req.body); // temporal: confirma datos entrantes
  try {
    // Validación obligatoria de cierre en el backend.
    if (new Date() > FECHA_CIERRE) {
      return res.status(403).json({ error: 'El concurso ha finalizado' });
    }
    if (!req.body || !req.body.nombre || !req.body.instagram) {
      return res.status(400).json({ error: 'nombre e instagram son obligatorios' });
    }
    const creado = await service.crear(req.body);
    return res.status(201).json(creado);
  } catch (err) {
    console.error('[Controller] Error al crear:', err.message);
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Error interno al guardar' });
  }
}

async function top(req, res) {
  try {
    const data = await service.top(req.query.limit);
    return res.json(data);
  } catch (err) {
    console.error('[Controller] Error en top:', err.message);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function existe(req, res) {
  try {
    const exists = await service.existePorInstagram(req.query.instagram);
    return res.json({ exists });
  } catch (err) {
    console.error('[Controller] Error en existe:', err.message);
    return res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { crear, top, existe };
