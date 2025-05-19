import ActionButton from "../components/actionButtons/actionButtons";
import Daimon from "../components/daimon/daimon";
import IntroManager from "../components/dialogueBox/introManager";
import Table from "../components/table/table";

export default function GameBoard() {

  return(
    <div 
      className="game-board"
      style={{
        width: "100%",
        padding: "10px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ActionButton />
      <IntroManager />
      <Daimon />
      <Table />
    </div>
  )
};