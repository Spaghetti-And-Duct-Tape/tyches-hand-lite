import { tutorialDeck, type CardType } from "./cards";

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export function cardTotal(cards: CardType[]) {
  let sum = 0;
  let aces = 0;

  cards.forEach(card => {
    const { rank } = card;
    if (rank === "Ace") {
      aces++
    }
    else if (isNaN(rank)) {
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

export function calculateHealth(health: number, maxHealth: number) {
  return Math.max(Math.min(health, maxHealth), 0)
};