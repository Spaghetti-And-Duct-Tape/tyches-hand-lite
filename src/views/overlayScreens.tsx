import { useEffect, useState } from "react";
import { useGameState } from "../composables/useGameState";
import StartScreen from "./startScreen";
import BloodButton from "../components/bloodButton/bloodButton";

export default function OverlayScreens() {
  const { gameDispatch } = useGameState();
  const [playButton, setPlayButton] = useState<boolean>(false);
  
  useEffect(() => {
    const introDelay = setTimeout(() => {
      setPlayButton(true);
    }, 1500);

    return () => clearTimeout(introDelay);
  }, []);

  return(
    <div 
      className="overlay-screen"
      style={{ 
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        
      }}
    >
      <StartScreen />
        <div 
          className="start-button-container transition-opacity"
          style={{
            opacity: playButton ? "1" : "0" ,
            zIndex: "1"
          }}
        >
          <BloodButton
            disabled={ !playButton }
            action={ () => gameDispatch({ type: "START_GAME" }) }
          >
            Play
          </BloodButton>
        </div>
    </div>
  )
};