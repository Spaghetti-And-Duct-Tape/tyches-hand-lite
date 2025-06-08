import { useEffect, useRef, useState } from "react";
import { useGameState, type PhaseType } from "../../composables/useGameState";
import "./daimon.css";
import { daimons } from "../../daimons";
import { wait } from "../../utils/utils";

export default function Daimon() {
  const { gameState, gameDispatch, setAnimation } = useGameState();
  const { phase, animations, hand, visibility } = gameState;
  const [isTychesWrath, setIsTychesWrath] = useState<boolean>(false);
  const daimon = daimons[gameState.daimon];
  const blinkTimer = useRef<number>(0);
  const effectRef = useRef(false);

  //Opens eye lid on load
  useEffect(() => {
    if (!visibility.daimon) return;

    setAnimation("daimon", "open-eyelid", 1500);
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

  //Transitions into tyches wrath
  useEffect(() => {
    if (hand !== 5 || gameState.daimonHealth === 0) return;
    
    setAnimation("daimon", "blinking", 1000);

    const timeout = setTimeout(() => {
      setIsTychesWrath(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [visibility.table]);

  useEffect(() => {
    if (phase !== "apply-daimon-effect") return;
    if (!daimon.effectType || effectRef.current) {
      return gameDispatch({ type: "SET_PHASE", 
        payload: {
          phase: "resolution"
      }})
    }
  }, [phase]);

  //Resets effects for next hand
  useEffect(() => {
    if (phase === "resolution") effectRef.current = false
  }, [phase]);

  useEffect(() => {
    applyDaimonEffects(phase);
  }, [phase]);

  async function applyDaimonEffects(phase: PhaseType) {
    const newGameState = daimon.effect(gameState);

    if (!newGameState && phase === "apply-daimon-effect") return gameDispatch({ 
      type: "SET_PHASE", payload: { phase: "resolution"
    }})
    if (!newGameState) return;
    effectRef.current = true;

    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        daimon: "attacked"
    }});

    newGameState.phase = phase === "apply-daimon-effect" ? 
      "resolution" : phase;

    await setAnimation("daimon", "attacked", 2000);

    gameDispatch({ type: "APPLY_EFFECTS", 
      payload: {
        gameState: newGameState
    }});
  };

  return (
    <div
      className={ `daimon-eye-container transition-opacity ${ isTychesWrath ? "tyches-wrath" : "" }` }
      style={{
        marginTop: "min(2vw, 2vh)",
        height: "fit-content",
        opacity: visibility.daimon ? "1" : "0",
        padding: "0",
        zIndex: "1"
      }}
    >
      <div className="float">
        <div className={ `daimon-${ animations.daimon } ${ daimon.effectType }` }>
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