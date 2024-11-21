const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Base de datos (MySQL)
const db = mysql.createPool({
  host: process.env.MYSQLHOST || 'mysql.railway.internal',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'daMxlxIRRrWggGwBsMDNKoOxPgNrejgz',
  database: process.env.MYSQLDATABASE || 'railway',
  port: process.env.MYSQLPORT || 3306,
});

// Rutas para CRUD
app.get('/api/records', (req, res) => {
  db.query('SELECT * FROM records', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/records', (req, res) => {
  const { name, email } = req.body;
  db.query('INSERT INTO records (name, email) VALUES (?, ?)', [name, email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Registro agregado exitosamente', id: results.insertId });
  });
});

app.put('/api/records/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  db.query('UPDATE records SET name = ?, email = ? WHERE id = ?', [name, email, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Registro actualizado exitosamente' });
  });
});

app.delete('/api/records/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM records WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Registro eliminado exitosamente' });
  });
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
