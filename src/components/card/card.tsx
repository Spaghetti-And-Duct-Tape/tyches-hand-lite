import type { CardType } from "../../utils/cards";
import "./card.css";


interface FaceUpCardProps {
  card: {
  displayRank: string | number;
  displaySuit: string;
  };
}

export default function Card({
  card,
  isFlipped = false
} : {
  card: CardType;
  isFlipped?: boolean;
}) {
  const { suit, rank, effect } = card;
  const isBlackSuit = suit === "Clubs" || suit === "Spades";
  const cardSuit = {
    Hearts: "♥",
    Diamonds: "♦",
    Clubs: "♣",
    Spades: "♠",
  };
  const cardRank = {
    Ace: "A",
    King: "K",
    Queen: "Q",
    Jack: "J"
  }
  
  const displaySuit = cardSuit[suit as keyof typeof cardSuit] || "";
  const displayRank = cardRank[rank as keyof typeof cardRank] || rank;

    return(
    <div className={`card-container ${ isBlackSuit ? "black" : "" }`}>
      <div className={`card-inner ${ isFlipped ? "flipped" : "" }`}>
        {/* Front (Face-Up) */}
        <div className={`card-face card-front ${ effect }-card`}>
          <FaceUpCard card={{ displayRank, displaySuit }} />
        </div>

        {/* Back (Face-Down) */}
        <div className="card-face card-back">
          <FaceDownCard />
        </div>
      </div>
    </div>
  );
}

function FaceUpCard({ 
  card 
}: FaceUpCardProps) {
  const { displayRank, displaySuit } = card;

  return (
    <div 
      className="face-up"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "95%",
        height: "95%"
      }}
    >
      <div 
        className="card-header"
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div className="card-suit">{ displayRank }</div>
        <div className="card-rank">{ displaySuit }</div>
      </div>
      <div 
        className="card-content"
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center"
        }}
      >
        <div className="card-value">{ displayRank }</div>
      </div>
    </div>
  );
}

function FaceDownCard() {
  return <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
    className="face-down" 
  />;
}