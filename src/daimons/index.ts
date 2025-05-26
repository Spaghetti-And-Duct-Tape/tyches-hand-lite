import type { GameStateType } from "../composables/useGameState";
import { cardTotal } from "../utils/utils";
import { daimonDailogue1 } from "./daimon1";

type dialougeType = {
  [key: string | number]: string[]
}

export type daimonDialogueType = {
  "intro-dialogue"?: dialougeType;
  "hand-dialogue"?: dialougeType;
  "end-dialogue"?: dialougeType;
};

interface Daimon {
  id: number;
  name: string;
  rune: string;
  effect: (gs: GameStateType) => { [key: keyof GameStateType]: GameStateType };
  dialogue: daimonDialogueType;
}

export const daimons: Daimon[] = [{
  id: 1,
  name: "The Draw",
  rune: "",
  effect: () => null,
  dialogue: daimonDailogue1
}, {
  id: 2,
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
  dialogue: {}
}, {
  id: 3,
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
  dialogue: {}
}, {
  id: 4,
  name: "The Resolve",
  rune: "Ψ",
  effect: (gs: GameStateType): GameStateType => {
    if (gs.phase === "daimon-turn") {
      return {
        daimonHealth: gs.daimonHealth + 50,
        daimonMaxHealth: gs.daimonMaxHealth + 100,
        animations: {
          ...gs.animations,
          daimon: "healed"
        }
      }
    }
  },
  dialogue: {}
}, {
  id: 5,
  name: "The Descent",
  rune: "Θ",
  effect: (gs: GameStateType): GameStateType => {
    if (gs.phase === "daimon-turn") {
      return { playerHealth: gs.playerHealth - 100 }
    }
  },
  dialogue: {}
},  {
  id: 6,
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

      console.log(effect)

      return effect
    }
  },
  dialogue: {}
}]