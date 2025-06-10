import { useEffect, useRef, useState } from "react";
import { useGameState, type PhaseType } from "../../composables/useGameState";
import "./daimon.css";
import { daimons } from "../../daimons";
import { wait } from "../../utils/utils";

export default function Daimon() {
  const { gameState, gameDispatch, setAnimation } = useGameState();
  const { phase, animations, hand, visibility } = gameState;
  const daimon = daimons[gameState.daimon];
  const effectRef = useRef(false);

  //Opens eye lid on load
  useEffect(() => {
    if (!visibility.daimon) return;

    setAnimation("daimon", "open-eyelid", 1500);
  }, [visibility.daimon]);

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
        phase: "apply-effect"
    }});

    await setAnimation("daimon", "attacked", 2000);

    const transitionPhase = phase === "apply-daimon-effect" ? 
      "resolution" : phase;

    gameDispatch({ type: "APPLY_EFFECTS", 
      payload: {
        gameState: newGameState
    }});

    await wait(1000);
    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        target: "daimon",
        animation: "idle",
    }});

    await wait(300);
    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        target: "player",
        animation: "idle",
    }})

    gameDispatch({ type: "SET_PHASE", 
      payload: {
        phase: transitionPhase
    }})
  };

  return (
    <div
      className={ `daimon-eye-container transition-opacity ${ hand > 5 ? "tyches-wrath" : "" }` }
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