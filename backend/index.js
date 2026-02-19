const express = require("express");
const cors = require("cors");

const app = express();   // ← AQUÍ defines app
const PORT = 3000;

app.use(cors());
app.use(express.json());

let cartas = [
  { id: 1, status: "learning", word: "aaaa", translation: "aaaa"  },
  { id: 2, status: "ready", word: "bbbbb", translation: "bbbbb", },
];


app.get("/cartas", (req, res) => {
  res.json(cartas);
});


app.get("/", (req, res) => {
  res.send("Servidor backend funcionando🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
