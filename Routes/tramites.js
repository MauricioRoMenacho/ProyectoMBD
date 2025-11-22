const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: listar trámites
router.get('/', async (req, res) => {
  try {
    const result = await db.open(`SELECT * FROM TRAMITES`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: trámite por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.open(
      `SELECT * FROM TRAMITES WHERE ID_TRAMITE = :id`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: crear trámite
router.post('/', async (req, res) => {
  const { descripcion, fecha } = req.body;

  try {
    await db.open(
      `INSERT INTO TRAMITES (DESCRIPCION, FECHA) VALUES (:descripcion, :fecha)`,
      [descripcion, fecha],
      true
    );
    res.json({ msg: 'Trámite creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: actualizar trámite
router.put('/:id', async (req, res) => {
  const { descripcion, fecha } = req.body;

  try {
    await db.open(
      `UPDATE TRAMITES SET DESCRIPCION = :descripcion, FECHA = :fecha WHERE ID_TRAMITE = :id`,
      [descripcion, fecha, req.params.id],
      true
    );
    res.json({ msg: 'Trámite actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: eliminar trámite
router.delete('/:id', async (req, res) => {
  try {
    await db.open(
      `DELETE FROM TRAMITES WHERE ID_TRAMITE = :id`,
      [req.params.id],
      true
    );
    res.json({ msg: 'Trámite eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

