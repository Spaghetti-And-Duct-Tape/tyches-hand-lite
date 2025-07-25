import { useEffect, useRef } from "react";
import { useGameState } from "../../composables/useGameState"
import { tokens } from "../../utils/token";
import Token from "./token";
import { wait } from "../../utils/utils";

export default function ApplyToken() {
  const { gameState, gameDispatch, setAnimation, endRound } = useGameState();
  const { phase, token, animations } = gameState;
  const effectRef = useRef(false);
  const playerEffect = token !== null ? tokens[token] : undefined;

  useEffect(() => {
    if (phase === "resolution") effectRef.current = false;
  }, [phase]);

  useEffect(() => {
    if (phase !== "apply-token-effect") return;
    const tokenEffect = playerEffect?.gameState(gameState);

    if (!tokenEffect || effectRef.current) gameDispatch({
      type: "SET_PHASE",
      payload: {
        phase: "apply-daimon-effect"
    }});
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
        phase: "apply-effect"
    }});

    await setAnimation("player", "attacked", 2500);

    if (newGameState.daimonHealth !== undefined && newGameState?.daimonHealth <= 0) return endRound();

    const newPhase = newGameState.phase;
    newGameState.phase = "apply-effect";

    gameDispatch({ type: "APPLY_EFFECTS",
      payload: {
        gameState: newGameState
    }});

    if (newGameState.animations) {
      await wait(1200);
      
      gameDispatch({ type: "SET_ANIMATION", 
        payload: {
          target: "player",
          animation: "idle"
        }
      });
      
      gameDispatch({ type: "SET_ANIMATION", 
        payload: {
          target: "daimon",
          animation: "idle"
        }
      });
    };

    gameDispatch({ type: "SET_PHASE", 
      payload: {
        phase: newPhase
    }});
  };

  if (token === null) return;
  
  return (
    <>
      { animations.player &&
        <div 
          className="player-effect"
          style={{
            position: "absolute",
            fontSize: "50px"
          }}
        >
          <Token
            token={ tokens[token] }
          />
        </div>
      }
    </>
  )
};