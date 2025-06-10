import { useGameState } from "../../composables/useGameState";
import { daimons } from "../../daimons";
import ApplyToken from "../token/applyToken";
import HealthStatus from "./healthBar";
import WagerBottle from "./wagerBottle";

export default function HealthBars() {
  const { gameState } = useGameState();
  const { 
    playerHealth, 
    playerMaxHealth,
    daimon,
    round,
    daimonHealth, 
    daimonMaxHealth,
    visibility,
  } = gameState;

  return (
    <>
        <div 
          className="healthbar-content transition-opacity"
          style={{
            position: "absolute",
            top: "5%",
            right: "2%",
            zIndex: "5",
            opacity: visibility.healthBars ? "1" : "0"
          }}
        >
          <HealthStatus
            name={ daimons[daimon].name }
            health={ daimonHealth }
            maxHealth={ daimonMaxHealth }
            isPlayer={ false }
          />
        </div>
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
          <div
            className="player-hud"
            style={{
              display: "flex",
              alignItems: "end"
            }}
          >
            <HealthStatus
              name={ `Trial: ${ round }` }
              health={ playerHealth }
              maxHealth={ playerMaxHealth }
              isPlayer={ true }
            />
            <ApplyToken />
          </div>
        </div>
          <WagerBottle />
        </>
  )
};