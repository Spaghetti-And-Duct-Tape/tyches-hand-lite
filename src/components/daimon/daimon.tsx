import { useEffect } from "react";
import { useGameState } from "../../composables/useGameState";
import "./daimon.css";
import { useAnimationState } from "../../composables/useAnimationState";

export default function Daimon() {
  const { gameState } = useGameState();
  const { animationState, setAnimation } = useAnimationState();
  const { visibility } = gameState;

  useEffect(() => {
    if (!visibility.daimon) return;
    setAnimation("daimon", "open-eyelid", 10000)
  }, [visibility.daimon]);

   //Blinks randomly if in an idle animation
  useEffect(() => {
    if (animationState.daimon !== "idle") return;
    const randomDelay: number = Math.random() * 5000 + 10000
    console.log(randomDelay);
    
    setAnimation("daimon", "blinking", randomDelay);
  }, [animationState.daimon]);
  
  return (
    <div
      className="daimon-eye-container transition-opacity"
      style={{ 
        marginTop: "min(2vw, 2vh)",
        height: "fit-content",
        opacity: visibility.daimon ? "1" : "0", 
        padding: "0",
      }}
    >
      <div className="float">
        <div className={ `${ animationState.daimon }` } >
          <div className={ `` } id="eye">
            <div className="pupil">
              <div className="shine" />
                  <div className="rune">
                    O
                  </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
};