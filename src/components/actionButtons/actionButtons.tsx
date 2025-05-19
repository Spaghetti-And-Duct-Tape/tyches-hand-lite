import { useState, useEffect } from "react";
import { useGameState } from "../../composables/useGameState";
import BloodButton from "../bloodButton/bloodButton";
import { calculateWager } from "../../utils/gameCalculations";

export default function ActionButton() {
  const { gameState, gameDispatch } = useGameState();
  const { phase } = gameState;
  const [buttonMap, setButtonMap] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phase === "intro") return;
    if (phase === "wager") return setButtonMap(["Wager"]);
  }, [phase]);

  if (buttonMap.length === 0) return;

  function startWager() {
    const { playerHealth, daimonHealth, wager } = gameState
    const wage = calculateWager(index, playerHealth);
    const deductedPlayer = playerHealth - wage;
    const deductedDaimon = daimonHealth - wage;

    if (deductedPlayer <= 0) return console.log("player lost");
    if (deductedDaimon <= 0) return console.log("daimon lost");

    gameDispatch({ 
      type: "SET_WAGER", 
      payload: 
      { 
        wager: wage
    }})
  };

  console.log(gameState);

  return (
    <div
      className="action-buttons-container"
      style={{
        position: "absolute",
        top: "3%",
        right: "5%",
        zIndex: "1",
      }}
    >
      { buttonMap.map((button, index) => {
        //Makes the bottom button appear first
        const inverseIndex = buttonMap.length - index;

        return (
          <div 
            className="draw-button-animation"
            style={{
              margin: "5px",
              transform: `translateY( ${ -50 * (index + 1) }px)`,
              animationDelay: `${ inverseIndex * 0.25 }s` 
            }}
          >
            <BloodButton
              action={ startWager }
            >
              { button }
            </BloodButton>
          </div>
        )
      })}
    </div>
  )
};