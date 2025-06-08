import { useEffect } from "react";
import { useGameState } from "../composables/useGameState"
import Landscape from "./landScape";

export default function TheGambler() {
  const { gameState, gameDispatch } = useGameState();
  const { playerHealth, animations } = gameState;

  useEffect(() => {
    if (playerHealth <= 0) return gameDispatch({ type: "END_GAME" });
  }, [playerHealth]);

  return (
    <div
      style={{
        position: "relative",
        height: "100dvh",
        width: "100dvw",
        zIndex: "1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
      className={ `player-${ animations.player }` }
    >
      <Landscape />
    </div>
  )
};