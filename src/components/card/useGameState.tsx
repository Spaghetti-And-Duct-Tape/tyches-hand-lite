import { createContext, useContext, useReducer } from "react";
import { emptyCard, shuffleCards, tutorialDeck, type CardType } from "../utils/cards";
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
  deck: CardType[];
  discardPile: CardType[];
  //Token
  token: number | null;
  handWinner: "player" | "daimon" | "push" | null;
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
  | { type: "EQUIP_ITEMS",
      payload: {
        token: number;
        deck: CardType[];
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
  token: null,
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
  const { 
    phase, 
    started, 
    gameOver, 
    round, 
    handCount, 
    playerHealth, 
    playerMaxHealth,
    daimonHealth,
    daimonMaxHealth,
    wager,
    playerHand,
    daimonHand,
    handWinner,
    token,
    deck,
    discardPile,
    visibility 
  } = state;
  const deckToDraw = deck.length === 0 ? shuffleCards(discardPile, round) : deck;

  switch(action.type) {
    case "START_GAME":
      const calcDaimonHealth = calculateDaimonHealth(round);
      const completeDeck = [...deck, ...discardPile];
      const shuffledDeck = shuffleCards(completeDeck, round);
      
      return { 
        ...state,
        phase: "introDialogue",
        started: true,
        round: round + 1,
        handCount: 0,
        daimonHealth: round === 0 ? 500 : calcDaimonHealth,
        daimonMaxHealth: calcDaimonHealth,
        wager: 0,
        playerHand: [],
        daimonHand: [],
        handWinner: null,
        deck: shuffledDeck,
        discardPile: [],
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
          ...visibility,
          ...action.payload
        }
      };
    case "SET_WAGER":
      return {
        ...state,
        phase: "draw",
        handCount: handCount + 1,
        playerHealth: calculateHealth(playerHealth - action.payload.wager, playerMaxHealth),
        daimonHealth: calculateHealth(daimonHealth - action.payload.wager, daimonMaxHealth),
        wager: 2 * action.payload.wager
      }
    case "SET_HEALTHVALUES":
      return {
        ...state,
        playerHealth: action.payload.playerHealth,
        daimonHealth: action.payload.daimonHealth,
        wager: action.payload.wager
      }
    case "EQUIP_ITEMS":
      return {
        ...state,
        token: action.payload.token,
        deck: action.payload.deck,
        discardPile: []
      }
    case "DRAW_PLAYER_CARD":
      const [nextCard, ...restOfDeck] = deckToDraw;
      const newPlayerHand = [...playerHand, nextCard];
      const { isBust } = cardTotal(newPlayerHand);
      return {
        ...state,
        playerHand: [...playerHand, deck[0]],
        deck: restOfDeck,
        discardPile: deck.length === 0 ? [] : discardPile,
        phase: isBust ? "resolution" : phase,
      }
    case "DRAW_DAIMON_CARD":
      const drawnCard = deckToDraw[deckToDraw.length - 1];
      const newDeck = deckToDraw.slice(0, -1);
      return {
        ...state,
        daimonHand: [...daimonHand, drawnCard],
        deck: newDeck,
        discardPile: deck.length === 0 ? [] : discardPile,
      }
    case "DECLARE_WINNER":
      return {
        ...state,
        handWinner: action.payload.winner
      }
    case "RESOLVE_HAND":
      const isPlayerWinner = handWinner === "player" || handWinner === "push";
      const isDaimonWinner = handWinner === "daimon" || handWinner === "push";
      const trueWager = handWinner === "push" ? wager / 2 : wager;
      return {
        ...state,
        phase: "wager",
        wager: 0,
        handWinner: null,
        playerHand: [],
        daimonHand: [],
        discardPile: [...discardPile, ...daimonHand, ...playerHand],
        daimonHealth: isDaimonWinner ? calculateHealth(daimonHealth + trueWager, daimonMaxHealth) : daimonHealth,
        playerHealth: isPlayerWinner ? calculateHealth(playerHealth + trueWager, playerMaxHealth) : playerHealth,
        
      }
    case "END_GAME":
      return {
        ...initialGameState,
        gameOver: true
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