import type { GameStateType } from "../composables/useGameState";
import { calculateCardWeights, randomCardPicker } from "./cards";

export interface TokenType {
  id: number;
  name: string;
  rune: string;
  description: string;
  effectDescription: string;
  gameState: (gs: GameStateType) => { [key: keyof GameStateType]: GameStateType };
  effect: string;
};

export const tokens: TokenType[] = [{
  id: 0,
  name: "Red Tearstone Blessing",
  rune: "Θ",
  description: "Tyche reaches her hand out, but are you willing to accept it? Her scale demands a great risk but can provide a great reward.",
  effectDescription: "The house loses from their blood pool every hand but the gambler's blood pool is capped.",
  gameState: (gs: GameStateType): GameStateType => {
    if (gs.phase === "intro-dialogue" && gs.hand === 0) {
      const playerMax = gs.playerMaxHealth * 0.4;
      return { 
        playerHealth: gs.playerHealth > playerMax ? playerMax : gs.playerHealth, 
        playerMaxHealth: playerMax 
      }
    };
    if (gs.phase === "player-turn") {
      return { 
        daimonHealth: gs.daimonHealth - 0.4 * (gs.daimonMaxHealth - gs.daimonHealth),
        animations: {
          ...gs.animations,
          daimon: "injured"
        }
      }
    }
  },
  effect: "damage"
}, {
  id: 1,
  name: "Gemini's Blessing",
  rune: "Π",
  description: "A blessing forged in the fires of twin stars. Only granted to those with a truly stubborn heart.",
  effectDescription: "The gambler is able to double down no matter what situation",
  gameState: (gs: GameStateType) => {
    if (gs.phase === "player-turn") {
      if (gs.playerHand.length > 2) return { playerActions: [] }
    }
  },
  effect: "utility" 
}, {
  id: 2,
  name: "Bloodletter's Blessing",
  rune: "β",
  description: "A wager made only by the desperate, whose bloodied hands shuffle through their deck.",
  effectDescription: "See more BLOODSTAINED cards at the top of the deck.",
  gameState: (gs: GameStateType) => {
    if (gs.phase === "intro-dialogue") {
      const rankWeights = (rank: number) => rank >= 10 ? 6 / gs.round : 1;
      const effectWeights = (effect: string) => effect === "Bloodstained" ? 4 : 1; 
      const weights = calculateCardWeights(gs.deck, {
        rankWeights: rankWeights, effectWeights: effectWeights
      });

      const deck = randomCardPicker(gs.deck, weights, 52)
      return { deck: deck }
    }
  },
  effect: "utility" 
}, {
  id: 3,
  name: "Arsenist's Blessing",
  rune: "Φ",
  description: "A blessing for those that recognize, sometimes for the new to grow the old must burn.",
  effectDescription: "See more CHARRED cards at the top of the deck.",
  gameState: (gs: GameStateType) => {
    if (gs.phase === "intro-dialogue") {
      const rankWeights = (rank: number) => rank >= 10 ? 6 / gs.round : 1;
      const effectWeights = (effect: string) => effect === "Charred" ? 4 : 1; 
      const weights = calculateCardWeights(gs.deck, {
        rankWeights: rankWeights, effectWeights: effectWeights
      });

      const deck = randomCardPicker(gs.deck, weights, 52)
      console.log(deck)
      return { deck: deck }
    }
  },
  effect: "utility" 
}, {
  id: 4,
  name: "Crow Mask Blessing",
  rune: "ζ",
  description: "A recognition that sometimes for the new to grow the old must burn.",
  effectDescription: "See more CHARRED cards at the top of the deck.",
  gameState: (gs: GameStateType) => {
    if (gs.phase === "player-turn") {
      return {
        playerHealth: gs.playerHealth + 10,
        playerMaxHealth: gs.playerMaxHealth + 50
      }
    }
  },
  effect: "damage" 
}]