import { useGameState } from "../composables/useGameState";
import MenuScreens from "./menuScreens/menuScreens";
import TheGambler from "./theGambler";
import "./game.css";
import { cardInventory } from "../utils/cards";

export default function Game() {
  const { gameState } = useGameState();
  const { started } = gameState;

  console.log(gameState)
  
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