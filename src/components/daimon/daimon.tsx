import { useEffect, useRef } from "react";
import { useGameState, type phaseType } from "../../composables/useGameState";
import { daimons } from "../../daimons";
import "./daimon.css";

export default function Daimon() {
  const { gameState, gameDispatch, setAnimation } = useGameState();
  const { animations, hand, phase, visibility } = gameState;
  const daimon = daimons[gameState.daimon];
  const blinkTimer = useRef<number>(0);
  const effectRef = useRef(false);

  useEffect(() => {
    if (phase === "resolution") effectRef.current = false
  }, [phase])

  //Opens eye lid on load
  useEffect(() => {
    if (visibility.daimon) setAnimation("daimon", "open-eyelid", 1500);
  }, [visibility.daimon]);

  //Periodically blinks
  useEffect(() => {
    window.clearTimeout(blinkTimer.current);
    
    if (!visibility.daimon || animations.daimon === "idle") return;
    const delay = Math.random() * 5000 + 10000;

    blinkTimer.current = window.setTimeout(() => {
      setAnimation("daimon", "blinking", 1000);
    }, delay);
  }, [animations.daimon]);
  
  useEffect(() => {
    if (!daimon.effect && phase === "daimon-turn" || effectRef.current && phase === "daimon-turn") return gameDispatch({ 
      type: "SET_PHASE", payload: { phase: "resolution"
    }})

    if (!daimon.effect) return;
    if (effectRef.current) return;

    applyDaimonEffects(phase);
  }, [phase]);

  async function applyDaimonEffects(phase: phaseType) {    
    const newGameState = daimon.effect(gameState);

    if (!newGameState && phase === "daimon-turn") return gameDispatch({ 
      type: "SET_PHASE", payload: { phase: "resolution"
    }})

    if (!newGameState) return;    
    effectRef.current = true;

    gameDispatch({ type: "SET_PHASE",
      payload: {
        phase: "apply-daimon-effect"
      }
    });

    gameDispatch({ type: "SET_PHASE",
      payload: {
        phase: "appy-token-effect"
      }
    });

    await setAnimation("daimon", "attacked", 2000);

    newGameState.phase = phase === "daimon-turn" 
      ? "resolution" : phase;

    gameDispatch({ type: "APPLY_EFFECTS",
      payload: {
        gameState: newGameState
      }
    })
  };

  return (
    <div
      className={ `daimon-eye-container transition-opacity ${ hand > 5 ? "tyches-wrath" : "" }` }
      style={{ 
        marginTop: "min(2vw, 2vh)",
        height: "fit-content",
        opacity: visibility.daimon ? "1" : "0", 
        padding: "0",
        zIndex: "999"
      }}
    >
      <div className="float">
        <div className={ `daimon-${ animations.daimon }` }>
          <div id="eye">
            <div className="pupil">
              <div className="shine" />
                  <div className="rune">
                    { daimon.rune }
                  </div>
              </div>
            </div>
          </div>
      </div>
    </div>

  )
};