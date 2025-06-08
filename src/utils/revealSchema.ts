export function revealSchema(round: number) {
  switch(round) {
    case 0:
      return {
        dialogueBox: 0,
        daimon: 1,
        table: 2,
        healthBars: 999
      };
    case 5:
      return {
        dialogueBox: 0,
        daimon: 5,
        table: 1,
        healthBars: 1
      }
    default:
      return {
        dialogueBox: 0,
        daimon: 1,
        table: 1,
        healthBars: 1
      };
  }
};