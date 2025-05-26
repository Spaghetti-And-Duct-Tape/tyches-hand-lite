import { createContext, useContext, useReducer } from "react";
import { shuffleCards, tutorialDeck, type CardType } from "../utils/cards";
import { calculateDaimonHealth } from "../utils/gameCalculations";
import { calculateHealth, cardTotal, wait } from "../utils/utils";

export type phaseType =
  | "intro-dialogue"
  | "wager"
  | "draw"
  | "hand-dialogue"
  | "player-turn"
  | "daimon-turn"
  | "apply-token-effect"
  | "apply-daimon-effect"
  | "resolution"
  | "end-dialogue"
  | "intermission";

type VisibilityType = {
  daimon: boolean;
  table: boolean;
  healthBars: boolean;
  dialogueBox: boolean;
  rune: boolean;
};

type CommonAnimationTypes = "idle" | "injured" | "healed" | "attacked";
type DaimonOnlyAnimationTypes = "open-eyelid" | "close-eyelid" | "blinking" | "null";
type CardOnlyAnimationTypes = "idle" | "sway" | "discard"

type DaimonAnimationTypes = CommonAnimationTypes | DaimonOnlyAnimationTypes;
type PlayerAnimationTypes = CommonAnimationTypes;
type AllAnimationTypes = CommonAnimationTypes | DaimonAnimationTypes | CardOnlyAnimationTypes

interface AnimationStateType {
  daimon: DaimonAnimationTypes;
  player: PlayerAnimationTypes;
  cards: CardOnlyAnimationTypes;
};

export type playerActionsType = "Wager" | "Hit" | "Stand" | "2x" | "Surr"

export interface GameStateType {
  //Game context
  phase: phaseType;
  started: boolean;
  gameOver: boolean;
  round: number;
  hand: number; //Hands in a round
  daimon: number;
  playerActions: playerActionsType[];
  handWinner: "player" | "daimon" | "push" | null;
  //Blood pool context
  playerHealth: number;
  playerMaxHealth: number;
  daimonHealth: number;
  daimonMaxHealth: number;
  wager: number
  //Items context
  playerHand: CardType[];
  daimonHand: CardType[];
  deck: CardType[];
  discardPile: CardType[];
  token: number | null;
  //Component visibility
  visibility: VisibilityType;
  //Animations context
  animations: AnimationStateType;
}

const initialGameState: GameStateType = {
  phase: "intro-dialogue",
  started: false,
  gameOver: false,
  round: 0,
  hand: 0,
  daimon: 0,
  playerActions: [],
  handWinner: null,
  playerHealth: 5000,
  playerMaxHealth: 5000,
  daimonHealth: 2500,
  daimonMaxHealth: 2500,
  wager: 0,
  playerHand: [],
  daimonHand: [],
  deck: tutorialDeck,
  discardPile: [],
  token: null,
  visibility: {
    daimon: false,
    table: false,
    healthBars: false,
    dialogueBox: false,
    rune: false
  },
  animations: {
    daimon: "null",
    player: "idle",
    cards: "idle",
  }
};

type GameActionType = 
  | { type: "START_GAME" }
  | { type: "END_GAME" }
  | { type: "SET_ANIMATION", 
      payload: {
        target: "player" | "daimon" | "cards"
        animation: AllAnimationTypes;
      }
    }
  | { type: "SET_VISIBILITY",
      payload: {
        visibility: VisibilityType;
    }}
  | { type: "SET_PHASE",
      payload: {
        phase: phaseType;
      }
    }
  | { type: "PLAYER_ACTIONS",
      payload: {
        playerActions: playerActionsType[];
      }
    }
  | { type: "SET_HEALTHVALUES"
      payload: {
        playerHealth: number;
        daimonHealth: number;
        wager: number;
        daimonAnimation: DaimonAnimationTypes;
        playerAnimation: PlayerAnimationTypes;
      }
    }
  | { type: "DRAW_PLAYER_CARD" }
  | { type: "DRAW_DAIMON_CARD" }
  | { type: "APPLY_EFFECTS",
      payload: {
        gameState: GameStateType
      }
    }
  | { type: "DECLARE_WINNER", 
      payload: {
        winner: "player" | "daimon" | "push";
      }
    }
  | { type: "RESOLVE_HAND" }
  | { type: "EQUIP_ITEMS",
      payload: {
        token: number;
        deck: CardType[];
    }}

