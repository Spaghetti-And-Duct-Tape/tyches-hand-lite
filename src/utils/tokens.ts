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
  description: "An acknowledgement made - that the greatest reward can require great sacrifice.",
  effectDescription: "The house loses from their blood pool but the gambler's blood pool is reduced.",
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
  description: "The light of the twin stars eluminate a new path. A blessing for those with a stubborn heart.",
  effectDescription: "Grants the freedom to double-down in all situations.",
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
  description: "To accept this blessing is to admit your desperatation - as the sins of the past seem to bubble to the top.",
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
     
      return { deck: deck }
    }
  },
  effect: "utility" 
}, {
  id: 4,
  name: "Styxian's Blessing ",
  rune: "ζ",
  description: "An oath crafted in the waters of Styx. A promise to heal any past wrongs at the cost of an unwavering heart.",
  effectDescription: "The gambler is able to hold greater blood pools but is incappable of surrendering.",
  gameState: (gs: GameStateType) => {
    if (gs.phase === "player-turn") {
      return {
        playerHealth: gs.playerHealth + 10,
        playerMaxHealth: gs.playerMaxHealth + 25
      }
    }
  },
  effect: "damage" 
}, {
  id: 5,
  name: "Nadir's Blessing",
  rune: "η",
  description: "A hand reaches to those who are humble and lowly helping them rise to their truest potential.",
  effectDescription: "See more LOW cards at the top of the deck.",
  gameState: (gs: GameStateType) => {
    if (gs.phase === "intro-dialogue") {
      const rankWeights = (rank: number) => {
        if (rank < 7) return 4;
        if (rank >= 7 && rank < 10) return 2;
        else return 1; 
      };
      const weights = calculateCardWeights(gs.deck, { rankWeights: rankWeights });

      const deck = randomCardPicker(gs.deck, weights, 52)
      
      return { deck: deck }
    }
  },
  effect: "utility" 
}, {
  id: 6,
  name: "Zenith's Blessing",
  rune: "Z",
  description: "Tyche calls from the highest summit, offering her blessing to those that dare reach higher.",
  effectDescription: "See more HIGH cards at the top of the deck.",
  gameState: (gs: GameStateType) => {
    if (gs.phase === "intro-dialogue") {
      const rankWeights = (rank: number) => {
        if (rank > 9) return 4;
        if (rank <= 9 && rank > 6) return 2;
        else return 1; 
      };
      const weights = calculateCardWeights(gs.deck, { rankWeights: rankWeights });

      const deck = randomCardPicker(gs.deck, weights, 52)
    
      return { deck: deck }
    }
  },
  effect: "utility" 
},]