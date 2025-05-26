import { useEffect } from "react";
import { useGameState } from "../../composables/useGameState";
import PerspectiveCards from "./perspectiveCards";
import { emptyCard } from "../../utils/cards";
import CardCounter from "./cardCounter";

export default function HandleCards() {
  const { gameState, gameDispatch, drawPlayerCards, drawDaimonCards } = useGameState();
  const { phase, playerHand, daimonHand } = gameState;
    const handleDaimonHand = daimonHand.length === 1 ? [...daimonHand, emptyCard] : daimonHand;

  useEffect(() => {
    if (phase === "draw") startHand();
  }, [phase]);

  async function startHand() {
    await drawPlayerCards(2);
    await drawDaimonCards(1);
    gameDispatch({ type: "SET_PHASE", 
      payload: {
        phase: "hand-dialogue"
    }});
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "35%"
        }}
      >
        <PerspectiveCards
          hand={ handleDaimonHand }
          owner="daimon"
        />
        <CardCounter
          hand={ handleDaimonHand }
          owner="daimon"
        />
      </div>
      <div
        style={{
          display: "flex",
          height: "35%"
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