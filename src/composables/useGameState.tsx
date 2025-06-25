import { createContext, useContext, useReducer } from "react";
import { shuffleCards, tutorialDeck, type CardType } from "../utils/cards";
import { calculateDaimonHealth, calculateHealth, wait } from "../utils/utils";

export type PhaseType = 
  | "intro-dialogue"
  | "wager"
  | "draw"
  | "hand-dialogue"
  | "player-turn"
  | "player-doubles"
  | "daimon-turn"
  | "apply-token-effect"
  | "apply-daimon-effect"
  | "apply-effect"
  | "resolution"
  | "daimon-dead"
  | "end-dialogue"
  | "intermission";

type VisibilityType = {
  daimon: boolean;
  table: boolean;
  healthBars: boolean;
  dialogueBox: boolean;
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

export type PlayerActionsType = "Wager" | "Hit" | "Stand" | "2x" | "Surr";

export interface GameStateType {
  //Game context
  phase: PhaseType;
  started: boolean;
  gameOver: boolean;
  round: number;
  hand: number; //Hands in a round
  daimon: number;
  playerActions: PlayerActionsType[];
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
};

const initialGameState: GameStateType = {phase: "intro-dialogue",
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
  },
  animations: {
    daimon: "null",
    player: "idle",
    cards: "idle",
  }
};

type GameActionType = 
  | { type: "START_GAME", 
      payload?: {
        phase?: PhaseType
      }
    }
  | { type: "SET_ANIMATION", 
      payload: {
        target: "player" | "daimon" | "cards"
        animation: AllAnimationTypes;
      }
    }
  | { type: "SET_VISIBILITY",
      payload: VisibilityType;
    }
  | { type: "SET_PHASE",
      payload: {
        phase: PhaseType;
      }
    }
  | { type: "PLAYER_ACTIONS",
      payload: {
        playerActions: PlayerActionsType[];
      }
    }
  | { type: "SET_HEALTHVALUES",
      payload: {
        playerHealth: number;
        daimonHealth: number;
        wager: number;
        daimonAnimation: DaimonAnimationTypes;
        playerAnimation: PlayerAnimationTypes;
      }
    }
  | { type: "DRAW_CARDS",
      payload: {
        playerHealth?: number;
        daimonHealth?: number;
        playerHand?: CardType[];
        daimonHand?: CardType[];
        discardPile: CardType[];
        deck?: CardType[];
        daimonAnimation: DaimonAnimationTypes;
        playerAnimation: PlayerAnimationTypes;
      }
    }
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
  | { type: "END_ROUND" }
  | { type: "EQUIP_ITEMS",
      payload: {
        token: number;
        deck: CardType[];
    }}
  | { type: "END_GAME" };

