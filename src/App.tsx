import './App.css'
import { GameProvider } from './composables/useGameState'
import GameView from './views/gameView'


function App() {

  return (
    <GameProvider>
      <div>Hi</div>
      <GameView />
    </GameProvider>
  )
}

export default App
