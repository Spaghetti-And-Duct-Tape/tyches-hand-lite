import { useGameState } from "../composables/useGameState"
import StartScreen from "./startScreen";

export default function GameView() {
  const { gameState } = useGameState();
  const { started } = gameState;
  
  return (
    <>
      {
        started ? (
          <div>Hi</div>
        ) : (
          <StartScreen />
        )
      }
    </>
  )
};