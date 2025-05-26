import { useEffect, useRef, useState } from "react";
import { useGameState, type playerActionsType } from "../../composables/useGameState";
import BloodButton from "../bloodButton/bloodButton";
import { tutorialPlayerActions } from "../../utils/utils";
import usePlayerActions from "../../composables/usePlayerActions";

export default function ActionButton() {
  const { gameState, gameDispatch, drawPlayerCards } = useGameState();
  const { 
    phase, 
    round, 
    playerHealth, 
    playerHand, 
    wager,
    deck, 
    playerActions 
  } = gameState;
  const { startWager, daimonResolves, playerSurrenders, player2x } = usePlayerActions();
  const buttonRef = useRef(false);

  useEffect(() => {
    buttonRef.current = false;
    let buttonMap: playerActionsType[] = [];

    if (phase === "wager") buttonMap = ["Wager"];
    if (phase === "player-turn") buttonMap = availablePlayerActions();

    gameDispatch({ type: "PLAYER_ACTIONS",
      payload: {
        playerActions: buttonMap
      }
    });
  }, [phase, playerHand]);

  function availablePlayerActions(): playerActionsType[] {
    if (round === 1) return tutorialPlayerActions(deck);
    
    const actions: playerActionsType[] = ["Hit", "Stand"];

    if (gameState.token === 1) actions.push("2x");
    if (playerHand.length > 2) return actions;
    
    actions.push("Surr");
    if (playerHealth <= wager / 2 || actions.length === 4) return actions;
    actions.push("2x");

    return actions;
  };

  const buttonActionsMap = {
    "Wager": () => startWager(),
    "Hit": () => drawPlayerCards(1),
    "Stand": () => daimonResolves(),
    "Surr": () => playerSurrenders(),
    "2x": () => player2x(),
  }

  function handleButtonClick(name: string) {
    if (buttonRef.current) return;
    buttonRef.current = true;

    const fn = buttonActionsMap[name];
    if (fn) fn();
  };

  

  return (
    <div
      className="action-buttons-container"
      style={{
        position: "absolute",
        bottom: "5%",
        right: "2%",
        zIndex: "1",
      }}
    >
      { playerActions.map((button, index) => {
        //Makes the bottom button appear first
        const inverseIndex = playerActions.length - index;

        return (
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