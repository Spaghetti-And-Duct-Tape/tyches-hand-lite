import { useEffect } from "react";
import { useGameState } from "../composables/useGameState"
import Landscape from "./landscape";
import ApplyToken from "../components/token/applyToken";

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
        height: "100vh",
        width: "100vw",
        zIndex: "1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
      className={ `player-${ animations.player }` }
    >
      <ApplyToken />
      <Landscape />
    </div>
  )
};