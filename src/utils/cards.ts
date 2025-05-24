type rankType = number | "Ace" | "Jack" | "Queen" | "King";
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

const ranks: rankType[] = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];
const suits: suitType[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
const effects: effectType[] = ["Charred", "Bloodstained", "Standard"];
const effectDescription = {
  "Charred": {
    story: "The embers on these cards still cauterize wounds.",
    effect: "The gambler's blood pool is slightly replenished at the end of the hand."
  },
  "Bloodstained": {
    story: "The cards are matted together, filling the room with a foul odor.",
    effect: "The house's blood pool is slightly decreased at the end of the hand."
  },
  "Standard": {
    story: "A plain set of cards.",
    effect: "None."
  }
};

function convertRank(rank: rankType): number {
  switch (rank) {
    case "Ace":
      return 15;
    case "Jack":
      return 11;
    case "Queen":
      return 12;
    case "King":
      return 13; 
    default:
      return rank;
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
          name: `A ${ effect } ${ rank } of ${suit}`,
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
  cardInventory[123], cardInventory[121], 
  cardInventory[125],
  cardInventory[152], cardInventory[124],
  cardInventory[142], cardInventory[135],
  cardInventory[122], cardInventory[134],
  cardInventory[127],
  cardInventory[143], cardInventory[140],
  cardInventory[105], 
  cardInventory[104], cardInventory[106], cardInventory[107], cardInventory[108], 
  cardInventory[109], cardInventory[111], cardInventory[112], cardInventory[113], 
  cardInventory[114], cardInventory[115], cardInventory[116], cardInventory[119], 
  cardInventory[120], cardInventory[130], cardInventory[131], cardInventory[132], 
  cardInventory[133], cardInventory[137], cardInventory[144], cardInventory[145], 
  cardInventory[146], cardInventory[147], cardInventory[148], cardInventory[150], 
  cardInventory[151], cardInventory[153], cardInventory[154], cardInventory[155],
  cardInventory[110], cardInventory[139],
  cardInventory[138],
  cardInventory[129],
  cardInventory[149],
  cardInventory[117],
  cardInventory[128], cardInventory[141],
  cardInventory[118],
  cardInventory[126],
  cardInventory[136], 
   
];


export function shuffleCards(cards: CardType[], round: number) {
  if (round === 0) return tutorialDeck;

  const biastBoost = round < 4 ? (6 / round) : (round / round);
  const rankWeights = (rank: number) => rank >= 10 ? biastBoost : 1
  const effectWeights = () => 1;
  const suitWeights = () => 1;
  
  const weights = calculateCardWeights(cards, rankWeights, effectWeights, suitWeights);
  return randomCardPicker(cards, weights, 52);
};

export function calculateCardWeights(
  cards: CardType[], 
  rankWeights: (rank: number) => number,
  effectWeights: (effect: string) => number,
  suitWeights: (suit: string) => number
) {
  const weightMap = cards.map(card => {
    const calculatedRank = convertRank(card.rank)
    const rankWeight = rankWeights(calculatedRank);
    const effectWeight = effectWeights(card.effect);
    const suitWeight = suitWeights(card.suit) || 1;

    return rankWeight * effectWeight * suitWeight;
  });

  return weightMap
};

export function randomCardPicker(cards: CardType[], weights: number[], count: number = 10) {
  let availableCards = [...cards];
  let availableWeights = [...weights];
  const picked = [];

  for (let i = 0; i < count && availableCards.length > 0; i++) {
    const index = weightedRandomIndex(availableWeights);
    picked.push(availableCards[index]);

    availableCards.splice(index, 1);
    availableWeights.splice(index, 1);
  };

  return picked;
};

function weightedRandomIndex(weights: number[]): number {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let r = Math.random() * total;
  
  for (let i = 0; i < weights.length; i++) {
    if (r < weights[i]) return i;
    r -= weights[i];
  }
  
  return weights.length - 1;
};