function gameReducer(
  state: GameStateType, 
  action: GameActionType
): GameStateType {
  const {
    phase, 
    round, 
    hand,
    playerHealth, 
    playerMaxHealth,
    daimonHealth,
    daimonMaxHealth,
    wager,
    playerHand,
    daimonHand,
    handWinner,
    deck,
    discardPile,
    visibility,
    animations
  } = state;

  const deckToDraw = deck.length === 0
    ? shuffleCards(discardPile, round)
    : deck;

  switch(action.type) {
    case "START_GAME":
      const calcDaimonHealth = calculateDaimonHealth(round);
      const shuffledDeck = shuffleCards(deck, round);

      return {
        ...state,
        phase: "intro-dialogue",
        started: true,
        round: round + 1,
        hand: 0,
        daimon: round % 6,
        playerMaxHealth: 5000,
        daimonHealth: round === 0 ? 500 : calcDaimonHealth,
        daimonMaxHealth: calcDaimonHealth,
        wager: 0,
        playerHand: [],
        daimonHand: [],
        handWinner: null,
        deck: shuffledDeck,
        discardPile: [],
      };

    case "END_GAME":
      return {
        ...initialGameState,
        deck: [...deck, ...discardPile],
        gameOver: true
      };
    
    case "SET_ANIMATION":
      return {
        ...state,
        animations: {
          ...animations,
          [action.payload.target]: action.payload.animation
        }
      }

    case "SET_VISIBILITY":
      return {
        ...state,
        visibility: {
          ...visibility,
          ...action.payload
        }
      };

    case "SET_PHASE":
      return {
        ...state,
        phase: action.payload.phase
      };
    
    case "PLAYER_ACTIONS":
      return {
        ...state,
        playerActions: action.payload.playerActions
      };

    case "SET_HEALTHVALUES":
      return {
        ...state,
        playerHealth: Math.floor(action.payload.playerHealth),
        daimonHealth: Math.floor(action.payload.daimonHealth),
        wager: action.payload.wager,
        animations: {
          ...animations,
          daimon: action.payload.daimonAnimation,
          player: action.payload.playerAnimation
        }
      };
    
    case "DRAW_PLAYER_CARD":
      const [nextCard, ...restOfDeck] = deckToDraw;
      const newPlayerHand = [...playerHand, nextCard];
      const { isBust } = cardTotal(newPlayerHand);

      return {
        ...state,
        playerHand: newPlayerHand,
        deck: restOfDeck,
        discardPile: deck.length === 0 ? [] : discardPile,
        hand: playerHand.length === 0 ? hand + 1 : hand,
        phase: isBust ? "resolution" : phase
      };
    
    case "DRAW_DAIMON_CARD":
      const drawnCard = deckToDraw[deckToDraw.length -1];
      const newDeck = deckToDraw.slice(0, -1);

      return {
        ...state,
        daimonHand: [...daimonHand, drawnCard],
        deck: newDeck,
        discardPile: deck.length === 0 ? [] : discardPile,
      };

    case "APPLY_EFFECTS": 
      return {
        ...state,
        ...action.payload.gameState
      };

    case "DECLARE_WINNER":
      return {
        ...state,
        handWinner: action.payload.winner
      };
    
    case "RESOLVE_HAND":
      const isPush = handWinner === "push";
      const isPlayerWinner = handWinner === "player" || isPush;
      const isDaimonWinner = handWinner === "daimon" || isPush;
      const trueWager = isPush ? wager / 2 : wager;
      
      const nextDaimonHealth = isDaimonWinner
        ? calculateHealth(daimonHealth + trueWager, daimonMaxHealth)
        : daimonHealth;
        
      const nextPlayerHealth = isPlayerWinner
        ? calculateHealth(playerHealth + trueWager, playerMaxHealth)
        : playerHealth;

      const nextDiscardPile = [
        ...discardPile,
        ...daimonHand,
        ...playerHand,
      ];

      return {
        ...state,
        phase: "wager",
        wager: 0,
        handWinner: null,
        playerHand: [],
        daimonHand: [],
        discardPile: nextDiscardPile,
        daimonHealth: Math.floor(nextDaimonHealth),
        playerHealth: Math.floor(nextPlayerHealth)
      };

    case "EQUIP_ITEMS":
      return {
        ...state,
        token: action.payload.token,
        deck: action.payload.deck,
        discardPile: []
      }

    default:
      return state;
  }
};

const GameContext = createContext<{
  gameState: GameStateType;
  gameDispatch: React.Dispatch<any>;
  setAnimation: (
    target: "player" | "daimon" | "cards",
    animation: AllAnimationTypes,
    milliseconds: number
  ) => void;
  dealDamage: (
    playerHealth?: number,
    daimonHealth?: number,
    wager?: number,
    animatePlayer?: boolean,
    animateDaimon?: boolean
  ) => void;
  drawPlayerCards: (count: number) => void;
  drawDaimonCards: (count: number) => void;
} | null>(null);

