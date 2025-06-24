import { useEffect, useState } from "react";
import { useGameState } from "../../composables/useGameState";
import { daimons } from "../../daimons";
import { tokens } from "../../utils/token";
import HoverBox from "../hoverBox/hoverBox";
import Token from "../token/token";
import HealthBar from "./healthBar";
import WagerBottle from "./wagerBottle";

export default function HealthBars() {
  const { gameState } = useGameState();
  const { 
    playerHealth, 
    playerMaxHealth,
    daimon,
    token,
    daimonHealth, 
    daimonMaxHealth,
    visibility,
  } = gameState;
  const [prevDaimonHealth, setPrevDaimonHealth] = useState(daimonHealth);
  const daimonHealthChange = daimonHealth - prevDaimonHealth;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevDaimonHealth(daimonHealth);
    }, 1000);

    return () => clearInterval(interval);
  }, [daimonHealth])

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
          <div
            style={{
              width: "25dvw"
            }} 
            className="health-status-container"
          >
            <h2
              className="boss-name"
              style={{
                margin: "0"
              }}
            >
              { daimons[daimon].name }
            </h2>
            <HealthBar
              health={ daimonHealth }
              maxHealth={ daimonMaxHealth }
              isPlayer={ false }
            />
            { daimonHealthChange !== 0 &&
              <p
                className={ `transition-opacity daimon-damage ${ daimonHealthChange > 0 ? "" : "negative-color" }` }
                style={{
                  margin: "0",
                  textAlign: "center",
                  opacity: daimonHealthChange === 0 ? "0" : "1",
                  maxHeight: "fit-content"
                }}
              >
                { daimonHealthChange }
              </p>
            }
          </div>
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
            style={{
              width: "25dvw"
            }}
            className="health-status-container"
          >
            <div
              className="player-hud"
            >
              { token !== null && 
                <HoverBox
                  name={ tokens[token].name }
                  description={ tokens[token].effectDescription }
                >
                  <Token
                    token={ tokens[token] }
                  />
                </HoverBox>
              }
              <HealthBar
                health={ playerHealth }
                maxHealth={ playerMaxHealth }
                isPlayer
              />
          </div>
          </div>
        </div>
          <WagerBottle />
        </>
  )
};