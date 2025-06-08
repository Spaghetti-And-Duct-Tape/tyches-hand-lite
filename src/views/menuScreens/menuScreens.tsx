import { useEffect, useState } from "react";
import BloodButton from "../../components/bloodButton/bloodButton";
import { useGameState } from "../../composables/useGameState";
import GameOverScreen from "./gameOverScreen";
import "./menuScreens.css";
import StartScreen from "./startScreen";

export default function MenuScreens() {
  const { gameState, gameDispatch } = useGameState();
  const { gameOver } = gameState;

  const [playButton, setPlayButton] = useState<boolean>(false);

  useEffect(() => {
    const introDelay = setTimeout(() => {
      setPlayButton(true);
    }, 1500);

    return () => clearTimeout(introDelay);
  }, [])

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
        className="transition-opacity"
        style={{
          opacity: playButton ? "1" : "0",
          zIndex: "1",
          width: "100%"
        }}
      >
        <div
          className="start-button-container"
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <BloodButton
            disabled={ !playButton }
            action={ () => gameDispatch({ type: "START_GAME" })}
          >
            Play
          </BloodButton> 
          <BloodButton
            disabled={ !playButton }
            action={ () => gameDispatch({ type: "START_GAME",
              payload: {
                phase: "intermission"
              }
            })}
          >
            Skip Tutorial
          </BloodButton> 
        </div>
        { gameOver &&
          <small
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            Held together by: <a
              href="https://github.com/Spaghetti-And-Duct-Tape/tyches-hand-lite"
            >
              Spaghetti and Duct Tape
            </a>
          </small>
        }
      </div>
    </div>
  )
};