import ActionButton from "../components/actionButtons/actionButton";
import Daimon from "../components/daimon/daimon";
import DialogueManager from "../components/dialogueBox/dialogueManager";
import HealthBars from "../components/healthBars/healthBars";
import Table from "../components/table/table";

export default function GameBoard() {
  return (
    <div
      className="game-board"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Daimon />
      <Table />
      <HealthBars />
      { /* Phase triggered components */ }
      <DialogueManager />
      <ActionButton />
    </div>
  )
};