import { useEffect } from "react";
import ActionButton from "../components/actionButtons/actionButtons";
import Daimon from "../components/daimon/daimon";
import DialogueManager from "../components/dialogueBox/dialogueManager";
import HealthBars from "../components/healthBars/healthBars";
import Table from "../components/table/table";
import { useGameState } from "../composables/useGameState";
import { tokens } from "../utils/tokens";
import "./gameBoard.css";
import { wait } from "../utils/utils";

export default function GameBoard() {
  return(
    <div 
      className="game-board"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ActionButton />
      <ApplyEffects /> 
      <HealthBars />
      <DialogueManager />
      <Daimon />
      <Table />
    </div>
  )
};

function ApplyEffects() {
  const { gameState, gameDispatch } = useGameState();
  const { phase } = gameState;

  useEffect(() => {
    if (phase !== "apply-token-effect") return;
    handleTokenEffects();
  }, [phase]);

  async function handleTokenEffects() {
    if (gameState.token === null) return gameDispatch({ type: "SET_PHASE", payload: { phase: "player-turn" }});
    
    const token = tokens[gameState.token];
    await wait(1600);
    
    const tokenGameState = Object.fromEntries(
      Object
        .entries(token.gameState)
        .map(([key, updater]) => 
          [key, (updater as Function)(gameState)]
        ));
    
    tokenGameState.phase = "player-turn"
          
    gameDispatch({ type: "APPLY_EFFECTS",
      payload: {
        gameState: { ...tokenGameState }
      }
    })
  
    await wait(2000);
  
  
    console.log(tokenGameState)
  };

  return (
    <div>
      { }
    </div>
  )
};