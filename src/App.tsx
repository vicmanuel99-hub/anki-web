import React, { useState } from "react";
import StudyMode from "./Studymode";
import "./styles.css";

export type Card = {
  id: number;
  status: "not-studied" | "learning" | "ready" | "mastered";
  word: string;
  translation: string;
};

export const initialCards: Card[] = [
  { id: 1, status: "learning", word: "two-faced", translation: "doble cara" },
  { id: 2, status: "ready", word: "narrow-minded", translation: "de mente cerrada" },
  { id: 3, status: "not-studied", word: "well-behaved", translation: "bien educado" },
];

const App = () => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [studyMode, setStudyMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const nextCard = () => {
    setFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Deck terminado 🎉");
      setStudyMode(false);
      setCurrentIndex(0);
    }
  };

  const updateCardStatus = (newStatus: Card["status"]) => {
    const updatedCards = cards.map((card, index) => {
      if (index === currentIndex) {
        return { ...card, status: newStatus };
      }
      return card;
    });

    setCards(updatedCards);
    nextCard();
  };

  // 📊 Estadísticas dinámicas
  const totalDeck = cards.length;

  const notStudied = cards.filter(c => c.status === "not-studied").length;
  const learning = cards.filter(c => c.status === "learning").length;
  const ready = cards.filter(c => c.status === "ready").length;
  const mastered = cards.filter(c => c.status === "mastered").length;

  const safeTotal = totalDeck || 1; // evita división por 0

  if (studyMode) {

        return (
    <StudyMode
      cards={cards}
      currentIndex={currentIndex}
      flipped={flipped}
      setFlipped={setFlipped}
      updateCardStatus={updateCardStatus}
    />
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
        <input placeholder="Search..." />
        <button className="add-btn">+</button>
      </div>

      <div className="card-list ">
        {cards.map((card) => (
          <div key={card.id} className="card-item rounded-4 shadow-sm p-3">
            <small>
              {card.status}
            </small>
            <h4>{card.word}</h4>
            <p>{card.translation}</p>
          </div>
        ))}
      </div>

      <button
        className="study-btn"
        onClick={() => setStudyMode(true)}
      >
        Study deck
      </button>
    </div>
  );
};

export default App;
