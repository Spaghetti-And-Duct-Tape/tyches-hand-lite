import './App.css'
import { AnimationProvider } from './composables/useAnimationState'
import { GameProvider } from './composables/useGameState'
import GameView from './views/gameView'


function App() {

  return (
    <GameProvider>
      <AnimationProvider>
        <GameView />
      </AnimationProvider>
    </GameProvider>
  )
}

export default App
