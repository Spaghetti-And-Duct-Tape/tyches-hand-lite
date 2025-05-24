import { useEffect, useState } from "react";
import { useGameState } from "../composables/useGameState";
import StartScreen from "./startScreen";
import BloodButton from "../components/bloodButton/bloodButton";

export default function OverlayScreens() {
  const { gameState, gameDispatch } = useGameState();
  const { gameOver } = gameState;
  const [playButton, setPlayButton] = useState<boolean>(false);
  
  useEffect(() => {
    const introDelay = setTimeout(() => {
      setPlayButton(true);
    }, 1500);

    return () => clearTimeout(introDelay);
  }, []);

  return(
    <div 
      className="overlay-screen"
      style={{ 
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        
      }}
    >
      { gameOver 
        ? <GameOver />
        : <StartScreen />
      }
        <div 
          className="start-button-container transition-opacity"
          style={{
            opacity: playButton ? "1" : "0" ,
            zIndex: "1"
          }}
        >
          <BloodButton
            disabled={ !playButton }
            action={ () => gameDispatch({ type: "START_GAME" }) }
          >
            Play
          </BloodButton>
        </div>
    </div>
  )
};

function GameOver() {
  return (
    <div className="start-screen-content game-over">
      <div 
          className="logo-container"
          style={{
            opacity: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "min(40vw, calc(40vh * 16 / 9)",
            animation: "fade-in-soft-descent 1s ease-in-out forwards"
          }}
        >
        <h2
          style={{
          }}
        >
          Game Over
        </h2>
        <small>
          Held together by <a
            target="_blank"
            href="https://github.com/Spaghetti-And-Duct-Tape?tab=repositories"
          >
            Spaghetti and Duct Tape
          </a>
        </small>
    </div>
  </div>
  )
};