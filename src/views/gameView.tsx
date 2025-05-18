import { useGameState } from "../composables/useGameState";
import OverlayScreens from "./overlayScreens";
import "./gameView.css";

export default function GameView() {
  const { gameState } = useGameState();
  const { started } = gameState;
  
  return (
    <div className="game-view">
      {
        started ? (
          <div>{ JSON.stringify(gameState) }</div>
        ) : (
          <OverlayScreens />
        )
      }
    </div>
  )
};