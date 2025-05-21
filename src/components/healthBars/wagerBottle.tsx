import { useState } from "react";
import "./healthBars.css"
import NumberTicker from "./numberTicker";
import { useGameState } from "../../composables/useGameState";

export default function WagerBottle() {
  const { gameState } = useGameState();
  const { wager, visibility } = gameState;

  const [value, setValue] = useState(wager);
  const rawTop = 100 - (100 * (value / 1000));
  const top = Math.min(100, Math.max(1, rawTop));

  return(
    <div 
      className="orb transition-opacity"
      style={{
        position: "absolute",
        bottom: "50%",
        right: "2%",
        opacity: visibility.healthBars ? "1" : "0"
      }}
    >
      <div 
        className="shine"
        style={{
          position: "absolute",
          top: "15%",
          left: "15%",
        }} 
      />
      <div className={ `blood-fill ${ wager === value ? "" : "animate-fill"}` }
        style={{ 
            top: `${ top }%`,
            zIndex: "1"
          }} 
      />
      <span
        className="wager-text"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "5"
        }}
      >
        <NumberTicker
          duration={ 1000 }
          replacement={ wager }
          value={ value }
          setValue={ setValue }
        />
      </span>
    </div>
  )
};