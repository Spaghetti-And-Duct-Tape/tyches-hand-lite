import { useGameState } from "../composables/useGameState";
import OverlayScreens from "./overlayScreens";
import GameBoard from "./gameBoard";

export default function GameView() {
  const { gameState } = useGameState();
  const { started } = gameState;
  
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
          <GameBoard />
        ) : (
          <OverlayScreens />
        )
      }
    </div>
  )
};