function gameReducer(
  state: GameStateType,
  action: GameActionType,
): GameStateType {
  const { 
    round,
    hand,
    playerHealth,
    playerMaxHealth,
    daimonHealth,
    daimonMaxHealth,
    wager,
    playerHand,
    daimonHand,
    deck,
    discardPile,
    visibility,
    animations,
    handWinner
  } = state;

  const allCards = [
    ...deck,
    ...playerHand,
    ...daimonHand,
    ...discardPile
  ]
  
  switch(action.type) {
    case "START_GAME":

      //If player skips tutorial, phase skips to intermission
      const currentPhase = action.payload?.phase 
        ? action.payload.phase 
        : "intro-dialogue"
        
      //Determines which daimon is chosen for the round
      const daimonIndex = round < 6 
        ? round 
        : (round - 6) % 5 + 1;

      const daimonStartingHealth = calculateDaimonHealth(round);

      //Returns any blood pool remaining to the player
      const totalPlayerHealth = playerHealth + wager;
      
      return {
        ...state,
        phase: currentPhase,
        started: true,
        round: round + 1,
        hand: 0,
        daimon: daimonIndex,
        playerHealth: calculateHealth(totalPlayerHealth, 5000, wager),
        playerMaxHealth: 5000,
        daimonHealth: daimonStartingHealth,
        daimonMaxHealth: daimonStartingHealth,
        wager: 0,
        playerHand: [],
        daimonHand: [],
        handWinner: null,
        discardPile: [],
        deck: shuffleCards(allCards, round)
      };

    case "SET_ANIMATION":
      return {
        ...state,
        animations: {
          ...animations,
          [action.payload.target]: action.payload.animation
        }
      };
    
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
        playerHealth: action.payload.playerHealth,
        daimonHealth: action.payload.daimonHealth,
        wager: action.payload.wager,
        animations: {
          ...animations,
          daimon: action.payload.daimonAnimation,
          player: action.payload.playerAnimation
        }
      };
    
    case "DRAW_CARDS":
      return {
        ...state,
        ...(action.payload.playerHealth && { playerHealth: action.payload.playerHealth }),
        ...(action.payload.daimonHealth && { daimonHealth: action.payload.daimonHealth }),
        ...(action.payload.playerHand && { playerHand: action.payload.playerHand }),
        ...(action.payload.daimonHand && { daimonHand: action.payload.daimonHand }),
        ...(action.payload.discardPile && { discardPile: action.payload.discardPile }),
        ...(action.payload.deck && { deck: action.payload.deck }),
        hand: playerHand.length === 0 ? hand + 1 : hand,

        animations: {
          ...animations,
          ...(action.payload.daimonAnimation && { daimon: action.payload.daimonAnimation }),
          ...(action.payload.playerAnimation && { player: action.payload.playerAnimation }),
        }
      };
    
    case "APPLY_EFFECTS": 
      return {
        ...state,
        ...action.payload.gameState
      };

    case "DECLARE_WINNER":
      return {
        ...state,
        handWinner: action.payload.winner,
        animations: {
          ...animations,
          cards: "discard"
        }
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
        playerHealth: Math.floor(nextPlayerHealth),
        animations: {
          player: "idle",
          daimon: isDaimonWinner ? "healed" : "idle",
          cards: "idle"
        }
      };

      case "END_ROUND":
        return {
          ...state,
          phase: "end-dialogue",
          hand: 0,
          playerMaxHealth: 5000,
          deck: allCards,
          playerHand: [],
          daimonHand: [],
          discardPile: [],
        };

      case "EQUIP_ITEMS":
        return {
          ...state,
          token: action.payload.token,
          deck: action.payload.deck,
          discardPile: []
        };

      case "END_GAME":
        return {
          ...initialGameState,
          deck: [...deck, ...discardPile],
          gameOver: true
        };
  };
};

const GameContext = createContext<{
  gameState: GameStateType;
  gameDispatch: React.Dispatch<any>;
  setAnimation: (
    target: "player" | "daimon" | "cards",
    animation: AllAnimationTypes,
    milliseconds: number
  ) => Promise<void>;
  endRound: () => void;
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

    //Cancels resetting animation if already in another animation
    if (gameState.animations[target] !== animation) return;
    gameDispatch({ type: "SET_ANIMATION", 
      payload: {
        target: target,
        animation: "idle"
      }
    });
  };

  async function endRound() {
    gameDispatch({ type: "SET_PHASE", 
      payload: {
        phase: "daimon-dead"
      }
    });
    
    gameDispatch({ type: "SET_HEALTHVALUES", 
      payload: {
        daimonHealth: 0,
        playerHealth: calculateHealth(gameState.playerHealth, gameState.playerMaxHealth, gameState.wager),
        wager: 0,
        daimonAnimation: "close-eyelid",
        playerAnimation: "idle"
    }})

    await wait(2000);

    gameDispatch({ type: "SET_VISIBILITY", 
      payload: {
        daimon: false,
        table: false,
        healthBars: false,
        dialogueBox: false
    }});

    await wait(200);

    gameDispatch({ type: "END_ROUND" });
  };

  return (
    <GameContext.Provider value={{
      gameState,
      gameDispatch,
      setAnimation,
      endRound
    }}>
      { children }
    </GameContext.Provider>
  )
};

function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameProvider");
  }
  return context;
};

export { GameProvider, useGameState };