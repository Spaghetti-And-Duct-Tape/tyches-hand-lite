import { useState } from "react";
import WoodenPanel from "../dialogueBox/woodenPanels"
import NumberTicker from "./numberTicker"

export default function HealthStatus({
  name,
  health, 
  maxHealth = 5000,
  isPlayer = true,
} : {
  name: string;
  health: number;
  maxHealth?: number;
  isPlayer: boolean;
}) {
  const playerMaxHealth: number = maxHealth;
  const healthBarWidth: number = (health / playerMaxHealth) * 100;
  const [value, setValue] = useState(health); 

  return(
    <div className="health-status-container">
      <WoodenPanel>
          <div
            style={{
              textAlign: "center",
            }}  
            className="heading-name">
            <h2
              style={{
                textAlign: "center",
              }} 
            >
              { name }
            </h2>
          </div>
        <div className="healthbar-container">
          <WoodenPanel>
            <div
              style={{ 
                position: "relative"
              }} 
              className="relative healthbar-inner-layer"
            >
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%"
                }} 
              >
                <div className={ `healthbar-fill ${ isPlayer && "player-health" }` } style={{ width: `${ healthBarWidth }%` }} />
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
                      value={ value } 
                      setValue={ setValue } 
                    /> / { maxHealth }
                  </div>
                }
              </div>
            </div>
          </WoodenPanel>
        </div>
      </WoodenPanel>
    </div>
  )
};