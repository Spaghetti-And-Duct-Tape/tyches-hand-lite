import { useEffect, useRef } from "react";
import { useGameState } from "../../composables/useGameState"
import { cardTotal, emptyCard } from "../../utils/cards";
import { effectCardDelay, standardCardDelay, wait } from "../../utils/utils";
import usePlayerActions from "../../composables/usePlayerActions";
import PerspectiveCards from "./perspectiveCards";
import CardCounter from "./cardCounter";

export default function HandleCards() {
  const { gameState, gameDispatch } = useGameState();
  const { phase, playerHand, daimonHand } = gameState;
  const { drawPlayerCard, drawDaimonCard } = usePlayerActions();
  const handleDaimonHand = daimonHand.length === 1 ? [...daimonHand, emptyCard] : daimonHand;
  const doubleDrawRef = useRef(false);

  useEffect(() => {
    if (phase !== "draw") return;
    handleDrawPhase();
  }, [phase, playerHand, daimonHand]);

  
  useEffect(() => {
    if (phase !== "player-doubles") return;
    if (doubleDrawRef.current) return;
    player2xCard()
  }, [phase])

  useEffect(() => {
    if (phase !== "daimon-turn") return;
    handleDaimonPhase();
  }, [phase, daimonHand]);

  useEffect(() => {
    if (phase !== "resolution") return;
    doubleDrawRef.current = false;
  }, [phase]);

  async function handleDrawPhase() {
    const isFirstCard = playerHand.length === 0;
    const isSecondCard = playerHand.length === 1;
    const isDaimonDraw = playerHand.length === 2;
    const transitionPhase = daimonHand.length === 1;
    
    const lastCardEffect = playerHand[playerHand.length - 1]?.effect ?? "Standard";
    const delay = lastCardEffect === "Standard" ? standardCardDelay : effectCardDelay;
    
    if (isFirstCard) {
      drawPlayerCard();
    } else if (isSecondCard) {
      await wait(delay);
      drawPlayerCard();
    } else if (transitionPhase) {
      await wait(100);
      gameDispatch({ type: "SET_PHASE", 
        payload: {
          phase: "hand-dialogue"
      }})
    } else if (isDaimonDraw) {
      await wait(delay);
      drawDaimonCard();
    } 
  };

  async function handleDaimonPhase() {
    const isSecondCard = daimonHand.length === 1;
    const delay = isSecondCard ? 0 : 300;
    const daimonTotal = cardTotal(daimonHand).sum

    if (daimonTotal < 17 && !cardTotal(playerHand).isBust) {
      await wait(delay);
      return drawDaimonCard();
    };

    gameDispatch({ type: "SET_PHASE",
      payload: {
        phase: "apply-daimon-effect"
    }});
  };

  async function player2xCard() {
    doubleDrawRef.current = true;
    await drawPlayerCard();

    gameDispatch({ type: "SET_PHASE", 
      payload: {
        phase: "daimon-turn"
    }})
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