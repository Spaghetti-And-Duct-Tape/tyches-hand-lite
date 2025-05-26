import { useEffect, useState } from "react";
import StartScreen from "./startScreen";
import BloodButton from "../../components/bloodButton/bloodButton";
import GameOverScreen from "./gameOverScreen";
import "./menuScreen.css";
import { useGameState } from "../../composables/useGameState";

export default function MenuScreens() {
  const { gameState, gameDispatch } = useGameState();
  const { gameOver } = gameState;

  const [playButton, setPlayButton] = useState<boolean>(false);

  useEffect(() => {
    const introDelay = setTimeout(() => {
      setPlayButton(true);
    }, 1500);

    return () => clearTimeout(introDelay);
  }, []);
  
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      { gameOver ? (
        <GameOverScreen />
      ) : (
        <StartScreen />
      )}

      <div 
        className="start-button-container transition-opacity"
        style={{
          opacity: playButton ? "1" : "0",
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

      { gameOver &&
        <small
          style={{
            position: "absolute",
            bottom: "0",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: playButton ? "1" : "0",
          }}
        >Held together by: <a
            href="https://github.com/Spaghetti-And-Duct-Tape/tyches-hand-lite"
          >
            Spaghetti and Duct Tape
          </a>
        </small>
      }

    </div>
  )
}