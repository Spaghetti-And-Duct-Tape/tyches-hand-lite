import { useGameState } from "../../composables/useGameState";
import type { CardType } from "../../utils/cards";
import Card from "./card";

export default function PerspectiveCards({
  hand,
  owner
} : {
  hand: CardType[];
  owner: string;
}) {
  const { gameState } = useGameState();
  const { animations } = gameState;
  
  return(
    <div
      className={ `${ owner }-card-stack ${ animations.cards }` }
      style={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      { hand.length > 0 &&
        hand.map((card, index) => (
          <div 
            key={ owner === "player" ? index : index + 10 }
            className={ `overlap-cards` }
            style={{ 
              width: "fit-content",
              animationDelay: card.id === 999 ? "0.3s" : "", 
            }}
          >
            <div
              className="perspective-card"
            >
              <Card
                card={ card }
                isFlipped={ card.flipped }
              />
            </div>
          </div>
        ))
      }
    </div>
  )
};