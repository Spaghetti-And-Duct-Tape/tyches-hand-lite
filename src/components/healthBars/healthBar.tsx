import { useState } from "react";
import WoodenPanel from "../dialogue/woodenPanel";
import NumberTicker from "./numberTicker";

export default function HealthBar({
  health,
  maxHealth = 5000,
  isPlayer = true
} : {
  health: number;
  maxHealth?: number;
  isPlayer: boolean
}) {
  const playerMaxHealth: number = maxHealth;
  const healthBarWidth: number = (health / playerMaxHealth) * 100;
  const [healthValue, setHealthValue] = useState(health);
  const [maxHealthValue, setMaxHealthValue] = useState(maxHealth);

  return (
    <div
      className="healthbar-container"
    >
      <WoodenPanel>
        <div
          style={{
            position: "relative",
          }}
          className="healthbar-inner-layer"
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
                width: `${ healthBarWidth }%`
              }}
            />
            { isPlayer &&
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
                <NumberTicker
                  replacement={ health }
                  duration={ 1000 } 
                  value={ healthValue } 
                  setValue={ setHealthValue } 
                /> / <NumberTicker 
                  replacement={ maxHealth }
                  duration={ 1000 }
                  value={ maxHealthValue }
                  setValue={ setMaxHealthValue }
                />
              </div>
            }
          </div>
        </div>
      </WoodenPanel>
    </div>
  )
}