import { useEffect, useState } from "react";
import { useGameState } from "../composables/useGameState";
import StartScreen from "../components/startScreen";
import BloodButton from "../components/bloodButton";

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
    <div className="overlay-screen">
      <StartScreen />
        <div 
          className="start-button-container"
          style={{ opacity: playButton ? "1" : "0" }}
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