const { connectDB } = require('./db');

async function test() {
  try {
    const conn = await connectDB();

    // Test 1: verificar conexión
    console.log('Conectado a Oracle');

    
    
    console.log('Trámite de prueba:', tramite.rows[0]);

    await conn.close();
  } catch (err) {
    console.error('Error en el test:', err);
  }
}

test();
