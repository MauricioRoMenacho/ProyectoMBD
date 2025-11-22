const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// GET: listar todos los trámites con información completa
router.get('/', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        t.ID_TRAMITE,
        t.CODIGO,
        t.FECHA_REGISTRO,
        t.ESTADO,
        u.NOMBRE || ' ' || u.APELLIDO AS USUARIO,
        td.NOMBRE_TIPO AS TIPO_DOCUMENTO,
        a.NOMBRE_AREA AS AREA
      FROM TRAMITE t
      JOIN USUARIOS u ON t.ID_USUARIO = u.ID_USUARIO
      JOIN TIPODOCUMENTO td ON t.ID_TIPO = td.ID_TIPO
      JOIN AREA a ON t.ID_AREA = a.ID_AREA
      ORDER BY t.FECHA_REGISTRO DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: trámite por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        t.*,
        u.NOMBRE || ' ' || u.APELLIDO AS USUARIO,
        td.NOMBRE_TIPO AS TIPO_DOCUMENTO,
        a.NOMBRE_AREA AS AREA
      FROM TRAMITE t
      JOIN USUARIOS u ON t.ID_USUARIO = u.ID_USUARIO
      JOIN TIPODOCUMENTO td ON t.ID_TIPO = td.ID_TIPO
      JOIN AREA a ON t.ID_AREA = a.ID_AREA
      WHERE t.ID_TRAMITE = :id
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: obtener usuarios para el formulario
router.get('/catalogo/usuarios', async (req, res) => {
  try {
    const result = await executeQuery(`SELECT * FROM USUARIOS ORDER BY NOMBRE`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: obtener tipos de documento para el formulario
router.get('/catalogo/tipos', async (req, res) => {
  try {
    const result = await executeQuery(`SELECT * FROM TIPODOCUMENTO ORDER BY NOMBRE_TIPO`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: obtener áreas para el formulario
router.get('/catalogo/areas', async (req, res) => {
  try {
    const result = await executeQuery(`SELECT * FROM AREA ORDER BY NOMBRE_AREA`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: crear nuevo trámite Y su movimiento inicial
router.post('/', async (req, res) => {
  const { codigo, estado, id_usuario, id_tipo, id_area, id_area_destino, observacion } = req.body;

  try {
    // Obtener el siguiente ID para trámite
    const maxIdTramiteResult = await executeQuery(`SELECT NVL(MAX(ID_TRAMITE), 0) + 1 AS NEXT_ID FROM TRAMITE`);
    const nextIdTramite = maxIdTramiteResult.rows[0].NEXT_ID;

    // Insertar el trámite
    await executeQuery(
      `INSERT INTO TRAMITE (ID_TRAMITE, CODIGO, FECHA_REGISTRO, ESTADO, ID_USUARIO, ID_TIPO, ID_AREA) 
       VALUES (:id, :codigo, SYSDATE, :estado, :id_usuario, :id_tipo, :id_area)`,
      [nextIdTramite, codigo, estado, id_usuario, id_tipo, id_area],
      true
    );

    // Obtener el siguiente ID para movimiento
    const maxIdMovimientoResult = await executeQuery(`SELECT NVL(MAX(ID_MOVIMIENTO), 0) + 1 AS NEXT_ID FROM MOVIMIENTO`);
    const nextIdMovimiento = maxIdMovimientoResult.rows[0].NEXT_ID;

    // Insertar el movimiento inicial
    await executeQuery(
      `INSERT INTO MOVIMIENTO (ID_MOVIMIENTO, OBSERVACION, ID_TRAMITE, ID_AREA_ORIGEN, ID_AREA_DESTINO) 
       VALUES (:id_mov, :observacion, :id_tramite, :id_area_origen, :id_area_destino)`,
      [
        nextIdMovimiento, 
        observacion || 'Trámite iniciado', 
        nextIdTramite, 
        id_area, 
        id_area_destino || id_area
      ],
      true
    );

    res.json({ msg: 'Trámite y movimiento creados exitosamente', id: nextIdTramite });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: actualizar trámite
router.put('/:id', async (req, res) => {
  const { codigo, estado, id_usuario, id_tipo, id_area } = req.body;

  try {
    await executeQuery(
      `UPDATE TRAMITE 
       SET CODIGO = :codigo, 
           ESTADO = :estado, 
           ID_USUARIO = :id_usuario, 
           ID_TIPO = :id_tipo, 
           ID_AREA = :id_area 
       WHERE ID_TRAMITE = :id`,
      [codigo, estado, id_usuario, id_tipo, id_area, req.params.id],
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
    // Primero eliminar los movimientos asociados
    await executeQuery(
      `DELETE FROM MOVIMIENTO WHERE ID_TRAMITE = :id`,
      [req.params.id],
      true
    );
    
    // Luego eliminar el trámite
    await executeQuery(
      `DELETE FROM TRAMITE WHERE ID_TRAMITE = :id`,
      [req.params.id],
      true
    );
    res.json({ msg: 'Trámite eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;