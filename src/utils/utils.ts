import type { playerActionsType } from "../composables/useGameState";
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

export function tutorialPlayerActions(deck: CardType[]): playerActionsType[] {
  switch(deck.length) {
    case 49:
      return ["Hit"];
    case 48:
      return ["Stand"];
    case 44:
      return ["Stand"];
    case 39:
      return ["Surr"];
    case 36:
      return ["2x"];
    case 31:
      return ["Stand"];
    default:
      return [];
  }
};

export function handWinner(
  playerHand: CardType[],
  daimonHand: CardType[]
): "player" | "daimon" | "push" {
  const { isBlackjack: playerBlackjack, isBust: playerBust, sum: playerSum }   = cardTotal(playerHand);
  const { isBlackjack: daimonBlackjack, isBust: daimonBust, sum: daimonSum }   = cardTotal(daimonHand);

  // 1) Handle any Blackjacks
  if (playerBlackjack || daimonBlackjack) {
    if (playerBlackjack && daimonBlackjack) return "push";
    return playerBlackjack ? "player" : "daimon";
  }

  // 2) Handle any Busts
  if (playerBust || daimonBust) {
    if (playerBust && daimonBust) return "daimon";  // house wins ties on double‐bust
    return playerBust ? "daimon" : "player";
  }

  // 3) Compare sums (including a true tie)
  if (playerSum === daimonSum) return "push";
  return playerSum > daimonSum ? "player" : "daimon";
}