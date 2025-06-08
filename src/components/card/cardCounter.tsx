import { useEffect, useState } from "react";
import { useGameState } from "../../composables/useGameState"
import { cardTotal, type CardType } from "../../utils/cards";
import NumberTicker from "../healthBars/numberTicker";
import usePlayerActions from "../../composables/usePlayerActions";

export default function CardCounter({
  owner,
  hand
} : {
  owner: string;
  hand: CardType[];
}) {
  const { gameState } = useGameState();
  const { resolveHand } = usePlayerActions();
  const [value, setValue] = useState(0);
  const isResolving = gameState.phase === "resolution";
  const isWinner = gameState.handWinner === owner || gameState.handWinner === "push";
  const isLoser = gameState.handWinner !== null && !isWinner;
  const total = isResolving ? cardTotal(hand).sum : 0;

  useEffect(() => {
    if (isResolving) resolveHand();
  }, [isResolving]);

  return (
    <div
      className={ `transition-opacity ${ isWinner && "winner-counter" } ${ isLoser && "loser-counter" }` }
      style={{ 
        opacity: isResolving ? "1": "0",
        display: "flex",
        alignItems: "center",
        fontSize: "min(2.5vw, calc(2.5vh * 16 / 9))",
        width: "2vw"
      }}
    >
      <NumberTicker
        duration={ 500 * hand.length }
        replacement={ total }
        value={ value }
        setValue={ setValue }
      />
    </div>
  )
};