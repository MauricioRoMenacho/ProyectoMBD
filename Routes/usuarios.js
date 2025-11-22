const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar usuarios
router.get('/', async (req, res) => {
  const connection = await db.connectDB();
  try {
    const result = await connection.execute(
      `SELECT ID_USUARIO, NOMBRE, APELLIDO, CORREO, ROL
       FROM USUARIOS
       ORDER BY ID_USUARIO`
    );

    const usuarios = result.rows.map(row => ({
      ID_USUARIO: row[0],
      NOMBRE: row[1],
      APELLIDO: row[2],
      CORREO: row[3],
      ROL: row[4]
    }));

    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await connection.close();
  }
});

// Crear usuario
router.post('/', async (req, res) => {
  const { nombre, apellido, correo, rol } = req.body;
  const connection = await db.connectDB();

  try {
    await connection.execute(
      `INSERT INTO USUARIOS (NOMBRE, APELLIDO, CORREO, ROL)
       VALUES (:nombre, :apellido, :correo, :rol)`,
      [nombre, apellido, correo, rol]
    );
    await connection.commit();
    res.json({ msg: 'Usuario creado exitosamente ' });
  } catch (err) {
    if (err.errorNum === 1) {
      res.status(400).json({ error: "El correo ya existe" });
    } else {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } finally {
    await connection.close();
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  const { nombre, apellido, correo, rol } = req.body;
  const connection = await db.connectDB();

  try {
    await connection.execute(
      `UPDATE USUARIOS
       SET NOMBRE = :nombre, APELLIDO = :apellido, CORREO = :correo, ROL = :rol
       WHERE ID_USUARIO = :id`,
      [nombre, apellido, correo, rol, req.params.id]
    );
    await connection.commit();
    res.json({ msg: 'Usuario actualizado ' });
  } catch (err) {
    if (err.errorNum === 1) {
      res.status(400).json({ error: "El correo ya existe" });
    } else {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } finally {
    await connection.close();
  }
});

// Borrar usuario (incluye trámites y movimientos)
router.delete('/:id', async (req, res) => {
  const connection = await db.connectDB();
  const idUsuario = req.params.id;

  try {
    // Borrar movimientos de los trámites del usuario
    await connection.execute(
      `DELETE FROM MOVIMIENTO
       WHERE id_tramite IN (SELECT id_tramite FROM TRAMITE WHERE id_usuario = :id)`,
      [idUsuario]
    );

    // Borrar trámites del usuario
    await connection.execute(
      `DELETE FROM TRAMITE WHERE id_usuario = :id`,
      [idUsuario]
    );

    // Borrar usuario
    await connection.execute(
      `DELETE FROM USUARIOS WHERE id_usuario = :id`,
      [idUsuario]
    );

    await connection.commit();
    res.json({ msg: 'Usuario eliminado exitosamente ' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await connection.close();
  }
});

module.exports = router;
