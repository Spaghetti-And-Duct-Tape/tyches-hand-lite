import { useGameState } from "../composables/useGameState";
import MenuScreens from "./menuScreens/menuScreens";
import "./game.css";
import TheGambler from "./theGambler";

export default function Game() {
  const { gameState } = useGameState();
  const { started } = gameState;
  
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111"
      }}
    >
      {
        started ? (
          <TheGambler />
        ) : (
          <MenuScreens />
        )
      }
    </div>
  )
};