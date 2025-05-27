import type { GameStateType } from "../composables/useGameState";
import { cardTotal } from "../utils/utils";
import { daimonDailogue1 } from "./daimon1";
import { daimonDialogue2 } from "./daimon2";
import { daimonDailogue3 } from "./daimon3";
import { daimonDailogue4 } from "./daimon4";
import { daimonDialogue5 } from "./daimon5";
import { daimonDialogue6 } from "./daimon6";

let healthDialogueTrigger = true;

type dialougeType = {
  [key: string | number]: string[]
}

export type daimonDialogueType = {
  "intro-dialogue"?: string[];
  "hand-dialogue"?: dialougeType;
  "end-dialogue"?: string[];
  "player-health"?: dialougeType;
};

interface Daimon {
  id: number;
  name: string;
  rune: string;
  effect: (gs: GameStateType) => { [key: keyof GameStateType]: GameStateType };
  dialogue: daimonDialogueType;
}

export const daimons: Daimon[] = [{
  id: 0,
  name: "The Draw",
  rune: "",
  effect: () => null,
  dialogue: daimonDailogue1
}, {
  id: 1,
  name: "The Thrill",
  rune: "α",
  effect: (gs: GameStateType): GameStateType => {
    if (gs.phase === "daimon-turn") {
      const daimonTotal = cardTotal(gs.daimonHand);
      const playerTotal = cardTotal(gs.playerHand);
      
      if (!daimonTotal.isBust && !playerTotal.isBust) {
        if (playerTotal.sum > daimonTotal.sum) {
          return {
            daimonHand: [...gs.daimonHand, gs.deck[0]],
            deck: gs.deck.slice(1),
          }
        }
      }
    }
  },
  dialogue: daimonDialogue2
}, {
  id: 2,
  name: "The Wall",
  rune: "λ",
  effect: (gs:GameStateType): GameStateType => {
    if (gs.phase === "wager" && gs.hand === 0) {
      return { 
        daimonHealth: gs.daimonHealth * 2,
        daimonMaxHealth: gs.daimonHealth * 2 
      }
    };
  },
  dialogue: daimonDailogue3
}, {
  id: 3,
  name: "The Resolve",
  rune: "Ψ",
  effect: (gs: GameStateType): GameStateType => {
    if (gs.phase === "daimon-turn") {
      return {
        daimonHealth: gs.daimonHealth + 150,
        daimonMaxHealth: gs.daimonMaxHealth + 75,
        animations: {
          ...gs.animations,
          daimon: "healed"
        }
      }
    }
  },
  dialogue: daimonDailogue4
}, {
  id: 4,
  name: "The Abyss",
  rune: "Θ",
  effect: (gs: GameStateType): GameStateType => {
    if (gs.phase === "daimon-turn") {
      return { playerHealth: gs.playerHealth - 100 }
    }
  },
  dialogue: daimonDialogue5
},  {
  id: 5,
  name: "The Choice",
  rune: "δ",
  effect: (gs: GameStateType): GameStateType => {
    if (gs.phase === "daimon-turn") {
      const randNum = Math.floor(Math.random() * 6);
      let randAbility = daimons[randNum];

      switch (randNum) {
        case 0:
        case 2:
        case 3:
          randAbility = daimons[3];
          break;
        case 1:
          randAbility = daimons[1];
          break;
        case 4:
        case 5:
          randAbility = daimons[4]
      }

      const effect = randAbility.effect(gs);

      return effect
    }
  },
  dialogue: daimonDialogue6
}]

export function handleDialogue(gs: GameStateType) {
  const { phase, daimon, hand } = gs;
  const daimonDialogue = daimons[daimon]?.dialogue;
  let finalDialogue: string[] | undefined;

  if (phase === "intro-dialogue") {
    healthDialogueTrigger = true;
    finalDialogue = daimonDialogue["intro-dialogue"];
  }
  if (phase === "hand-dialogue") finalDialogue = daimonDialogue["hand-dialogue"]?.[hand];
  if (phase === "end-dialogue") finalDialogue = daimonDialogue["end-dialogue"];
  
  return finalDialogue;
};