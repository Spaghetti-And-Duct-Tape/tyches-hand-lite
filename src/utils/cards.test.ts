import { describe, expect, it } from "vitest";
import { calculateCardWeights, cardInventory, cardTotal, convertRank, randomCardPicker, shuffleCards, tutorialDeck, type CardType, type EffectType, type RankType, type SuitType } from "./cards";

describe("Returns all available cards", () => {
  describe("cardInventory", () => {
    it ("returns 156", () => {
      expect(cardInventory.length).toBe(156)
    })

    it ("returns the first card Charred Ace of Hearts", () => {
      expect(cardInventory[0]).toEqual({
        id: 0,
        name: "A Charred Ace of Hearts",
        rank: "Ace",
        suit: "Hearts",
        description: "The embers on these cards still cauterize wounds.",
        effect: "Charred",
        effectDescription: "The gambler's blood pool is slightly replenished at the end of the hand.",
        value: 250,
        flipped: false
      })
    })

    it ("returns the last card Standard Ace of Hearts", () => {
      expect(cardInventory[155]).toEqual({
        id: 155,
        name: "A Standard King of Spades",
        rank: "King",
        suit: "Spades",
        description: "A plain set of cards.",
        effect: "Standard",
        effectDescription: "No effect.",
        value: 217,
        flipped: false
      })
    })
  })
});

describe("Returns card weights", () => {
  describe("calculate card weights", () => {
    const CharredAceOfHearts = [cardInventory[0]];
    const CharredAceOfSpades = cardInventory[39];
    const CharredTwoOfSpades = cardInventory[40];
    const CharredTwoOfHearts = cardInventory[1];
    const BloodstainedAceOfHearts = cardInventory[52];
    const BloodstainedTwoOfHearts = cardInventory[53];
    const BloodstainedAceOfSpades = cardInventory[91];
    const BloodstainedTwoOfSpades = cardInventory[92];
    const StandardKingOfHearts = cardInventory[155];

    it ("returns [1]", () => {
      expect(calculateCardWeights(CharredAceOfHearts)).toStrictEqual([1])
    })

    it ("returns [2]", () => {
      const rankWeights = (rank: RankType) => rank === 15 ? 2 : 1;
      
      expect(calculateCardWeights(CharredAceOfHearts, {
        rankWeights: rankWeights
      })).toStrictEqual([2])
    })

    it ("returns [1]", () => {
      const rankWeights = (rank: RankType) => rank !== 15 ? 2 : 1;
      
      expect(calculateCardWeights(CharredAceOfHearts, {
        rankWeights: rankWeights
      })).toStrictEqual([1])
    })

    
    it ("returns [2]", () => {
      const effectWeights = (effect: EffectType) => effect === "Charred" ? 2 : 1;
      
      expect(calculateCardWeights(CharredAceOfHearts, {
        effectWeights: effectWeights
      })).toStrictEqual([2])
    })

    it ("returns [1]", () => {
      const effectWeights = (effect: EffectType) => effect !== "Charred" ? 2 : 1;
      
      expect(calculateCardWeights(CharredAceOfHearts, {
        effectWeights: effectWeights
      })).toStrictEqual([1])
    })

    it ("returns [2]", () => {
      const suitWeights = (suit: SuitType) => suit === "Hearts" ? 2 : 1;
      
      expect(calculateCardWeights(CharredAceOfHearts, {
        suitWeights: suitWeights
      })).toStrictEqual([2])
    })

    it ("returns [1]", () => {
      const suitWeights = (suit: SuitType) => suit !== "Hearts" ? 2 : 1;
      
      expect(calculateCardWeights(CharredAceOfHearts, {
        suitWeights: suitWeights
      })).toStrictEqual([1])
    })

    it ("returns an array of weights", () => {
      const cards: CardType[] = [
        CharredAceOfHearts[0],
        CharredAceOfSpades, 
        CharredTwoOfHearts,
        BloodstainedAceOfHearts,
        CharredTwoOfSpades, 
        BloodstainedTwoOfHearts,
        BloodstainedAceOfSpades,
        BloodstainedTwoOfSpades,
        StandardKingOfHearts];
      const rankWeights = (rank: RankType) => rank === 15 ? 2 : 1;
      const effectWeights = (effect: EffectType) => effect === "Charred" ? 2 : 1;
      const suitWeights = (suit: SuitType) => suit === "Hearts" ? 2 : 1 ;
      
      expect(calculateCardWeights(cards, {
        rankWeights: rankWeights,
        effectWeights: effectWeights,
        suitWeights: suitWeights
      })).toStrictEqual([8, 4, 4, 4, 2, 2, 2, 1, 1])
    })
  })
});

