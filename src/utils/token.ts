import type { GameStateType } from "../composables/useGameState";
import { calculateHealth } from "./utils";

export interface TokenType {
  id: number;
  name: string;
  rune: string;
  description: string;
  effectDescription: string;
  gameState: (gs: GameStateType) => Partial<GameStateType> | void;
  effect: string;
};

export const tokens: TokenType[] = [{
  id: 0,
  name: "Red Tearstone Blessing",
  rune: "Θ",
  description: "An acknowledgement made - that the greatest reward can require great sacrifice.",
  effectDescription: "The house loses from their blood pool but the gambler's blood pool is reduced.",
  gameState: (gs: GameStateType) => {
    if (gs.phase === "intro-dialogue" && gs.hand === 0) {
      const playerMaxHealth = gs.playerMaxHealth * 0.4;
      return {
        playerHealth: calculateHealth(gs.playerHealth, playerMaxHealth),
        playerMaxHealth
    }};
    if (gs.phase === "player-turn") {
      return {
        daimonHealth: gs.daimonHealth - 0.4 * (gs.daimonMaxHealth -gs.daimonHealth),
        animations: {
          ...gs.animations,
          daimon: "injured"
        }
      }
    };
  },
  effect: "damage"
}]