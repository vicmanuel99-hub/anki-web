const express = require("express");
const cors = require("cors");

const app = express();   // ← AQUÍ defines app
const PORT = 3000;

app.use(cors());
app.use(express.json());

let cartas = [
  { id: 1, status: "learning", word: "hello", translation: "hola" },
  { id: 2, status: "ready", word: "bye", translation: "adios" },
];
let nextId = 3;

// GET - traer todas las cartas
app.get("/cartas", (req, res) => {
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

  const newCard = {
    id: nextId++,
    status: "not-studied", // status por defecto
    word,
    translation,
  };

  cartas.push(newCard);
  res.status(201).json(newCard); // responde con la carta creada
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});