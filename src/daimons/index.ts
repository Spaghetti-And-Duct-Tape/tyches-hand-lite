import { daimonDailogue1 } from "./daimon1";
import { daimonDialogue2 } from "./daimon2";

export type dialogueType = {
  introDialogue?: { [handIndex: number]: string[] };
  handDialogue?: { [handIndex: number]: string[] };
  endDialogue?: { [handIndex: number]: string[] };
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