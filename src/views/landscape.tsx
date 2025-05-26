import { useGameState } from "../composables/useGameState"
import GameBoard from "./gameBoard";
import Intermission from "./intermission/intermission";

export default function Landscape() {
  const { gameState } = useGameState();
  const { phase } = gameState;
  
  return(
    <div
      className="landscape"
      style={{
        width: "min(100vw, calc(100vh * 16 / 9))",
        height: "min(calc(100vw * 9 / 16), 100vh)",
        position: "relative",
        background: "#111",
        zIndex: "-1",
      }}
    >
      { phase === "intermission" ? (
        <Intermission />
      ) : (
        <GameBoard />
      )}
    </div>
  )
};