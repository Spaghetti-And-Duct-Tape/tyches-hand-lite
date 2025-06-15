import { cardTotal, type CardType } from "./cards";

export const effectCardDelay = 1200;
export const standardCardDelay = 300;

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export function calculateDaimonHealth(round: number): number {
  const baseDaimonHealth: number = 2500;
  const scalingFactor: number = 1.155;

  if (round <= 0) return 2500;
  return Math.round(baseDaimonHealth * (scalingFactor ** round));
};

export function calculateWager(handsPlayed: number, playerHealth: number) {
  //Minimum wager for hands less than 4
  let minimumWager = 500;

  if (handsPlayed < 4) return minimumWager;

  //Scales from hand 5 to 15
  const scaling = Math.min(handsPlayed, 15);

  const totalWager = minimumWager + (scaling - 4) * 409;

  //A minimum of 500 must be wagered
  const maxWager = Math.max(playerHealth - 1, minimumWager);
  //Prevents wager from going over player health
  return Math.min(maxWager, totalWager);
};

export function calculateHealth(
  health: number, 
  maxHealth: number,
  amount: number = 0
) {
  const changeHealth = health + amount;
  return Math.max(Math.min(changeHealth, maxHealth), 0);
};

export function handWinner(
  playerHand: CardType[],
  daimonHand: CardType[]
): "player" | "daimon" | "push" {
  const { isBlackjack: playerBlackjack, isBust: playerBust, sum: playerSum }   = cardTotal(playerHand);
  const { isBlackjack: daimonBlackjack, isBust: daimonBust, sum: daimonSum }   = cardTotal(daimonHand);

  if (playerBlackjack || daimonBlackjack) {
    if (playerBlackjack && daimonBlackjack) return "push";
    return playerBlackjack ? "player" : "daimon";
  }

  if (playerBust || daimonBust) {
    if (playerBust && daimonBust) return "daimon";  // house wins ties on double‐bust
    return playerBust ? "daimon" : "player";
  }
  
  if (playerSum === daimonSum) return "push";
  return playerSum > daimonSum ? "player" : "daimon";
}