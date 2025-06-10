import { useGameState } from "../composables/useGameState";
import MenuScreens from "./menuScreens/menuScreens";
import TheGambler from "./theGambler";
import "./game.css";

export default function Game() {
  const { gameState } = useGameState();
  const { started } = gameState;

  console.log(gameState.phase)
  
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      { started ? (
        <TheGambler />
      ) : (
        <MenuScreens />
      )}
    </div>
  )
};