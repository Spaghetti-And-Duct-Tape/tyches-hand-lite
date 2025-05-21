import { useGameState } from "../composables/useGameState";
import OverlayScreens from "./overlayScreens";
import GameBoard from "./gameBoard";
import { useEffect } from "react";

export default function GameView() {
  const { gameState, gameDispatch } = useGameState();
  const { playerHealth } = gameState;
  const { started } = gameState;
  
  useEffect(() => {
    if (playerHealth <= 0) endGame();
  }, [playerHealth])

  function endGame() {
    gameDispatch({ type: "END_GAME" })
  };

  return (
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
  )
};


function Game() {
  const { gameState } = useGameState();
  
  return(
    <GameBoard />
  )
}
