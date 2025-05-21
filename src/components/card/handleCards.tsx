import { useEffect, useState } from "react";
import { useGameState } from "../../composables/useGameState"
import { cardTotal, wait } from "../../utils/utils";
import PerspectiveCards from "./perspectiveCards";
import NumberTicker from "../healthBars/numberTicker";
import type { CardType } from "../../utils/cards";
import usePlayerActions from "../../composables/usePlayerActions";

export default function HandleCards() {
  const { gameState, gameDispatch } = useGameState();
  const { phase, playerHand, daimonHand } = gameState;
  const animationDelay = 300;

  useEffect(() => {
    if (phase !== "draw") return;
    startHand();
  }, [phase]);

  async function startHand() {
    await wait(2000);
    await drawPlayerCards(2);
    await drawDaimonCards();
    gameDispatch({ type: "SET_PHASE", payload: { phase: "handDialogue" } })
  };

  async function drawPlayerCards(cardCount: number) {
    let cardIndex = 0
   
    while (cardIndex < cardCount) {
      gameDispatch({ type: "DRAW_PLAYER_CARD" })
      cardIndex++
      
      await wait(animationDelay * cardIndex)
    };
  };

  async function drawDaimonCards() {
    gameDispatch({ type: "DRAW_DAIMON_CARD" });
    await wait(animationDelay);
    gameDispatch({ type: "DRAW_EMPTY_CARD" });
  }

  return (
    <>
      <div
        style={{ 
          display: "flex",
          height: "35%",
        }}
      >
        <PerspectiveCards
          hand={ daimonHand }
          owner="daimon"
        />
        <CardCounter
          hand={ daimonHand }
          owner="daimon"
        />
      </div>
      <div
        style={{ 
          display: "flex",
          height: "35%",
        }}
      >
        <PerspectiveCards
          hand={ playerHand }
          owner="player"
        />
        <CardCounter
          hand={ playerHand }
          owner="player"
        />
      </div>
    </>
  )
};


function CardCounter({ 
  hand,
  owner 
} : { 
  hand: CardType[];
  owner: string;
}) {
  const { gameState } = useGameState();
  const [value, setValue] = useState(0);
  const isResolving = gameState.phase === "resolution";
  const isWinner = gameState.handWinner === owner || gameState.handWinner === "push";
  const isLoser = gameState.handWinner !== null && !isWinner;
  const total = isResolving ? cardTotal(hand).sum : 0;
  const { resolveHand } = usePlayerActions();

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
        duration={ 800 * hand.length }
        replacement={ total }
        value={ value }
        setValue={ setValue }
      />
    </div>
  )
};