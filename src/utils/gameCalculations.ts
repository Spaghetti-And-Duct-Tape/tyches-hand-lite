export function calculateWager(handsPlayed: number, playerHealth: number) {
  //Minimum wager for hands less than 4
  let minimumWager = 500;

  if (handsPlayed < 4) return minimumWager;

  //Scales from hand 5 to 15
  const scaling = Math.min(handsPlayed, 15)

  const totalWager = minimumWager + (scaling - 4) * 409;

  //A minimum of 500 must be wagered
  const maxWager = Math.max(playerHealth - 1, minimumWager);
  //Prevents wager from going over player health
  return Math.min(maxWager, totalWager);
};

export function calculateDaimonHealth(round: number): number {
  const baseDaimonHealth: number = 2500;
  const scalingFactor: number = 1.155;
  
  if (round <= 0) return 2500;
  return Math.round(baseDaimonHealth * (scalingFactor ** (round)));
}