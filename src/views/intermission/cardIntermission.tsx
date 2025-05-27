import { useState } from "react";
import type { CardType } from "../../utils/cards";
import IntermissionDescription from "./intermissionDescription";
import Card from "../../components/card/card";
import BloodButton from "../../components/bloodButton/bloodButton";

export default function CardIntermission({
  cards,
  items, 
  discardCards,
  setItem,
} : {
  cards: CardType[] | undefined;
  items: {
    deck: CardType[];
    token: number | null;
  };
  discardCards: CardType[];
  setItem: (key: string, value: CardType[] | number) => void;
}) {

  if (!cards) return;
  const [showCard, setShowCard] = useState<CardType>(cards[0]);
  const [toggleCards, setToggleCards] = useState(true);
  const [cardsToAdd, setCardsToAdd] = useState<CardType[]>([]);
  const [cardsToRemove, setCardsToRemove] = useState<CardType[]>([]);

  function selectedNewCards(card: CardType) {
    setShowCard(card);
    setCardsToAdd(prev => {
      if (prev.includes(card)) return prev.filter(prevCard => prevCard.id !== card.id);
      return [...prev, card]
    });
  };

  function selectedOldCards(card: CardType) {
    setShowCard(card);
    setCardsToRemove(prev => {
      if (prev.includes(card)) return prev.filter(prevCard => prevCard.id !== card.id);
      if (cardsToAdd.length === 0) return prev;
      if (prev.length + 1 > cardsToAdd.length) {
        return [...prev.slice(1), card]
      };
      return [...prev, card]
    });
  };

  function setDeck() {
    if (cardsToRemove.length !== cardsToAdd.length) return;

    let filteredDeck = items.deck.filter(card => !cardsToRemove.includes(card));
    setItem("deck", [...filteredDeck, ...cardsToAdd]);
  };

  return (
    <>
      <div
        style={{ 
          textAlign: "center",
          gridColumn: "1 / span 4" 
        }}
      >
        <p>
          { toggleCards 
            ? "Three cards have appeared before you, you may choose to add them to your deck."
            : "Tyche demands balance. Choose " + cardsToAdd.length + " cards to remove."
          }
        </p>
      </div>
      <div
        className="intermission-description-container"
        style={{
          gridColumn: "1 / span 4"
        }}
      >
        <IntermissionDescription
          item={ showCard }
        />
      </div>
      { toggleCards ? (
        <CardSection
          cards={ cards }
          pickedCards={ cardsToAdd }
          selectCard={ selectedNewCards } 
          maxCardsToPick={ 3 }
        />
      ) : (
        <CardSection
          cards={ discardCards }
          pickedCards={ cardsToRemove }
          selectCard={ selectedOldCards } 
          maxCardsToPick={ cardsToAdd.length }
        />
      )}
      <div
        style={{
          margin: "20px 5px",
          display: "flex",
          justifyContent: "space-evenly",
          gridColumn: "1 / span 4"
        }}
      >
        <BloodButton
          action={ toggleCards ? () => setToggleCards(false) : setDeck }
        >
          { toggleCards ? "Equip Cards" : "Discard Cards" }
        </BloodButton>
      </div>
    </>
  )
};

function CardSection({
  cards, 
  pickedCards,
  maxCardsToPick,
  selectCard
} : {
  cards: CardType[];
  pickedCards: CardType[];
  maxCardsToPick: number;
  selectCard: (card: CardType) => void;
}) {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "10% !important",
          display: "flex",
          justifyContent: "space-evenly",
          gridColumn: "1 / span 3" 
        }}

      >
        { cards && cards.map(card => (
          <div 
            key={ card.id }
            style={{
              margin: "5px",
              animation: pickedCards.includes(card) ? "pulse-glow 2s infinite" : "" 
            }}
            className="intermission-card-clicker"
            onClick={ () => selectCard(card) }
          >
            <Card
              card={ card }
            />
          </div>
        ))}
      </div>
      <div 
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          marginLeft: "5px"
        }}
      >
        <h2
          style={{ 
            color: pickedCards.length !== maxCardsToPick ? "red" : "" 
          }}
        >
          { pickedCards.length } / { maxCardsToPick }
        </h2>
      </div>
    </>
  )
};