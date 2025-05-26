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
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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