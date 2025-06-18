import { useState } from "react";
import NumberTicker from "./numberTicker"
import WoodenPanel from "../dialogue/woodenPanel";

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
  const [healthValue, setHealthValue] = useState(health); 
  const [maxHealthValue, setMaxHealthValue] = useState(maxHealth);

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
                
              </div>
            </div>
          </WoodenPanel>
        </div>
      </WoodenPanel>
    </div>
  )
};