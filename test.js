const { connectDB } = require('./db');

async function test() {
  try {
    const conn = await connectDB();

    // Test 1: verificar conexión
    console.log('Conectado a Oracle');

    // Test 2: contar usuarios
    const usuarios = await conn.execute(
      'SELECT COUNT(*) AS TOTAL FROM USUARIO'
    );
    console.log('Total usuarios:', usuarios.rows[0][0]);

    // Test 3: traer 1 trámite con joins
    const tramite = await conn.execute(
      `SELECT t.codigo, u.nombre, td.nombre_tipo
       FROM TRAMITE t
       JOIN USUARIO u ON t.id_usuario = u.id_usuario
       JOIN TIPODOCUMENTO td ON t.id_tipo = td.id_tipo
       WHERE ROWNUM = 1`
    );
    
    console.log('Trámite de prueba:', tramite.rows[0]);

    await conn.close();
  } catch (err) {
    console.error('Error en el test:', err);
  }
}

test();
