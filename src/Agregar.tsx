import React, { useState } from "react";
import "./styles.css";

type agregarProps = {
  setStateMode: React.Dispatch<React.SetStateAction<number>>; //esta var recibira un number dianmico
  agreguemosBro: (front: string, back: string) => void; //estoy llamando a esta f de su padre, la accion esta en el padre, esta f se ejecutara en el hijo, pero la accion se hara en el padre, es como un puente entre ambos componentes
};

function Agregar({ setStateMode, agreguemosBro }: agregarProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  
  return (
    <div className="newcard-container">
      <div className="header">
        <h2>New card</h2>
        <button className="check-btn" onClick={()=>{  agreguemosBro(front, back);setFront("");setBack("");  }     }>
          ✓
        </button>
      </div>

      <div className="field">
        <label className="label front">Front</label>
        <input
          type="text"
          placeholder="Enter text here..."
          value={front}
          onChange={(e) => setFront(e.target.value)} //setfront se actualiza dinamicamente mientras escribo, el valor del input se queda con lo que escribo
          className="input"
        />
      </div>

      <div className="field">
        <label className="label back">Back</label>
        <input
          type="text"
          placeholder="Enter text here..."
          value={back}
          onChange={(e) => setBack(e.target.value)}
          className="input focus-green"
        />



      </div>
      <button onClick={() => setStateMode(0)}>principal</button>
      </div>
  );
}

export default Agregar;
