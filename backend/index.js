const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000; // PORT = 3000; con eso compilaba en localhost

app.use(cors());
app.use(express.json());

// Conectar (o crear) la base de datos SQLite
const db = new Database("cartas.db");
db.pragma("journal_mode = WAL"); // permite lecturas concurrentes sin bloquear, asi haces deletes desde browser y no cae la pagina

// Crear la tabla si no existe todavía
db.exec(`
  CREATE TABLE IF NOT EXISTS cartas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    status      TEXT    NOT NULL DEFAULT 'not-studied',
    word        TEXT    NOT NULL,
    translation TEXT    NOT NULL
  )
`);

console.log("Base de datos SQLite conectada ✅");

// GET - traer todas las cartas
app.get("/cartas", (req, res) => {
  const cartas = db.prepare("SELECT * FROM cartas").all(); //trae todas las filas
  res.json(cartas);
});

app.get("/", (req, res) => {
  res.send("Servidor backend funcionando 🚀");
});

// POST - agregar una carta nueva
app.post("/cartas", (req, res) => {
  const { word, translation } = req.body;

  if (!word || !translation) {
    return res.status(400).json({ error: "Faltan campos word o translation" });
  }

  const insert = db.prepare(
    "INSERT INTO cartas (word, translation) VALUES (?, ?)"
  );
  const result = insert.run(word, translation); // ejecuta el INSERT

  const newCard = {
    id: result.lastInsertRowid, //SQLite nos da el id generado
    status: "not-studied",
    word,
    translation,
  };

  res.status(201).json(newCard);
});

// DELETE - eliminar una carta por id
app.delete("/cartas/:id", (req, res) => {
  const { id } = req.params;

  const carta = db.prepare("SELECT * FROM cartas WHERE id = ?").get(id); //verifico que existe
  if (!carta) {
    return res.status(404).json({ error: "Carta no encontrada" });
  }

  db.prepare("DELETE FROM cartas WHERE id = ?").run(id);
  res.json(carta); //devuelvo la carta eliminada
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});