import type { GameStateType, PhaseType } from "../composables/useGameState";
import { cardTotal } from "../utils/cards";
import { daimonDailogue1 } from "./daimon1";
import { daimonDialogue2 } from "./daimon2";
import { daimonDailogue3 } from "./daimon3";
import { daimonDailogue4 } from "./daimon4";
import { daimonDialogue5 } from "./daimon5";
import { daimonDialogue6 } from "./daimon6";

export type dialogueType = {
  [key: string | number]: string[];
};

export type daimonDialogueType = {
  "intro-dialogue"?: string[];
  "hand-dialogue"?: dialogueType;
  "end-dialogue"?: string[];
};

interface DaimonType {
  id: number;
  name: string;
  rune: string;
  effect: (gs: GameStateType) => Partial<GameStateType> | undefined;
  effectType: string | null;
  dialogue: daimonDialogueType;
};

export const daimons: DaimonType[] = [{
  id: 0,
  name: "The Draw",
  rune: "",
  effect: () => undefined,
  effectType: null,
  dialogue: daimonDailogue1
}, {
  id: 1,
  name: "The Thrill",
  rune: "α",
  effect: (gs: GameStateType): Partial<GameStateType> | undefined => {
    if (gs.phase === "apply-daimon-effect") {
      const daimonTotal = cardTotal(gs.daimonHand);
      const playerTotal = cardTotal(gs.playerHand);
      
      if (!daimonTotal.isBust && !playerTotal.isBust) {
        if (playerTotal.sum > daimonTotal.sum) {
          return {
            daimonHand: [...gs.daimonHand, gs.deck[gs.deck.length - 1]],
            deck: gs.deck.slice(0, -1),
          }
        }
      }
    }
  },
  effectType: "utility",
  dialogue: daimonDialogue2
}, {
  id: 2,
  name: "The Wall",
  rune: "λ",
  effect: (gs:GameStateType): Partial<GameStateType> | undefined => {
    if (gs.phase === "wager" && gs.hand === 0) {
      return { 
        daimonHealth: gs.daimonHealth * 2,
        daimonMaxHealth: gs.daimonHealth * 2,
        animations: {
          ...gs.animations,
          daimon: "healed"
        }
      }
    };
  },
  effectType: "healing",
  dialogue: daimonDailogue3
}, {
  id: 3,
  name: "The Resolve",
  rune: "Ψ",
  effect: (gs: GameStateType): Partial<GameStateType> | undefined => {
    if (gs.phase === "apply-daimon-effect") {
      return {
        daimonHealth: gs.daimonHealth + 250,
        daimonMaxHealth: gs.daimonMaxHealth + 150,
        animations: {
          ...gs.animations,
          daimon: "healed"
        }
      }
    }
  },
  effectType: "healing",
  dialogue: daimonDailogue4
}, {
  id: 4,
  name: "The Abyss",
  rune: "Θ",
  effect: (gs: GameStateType): Partial<GameStateType> | undefined => {
    if (gs.phase === "apply-daimon-effect") {
      return { 
        playerHealth: gs.playerHealth - 150 ,
        animations: {
          ...gs.animations,
          player: "injured"
        }
      }
    }
  },
  effectType: "injuring",
  dialogue: daimonDialogue5
},  {
  id: 5,
  name: "The Choice",
  rune: "δ",
  effect: (gs: GameStateType): Partial<GameStateType> | undefined => {
    if (gs.phase === "wager" && gs.hand === 0) {
      return { 
        daimonHealth: gs.daimonHealth * 2,
        daimonMaxHealth: gs.daimonHealth * 2,
        animations: {
          ...gs.animations,
          daimon: "healed"
        }
      }
    };
    if (gs.phase === "apply-daimon-effect") {
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
  effectType: null,
  dialogue: daimonDialogue6
}];

export function handleDialogue({
  phase,
  daimon,
  hand
}: {
  phase: PhaseType;
  daimon: number;
  hand: number;
}) {
  const daimonDialogue = daimons[daimon]?.dialogue;

  const phaseDialogue = daimonDialogue?.[phase as keyof daimonDialogueType];

  if (Array.isArray(phaseDialogue)) {
    return phaseDialogue;
  };

  return phaseDialogue?.[hand];
};