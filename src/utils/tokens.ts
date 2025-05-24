import type { GameStateType } from "../composables/useGameState";

export interface TokenType {
  id: number;
  name: string;
  rune: string;
  description: string;
  effectDescription: string;
  gameState: {};
  effect: string;
};

export const tokens: TokenType[] = [{
  id: 0,
  name: "Red Tearstone Blessing",
  rune: "Θ",
  description: `"When tyche smiles upon you, you have to go all in". 
    Tyche rewards those who play the odd, risk it all and you may be greatly rewarded.`,
  effectDescription: "The house loses from their blood pool every hand but the gambler's blood pool is capped.",
  gameState: {
    playerMaxHealth: 1000,
    daimonHealth: (gs: GameStateType) => 0.15 * (gs.daimonHealth - (gs.daimonHealth - gs.daimonMaxHealth))
  },
  effect: "damage"
},]