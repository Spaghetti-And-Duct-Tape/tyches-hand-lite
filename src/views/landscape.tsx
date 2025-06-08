import { useGameState } from "../composables/useGameState";
import GameBoard from "./gameBoard";
import Intermission from "./intermission/intermission";

export default function Landscape() {
  const { gameState } = useGameState();
  const { phase } = gameState;
  
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: " 100dvw",
        height: "100dvh"
      }}
    >
      <div
        className="landscape"
        style={{
          aspectRatio: "16 / 9",
          width: "100%",
          maxHeight: "100dvh",
          maxWidth: "calc(100dvh * (16 / 9))",
          position: "relative",
        }}
      >
        { phase === "intermission" ? (
          <Intermission />
        ) : (
          <GameBoard />
        )}
      </div>
    </div>
  )
};