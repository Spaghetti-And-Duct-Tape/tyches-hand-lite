export function revealSchema(round: number) {
  switch(round) {
    case 0: 
      return {
        dialogueBox: 0,
        daimon: 1,
        table: 2,
        healthBars: 999
      }
    case 1:
    case 2:
    case 3:
    case 4:
      return {
        dialogueBox: 0,
        daimon: 1,
        table: 1,
        healthBars: 1
      }
    case 5:
      return {
        dialogueBox: 0,
        daimon: 4,
        table: 5,
        healthBars: 5
      }
  };
};