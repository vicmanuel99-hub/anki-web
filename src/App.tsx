import React, { useState, useEffect } from "react";
import StudyMode from "./Studymode";
import "./styles.css";
import Agregar from "./Agregar";

export type Card = { //estructura de initialCards
  id: number;
  status: "not-studied" | "learning" | "ready" | "mastered";
  word: string;
  translation: string;
};


//const API = "http://localhost:3000";
const API = "https://anki-web-backend.onrender.com";


function App() {
  const [cards, setCards] = useState<Card[]>([]); //arranca vacío, se llena desde el backend
  const [stateMode, setStateMode] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [search, setSearch] = useState("");

  // Cargar cartas desde el backend al iniciar
  useEffect(() => {
    fetch(`${API}/cartas`)
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch((err) => console.error("Error al cargar cartas:", err));
  }, []); //[] = solo se ejecuta una vez al montar el componente


  const nextCard = () => {
    setFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Deck terminado 🎉");
      setStateMode(0);
      setCurrentIndex(0);
    }
  };

  function updateCardStatus(newStatus: Card["status"]) {
    const updatedCards = cards.map((card, index) => {
      if (index === currentIndex) {
        return { ...card, status: newStatus };
      }
      return card;
    });

    setCards(updatedCards);
    nextCard(); //para avanzar a la sg carta
  }

  async function agregarCards(a: string, b: string) {
    try {
      const res = await fetch(`${API}/cartas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: a, translation: b }),
      });
      const newCard = await res.json(); //el backend nos devuelve la carta creada
      setCards([...cards, newCard]);
    } catch (err) {
      console.error("Error al agregar carta:", err);
    }
  }

  async function eliminarCard(id: number) {
    try {
      await fetch(`${API}/cartas/${id}`, { method: "DELETE" });
      setCards(cards.filter((c) => c.id !== id)); //saco la carta del estado sin recargar
    } catch (err) {
      console.error("Error al eliminar carta:", err);
    }
  }


  // 📊 Estadísticas dinámicas
  const totalDeck = cards.length;

  const notStudied = cards.filter((c) => c.status === "not-studied").length;
  const learning = cards.filter((c) => c.status === "learning").length;
  const ready = cards.filter((c) => c.status === "ready").length;
  const mastered = cards.filter((c) => c.status === "mastered").length;

  const safeTotal = totalDeck || 1; // evita división por 0

  if (stateMode === 1) {
    return (
      <StudyMode
        cards={cards}
        currentIndex={currentIndex}
        flipped={flipped}
        setFlipped={setFlipped}
        updateCardStatus={updateCardStatus}
        setStateMode={setStateMode}
      />
    );
  }

  if (stateMode === 2) {

    return (
      <>
        {
          <Agregar
            setStateMode={setStateMode}
            agreguemosBro={agregarCards} //envio agregarCards al hijo, solo va nombre
          />
        }
      </>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>English</h1>
        <p className="subtitle">Cards for today</p>
      </div>

      <div className="today-card">
        <div className="circle">
          <span>{ready}</span>
        </div>

        <div className="legend">
          <div>
            <span className="dot gray"></span>
            Not studied ({notStudied})
          </div>
          <div>
            <span className="dot green"></span>
            To review ({ready})
          </div>
        </div>
      </div>

      <div className="deck-info">
        <h3>{totalDeck} cards in deck</h3>

        <div className="progress-bar">
          <div
            className="learning"
            style={{ width: `${(learning / safeTotal) * 100}%` }}
          />
          <div
            className="mastered"
            style={{ width: `${(mastered / safeTotal) * 100}%` }}
          />
        </div>

        <div className="stats">
          <span>{notStudied} Not studied</span>
          <span>{learning} Learning</span>
          <span>{ready} Ready</span>
          <span>{mastered} Mastered</span>
        </div>
      </div>

      <div className="search">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} //filtra las cards mientras escribo
        />
        <button className="add-btn" onClick={() => setStateMode(2)}>
          +
        </button>
      </div>

      <div className="card-list ">
        {cards
          .filter(
            (card) =>
              card.word.toLowerCase().includes(search.toLowerCase()) ||
              card.translation.toLowerCase().includes(search.toLowerCase())
          )
          .map((card) => (
            <div key={card.id} className="card-item rounded-4 shadow-sm p-3">
              <div className="card-item-header">
                <small>{card.status}</small>
                <button
                  className="delete-btn"
                  onClick={() => eliminarCard(card.id)}
                >
                  🗑
                </button>
              </div>
              <h4>{card.word}</h4>
              <p>{card.translation}</p>
            </div>
          ))}
      </div>

      <button className="study-btn" onClick={() => setStateMode(1)}>
        Study deck
      </button>
    </div>
  );
}

export default App;
