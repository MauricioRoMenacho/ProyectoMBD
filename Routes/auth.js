const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// Login
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Correo y contraseña son requeridos' 
      });
    }

    // Consultar usuario en la base de datos
    const sql = `SELECT ID_USUARIO, NOMBRE, APELLIDO, CORREO, ROL, PASSWORD 
                 FROM USUARIOS 
                 WHERE CORREO = :correo AND PASSWORD = :password`;
    
    const result = await executeQuery(sql, { correo, password });

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Correo o contraseña incorrectos' 
      });
    }

    const user = result.rows[0];
    
    res.json({ 
      success: true, 
      message: 'Login exitoso',
      user: {
        id: user.ID_USUARIO,
        nombre: user.NOMBRE,
        apellido: user.APELLIDO,
        correo: user.CORREO,
        rol: user.ROL
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Sesión cerrada' });
});

module.exports = router;