import { useGameState } from "../../composables/useGameState"
import HandleCards from "../card/handleCards";
import WoodenPanel from "../dialogue/woodenPanel";
import "./table.css";

export default function Table() {
  const { gameState } = useGameState();
  const { visibility } = gameState;
  const { table } = visibility;

  return (
    <div
      className="table transition-opacity"
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        opacity: table ? "1" : "0"
      }}
    >
      <div
        className="table-container"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <div
          className="table-surface"
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flexGrow: "1",
            justifyContent: "center",
            alignItems: "center",
            height: "min(calc(65vw * 9/16), 65vh)",
            paddingBottom: "2vw"
          }}
        >
          <HandleCards />
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