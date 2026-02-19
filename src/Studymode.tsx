import type { Card } from "./App";

type StudyModeProps = {
  cards: Card[];
  currentIndex: number;
  flipped: boolean;
  setFlipped: React.Dispatch<React.SetStateAction<boolean>>;
  updateCardStatus: (status: Card["status"]) => void;
};

const StudyMode = ({
  cards,
  currentIndex,
  flipped,
  setFlipped,
  updateCardStatus,
}: StudyModeProps) => {
  const currentCard = cards[currentIndex];

  return (
    <div className="study-container">
      <h2>Study Mode</h2>

      <div
        className="study-card"
        onClick={() => setFlipped(!flipped)}
      >
        {flipped ? currentCard.translation : currentCard.word}
      </div>

      {flipped && (
        <div className="study-buttons">
          <button onClick={() => updateCardStatus("learning")}>
            Again
          </button>
          <button onClick={() => updateCardStatus("ready")}>
            Good
          </button>
          <button onClick={() => updateCardStatus("mastered")}>
            Easy
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyMode;
