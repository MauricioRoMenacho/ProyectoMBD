const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// GET: listar todos los movimientos con información completa
router.get('/', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        m.ID_MOVIMIENTO,
        m.OBSERVACION,
        m.ID_TRAMITE,
        m.ID_AREA_ORIGEN,
        m.ID_AREA_DESTINO,
        t.CODIGO AS CODIGO_TRAMITE,
        t.ESTADO AS ESTADO_TRAMITE,
        t.FECHA_REGISTRO,
        u.NOMBRE || ' ' || u.APELLIDO AS USUARIO,
        a_origen.NOMBRE_AREA AS AREA_ORIGEN,
        a_destino.NOMBRE_AREA AS AREA_DESTINO
      FROM MOVIMIENTO m
      JOIN TRAMITE t ON m.ID_TRAMITE = t.ID_TRAMITE
      JOIN USUARIOS u ON t.ID_USUARIO = u.ID_USUARIO
      JOIN AREA a_origen ON m.ID_AREA_ORIGEN = a_origen.ID_AREA
      JOIN AREA a_destino ON m.ID_AREA_DESTINO = a_destino.ID_AREA
      ORDER BY t.FECHA_REGISTRO DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: movimientos por ID de trámite
router.get('/tramite/:id', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        m.ID_MOVIMIENTO,
        m.OBSERVACION,
        m.ID_TRAMITE,
        m.ID_AREA_ORIGEN,
        m.ID_AREA_DESTINO,
        t.CODIGO AS CODIGO_TRAMITE,
        t.ESTADO AS ESTADO_TRAMITE,
        t.FECHA_REGISTRO,
        u.NOMBRE || ' ' || u.APELLIDO AS USUARIO,
        a_origen.NOMBRE_AREA AS AREA_ORIGEN,
        a_destino.NOMBRE_AREA AS AREA_DESTINO
      FROM MOVIMIENTO m
      JOIN TRAMITE t ON m.ID_TRAMITE = t.ID_TRAMITE
      JOIN USUARIOS u ON t.ID_USUARIO = u.ID_USUARIO
      JOIN AREA a_origen ON m.ID_AREA_ORIGEN = a_origen.ID_AREA
      JOIN AREA a_destino ON m.ID_AREA_DESTINO = a_destino.ID_AREA
      WHERE m.ID_TRAMITE = :id
      ORDER BY m.ID_MOVIMIENTO
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: movimientos por fecha
router.get('/fecha/:fecha', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        m.ID_MOVIMIENTO,
        m.OBSERVACION,
        m.ID_TRAMITE,
        m.ID_AREA_ORIGEN,
        m.ID_AREA_DESTINO,
        t.CODIGO AS CODIGO_TRAMITE,
        t.ESTADO AS ESTADO_TRAMITE,
        t.FECHA_REGISTRO,
        u.NOMBRE || ' ' || u.APELLIDO AS USUARIO,
        a_origen.NOMBRE_AREA AS AREA_ORIGEN,
        a_destino.NOMBRE_AREA AS AREA_DESTINO
      FROM MOVIMIENTO m
      JOIN TRAMITE t ON m.ID_TRAMITE = t.ID_TRAMITE
      JOIN USUARIOS u ON t.ID_USUARIO = u.ID_USUARIO
      JOIN AREA a_origen ON m.ID_AREA_ORIGEN = a_origen.ID_AREA
      JOIN AREA a_destino ON m.ID_AREA_DESTINO = a_destino.ID_AREA
      WHERE TRUNC(t.FECHA_REGISTRO) = TO_DATE(:fecha, 'YYYY-MM-DD')
      ORDER BY t.FECHA_REGISTRO DESC
    `, [req.params.fecha]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: movimientos por área origen
router.get('/area-origen/:id', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        m.ID_MOVIMIENTO,
        m.OBSERVACION,
        m.ID_TRAMITE,
        m.ID_AREA_ORIGEN,
        m.ID_AREA_DESTINO,
        t.CODIGO AS CODIGO_TRAMITE,
        t.ESTADO AS ESTADO_TRAMITE,
        t.FECHA_REGISTRO,
        u.NOMBRE || ' ' || u.APELLIDO AS USUARIO,
        a_origen.NOMBRE_AREA AS AREA_ORIGEN,
        a_destino.NOMBRE_AREA AS AREA_DESTINO
      FROM MOVIMIENTO m
      JOIN TRAMITE t ON m.ID_TRAMITE = t.ID_TRAMITE
      JOIN USUARIOS u ON t.ID_USUARIO = u.ID_USUARIO
      JOIN AREA a_origen ON m.ID_AREA_ORIGEN = a_origen.ID_AREA
      JOIN AREA a_destino ON m.ID_AREA_DESTINO = a_destino.ID_AREA
      WHERE m.ID_AREA_ORIGEN = :id
      ORDER BY t.FECHA_REGISTRO DESC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: movimientos por área destino
router.get('/area-destino/:id', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        m.ID_MOVIMIENTO,
        m.OBSERVACION,
        m.ID_TRAMITE,
        m.ID_AREA_ORIGEN,
        m.ID_AREA_DESTINO,
        t.CODIGO AS CODIGO_TRAMITE,
        t.ESTADO AS ESTADO_TRAMITE,
        t.FECHA_REGISTRO,
        u.NOMBRE || ' ' || u.APELLIDO AS USUARIO,
        a_origen.NOMBRE_AREA AS AREA_ORIGEN,
        a_destino.NOMBRE_AREA AS AREA_DESTINO
      FROM MOVIMIENTO m
      JOIN TRAMITE t ON m.ID_TRAMITE = t.ID_TRAMITE
      JOIN USUARIOS u ON t.ID_USUARIO = u.ID_USUARIO
      JOIN AREA a_origen ON m.ID_AREA_ORIGEN = a_origen.ID_AREA
      JOIN AREA a_destino ON m.ID_AREA_DESTINO = a_destino.ID_AREA
      WHERE m.ID_AREA_DESTINO = :id
      ORDER BY t.FECHA_REGISTRO DESC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: obtener áreas para filtros
router.get('/catalogo/areas', async (req, res) => {
  try {
    const result = await executeQuery(`SELECT * FROM AREA ORDER BY NOMBRE_AREA`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: crear movimiento
router.post('/', async (req, res) => {
  const { observacion, id_tramite, id_area_origen, id_area_destino } = req.body;

  try {
    // Obtener el siguiente ID
    const maxIdResult = await executeQuery(`SELECT NVL(MAX(ID_MOVIMIENTO), 0) + 1 AS NEXT_ID FROM MOVIMIENTO`);
    const nextId = maxIdResult.rows[0].NEXT_ID;

    await executeQuery(
      `INSERT INTO MOVIMIENTO (ID_MOVIMIENTO, OBSERVACION, ID_TRAMITE, ID_AREA_ORIGEN, ID_AREA_DESTINO) 
       VALUES (:id, :observacion, :id_tramite, :id_area_origen, :id_area_destino)`,
      [nextId, observacion, id_tramite, id_area_origen, id_area_destino],
      true
    );
    res.json({ msg: 'Movimiento registrado exitosamente', id: nextId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: eliminar movimiento
router.delete('/:id', async (req, res) => {
  try {
    await executeQuery(
      `DELETE FROM MOVIMIENTO WHERE ID_MOVIMIENTO = :id`,
      [req.params.id],
      true
    );
    res.json({ msg: 'Movimiento eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;