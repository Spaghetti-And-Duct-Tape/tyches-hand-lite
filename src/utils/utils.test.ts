import { describe, expect, it } from "vitest";
import { calculateDaimonHealth, calculateHealth } from "./utils";

describe("Adjust health correctly", () => {
  describe("calculateHealth", () => {
    it("return 0", () => {
      expect(calculateHealth(500, 5000, -500)).toBe(0)
    })

    it ("return 5000", () => {
      expect(calculateHealth(5000, 5000, 500)).toBe(5000)
    })

    it ("return 4500", () => {
      expect(calculateHealth(5000, 5000, -500)).toBe(4500)
    })

    it ("return 5000", () => {
      expect(calculateHealth(4500, 5000, 500)).toBe(5000)
    })

    it ("return 5000", () => {
      expect(calculateHealth(5200, 5000, 0)).toBe(5000)
    })
    
    it ("return 2500", () => {
      expect(calculateHealth(2000, 2500, 3000)).toBe(2500)
    })
  })
});

describe("Returns daimon health based on round", () => {
  describe("calculateDaimonHealth", () => {
    it("returns 2500", () => {
      expect(calculateDaimonHealth(0)).toBe(2500)
    })

    it("returns 2888", () => {
      expect(calculateDaimonHealth(1)).toBe(2888)
    })

    
    it("returns 3335", () => {
      expect(calculateDaimonHealth(2)).toBe(3335)
    })

    it("returns 3852", () => {
      expect(calculateDaimonHealth(3)).toBe(3852)
    })

    it("returns 4449", () => {
      expect(calculateDaimonHealth(4)).toBe(4449)
    })

    it("returns 5139", () => {
      expect(calculateDaimonHealth(5)).toBe(5139)
    })

    it("returns 10562", () => {
      expect(calculateDaimonHealth(10)).toBe(10562)
    })

    it("returns 44625", () => {
      expect(calculateDaimonHealth(20)).toBe(44625)
    })

    it("returns 188538", () => {
      expect(calculateDaimonHealth(30)).toBe(188538)
    })
  })
});