import './App.css';
import { GameProvider } from './composables/useGameState';
import Game from './views/game';

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  )
}

export default App;