describe("Returns a set of random cards", () => {
  describe("randomCardPicker", () => {
      const rankWeights = (rank: RankType) => rank === 15 ? 100 : -1;
      const effectWeights = (effect: EffectType) => effect === "Charred" ? 100 : -1;
      const suitWeights = (suit: SuitType) => suit === "Hearts" ? 100 : -1 ;
      
      const cardWeights = calculateCardWeights(
        cardInventory, 
        { rankWeights: rankWeights,
          effectWeights: effectWeights,
          suitWeights: suitWeights
      });
      const randomCards = randomCardPicker(cardInventory, cardWeights);

    it ("returns 5 cards", () => {
      expect(randomCards.length).toBe(5)
    })

    it ("returns A Charred Ace of Hearts as the 0th index", () => {
      expect(randomCards[0]).toEqual({
        id: 0,
        name: "A Charred Ace of Hearts",
        rank: "Ace",
        suit: "Hearts",
        description: "The embers on these cards still cauterize wounds.",
        effect: "Charred",
        effectDescription: "The gambler's blood pool is slightly replenished at the end of the hand.",
        value: 250,
        flipped: false
      })
    })
  })
});

describe("Returns a shuffled deck of cards", () => {
  const countHighCards = (cards: CardType[]) => 
    cards.filter(card => convertRank(card.rank) >= 10).length; 

  describe("shuffleCards", () => {
    it ("returns 52 cards", () => {
      expect(shuffleCards(tutorialDeck, 0).length).toBe(52);
    })

    it ("returns the tutorial deck in round 0", () => {
      expect(shuffleCards(tutorialDeck, 0)).toEqual([...tutorialDeck]);
    })

    it ("returns 52 random cards in round 1", () => {
      expect(shuffleCards(tutorialDeck, 1).length).toBe(52);
    })


    it("returns more high cards in round 1 than in round 5", () => {
      const iterations = 100;
      let highRound1 = 0;
      let highRound5 = 0;

      for (let i = 0; i < iterations; i++) {
        const shuffled1 = shuffleCards(cardInventory, 1);
        const shuffled5 = shuffleCards(cardInventory, 5);

        highRound1 += countHighCards(shuffled1);
        highRound5 += countHighCards(shuffled5);
      };

      const avg1 = highRound1 / iterations;
      const avg5 = highRound5 / iterations;

      expect(avg1).toBeGreaterThan(avg5)
    })
  })
});

describe("Returns the card total", () => {
      const CharredAceOfHearts = [cardInventory[0]];
      const CharredAceOfSpades = cardInventory[39];
      const CharredTwoOfSpades = cardInventory[40];
      const CharredTwoOfHearts = cardInventory[1];
      const BloodstainedAceOfHearts = cardInventory[52];
      const BloodstainedTwoOfHearts = cardInventory[53];
      const BloodstainedAceOfSpades = cardInventory[91];
      const BloodstainedTwoOfSpades = cardInventory[92];
      const StandardKingOfHearts = cardInventory[155];
      const StandardTenOfHearts = cardInventory[152];

  describe("cardTotal", () => {
    it ("returns the total sum of 21", () => {
      const blackjack = cardTotal([CharredAceOfHearts[0], StandardKingOfHearts]);

      expect(blackjack.sum).toBe(21);
      expect(blackjack.isBlackjack).toBe(true);
      expect(blackjack.isBust).toBe(false);
    });

    
    it ("returns the total sum of 21", () => {
      const twentyOne = cardTotal([StandardTenOfHearts, StandardKingOfHearts, CharredAceOfHearts[0]]);

      expect(twentyOne.sum).toBe(21);
      expect(twentyOne.isBlackjack).toBe(false);
      expect(twentyOne.isBust).toBe(false);
    });

    it ("returns the total sum of 22", () => {
      const bust = cardTotal([StandardTenOfHearts, StandardKingOfHearts, BloodstainedTwoOfHearts]);

      expect(bust.sum).toBe(22);
      expect(bust.isBlackjack).toBe(false);
      expect(bust.isBust).toBe(true);
    })

    it ("can calculate multiple aces", () => {
      const twoAces = cardTotal([BloodstainedAceOfHearts, BloodstainedAceOfSpades]);

      expect(twoAces.sum).toBe(12);
      expect(twoAces.isBlackjack).toBe(false);
      expect(twoAces.isBust).toBe(false);
    })

    it ("can calculate two aces and a ten", () => {
      const twelve = cardTotal([BloodstainedAceOfHearts, BloodstainedAceOfSpades, StandardKingOfHearts]);

      expect(twelve.sum).toBe(12);
      expect(twelve.isBlackjack).toBe(false);
      expect(twelve.isBust).toBe(false);
    })
  });
});