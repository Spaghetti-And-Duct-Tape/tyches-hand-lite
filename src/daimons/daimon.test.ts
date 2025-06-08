import { describe, expect, it } from "vitest";
import { daimons, handleDialogue } from ".";

describe ("Returns the current dialogue option", () => {
  describe("handleDialogue", () => {
    it ("returns the current intro dialogue for daimon 1", () => {
      expect(handleDialogue({
        phase: "intro-dialogue",
        daimon: 0,
        hand: 0,
      })).toEqual([
        "Ah...you're finally awake.", 
        "Quite brave of you to come here.", 
        "Come sit...join me at the table.", 
        "Have you forgotten how to play?", 
        "No matter, all you need is something to wager with.",
        "Mind you, money doesn't carry weight here, the stakes are a little higher."
      ])
    });

    it ("returns the current end dialogue for daimon 1", () => {
      expect(handleDialogue({
        phase: "end-dialogue",
        daimon: 0,
        hand: 0,
      })).toEqual([
        "You push the heavy doors - the casino welcoming your initiation.",
        "The clatter and chimes of success ring in your ear,",
        "The warm wash of the golden lights bathe your skin.",
        "A lone table and its empty chair appear to beckon you...",
        "It draws you in."
      ])
    });

    it ("returns undefined", () => {
      expect(handleDialogue({
        phase: "intro-dialogue",
        daimon: 7,
        hand: 0
      })).toBe(undefined)
    })
  });
});


describe ("Returns the effect of the current daimon", () => {
  describe("daimon 1 effect", () => {
    it ("returns null", () => {
      expect(daimons[0].effect()).toBe(null);
    })
  })
})