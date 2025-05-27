import type { CardType } from "../utils/cards";
import { calculateWager } from "../utils/gameCalculations";
import { cardTotal, handWinner, wait } from "../utils/utils";
import { useGameState } from "./useGameState";

export default function usePlayerActions() {
  const { gameState, gameDispatch, dealDamage, drawPlayerCards, setAnimation } = useGameState();
  const {
    playerHealth,
    daimonHealth,
    visibility,
    playerHand,
    daimonHand,
    hand,
    deck,
    wager
  } = gameState;

  async function startWager() {
    if (!visibility.healthBars) {
      gameDispatch({ 
        type: "SET_VISIBILITY", 
        payload: {
          ...gameState.visibility,
          healthBars: true
        }});
      await wait(1000);
    }
    
    const wage = calculateWager(hand, playerHealth);
    const handleHealths = await dealDamage(
      playerHealth - wage,
      daimonHealth - wage,
      wage * 2
    );

    if (handleHealths) return;

    gameDispatch({ type: "SET_PHASE", 
      payload: {
        phase: "draw"
      }
    });
  };

  async function playerSurrenders() {
    const quarterWager = Math.floor(wager / 4);
    const trQtWager = Math.floor(wager * 3 /4);
    await dealDamage(
      playerHealth + quarterWager,
      daimonHealth,
      trQtWager,
      true,
      false
    );

    gameDispatch({ type: "DECLARE_WINNER", 
      payload: {
        winner: "daimon"
      }
    });

    await setAnimation("cards", "discard", 1700);

    gameDispatch({ type: "RESOLVE_HAND" });
  };

  async function player2x() {
    gameDispatch({ type: "SET_PHASE",
      payload: "player2x"
    })
    const wage = wager / 2;
    const handleHealths = await dealDamage(
      playerHealth - wage,
      daimonHealth - wage,
      wager * 2,
      true,
      false
    );

    if (handleHealths) return;

    await drawPlayerCards(1);
    await daimonResolves();
  };

  async function daimonResolves() {
    let drawCount = 1;
    const startingHand = daimonHand[0];

    while (
      projectedSum(startingHand, drawCount) < 17 &&
      drawCount < 12
    ) {
      drawCount++;
      await wait(300);
    };

    gameDispatch({ type: "SET_PHASE",
      payload: { 
        phase: "daimon-turn" 
      }
    });
    
  };

  async function resolveHand() {
    const maxCardLength = Math.max(playerHand.length, daimonHand.length);
    await setAnimation("cards", "sway", 700 * maxCardLength);

    let winner = handWinner(playerHand, daimonHand);
    gameDispatch({ type: "DECLARE_WINNER", 
      payload: {
        winner: winner
      }
    });

    setAnimation("cards", "discard", 1700);
    await wait(1500);

    
    gameDispatch({ type: "RESOLVE_HAND" })
  }
  
  function projectedSum(startingHand: CardType, n: number) {
    const extra = deck.slice(-n);
    const hand = [startingHand, ...extra];
    gameDispatch({ type: "DRAW_DAIMON_CARD" });
    return cardTotal(hand).sum;
  };

  return {
    startWager,
    daimonResolves,
    resolveHand,
    playerSurrenders,
    player2x
  }
};