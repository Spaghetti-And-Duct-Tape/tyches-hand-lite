import { useGameState } from "../composables/useGameState"

export default function GameView() {
  const { gameState } = useGameState(); 
  
  return (
    <div>Hello | { JSON.stringify(gameState) }</div>
  )
};