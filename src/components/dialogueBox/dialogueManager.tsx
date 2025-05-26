import { useEffect } from "react";
import { useGameState } from "../../composables/useGameState";
import { daimons } from "../../daimons";
import BloodButton from "../bloodButton/bloodButton";
import DialogueBox from "./dialogueBox";
import useDialogue from "../../composables/useDialogue";
import { revealSchema } from "../../utils/revealSchema";

export default function DialogueManager() {
  const { gameState, gameDispatch } = useGameState();
  const { phase, hand, daimon, visibility } = gameState;
  const isDialoguePhase = phase === "intro-dialogue" 
    || phase === "hand-dialogue"
    || phase === "end-dialogue";
    
  if (!isDialoguePhase) return;
  //Only triggered in dialogue game phases
  
  const daimonDialogue = daimons[daimon]?.dialogue?.[phase]?.[hand];
  const dialogue = useDialogue(daimonDialogue, () => advancePhase());
  const { index, currentLine, advance, reset } = dialogue;

  const revealObj: {
    dialogueBox: number;
    daimon: number;
    table: number;
    healthBars: number;
  } = revealSchema(daimon)
  const opacityDelay = 300;
  const visibilityMap = Object.fromEntries(
    Object
      .entries(revealObj)
      .map(([key, threshold]) => [
        key,
        index >= threshold
      ])
  );

  useEffect(() => {
    if (!daimonDialogue) {
      advancePhase();
      gameDispatch({ type: "SET_VISIBILITY", 
        payload: {
          ...visibility,
          daimon: true,
          table: true,
          healthBars: true,
      }})
    }
  }, []);

  useEffect(() => {
    if (!daimonDialogue) return;

    const timer = setTimeout(() => {
      gameDispatch({ type: "SET_VISIBILITY", 
        payload: {
          ...visibility,
          dialogueBox: true
      }})
    }, opacityDelay);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "intro-dialogue") return;
    if (index !== 0) {
      gameDispatch({ type: "SET_VISIBILITY", 
        payload: visibilityMap
      })
    }
  }, [index]);

  if (!currentLine) return;

  function advancePhase() {
    const nextPhase = {
      "intro-dialogue": "wager",
      "hand-dialogue": "player-turn",
      "end-dialogue": "intermission"
    };

    gameDispatch({ type: "SET_PHASE", 
      payload: 
      { phase: nextPhase[phase] 

    }});
    reset();
  };

  return (
    <>
      <DialogueBox
        isVisible = { visibility.dialogueBox }
        line={ currentLine }
      />
      <div
        className="intro-button-container transition-opacity"
        style={{
          position: "absolute",
          bottom: "5%",
          right: "2%",
          zIndex: "1",
          opacity: visibility.dialogueBox ? "1" : "0",
        }}
      >
        <BloodButton
          action={ advance }
        >
          Next
        </BloodButton>
      </div>
    </>
  )
};