import ActionButton from "../components/actionButtons/actionButtons";
import Daimon from "../components/daimon/daimon";
import DialogueManager from "../components/dialogueBox/dialogueManager";
import HealthBars from "../components/healthBars/healthBars";
import Table from "../components/table/table";
import { useAnimationState } from "../composables/useAnimationState";
import "./gameBoard.css";

export default function GameBoard() {
  const { animationState } = useAnimationState();
  return(
    <div 
      className={`game-board player-${ animationState.player }`}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ActionButton />
      <HealthBars />
      <DialogueManager />
      <Daimon />
      <Table />
    </div>
  )
};