import { useGameState } from "../composables/useGameState";
import OverlayScreens from "./overlayScreens";
import GameBoard from "./gameBoard";
import { useEffect } from "react";
import { useAnimationState } from "../composables/useAnimationState";
import Intermission from "./intermission/intermission";

export default function GameView() {
  const { gameState, gameDispatch } = useGameState();
  const { animationState } = useAnimationState();
  const { playerHealth } = gameState;
  const { started } = gameState;

  console.log(gameState)
  
  useEffect(() => {
    if (playerHealth <= 0) endGame();
  }, [playerHealth])

  function endGame() {
    gameDispatch({ type: "END_GAME" })
  };

  return (
    <div 
      className={ `player-${ animationState.player }` }
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999
      }}
    >
      <div 
        className="game-view"
        style={{
          width: "min(100vw, calc(100vh * 16 / 9))",
          height: "min(calc(100vw * 9 / 16), 100vh)",
          position: "relative",
          overflow: "hidden",
          background: "#111",
        }}
      >
        {
          started ? (
            <Game />
          ) : (
            <OverlayScreens />
          )
        }
      </div>
    </div>
  )
};


function Game() {
  const { gameState } = useGameState();
  const { phase } = gameState;

  if (phase === "intermission") return <Intermission />
  
  return(
    <GameBoard />
  )
};

