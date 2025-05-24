import { useEffect } from "react";
import useDialogue from "../../composables/useDialogue";
import { useGameState } from "../../composables/useGameState";
import { conditionalDialogue, daimons } from "../../daimons";
import { revealSchema } from "../../utils/revealSchema";
import DialogueBox from "./dialogueBox";
import BloodButton from "../bloodButton/bloodButton";

export default function DialogueManager() {
  const { gameState, gameDispatch} = useGameState();
  const { phase, round, handCount } = gameState;
  const isDialoguePhase = phase === "introDialogue" || phase === "handDialogue" || phase === "endDialogue";

  if (!isDialoguePhase) return;

  const daimonDialogue = daimons[round]?.dialogue?.[phase]?.[handCount] || conditionalDialogue(gameState);
  const dialogue = useDialogue(daimonDialogue, () => advancePhase());
  const { index, currentLine, advance, reset } = dialogue;
  const opacityDelay: number = 300;
  
  const visibility = Object.fromEntries(
    Object.entries(revealSchema).map(([key, threshold]) => [
      key,
      index >= threshold
    ])
  );

  function advancePhase() {
    const nextPhase = {
      "introDialogue": "wager",
      "handDialogue": "player-turn",
      "endDialogue": "intermission"
    };

    //Safely sets everything as visible
    gameDispatch({ type: "SET_VISIBILITY", payload: {
      ...gameState.visibility,
      daimon: true,
      table: true,
      healthBars: true,
    }});
    gameDispatch({ type: "SET_PHASE", payload: { phase: nextPhase[phase] }});
    reset();
  };
  
  useEffect(() => {
    if (!daimonDialogue) {
      advancePhase();
    }
  }, []);

  useEffect(() => {
    if (!daimonDialogue) return;
    const timer = setTimeout(() => {
      gameDispatch({ type: "SET_VISIBILITY", payload: {
        ...gameState.visibility,
        dialogueBox: true
      }})
      
    return () => clearTimeout(timer);
    }, opacityDelay);
  }, [])
  
  useEffect(() => {
    if (phase !== "introDialogue") return;
    if (index !== 0) {
      gameDispatch({ type: "SET_VISIBILITY", payload: visibility });
      return;
    }
  }, [index]);

  if (!currentLine) return;

  return (
      <>
        <DialogueBox
          isVisible = { gameState.visibility.dialogueBox }
          line={ currentLine }
        />
        <div 
          className="intro-button-container transition-opacity"
          style={{
            position: "absolute",
            bottom: "5%",
            right: "2%",
            zIndex: "1",
            opacity: gameState.visibility.dialogueBox ? "1" : "0",
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

}