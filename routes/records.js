
const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/database.db");

// Obtener todos los registros
router.get("/", (req, res) => {
  db.all("SELECT * FROM records", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Agregar un registro
router.post("/", (req, res) => {
  const { name, email } = req.body;
  const sql = "INSERT INTO records (name, email) VALUES (?, ?)";
  db.run(sql, [name, email], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, email });
  });
});

// Editar un registro
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const sql = "UPDATE records SET name = ?, email = ? WHERE id = ?";
  db.run(sql, [name, email, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Registro actualizado" });
  });
});

// Eliminar un registro
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM records WHERE id = ?";
  db.run(sql, id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Registro eliminado" });
  });
});

module.exports = router;

