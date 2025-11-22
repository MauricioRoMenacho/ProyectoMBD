const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos desde /Public
app.use(express.static(path.join(__dirname, 'Public')));

// Rutas API
const usuariosRouter = require('./Routes/usuarios');
const tramitesRouter = require('./Routes/tramites');
const movimientosRouter = require('./Routes/movimientos');

app.use('/api/usuarios', usuariosRouter);
app.use('/api/tramites', tramitesRouter);
app.use('/api/movimientos', movimientosRouter);

// Vistas HTML

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views/index.html'));
  });

  
app.get('/usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/usuarios.html'));
});

app.get('/tramites', (req, res) => {
  res.sendFile(path.join(__dirname, 'Views/tramites.html'));
});

app.get('/movimientos', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views/movimientos.html'));
  });
  



app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
