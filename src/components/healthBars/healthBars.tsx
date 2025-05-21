import { useState } from "react";
import { useGameState } from "../../composables/useGameState";
import WoodenPanel from "../dialogueBox/woodenPanels";
import "./healthBars.css"
import NumberTicker from "./numberTicker";
import WagerBottle from "./wagerBottle";

export default function HealthBars() {
  const { gameState } = useGameState();
  const { 
    playerHealth, 
    playerMaxHealth, 
    daimonHealth, 
    daimonMaxHealth,
    visibility
  } = gameState;

  return (
    <div
    >
    <div 
      className="healthbar-content transition-opacity"
      style={{
        position: "absolute",
        bottom: "5%",
        left: "2%",
        zIndex: "5",
        opacity: visibility.healthBars ? "1" : "0"
      }}
    >
      <WoodenPanel>
        <div className="healthbar-container">
          <HealthBarFill
            health={ playerHealth }
            maxHealth={ playerMaxHealth } 
            isPlayer 
          />
          <HealthBarFill
            health={ daimonHealth }
            maxHealth={ daimonMaxHealth }
          />
        </div>
      </WoodenPanel>

      
    </div>
      <WagerBottle />
    </div>
  )
};

function HealthBarFill({
  health,
  maxHealth,
  isPlayer
} : {
  health: number;
  maxHealth: number;
  isPlayer?: boolean;
}) {
  const healthBarWidth: number = (health / maxHealth) * 100;
  const [value, setValue] = useState(health);
  return (
    <WoodenPanel>
      <div 
        className="healthbar-inner-layer"
        style={{ 
          position: "relative",
          height: "20px",
          overflow: "hidden",
          zIndex: "1",
          borderRadius: "10px" 
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%"
          }}
        >
          <div 
            className={ `healthbar-fill ${ isPlayer && "player-health" }` } 
            style={{ 
              width: `${ healthBarWidth }%`,
              height: "100%",
              borderRadius: "5px"
            }} 
          />
          <div 
            className="healthbar-text"
            style={{
              position: "absolute",
              width: "100%",
              textAlign: "end",
              top: "50%",
              left: "45%",
              fontSize: "15px"
            }}
          >
            { isPlayer ? (
              <>
                <NumberTicker
                  replacement={ health }
                  duration={ 1000 }
                  value={ value }
                  setValue={ setValue }
                /> / { maxHealth }
              </>
            ) : (
              <span>The Daimon</span>
            )}
          </div>
        </div>
      </div>
    </WoodenPanel>
  )
};