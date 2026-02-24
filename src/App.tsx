import React, { useState } from "react";
import StudyMode from "./Studymode";
import "./styles.css";
import Agregar from "./Agregar";

export type Card = { //estructura de initialCards
  id: number;
  status: "not-studied" | "learning" | "ready" | "mastered";
  word: string;
  translation: string;
};

export const initialCards: Card[] = [
  {
    id: 1,
    status: "learning",
    word: "two-faced",
    translation: "doble cara"
  },
  {
    id: 2,
    status: "ready",
    word: "narrow-minded",
    translation: "de mente cerrada",
  },
  {
    id: 3,
    status: "not-studied",
    word: "well-behaved",
    translation: "bien educado",
  },
];

function App() {
  const [cards, setCards] = useState<Card[]>(initialCards); //cards se queda con todos las cartas
  const [stateMode, setStateMode] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [search, setSearch] = useState("");

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

  function agregarCards(a: string, b: string) {

    setCards([
      ...cards,
      {
        id: cards.length + 1, //id dinamico, se asigna el siguiente numero disponible
        status: "not-studied",
        word: a,
        translation: b
      }
    ]);

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
              <small>{card.status}</small>
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
