import { useEffect, useRef, useState } from "react";
import { useGameState, type PhaseType } from "../../composables/useGameState";
import "./daimon.css";
import { daimons } from "../../daimons";

export default function Daimon() {
  const { gameState, gameDispatch, setAnimation } = useGameState();
  const { phase, animations, hand, visibility } = gameState;
  const [isTychesWrath, setIsTychesWrath] = useState<boolean>(false);
  const daimon = daimons[gameState.daimon];
  const effectRef = useRef(false);

  //Opens eye lid on load
  useEffect(() => {
    if (!visibility.daimon) return;

    setAnimation("daimon", "open-eyelid", 1500);
  }, [visibility.daimon]);

  //Transitions into tyches wrath
  useEffect(() => {
    console
    if (hand !== 6 || gameState.daimonHealth === 0) return;
    
    setAnimation("daimon", "blinking", 1500);

    const timeout = setTimeout(() => {
      setIsTychesWrath(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [hand]);

  //Resets effects for next hand
  useEffect(() => {
    if (phase === "resolution") effectRef.current = false
  }, [phase]);

  useEffect(() => {
    if (phase !== "apply-daimon-effect") return;
    const daimonEffect = daimon.effect(gameState);

    if (!daimonEffect || effectRef.current) gameDispatch({
      type: "SET_PHASE",
      payload: {
        phase: "resolution"
    }}); 
  }, [phase])

  useEffect(() => {
    if (effectRef.current) return;

    applyDaimonEffects(phase);
  }, [phase]);

  async function applyDaimonEffects(phase: PhaseType) {
    const newGameState = daimon.effect(gameState);

    if (!newGameState && phase === "apply-daimon-effect") return gameDispatch({ 
      type: "SET_PHASE", payload: { phase: "resolution"
    }})
    if (!newGameState) return;
    effectRef.current = true;

    gameDispatch({ type: "SET_PHASE", 
      payload: {
        phase: "apply-token-effect"
    }});

    console.log(animations.daimon)
    await setAnimation("daimon", "attacked", 2000);

    newGameState.phase = phase === "apply-daimon-effect" ? 
      "resolution" : phase;

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