function GameProvider({ children } : { children: React.ReactNode }) {
  const [gameState, gameDispatch] = useReducer(gameReducer, initialGameState);

  async function setAnimation(
    target: "player" | "daimon" | "cards", 
    animation: AllAnimationTypes, 
    milliseconds: number
  ): Promise<void> {
    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        target: target,
        animation: animation
      }
    });

    await wait(milliseconds);

    
    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        target: target,
        animation: "idle"
      }
    });
  };

  async function dealDamage(
    playerHealthParam?: number,
    daimonHealthParam?: number,
    wagerParam?: number,
    animatePlayer: boolean = true,
    animateDaimon: boolean = false,
  ): Promise<boolean> {
    const prevPlayerHealth = gameState.playerHealth;
    const prevDaimonHealth = gameState.daimonHealth;

    const newPlayerHealth = playerHealthParam ?? prevPlayerHealth;
    const newDaimonHealth = daimonHealthParam ?? prevDaimonHealth;
    const newWager = wagerParam ?? gameState.wager;
    
    if (newDaimonHealth <= 0) return await endRound();

    const playerAnimation = animatePlayer
    ? (newPlayerHealth < prevPlayerHealth ? "injured" : "healed")
    : gameState.animations.player;

  const daimonAnimation = animateDaimon
    ? (newDaimonHealth < prevDaimonHealth ? "injured" : "healed")
    : gameState.animations.daimon;

    gameDispatch({ type: "SET_HEALTHVALUES", 
      payload: {
        playerHealth: calculateHealth(newPlayerHealth, gameState.playerMaxHealth),
        daimonHealth: calculateHealth(newDaimonHealth, gameState.daimonMaxHealth),
        wager: newWager,
        playerAnimation,
        daimonAnimation
      }
    });

    if (!animatePlayer && !animateDaimon) return false; 
    
    await wait(1300);

    animatePlayer && gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        target: "player",
        animation: "idle"
    }});
    
    animateDaimon && gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        target: "player",
        animation: "idle"
    }});

    return false;
  };

  async function drawPlayerCards(count: number) {
    let cardIndex = 0;
    let cards = gameState.deck.slice(0, count);

    while (cardIndex < count) {
      gameDispatch({ type: "DRAW_PLAYER_CARD" });
      await wait(300);
      
      if (!cards[cardIndex]) cards.push(gameState.deck.slice(0, count - cardIndex))
      if (cards[cardIndex].effect !== "Standard") {
        await handleCardEffects(cards[cardIndex]);
      }
      
      cardIndex++;
    };
  };

  async function drawDaimonCards(count: number) {
    let cardIndex = 0;
    
    while (cardIndex < count) {
      gameDispatch({ type: "DRAW_DAIMON_CARD" });
      cardIndex++;

      await wait(300);
    };
  };

  async function handleCardEffects(card: CardType): Promise<void> {
    const { playerHealth, daimonHealth, wager } = gameState;
    
    await wait(200);

    let newPlayerHealth = playerHealth;
    let newDaimonHealth = daimonHealth;
    let animatePlayer = false;
    let animateDaimon = false;

    switch (card.effect) {
      case "Charred":
        newPlayerHealth += card.value;
        animatePlayer = true;
        break;
      case "Bloodstained":
        newDaimonHealth += card.value;
        animateDaimon = true;
        break;
      case "Standard":
      default:
        return;
    };

    await dealDamage(
      newPlayerHealth,
      newDaimonHealth,
      wager,
      animatePlayer,
      animateDaimon
    )
  };

  async function endRound() {
    gameDispatch({ type: "APPLY_EFFECTS", 
      payload: {
        gameState: {
          daimonHealth: 0,
        }
      }
    });
    await wait(300);

    setAnimation("daimon", "close-eyelid", 2800);

    await wait(2000);

    gameDispatch({ type: "SET_VISIBILITY", 
      payload: {
        daimon: false,
        table: false,
        healthBars: false,
        dialogueBox: false
      }
    });

    await wait(200);

    gameDispatch({ type: "SET_PHASE", 
      payload: {
        phase: "end-dialogue"
      }
    });

    return true;
  };

  return (
    <GameContext.Provider value={{ 
      gameState, 
      gameDispatch,
      setAnimation,
      dealDamage, 
      drawPlayerCards,
      drawDaimonCards
    }}>
      { children }
    </GameContext.Provider>
  )
};

function useGameState() {
  const context = useContext(GameContext);
  if(!context) {
    throw new Error("useGameState must be used within a GameProvider");
  }
  return context;
};

export { GameProvider, useGameState };