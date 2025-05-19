import { useGameState } from "../../composables/useGameState";
import WoodenPanel from "../dialogueBox/woodenPanels";
import "./table.css";

export default function Table() {
  const { gameState } = useGameState();
  const { visibility } = gameState;

  return (
    <div 
      className="table transition-opacity"
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%", 
        opacity: visibility.table ? "1" : "0" 
      }}
    >
      <div 
        className="table-container"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div 
          className="table-surface"
          style={{
            flexGrow: "1",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            height: "min(calc((100vw * 9 / 16) - 150px), (100vh - 200px)",
          }}
        >
        </div>
        <div className="table-edge">
          <WoodenPanel>
            <WoodenPanel />
          </WoodenPanel>
        </div>
      </div>
    </div>
  )
};