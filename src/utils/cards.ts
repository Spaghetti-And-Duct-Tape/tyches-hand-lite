import { useMemo } from "react";

type rankType = number | "A" | "J" | "Q" | "K";
type suitType = "Hearts" | "Diamonds" | "Clubs" | "Spades";
type effectType = "Charred" | "Bloodstained" | "Standard"

export interface CardType {
  id: number;
  name: string;
  rank: rankType;
  suit: suitType;
  effect: effectType;
  value: number;
  description: string;
  effectDescription: string;
  flipped?: boolean
};

const ranks: rankType[] = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
const suits: suitType[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
const effects: effectType[] = ["Charred", "Bloodstained", "Standard"];
const effectDescription = {
  "Charred": {
    story: "The embers on these cards still cauterize wounds.",
    effect: "The gambler's blood pool is slightly replenished when card is dealt."
  },
  "Bloodstained": {
    story: "The cards are matted together, filling the room with a foul odor.",
    effect: "The house's blood pool is slightly decreased when card is dealt."
  },
  "Standard": {
    story: "A plain set of cards.",
    effect: "None."
  }
};

function convertRank(rank: rankType): number {
  if (!isNaN(rank)) return rank;
  switch (rank) {
    case "A":
      return 15;
    case "J":
      return 11;
    case "Q":
      return 12;
    case "K":
      return 13; 
  }
};

function buildCardInventory(): CardType[] {
  const cardArray: CardType[] = [];
  let cardIndex = 0;

  for (const effect of effects) {
    for (const suit of suits) {
      for (const rank of ranks) {
        const effectValue = Math.round((250 * convertRank(rank)) / 15);
        cardArray.push({
          id: cardIndex++,
          name: `A ${ effect } ${ rank === "A" ? "Ace" : rank } of ${suit}`,
          rank,
          suit,
          effect,
          value: effect === "Bloodstained" ? -effectValue : effectValue,
          description: effectDescription[effect].story,
          effectDescription: effectDescription[effect].effect,
          flipped: false,
        });
      }
    }
  }

  return cardArray;
}

export const emptyCard: CardType = {
  id: 999,
  name: "",
  rank: 0,
  suit: "Clubs",
  effect: "Standard",
  value: 0,
  description: "",
  effectDescription: "",
  flipped: true
} 

export const cardInventory: CardType[] = buildCardInventory();

export const tutorialDeck: CardType[] = [
  cardInventory[123], cardInventory[121], cardInventory[136], cardInventory[125],
  cardInventory[126], cardInventory[152], cardInventory[124], cardInventory[118],
  cardInventory[128], cardInventory[141], cardInventory[142], cardInventory[135],
  cardInventory[117], cardInventory[122], cardInventory[134], cardInventory[149],
  cardInventory[127], cardInventory[129], cardInventory[143], cardInventory[140],
  cardInventory[138], cardInventory[110], cardInventory[139], cardInventory[105], 
  cardInventory[104], cardInventory[106], cardInventory[107], cardInventory[108], 
  cardInventory[109], cardInventory[111], cardInventory[112], cardInventory[113], 
  cardInventory[114], cardInventory[115], cardInventory[116], cardInventory[119], 
  cardInventory[120], cardInventory[130], cardInventory[131], cardInventory[132], 
  cardInventory[133], cardInventory[137], cardInventory[144], cardInventory[145], 
  cardInventory[146], cardInventory[147], cardInventory[148], cardInventory[150], 
  cardInventory[151], cardInventory[153], cardInventory[154], cardInventory[155], 
];