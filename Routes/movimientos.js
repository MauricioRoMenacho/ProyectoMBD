const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: listar movimientos
router.get('/', async (req, res) => {
  try {
    const result = await db.open(`SELECT * FROM MOVIMIENTOS`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: movimiento por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.open(
      `SELECT * FROM MOVIMIENTOS WHERE ID_MOVIMIENTO = :id`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: crear movimiento
router.post('/', async (req, res) => {
  const { id_usuario, tipo, monto } = req.body;

  try {
    await db.open(
      `INSERT INTO MOVIMIENTOS (ID_USUARIO, TIPO, MONTO)
       VALUES (:id_usuario, :tipo, :monto)`,
      [id_usuario, tipo, monto],
      true
    );
    res.json({ msg: 'Movimiento creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: actualizar movimiento
router.put('/:id', async (req, res) => {
  const { tipo, monto } = req.body;

  try {
    await db.open(
      `UPDATE MOVIMIENTOS
       SET TIPO = :tipo, MONTO = :monto
       WHERE ID_MOVIMIENTO = :id`,
      [tipo, monto, req.params.id],
      true
    );
    res.json({ msg: 'Movimiento actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: eliminar movimiento
router.delete('/:id', async (req, res) => {
  try {
    await db.open(
      `DELETE FROM MOVIMIENTOS WHERE ID_MOVIMIENTO = :id`,
      [req.params.id],
      true
    );
    res.json({ msg: 'Movimiento eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

