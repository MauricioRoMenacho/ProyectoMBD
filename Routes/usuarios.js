const express = require('express');
const router = express.Router();
const db = require('../db'); // tu db.js

// Listar usuarios
router.get('/', async (req, res) => {
  try {
    const result = await db.executeQuery(
      `SELECT ID_USUARIO, NOMBRE, APELLIDO, CORREO, ROL
       FROM USUARIOS
       ORDER BY ID_USUARIO`
    );
    res.json(result.rows); // con OUT_FORMAT_OBJECT, cada fila será un objeto {ID_USUARIO, NOMBRE, ...}
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Crear usuario
router.post('/', async (req, res) => {
  const { nombre, apellido, correo, rol } = req.body;
  try {
    await db.executeQuery(
      `INSERT INTO USUARIOS (ID_USUARIO, NOMBRE, APELLIDO, CORREO, ROL)
       VALUES (SEQ_USUARIO.NEXTVAL, :nombre, :apellido, :correo, :rol)`,
      [nombre, apellido, correo, rol],
      true
    );
    res.json({ msg: 'Usuario creado exitosamente' });
  } catch (err) {
    if (err.errorNum === 1) {
      res.status(400).json({ error: "El correo ya existe" });
    } else {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  const { nombre, apellido, correo, rol } = req.body;
  try {
    await db.executeQuery(
      `UPDATE USUARIOS
       SET NOMBRE = :nombre, APELLIDO = :apellido, CORREO = :correo, ROL = :rol
       WHERE ID_USUARIO = :id`,
      [nombre, apellido, correo, rol, req.params.id],
      true
    );
    res.json({ msg: 'Usuario actualizado' });
  } catch (err) {
    if (err.errorNum === 1) {
      res.status(400).json({ error: "El correo ya existe" });
    } else {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
});

// Borrar usuario
router.delete('/:id', async (req, res) => {
  const idUsuario = req.params.id;
  try {
    // Primero borrar movimientos de los trámites del usuario
    await db.executeQuery(
      `DELETE FROM MOVIMIENTO WHERE id_tramite IN
       (SELECT id_tramite FROM TRAMITE WHERE id_usuario = :id)`,
      [idUsuario],
      true
    );

    // Luego borrar trámites del usuario
    await db.executeQuery(
      `DELETE FROM TRAMITE WHERE id_usuario = :id`,
      [idUsuario],
      true
    );

    // Finalmente borrar usuario
    await db.executeQuery(
      `DELETE FROM USUARIOS WHERE ID_USUARIO = :id`,
      [idUsuario],
      true
    );

    res.json({ msg: 'Usuario eliminado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
