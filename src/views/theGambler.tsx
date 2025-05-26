import { useEffect, useRef } from "react";
import { useGameState, type phaseType } from "../composables/useGameState"
import Landscape from "./landscape";
import { tokens } from "../utils/tokens";
import Token from "../components/token/token";

export default function TheGambler() {
  const { gameState, gameDispatch, setAnimation } = useGameState();
  const { phase, token, playerHealth, animations } = gameState;
  const tokenRef = useRef(false);
  
  const playerEffect = tokens[token];

  useEffect(() => {
    if (phase === "resolution") tokenRef.current = false;
  }, [phase])


  useEffect(() => {
    if (playerHealth <= 0) return gameDispatch({ type: "END_GAME" });
  }, [playerHealth]);

  useEffect(() => {
    if (!playerEffect) return;
    if (tokenRef.current) return;

    applyTokenEffects(phase);
  }, [phase]);

  async function applyTokenEffects(phase: phaseType) {
    const newGameState = playerEffect.gameState(gameState);

    if (!newGameState) return;
    tokenRef.current = true;

    gameDispatch({ type: "SET_PHASE",
      payload: {
        phase: "apply-token-effect"
      }
    });

    await setAnimation("player", "attacked", 2000);

    newGameState.phase = phase;

    gameDispatch({ type: "APPLY_EFFECTS",
      payload: {
        gameState: newGameState
      }
    })
  };


  return(
    <div
      style={{ 
        position: "relative",
        height: "100%",
        width: "100%",
        zIndex: "999",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }} 
      className={ `player-${ animations.player }` }
    >
      { animations.player === "attacked" &&
        <div
          className="player-effect"
          style={{
            position: "absolute",
            fontSize: "50px",
          }}
        >
          <Token token={ playerEffect } />
        </div>
      }
      <Landscape />
    </div>
  )
};