// Material types and their configurations
export const MATERIAL_TYPES = {
  ore: { name: "Ore", refined: "Bars", icon: "⚒️" },
  hide: { name: "Hide", refined: "Leather", icon: "🛡️" },
  fiber: { name: "Fiber", refined: "Cloth", icon: "🧵" },
  wood: { name: "Wood", refined: "Planks", icon: "🪵" },
  stone: { name: "Stone", refined: "Blocks", icon: "🗿" },
} as const;

export type MaterialType = keyof typeof MATERIAL_TYPES;

// Tier configurations with material requirements
export const TIER_REQUIREMENTS = {
  2: { refined: 0, raw: 2 },
  3: { refined: 1, raw: 2 }, // T2 + 2 T3
  4: { refined: 1, raw: 2 }, // T3 + 2 T4
  5: { refined: 1, raw: 3 }, // T4 + 3 T5
  6: { refined: 1, raw: 4 }, // T5 + 4 T6
  7: { refined: 1, raw: 5 }, // T6 + 5 T7
  8: { refined: 1, raw: 6 }, // T7 + 6 T8
} as const;

export type Tier = keyof typeof TIER_REQUIREMENTS;

// City bonuses for different materials
export const CITY_BONUSES = {
  martlock: { material: "hide", bonus: 36.7 },
  bridgewatch: { material: "stone", bonus: 36.7 },
  lymhurst: { material: "fiber", bonus: 36.7 },
  sterling: { material: "wood", bonus: 36.7 },
  thetford: { material: "ore", bonus: 36.7 },
  caerleon: { material: "all", bonus: 15.2 },
} as const;

// Default return rates for REFINING
export const RETURN_RATES = {
  bonusCity: 36.7, // Normal bonus city rate
  bonusCityWithRefiningDay: 46.7, // Bonus city + refining day
  nonBonusCity: 15.2,
} as const;

// Return rates for CRAFTING (different from refining)
export const CRAFTING_RETURN_RATES = {
  bonusCity: 24.8, // Royal city bonus for crafting
  bonusCityWithRefiningDay: 34.8, // Royal city + refining day for crafting (24.8% + 10%)
  nonBonusCity: 15.2, // Normal crafting without royal city bonus
} as const;

// Base focus costs per tier (for refining 1 unit without mastery/spec)
export const BASE_FOCUS_COSTS = {
  2: 0,
  3: 0,
  4: 74,
  5: 148,
  6: 296,
  7: 592,
  8: 1184,
} as const;

// Calculate total return rate
export const calculateReturnRate = (
  baseReturnRate: number,
  useFocus: boolean
): number => {
  if (useFocus) {
    if (baseReturnRate >= 46.7) return 57.9; // Bonus city + Refining Day
    if (baseReturnRate >= 36.7) return 53.9; // Bonus city
    if (baseReturnRate >= 25.2) return 53.5; // Non-bonus city + Refining Day
    return 43.5; // Non-bonus city
  }
  return baseReturnRate;
};

/**
 * Calculate the actual focus cost using exponential reduction formula.
 * E = (Mastery * 30) + (TierSpec * 250) + (OtherSpecsTotal * 100)
 * Cost = BaseCost * 0.5 ^ (E / 10000)
 */
export const calculateFocusCost = (
  tier: Tier,
  masteryLevel: number,
  tierSpecLevel: number,
  otherSpecsTotal: number
): number => {
  if (tier < 4) return 0;
  
  const baseCost = BASE_FOCUS_COSTS[tier as keyof typeof BASE_FOCUS_COSTS] || 0;
  if (baseCost === 0) return 0;

  const totalEfficiency = (masteryLevel * 30) + (tierSpecLevel * 250) + (otherSpecsTotal * 100);
  const cost = baseCost * Math.pow(0.5, totalEfficiency / 10000);
  
  return Math.max(1, Math.floor(cost));
};

// Material names by tier
export const MATERIAL_NAMES = {
  ore: {
    2: "Copper Ore",
    3: "Tin Ore",
    4: "Iron Ore",
    5: "Titanium Ore",
    6: "Adamantium Ore",
    7: "Meteorite Ore",
    8: "Orichalcum Ore",
  },
  hide: {
    2: "Rugged Hide",
    3: "Thin Hide",
    4: "Medium Hide",
    5: "Heavy Hide",
    6: "Robust Hide",
    7: "Thick Hide",
    8: "Resilient Hide",
  },
  fiber: {
    2: "Cotton",
    3: "Flax",
    4: "Hemp",
    5: "Skyflower",
    6: "Amberleaf",
    7: "Sunflax",
    8: "Ghost Hemp",
  },
  wood: {
    2: "Birch Logs",
    3: "Chestnut Logs",
    4: "Pine Logs",
    5: "Cedar Logs",
    6: "Bloodoak Logs",
    7: "Ashenbark Logs",
    8: "Whitewood Logs",
  },
  stone: {
    2: "Limestone",
    3: "Sandstone",
    4: "Travertine",
    5: "Granite",
    6: "Slate",
    7: "Basalt",
    8: "Marble",
  },
};

export const REFINED_NAMES = {
  ore: {
    2: "Copper Bar",
    3: "Tin Bar",
    4: "Iron Bar",
    5: "Titanium Bar",
    6: "Adamantium Bar",
    7: "Meteorite Bar",
    8: "Orichalcum Bar",
  },
  hide: {
    2: "Stiff Leather",
    3: "Thick Leather",
    4: "Worked Leather",
    5: "Cured Leather",
    6: "Hardened Leather",
    7: "Reinforced Leather",
    8: "Fortified Leather",
  },
  fiber: {
    2: "Simple Cloth",
    3: "Neat Cloth",
    4: "Fine Cloth",
    5: "Ornate Cloth",
    6: "Lavish Cloth",
    7: "Opulent Cloth",
    8: "Ethereal Cloth",
  },
  wood: {
    2: "Birch Planks",
    3: "Chestnut Planks",
    4: "Pine Planks",
    5: "Cedar Planks",
    6: "Bloodoak Planks",
    7: "Ashenbark Planks",
    8: "Whitewood Planks",
  },
  stone: {
    2: "Limestone Block",
    3: "Sandstone Block",
    4: "Travertine Block",
    5: "Granite Block",
    6: "Slate Block",
    7: "Basalt Block",
    8: "Marble Block",
  },
};
