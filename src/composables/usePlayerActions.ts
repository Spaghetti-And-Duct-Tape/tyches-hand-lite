import { cardTotal, shuffleCards, type CardType } from "../utils/cards";
import { calculateHealth, calculateWager, effectCardDelay, handWinner, standardCardDelay, wait } from "../utils/utils";
import { useGameState, type GameStateType, type PlayerActionsType } from "./useGameState";

export default function usePlayerActions() {
  const { gameState, gameDispatch, endRound } = useGameState();
  const { 
    playerHealth,
    daimonHealth,
    visibility, 
    playerHand,
    daimonHand,
    hand,
    wager
  } = gameState;

  async function startWager() {
    //Activates healthbars
    if (!visibility.healthBars) {
      gameDispatch({ type: "SET_VISIBILITY",
        payload: {
          ...gameState.visibility,
          healthBars: true
        }
      });

      await wait(1000);
    };

    const wage = calculateWager(hand, playerHealth);
    
    if (daimonHealth - wage <= 0) return endRound();

    gameDispatch({ type: "SET_HEALTHVALUES", 
      payload: {
        playerHealth: calculateHealth(playerHealth, gameState.playerMaxHealth, -wage),
        daimonHealth: calculateHealth(daimonHealth, gameState.daimonMaxHealth, -wage),
        wager: wage * 2,
        playerAnimation: "injured",
        daimonAnimation: "injured"
    }});

    await wait(1000);
    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        target: "daimon",
        animation: "idle"
      }
    });

    await wait(300);
    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        target: "player",
        animation: "idle"
      }
    });

    await wait(500);
    gameDispatch({ type: "SET_PHASE",
      payload: {
        phase: "draw"
      }
    })
  };

  function playerStands() {
    gameDispatch({ type: "SET_PHASE",
      payload: {
        phase: "daimon-turn"
    }});
  };

  async function drawDaimonCard() {
    let deck = [...gameState.deck];
    let discardPile = [...gameState.discardPile];

    //Reshuffle deck if needed
    if (deck.length === 0) {
      deck = shuffleCards(discardPile, gameState.round);
      discardPile = [];
    };

    const drawnCard = deck[deck.length - 1];
    if (!drawnCard) return;

    const updatedDaimonHand = [...gameState.daimonHand, drawnCard];

    gameDispatch({ type: "DRAW_CARDS",
      payload: {
        daimonHand: updatedDaimonHand,
        deck: deck.slice(0, -1),
        discardPile: discardPile,
    }});
  };

  async function playerSurrenders() {
    const quarterWager = Math.floor(wager / 4);
    const threeQuartWager = Math.floor(wager * 3 / 4);
    gameDispatch({type: "SET_HEALTHVALUES",
      payload: {
        playerHealth: calculateHealth(playerHealth, gameState.playerMaxHealth, quarterWager),
        daimonHealth: daimonHealth,
        wager: threeQuartWager,
        playerAnimation: "healed"
    }});

    await wait(900);
    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        target: "player",
        animation: "idle"
      }
    });
    await wait(500);

    gameDispatch({ type: "DECLARE_WINNER",
      payload: {
        winner: "daimon"
    }});
    
    await wait(1500);
    gameDispatch({ type: "RESOLVE_HAND" })
  };

  async function player2x() {
    const wage = wager / 2;
    
    if (daimonHealth - wage <= 0) return endRound();
    
    gameDispatch({ type: "SET_HEALTHVALUES", 
      payload: {
        playerHealth: calculateHealth(playerHealth, gameState.playerMaxHealth, -wage),
        daimonHealth: calculateHealth(daimonHealth, gameState.daimonMaxHealth, -wage),
        wager: wage * 4,
        playerAnimation: "injured",
        daimonAnimation: "injured"
    }});
    
    await wait(1000);
    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        taget: "daimon",
        animation: "idle",
    }});

    await wait(300);
    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        taget: "player",
        animation: "idle",
    }});

    gameDispatch({ type: "SET_PHASE",
      payload: {
        phase: "player-doubles"
    }});
  };

  async function drawPlayerCard() {
    let deck = [...gameState.deck];
    let discardPile = [...gameState.discardPile];

    //Reshuffle deck if needed
    if (deck.length === 0) {
      deck = shuffleCards(discardPile, gameState.round);
      discardPile = [];
    };

    const drawnCard = deck[0];
    if (!drawnCard) return;

    const updatedPlayerHand = [...gameState.playerHand, drawnCard];

    const {
      newPlayerHealth,
      newDaimonHealth,
      playerAnimation,
      daimonAnimation,
      postEffectDelay,
    } = calculateCardEffects(drawnCard, gameState);

    gameDispatch({ type: "DRAW_CARDS",
      payload: {
        playerHand: updatedPlayerHand,
        daimonHealth: calculateHealth(newDaimonHealth, gameState.daimonMaxHealth),
        playerHealth: calculateHealth(newPlayerHealth, gameState.playerMaxHealth),
        discardPile: discardPile,
        deck: deck.slice(1),
        playerAnimation: playerAnimation,
        daimonAnimation: daimonAnimation,
    }});

    await wait(postEffectDelay);
    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        target: "player",
        animation: "idle"
      }
    });
    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        target: "daimon",
        animation: "idle"
      }
    });

    if (cardTotal([...playerHand, drawnCard]).isBust) {
      gameDispatch({ type: "SET_PHASE", 
        payload: {
          phase: "daimon-turn"
        }
      })
    };
    
    await wait(postEffectDelay);
  };

  async function resolveHand() {
    const maxcardLength = Math.max(playerHand.length, daimonHand.length);
    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        target: "cards",
        animation: "sway"
    }});

    await wait(700 * maxcardLength);

    let winner = handWinner(playerHand, daimonHand);
    gameDispatch({ type: "DECLARE_WINNER",
      payload: {
        winner
    }});

    await wait(1500);
    gameDispatch({ type: "RESOLVE_HAND" })


  };

  function calculateCardEffects(card: CardType, state: GameStateType) {
    let newPlayerHealth = state.playerHealth;
    let newDaimonHealth = state.daimonHealth;
    let playerAnimation = "idle";
    let daimonAnimation = "idle";
    let postEffectDelay = standardCardDelay;

    switch (card.effect) {
      case "Bloodstained":
        newDaimonHealth += card.value;
        daimonAnimation = "injured";
        postEffectDelay = effectCardDelay;
        break;
      case "Charred":
        newPlayerHealth += card.value;
        playerAnimation = "healed";
        postEffectDelay = effectCardDelay;
        break;
    }

    return {
      newPlayerHealth,
      newDaimonHealth,
      playerAnimation,
      daimonAnimation,
      postEffectDelay,
    };
  };

  function tutorialPlayerActions(deck: CardType[]): PlayerActionsType[] {
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

  return {
    startWager,
    playerStands,
    playerSurrenders,
    player2x,
    drawPlayerCard,
    drawDaimonCard,
    tutorialPlayerActions, 
    resolveHand
  };
};