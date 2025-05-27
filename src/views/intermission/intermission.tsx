import { useEffect, useMemo, useState } from "react";
import { useGameState } from "../../composables/useGameState";
import { calculateCardWeights, cardInventory, randomCardPicker, shuffleCards, type CardType } from "../../utils/cards";
import { tokens } from "../../utils/tokens";
import WoodenPanel from "../../components/dialogueBox/woodenPanels";
import "./intermission.css";
import TokenIntermission from "./tokenIntermission";
import CardIntermission from "./cardIntermission";

type PhasesType = "Dark" | "Token" | "Cards"

export default function Intermission() {
  const { gameState, gameDispatch } = useGameState();
  const [phase, setPhase] = useState<PhasesType>("Dark");
  const items = {
    deck: gameState.deck,
    token: gameState.token
  };
  const discardCards = useMemo(() => shuffleCards(gameState.deck, 10).slice(0, 5), []);
  const token = useMemo(() => randomToken(), []);
  const cards = useMemo(() => randomCards(), []);

  useEffect(() => {
    if (phase !== "Dark") return;

    setTimeout(() => {
      setPhase("Token");
    }, 1000);
  }, [phase]);

  useEffect(() => {
    if (phase === "Dark") return;

    if (phase === "Token" && !token) return setPhase("Cards");
    if (phase === "Cards" && !cards) return gameDispatch({ type: "START_GAME" });
  }, [phase]);

  function setItem(key: string, value: CardType[] | number) {
    items[key] = value;

    gameDispatch({
      type: "EQUIP_ITEMS",
      payload: {
        ...items
      }
    });
    
    key === "deck" ? gameDispatch({ type: "START_GAME" }) : setPhase("Cards");
  }

  function randomToken() {
    const discoverableTokens = tokens.filter(token => token.id !== gameState.token);
    
    if (discoverableTokens.length === 0) return;
    
    const index = Math.floor(Math.random() * discoverableTokens.length);
    return discoverableTokens[index];
  };

  function randomCards() {
    const discoverableCards = cardInventory.filter(card => !items.deck.includes(card));

    if (discoverableCards.length === 0) return;
  
    const isPlayerLow = gameState.playerHealth < 2000
      
    const effectWeights = isPlayerLow 
      ? (effect: string) => effect === "Charred" ? 3 : 1
      : (effect: string) => effect === "Charred" ? 1 : 3
    const rankWeights = () => 1;
    const suitWeights = () => 1;
  
    const weights = calculateCardWeights(discoverableCards, rankWeights, effectWeights, suitWeights);
    return randomCardPicker(discoverableCards, weights, 3);
  };

  if (phase === "Dark") return;

  return (
    <IntermissionLayout
      phase={ phase } 
    >
      { phase === "Token" &&
        <TokenIntermission
          token={ token }
          items={ items }
          setItem={ setItem } 
          setPhase={ setPhase }
        />
      }
      { phase === "Cards" &&
        <CardIntermission
          cards={ cards }
          discardCards={ discardCards }
          items={ items }
          setItem={ setItem }
        />
      }
    </IntermissionLayout>
  )

};


function IntermissionLayout({ 
  phase,
  children 
} : { 
  phase: string;
  children: React.ReactNode;
}) {
  return (
    <div 
      className="intermission-layout"
      key={ phase }
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center"
      }}
    >
      <WoodenPanel>
        <div
          className="blessing-background"
          style={{
            height: "100%",
            display: "grid",
            gridTemplateColumns: "auto auto auto auto"
          }}
        >
          { children }
        </div>
      </WoodenPanel>
    </div>
  )
};