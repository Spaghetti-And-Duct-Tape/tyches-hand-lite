import type { GameStateType } from "../composables/useGameState";
import { daimonDailogue1 } from "./daimon1";
import { daimonDialogue2 } from "./daimon2";

export type dialogueType = {
  "intro-dialogue"?: { [handIndex: number]: string[] };
  "hand-dialogue"?: { [handIndex: number]: string[] };
  "end-dialogue"?: { [handIndex: number]: string[] };
}

interface Daimons {
  [key: number]: {
    id: number;
    dialogue: dialogueType;
  }
}

export const daimons: Daimons = {
  1: {
    id: 1,
    dialogue: daimonDailogue1,
  },
  2: {
    id: 2,
    dialogue: daimonDialogue2,
  }
};

export function conditionalDialogue(gameState: GameStateType): string[] | undefined {
  const { playerHealth, handCount } = gameState;
  if (playerHealth < 1000) return ["A child, slept restlessly wondering if today they'd see their parent."];
  if (playerHealth < 1500) return ["A worried spouse, abandoned for days. Little did they know...they'd be homeless soon."];
  if (handCount === 6) return ["Tyche grows weary of this match...she demands a greater offering."]
  return undefined;
};