const oracledb = require('oracledb');


oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function connectDB() {
  try {
    return await oracledb.getConnection({
      user: "mauricio",
      password: "Mauricio123",
      connectString: "localhost:1521/FREEPDB1"
    });
  } catch (err) {
    console.error("Error al conectar:", err);
    return null;
  }
}


async function executeQuery(sql, params = [], autoCommit = false) {
  let connection;
  try {
    connection = await connectDB();
    if (!connection) {
      throw new Error('No se pudo conectar a la base de datos');
    }
    
    const result = await connection.execute(sql, params, { autoCommit });
    return result;
  } catch (err) {
    console.error("Error en executeQuery:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error al cerrar conexión:", err);
      }
    }
  }
}

module.exports = { connectDB, executeQuery };
