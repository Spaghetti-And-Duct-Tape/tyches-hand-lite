import { useEffect, useRef } from "react";
import { useGameState, type PlayerActionsType } from "../../composables/useGameState"
import BloodButton from "../bloodButton/bloodButton";
import usePlayerActions from "../../composables/usePlayerActions";

export default function ActionButton() {
  const { gameState, gameDispatch } = useGameState();
  const { 
    startWager,
    playerStands, 
    player2x,
    playerSurrenders,
    drawPlayerCard, 
    tutorialPlayerActions 
  } = usePlayerActions();
  const {
    phase,
    round,
    playerActions,
    playerHealth,
    playerHand,
    wager,
  } = gameState;
  const buttonRef = useRef(false);

  useEffect(() => {
    buttonRef.current = false;
    let buttonMap: PlayerActionsType[] = [];

    if (phase === "wager") buttonMap = ["Wager"];
    if (phase === "player-turn") buttonMap = availablePlayerActions();

    gameDispatch({ type: "PLAYER_ACTIONS",
      payload: {
        playerActions: buttonMap
      }
    });

  }, [phase, playerHand]);

  function availablePlayerActions(): PlayerActionsType[] {
    if (round === 1) return tutorialPlayerActions(gameState.deck);

    const actions: PlayerActionsType[] = ["Hit", "Stand"];

    if (gameState.token === 1) actions.push("2x");
    if (playerHand.length > 2) return actions;
    
    if (gameState.token !== 4) actions.push("Surr");
    if (playerHealth <= wager / 2 || actions.length === 4) return actions;
    actions.push("2x");

    return actions;
  };

  const buttonActionsMap: Record<PlayerActionsType, () => void> = {
    "Wager": () => startWager(),
    "Stand": () => playerStands(),
    "Hit": () => drawPlayerCard(),
    "2x": () => player2x(),
    "Surr": () => playerSurrenders()
  };

  function handleButtonClick(name: string) {
    if (buttonRef.current) return;
    buttonRef.current = true;

    const fn = buttonActionsMap[name as PlayerActionsType];
    if (fn) fn();
  };

  return (
    <div
      className="action-buttons-container"
      style={{
        position: "absolute",
        bottom: "5%",
        right: "2%",
        zIndex: "1"
      }}
    >
      { playerActions.map((button, index) => {
        //Makes the bottom button appear first
        const inverseIndex = playerActions.length - index;
        
        return(
          <div
            className="draw-button-animation"
            key={ button }
            style={{
              margin: "5px",
              transform: `translateY( ${ 50 * (index + 1) }px)`,
              animationDelay: `${ inverseIndex * 0.1 }s`
            }}
          >
            <BloodButton
              action={ () => handleButtonClick(button) }
            >
              { button }
            </BloodButton>
          </div>
        )
      })}
    </div>
  )
};