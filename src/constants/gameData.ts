// Material types and their configurations
export const MATERIAL_TYPES = {
  ore: { name: "Ore", refined: "Metal Bars", icon: "⚒️" },
  hide: { name: "Hide", refined: "Leather", icon: "🛡️" },
  fiber: { name: "Fiber", refined: "Cloth", icon: "🧵" },
  wood: { name: "Wood", refined: "Planks", icon: "🪵" },
  stone: { name: "Stone", refined: "Stone Blocks", icon: "🗿" },
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

// Default return rates
export const RETURN_RATES = {
  bonusCity: 36.7, // Normal bonus city rate
  bonusCityWithRefiningDay: 46.7, // Bonus city + refining day
  nonBonusCity: 15.2,
} as const;

// Focus costs per tier (at max specialization)
export const FOCUS_COSTS = {
  2: 10,
  3: 24,
  4: 3,
  5: 6,
  6: 10,
  7: 18,
  8: 31,
} as const;

// Mastery bonuses (additional return rate per 20 mastery levels)
export const MASTERY_BONUS_PER_20_LEVELS = 4.0; // 4% per 20 mastery levels

// Calculate mastery bonus
export const calculateMasteryBonus = (masteryLevel: number): number => {
  return Math.floor(masteryLevel / 20) * MASTERY_BONUS_PER_20_LEVELS;
};

// Calculate total return rate
export const calculateReturnRate = (
  baseReturnRate: number,
  masteryLevel: number,
  useFocus: boolean
): number => {
  const masteryBonus = calculateMasteryBonus(masteryLevel);
  const focusBonus = useFocus ? 15.3 : 0; // Approximate focus bonus
  return baseReturnRate + masteryBonus + focusBonus;
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
    3: "Bronze Bar",
    4: "Steel Bar",
    5: "Titanium Steel Bar",
    6: "Adamantium Steel Bar",
    7: "Meteorite Steel Bar",
    8: "Orichalcum Steel Bar",
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
