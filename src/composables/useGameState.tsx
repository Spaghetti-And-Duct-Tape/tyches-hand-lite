import { createContext, useContext, useReducer } from "react";
import { emptyCard, tutorialDeck, type CardType } from "../utils/cards";
import { calculateHealth, cardTotal } from "../utils/utils";
import { calculateDaimonHealth } from "../utils/gameCalculations";

type phaseType = 
    | "introDialogue" 
    | "wager" 
    | "draw"
    | "handDialogue"
    | "player-turn" 
    | "daimon-turn" 
    | "resolution" 
    | "endDialogue" 
    | "intermission";

export interface GameStateType {
  phase: phaseType
  started: boolean;
  gameOver: boolean;
  round: number;
  handCount: number;
  //Blood pool info
  playerHealth: number,
  playerMaxHealth: number,
  daimonHealth: number,
  daimonMaxHealth: number,
  wager: number,
  //Card info
  playerHand: CardType[];
  daimonHand: CardType[];
  handWinner: "player" | "daimon" | "push" | null;
  deck: CardType[];
  discardPile: CardType[];
  //Component visibility for cenamatic effect
  visibility: VisibilityType
};

type VisibilityType = {
  daimon: boolean;
  table: boolean;
  healthBars: boolean;
  dialogueBox: boolean;
};

type GameActionType = 
  | { type: "START_GAME" }
  | { type: "ST"}
  | { type: "SET_PHASE", 
      payload: {
        phase: phaseType
    }}
  | { type: "SET_VISIBILITY", 
      payload: {
        visibility: VisibilityType
    }}
  | { type: "SET_WAGER",
      payload: {
        wager: number
    }}
  | { type: "DRAW_PLAYER_CARD" }
  | { type: "DRAW_DAIMON_CARD" }
  | { type: "DRAW_EMPTY_CARD" }
  | { type: "CLEAR_HANDS" }
  | { type: "DECLARE_WINNER", 
      payload: {
        winner: "player" | "daimon" | "push";
      }
    }
  | { type: "RESOLVE_HAND" }
  | { type: "SET_HEALTHVALUES", 
      payload: {
        playerHealth: number;
        daimonHealth: number;
        wager: number;
      };
    }
  | { type: "END_GAME"}

const initialGameState: GameStateType = {
  phase: "introDialogue",
  started: false,
  gameOver: false,
  round: 0,
  handCount: 0,
  playerHealth: 5000,
  playerMaxHealth: 5000,
  daimonHealth: 2500,
  daimonMaxHealth: 2500,
  wager: 0,
  playerHand: [],
  daimonHand: [],
  handWinner: null,
  deck: tutorialDeck,
  discardPile: [],
  visibility: {
    daimon: false,
    table: false,
    healthBars: false,
    dialogueBox: false
  }
};

function gameReducer(state: GameStateType, action: GameActionType): GameStateType {
  switch(action.type) {
    case "START_GAME":
      const daimonHealth = calculateDaimonHealth(state.round);
      return { 
        ...state,
        phase: "introDialogue",
        started: true,
        handCount: 0,
        round: state.round + 1,
        daimonHealth: daimonHealth,
        daimonMaxHealth: daimonHealth
      };
    case "SET_PHASE":
      return {
        ...state,
        phase: action.payload.phase
      };
    case "SET_VISIBILITY":
      return {
        ...state,
        visibility: {
          ...state.visibility,
          ...action.payload
        }
      };
    case "SET_WAGER":
      return {
        ...state,
        phase: "draw",
        handCount: state.handCount + 1,
        playerHealth: calculateHealth(state.playerHealth - action.payload.wager, state.playerMaxHealth),
        daimonHealth: calculateHealth(state.daimonHealth - action.payload.wager, state.daimonMaxHealth),
        wager: 2 * action.payload.wager
      }
    case "SET_HEALTHVALUES":
      return {
        ...state,
        playerHealth: action.payload.playerHealth,
        daimonHealth: action.payload.daimonHealth,
        wager: action.payload.wager
      }
    case "DRAW_PLAYER_CARD":
      const newPlayerHand = [...state.playerHand, state.deck[0]];
      const { isBust } = cardTotal(newPlayerHand);
      return {
        ...state,
        playerHand: [...state.playerHand, state.deck[0]],
        deck: state.deck.slice(1),
        phase: isBust ? "resolution" : state.phase,
      }
    case "DRAW_DAIMON_CARD":
      const isCardEmtpy = state.daimonHand[1]?.id === 999;
      return {
        ...state,
        daimonHand: isCardEmtpy
          ? [state.daimonHand?.[0], state.deck[0]] 
          : [...state.daimonHand, state.deck[0]],
        deck: state.deck.slice(1),
      }
    case "DRAW_EMPTY_CARD":
      return {
        ...state,
        daimonHand: [...state.daimonHand, emptyCard]
      }
    case "DECLARE_WINNER":
      return {
        ...state,
        handWinner: action.payload.winner
      }
    case "RESOLVE_HAND":
      const isPlayerWinner = state.handWinner === "player" || state.handWinner === "push";
      const isDaimonWinner = state.handWinner === "daimon" || state.handWinner === "push";
      const wager = state.handWinner === "push" ? state.wager / 2 : state.wager;
      return {
        ...state,
        phase: "wager",
        wager: 0,
        handWinner: null,
        playerHand: [],
        daimonHand: [],
        discardPile: [...state.discardPile, ...state.daimonHand, ...state.playerHand],
        daimonHealth: isDaimonWinner ? calculateHealth(state.daimonHealth + wager, state.daimonMaxHealth) : state.daimonHealth,
        playerHealth: isPlayerWinner ? calculateHealth(state.playerHealth + wager, state.playerMaxHealth) : state.playerHealth,
        
      }
    case "END_GAME":
      return {
        phase: "introDialogue",
        started: false,
        gameOver: true,
        round: 0,
        handCount: 0,
        playerHealth: 5000,
        playerMaxHealth: 5000,
        daimonHealth: 500,
        daimonMaxHealth: 2500,
        wager: 0,
        playerHand: [],
        daimonHand: [],
        handWinner: null,
        deck: tutorialDeck,
        discardPile: [],
        visibility: {
          daimon: false,
          table: false,
          healthBars: false,
          dialogueBox: false
        }

      }
    default:
      return state;
  };
};

const GameContext = createContext<{
  gameState: GameStateType;
  gameDispatch: React.Dispatch<any>;
} | null>(null);

function GameProvider({ children } : { children: React.ReactNode }) {
  const [gameState, gameDispatch] = useReducer(gameReducer, initialGameState);

  return (
    <GameContext.Provider value={{ gameState, gameDispatch }}>
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