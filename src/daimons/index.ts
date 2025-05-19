import { daimonDailogue1 } from "./daimon1";

export type dialogueType = {
  intro: string[];
  hand?: { [handIndex: number]: string[] };
  end: string[];
}

interface Daimons {
  [key: number]: {
    id: number;
    name: string;
    rune: string | null;
    description: string;
    effectType: string | null;
    dialogue: dialogueType;
  }
}

export const daimons: Daimons = {
  1: {
    id: 1,
    name: "The Draw",
    rune: null,
    description: "",
    effectType: null,
    dialogue: daimonDailogue1,
  },
};