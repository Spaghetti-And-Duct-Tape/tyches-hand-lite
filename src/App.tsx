import './App.css'
import { GameProvider } from './composables/useGameState'
import GameView from './views/gameView'


function App() {

  return (
    <GameProvider>
      <GameView />
    </GameProvider>
  )
}

export default App
