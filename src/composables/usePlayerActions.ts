import { calculateWager } from "../utils/gameCalculations"
import { cardTotal, wait } from "../utils/utils";
import { useAnimationState } from "./useAnimationState";
import { useGameState } from "./useGameState";

export default function usePlayerActions() {
  const { gameState, gameDispatch } = useGameState();
  const { setAnimation } = useAnimationState();
  const { playerHealth, daimonHealth, visibility, playerHand, round, daimonHand, deck, wager } = gameState;

  function startWager() {
    const { playerHealth, handCount } = gameState;
    const wage = calculateWager(handCount, playerHealth);
    const next = applyWager(wage);

    if (next.daimonDead) {
      return endRound();
    }
    
    animateWager(wage);
  };

  async function animateWager(
    wage: number,
  ) {

    if (!visibility.healthBars) {
      gameDispatch({ 
        type: "SET_VISIBILITY", 
        payload: {
          ...gameState.visibility,
          healthBars: true
        }});
      await wait(1000);
    }
    
    gameDispatch({ 
      type: "SET_WAGER", 
      payload: 
      { 
        wager: wage
    }});
    setAnimation("player", "injured", 1600);
  };

  function applyWager(
    wage: number,
  ) {
    return {
      deductedPlayer: playerHealth - wage,
      deductedDaimon: daimonHealth - wage,
      playerDead: playerHealth - wage <= 0,
      daimonDead: daimonHealth - wage <=0,
    }
  };

  async function playerHits() {
    gameDispatch({ type: "DRAW_PLAYER_CARD" });
    await wait(300);
  };

  async function playerSurrenders() {
    gameDispatch({ type: "SET_HEALTHVALUES", 
      payload: {
        playerHealth: playerHealth + (wager / 4),
        daimonHealth: daimonHealth,
        wager: (wager * 3 / 4),
      }
    });
    
    await wait(300);
    gameDispatch({ type: "DECLARE_WINNER", payload: { winner: "daimon" }});

    setAnimation("cards", "discard", 2000);
    await wait (600);
    gameDispatch({ type: "RESOLVE_HAND" });
  };

  async function player2x() {
    const wage = wager / 2;
    const next = applyWager(wage);
    
    if (next.daimonDead) {
      return endRound();
    }

    gameDispatch({ type: "SET_HEALTHVALUES", 
      payload: {
        playerHealth: playerHealth - wage,
        daimonHealth: daimonHealth - wage,
        wager: wager * 2,
      }
    });
    setAnimation("player", "injured", 1600);
    await wait(1700);
    await playerHits();
    await daimonResolves();
    gameDispatch({ type: "SET_PHASE", payload: { phase: "resolution"}});
  }

  async function daimonResolves() {
    const nextHand = [daimonHand[0]]
    let count = 0;


    while (cardTotal(nextHand).sum < 17) {
      nextHand.push(deck[count]);
      count++;
    };

    while (count > 0) {
      gameDispatch({ type: "DRAW_DAIMON_CARD" });
      await wait(300);
      count--;
    };

    await wait(300);
    gameDispatch({ type: "SET_PHASE", payload: { phase: "resolution"}});
  };

  async function resolveHand() {
    const maxCardLength = Math.max(playerHand.length, daimonHand.length);
    setAnimation("cards", "sway", 1200 * maxCardLength);
    await wait(1300 * maxCardLength);

    setAnimation("cards", "discard", 2000);
    await wait(600);
    
    let winner = handWinner();
    gameDispatch({ type: "DECLARE_WINNER", payload: { winner: winner }})
    await wait(1000);
    gameDispatch({ type: "RESOLVE_HAND" })
    
  }

  function handWinner () {
    const playerTotal = cardTotal(playerHand);
    const daimonTotal = cardTotal(daimonHand);

    if (playerTotal.isBlackjack  && daimonTotal.isBlackjack) return "push";
    if (playerTotal.isBlackjack) return "player";
    if (daimonTotal.isBlackjack) return "daimon";
    if (playerTotal.isBust) return "daimon";
    if (daimonTotal.isBust) return "player";
    if (playerTotal.sum > daimonTotal.sum) return "player";
    if (playerTotal.sum < daimonTotal.sum) return "daimon";
  }

  function availablePlayerActions() {
    if (round === 1) return tutorialPlayerActions();
    if (cardTotal(playerHand).isBust) return [];

    const actions = ["Hit", "Stand"];

    if (playerHand.length === 2) { 
      actions.push("2x");
      actions.push("Surrender");
    };

    return actions;
  };


  function tutorialPlayerActions() {
    switch(deck.length) {
      case 49:
        return ["Hit"];
      case 48:
        return ["Stand"];
      case 44:
        return ["Stand"];
      case 39:
        return ["Surr"];
      case 36:
        return ["2x"];
      case 31:
        return ["Stand"];
      default:
        return [];
    }
  };

  async function endRound() {
    gameDispatch({ type: "SET_PHASE", 
      payload: {
        phase: "intermission"
      }
    });
    gameDispatch({ type: "SET_VISIBILITY", 
      payload: {
        daimon: true,
        table: false,
        healthBars: false,
        dialogueBox: false,
      }
    });

    await wait(600);
    setAnimation("daimon", "close-eyelid", 2500);
    await wait(2000)
    gameDispatch({ type: "SET_VISIBILITY", 
      payload: {
        daimon: false,
        table: false,
        healthBars: false,
        dialogueBox: false,
      }
    });
    await wait(5000)

    gameDispatch({ type: "START_GAME" })
  };

  return { 
    startWager, 
    availablePlayerActions, 
    playerHits,
    daimonResolves,
    resolveHand,
    playerSurrenders,
    player2x
  }
};