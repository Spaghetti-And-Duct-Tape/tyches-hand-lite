
import { useGameState } from "../../composables/useGameState";
import { gameOverText } from "../../utils/gameOverText";
import GameOverLine from "./gameOverLine";

export default function GameOverScreen() {
  const { gameState } = useGameState();
  const { deck } = gameState;
  
  const gameEnding = selectGameEnding();

  function selectGameEnding() {
    const counts = [
      deck.filter(card => card.effect === "Bloodstained").length,
      deck.filter(card => card.effect === "Charred").length,
      deck.filter(card => card.effect === "Standard").length
    ];
    
    const maxCount = Math.max(...counts);
    const endingIndex = counts.indexOf(maxCount);

    return gameOverText[endingIndex];
  };

  return (
    <main
      style={{
        height: "100%"
      }}
    >
      <ul
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0",
        }}
      >
        { gameEnding.map((line, index) => (
          <GameOverLine
            key={ index }
            animationDelay={ index }
            gameOverLine={ line }
          />
        ))}
      </ul>
    </main>
  )
};