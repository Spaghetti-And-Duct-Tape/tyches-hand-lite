import { createContext, useContext, useReducer } from "react";

type phaseType = 
    | "intro" 
    | "wager" 
    | "player-turn" 
    | "daimon-turn" 
    | "resolution" 
    | "player-won" 
    | "player-lost" 
    | "intermission";

interface GameStateType {
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
    }};

const initialGameState: GameStateType = {
  phase: "intro",
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
  deck: [],
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
      return { 
        ...state,
        phase: "intro",
        started: true,
        round: state.round + 1,
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
        phase: "player-turn",
        handCount: state.handCount + 1,
        playerHealth: state.playerHealth - action.payload.wager,
        daimonHealth: state.daimonHealth - action.payload.wager,
        wager: 2 * action.payload.wager
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

export type SuitType = "Hearts" | "Diamonds" | "Clubs" | "Spades" | "None";

export interface CardType {
  name: string;
  suit: SuitType;
  value: number;
  effectType: EffectType;
  effect: number;
};

export type EffectType = "Blessed" | "Bloodstained" | "Charred" | "Exhumed" | "Fleshwoven" | "Standard";

