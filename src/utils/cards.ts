export type RankType = number | "Ace" | "Jack" | "Queen" | "King";
export type SuitType = "Hearts" | "Diamonds" | "Clubs" | "Spades";
export type EffectType = "Charred" | "Bloodstained" | "Standard";

export interface CardType {
  id: number;
  name: string;
  rank: RankType;
  suit: SuitType;
  effect: EffectType;
  value: number;
  description: string;
  effectDescription: string;
  flipped?: boolean
};

interface weightOptions {
  rankWeights?: (rank: number) => number;
  effectWeights?: (effect: EffectType) => number;
  suitWeights?: (suit: SuitType) => number;
};

const ranks: RankType[] = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];
const suits: SuitType[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
const effects: EffectType[] = ["Charred", "Bloodstained", "Standard"];

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
    effect: "No effect."
  }
};

export function convertRank(rank: RankType): number {
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
        const effectValue = Math.round((500 * convertRank(rank)) / 15);
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
};

export const cardInventory: CardType[] = buildCardInventory();

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
};

export function cardTotal(cards: CardType[]) {
  let sum = 0;
  let aces = 0;

  cards.forEach(card => {
    const { rank } = card;
    if (rank === "Ace") {
      aces++
    }
    else if (typeof rank === "string") {
      sum += 10
    }
    else {
      sum += rank
    }
  });

  sum += aces;

  if (aces > 0 && sum + 10 <= 21) {
    sum += 10
  };

  return {
    sum,
    isBust: sum > 21,
    isBlackjack: sum === 21 && cards.length === 2
  }
};

export function shuffleCards(
  cards: CardType[],
  round: number
): CardType[] {
  if (round === 0) return tutorialDeck;

  const biasBoost = round < 4 ? (6 / round) : 1;
  const rankWeights = (rank: number) => rank >= 10 ? biasBoost : 1;

  const weights = calculateCardWeights(cards, {
    rankWeights: rankWeights
  });
  return randomCardPicker(cards, weights, 52);
};

export function randomCardPicker(
  cards: CardType[], 
  weights: number[], 
  count: number = 5) {
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

export function calculateCardWeights(
  cards: CardType[],
  options: weightOptions = {}
): number[] {
  const {
    rankWeights = () => 1,
    effectWeights = () => 1,
    suitWeights = () => 1
  } = options;

  return cards.map(card => {
    const r = convertRank(card.rank);
    
    return rankWeights(r)
      * effectWeights(card.effect)
      * suitWeights(card.suit); 
  })
};

function weightedRandomIndex(weights: number[]): number {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let r = Math.random() * total;

  for (let i = 0; i < weights.length; i ++) {
    if (r < weights[i]) return i;
    r -= weights[i];
  };

  return weights.length - 1;
};

/*export const tutorialDeck = [
  cardInventory[1], cardInventory[2], cardInventory[3], cardInventory[4], 
  cardInventory[5], cardInventory[6], cardInventory[7], cardInventory[8], 
  cardInventory[9], cardInventory[10], cardInventory[11], cardInventory[12],
  cardInventory[13], cardInventory[14], cardInventory[15], cardInventory[16], 
  cardInventory[17], cardInventory[18], cardInventory[19], cardInventory[20], 
  cardInventory[21], cardInventory[22], cardInventory[23], cardInventory[24], 
  cardInventory[25], cardInventory[26], cardInventory[27], cardInventory[28], 
  cardInventory[29], cardInventory[30], cardInventory[31], cardInventory[32], 
  cardInventory[33], cardInventory[34], cardInventory[35], cardInventory[36], 
  cardInventory[37], cardInventory[38], cardInventory[39], cardInventory[40], 
  cardInventory[41], cardInventory[42], cardInventory[43], cardInventory[44],
  cardInventory[45], cardInventory[46], cardInventory[47], cardInventory[48], 
  cardInventory[49], cardInventory[50], cardInventory[51], cardInventory[52], 
]*/

export const tutorialDeck: CardType[] = [
  cardInventory[123], cardInventory[121], cardInventory[125], cardInventory[152], 
  cardInventory[124], cardInventory[142], cardInventory[135], cardInventory[122], 
  cardInventory[134], cardInventory[127], cardInventory[143], cardInventory[140],
  cardInventory[105], cardInventory[104], cardInventory[106], cardInventory[107], 
  cardInventory[108], cardInventory[109], cardInventory[111], cardInventory[112], 
  cardInventory[113], cardInventory[114], cardInventory[115], cardInventory[116], 
  cardInventory[119], cardInventory[120], cardInventory[130], cardInventory[131], 
  cardInventory[132], cardInventory[133], cardInventory[137], cardInventory[144], 
  cardInventory[145], cardInventory[146], cardInventory[147], cardInventory[148], 
  cardInventory[150], cardInventory[151], cardInventory[153], cardInventory[154], 
  cardInventory[155], cardInventory[110], cardInventory[139], cardInventory[138],
  cardInventory[129], cardInventory[149], cardInventory[117], cardInventory[128], 
  cardInventory[141], cardInventory[118], cardInventory[126], cardInventory[136], 
];