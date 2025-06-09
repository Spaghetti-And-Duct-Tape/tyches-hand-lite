import { useEffect, useRef } from "react";
import { useGameState } from "../../composables/useGameState"
import { tokens } from "../../utils/token";
import Token from "./token";

export default function ApplyToken() {
  const { gameState, gameDispatch, setAnimation, endRound } = useGameState();
  const { phase, token, animations } = gameState;
  const effectRef = useRef(false);
  const playerEffect = token !== null ? tokens[token] : undefined;

  useEffect(() => {
    if (phase === "resolution") effectRef.current = false;
  }, [phase]);

  useEffect(() => {
    if (!playerEffect) return;
    if (effectRef.current) return;

    applyTokenEffects();
  }, [phase]);

  async function applyTokenEffects() {
    const newGameState = playerEffect?.gameState(gameState);

    if (!newGameState) return;
    effectRef.current = true;

    gameDispatch({ type: "SET_PHASE", 
      payload: {
        phase: "apply-token-effect"
    }});

    await setAnimation("player", "attacked", 1000);

    if (newGameState.daimonHealth !== undefined && newGameState?.daimonHealth <= 0) return endRound();

    newGameState.phase = phase;

    gameDispatch({ type: "APPLY_EFFECTS",
      payload: {
        gameState: newGameState
    }});
  };

  if (token === null) return;
  
  return (
    <div 
      className={ animations.player === "attacked" ? "player-attacked" : "" }
    >
      <Token
        token={ tokens[token] }
      />
    </div>
  )
};