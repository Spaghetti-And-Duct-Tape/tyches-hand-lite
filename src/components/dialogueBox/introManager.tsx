import { useEffect } from "react";
import useDialogue from "../../composables/useDialogue";
import { useGameState } from "../../composables/useGameState";
import { daimons } from "../../daimons";
import DialogueBox from "./dialogueBox";
import { revealSchema } from "../../utils/revealSchema";
import BloodButton from "../bloodButton/bloodButton";

export default function IntroManager() {
  const { gameState, gameDispatch } = useGameState();
  const { phase, round } = gameState;

  const introDelay: number = 300;
  const daimonIntro = daimons[round].dialogue.intro;
  const introDialogue = useDialogue(daimonIntro, () => advancePhase())
  const { index, currentLine, advance } = introDialogue;

  const visibility = Object.fromEntries(
    Object.entries(revealSchema).map(([key, threshold]) => [
      key,
      index >= threshold
    ])
  );

  useEffect(() => {
    if (phase !== "intro") return;
    if (index !== 0) {
      gameDispatch({ type: "SET_VISIBILITY", payload: visibility });
      return;
    }

    const timer = setTimeout(() => {
      gameDispatch({ type: "SET_VISIBILITY", payload: visibility })
    }, introDelay);

    return () => clearTimeout(timer);
  }, [index]);

  function advancePhase() {
    gameDispatch({ type: "SET_PHASE", payload: { phase: "wager" }})
  };

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
          top: "3%",
          right: "5%",
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
};