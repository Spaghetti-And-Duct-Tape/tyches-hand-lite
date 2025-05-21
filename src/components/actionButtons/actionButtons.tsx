import { useState, useEffect, useRef } from "react";
import { useGameState } from "../../composables/useGameState";
import BloodButton from "../bloodButton/bloodButton";
import usePlayerActions from "../../composables/usePlayerActions";
import "./actionButtons.css";

export default function ActionButton() {
  const { gameState, gameDispatch } = useGameState();
  const { phase, playerHand, handCount } = gameState;
  const [buttonMap, setButtonMap] = useState<string[]>([]);
  const { startWager, playerHits, daimonResolves, playerSurrenders, player2x, availablePlayerActions } = usePlayerActions();
  const buttonRef = useRef(false);

  useEffect(() => {
    buttonRef.current = false;

    switch(phase) {
      case "wager":
        return setButtonMap(["Wager"]);
      case "player-turn":
        return setButtonMap(availablePlayerActions());
      default:
        setButtonMap([]);
    }; 
  }, [phase, playerHand]);

  if (buttonMap.length === 0) return;

  function handleButtonClick(name: string) {
    if (buttonRef.current) return;
    buttonRef.current = true;

    const fn = buttonActionsMap[name];
    if (fn) fn();
  }
  const buttonActionsMap = {
    "Wager": () => startWager(),
    "Hit": () => playerHits(),
    "Stand": () => daimonResolves(),
    "Surr": () => playerSurrenders(),
    "2x": () => player2x(),
  }

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
      { buttonMap.map((button, index) => {
        //Makes the bottom button appear first
        const inverseIndex = buttonMap.length - index;

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