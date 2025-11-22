const oracledb = require('oracledb');

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

module.exports = { connectDB };
