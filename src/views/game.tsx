import { useGameState } from "../composables/useGameState";
import MenuScreens from "./menuScreens/menuScreens";
import TheGambler from "./theGambler";
import "./game.css";

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
        minHeight: "100dvh",
        minWidth: "100dvw"
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