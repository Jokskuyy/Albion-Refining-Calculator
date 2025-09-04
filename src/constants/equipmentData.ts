// Equipment crafting data for Albion Online
import type { MaterialType, Tier } from "./gameData";

// Equipment categories
export const EQUIPMENT_CATEGORIES = {
  weapons: { name: "Weapons", icon: "⚔️" },
  armor: { name: "Armor", icon: "🛡️" },
  accessories: { name: "Accessories", icon: "💍" },
  tools: { name: "Tools", icon: "⚒️" },
  consumables: { name: "Consumables", icon: "🧪" },
} as const;

export type EquipmentCategory = keyof typeof EQUIPMENT_CATEGORIES;

// Equipment slot types
export const EQUIPMENT_SLOTS = {
  head: "Head",
  chest: "Chest", 
  shoes: "Shoes",
  mainhand: "Main Hand",
  offhand: "Off Hand",
  cape: "Cape",
  bag: "Bag",
  mount: "Mount",
  tool: "Tool",
  consumable: "Consumable",
} as const;

export type EquipmentSlot = keyof typeof EQUIPMENT_SLOTS;

// Equipment rarity/enchantment
export const EQUIPMENT_ENCHANTMENTS = {
  0: { name: "Normal", multiplier: 1, suffix: "" },
  1: { name: ".1", multiplier: 1, suffix: ".1" },
  2: { name: ".2", multiplier: 1, suffix: ".2" },
  3: { name: ".3", multiplier: 1, suffix: ".3" },
} as const;

export type EquipmentEnchantment = keyof typeof EQUIPMENT_ENCHANTMENTS;

// Equipment recipe interface
export interface EquipmentRecipe {
  id: string;
  name: string;
  category: EquipmentCategory;
  slot: EquipmentSlot;
  tier: Tier;
  materials: {
    [key in MaterialType]?: number; // Amount of refined material needed
  };
  craftingFee: number; // Base crafting fee
  returnRate: number; // Base return rate for materials
  focusCost?: number; // Focus cost if different from standard
}

// Cloth/Fiber Equipment Recipes
export const CLOTH_EQUIPMENT: Record<string, EquipmentRecipe> = {
  // Cloth Armor
  cloth_hood: {
    id: "cloth_hood",
    name: "Cloth Hood",
    category: "armor",
    slot: "head", 
    tier: 4,
    materials: { fiber: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  cloth_robe: {
    id: "cloth_robe", 
    name: "Cloth Robe",
    category: "armor",
    slot: "chest",
    tier: 4,
    materials: { fiber: 16 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  cloth_sandals: {
    id: "cloth_sandals",
    name: "Cloth Sandals", 
    category: "armor",
    slot: "shoes",
    tier: 4,
    materials: { fiber: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },

  // Magic Weapons (Fiber-based)
  fire_staff: {
    id: "fire_staff",
    name: "Fire Staff",
    category: "weapons",
    slot: "mainhand",
    tier: 4,
    materials: { fiber: 16, wood: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  holy_staff: {
    id: "holy_staff", 
    name: "Holy Staff",
    category: "weapons",
    slot: "mainhand",
    tier: 4,
    materials: { fiber: 16, wood: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  arcane_staff: {
    id: "arcane_staff",
    name: "Arcane Staff", 
    category: "weapons",
    slot: "mainhand",
    tier: 4,
    materials: { fiber: 16, wood: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  curse_staff: {
    id: "curse_staff",
    name: "Curse Staff",
    category: "weapons", 
    slot: "mainhand",
    tier: 4,
    materials: { fiber: 16, wood: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  nature_staff: {
    id: "nature_staff",
    name: "Nature Staff",
    category: "weapons",
    slot: "mainhand", 
    tier: 4,
    materials: { fiber: 16, wood: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  frost_staff: {
    id: "frost_staff",
    name: "Frost Staff",
    category: "weapons",
    slot: "mainhand",
    tier: 4, 
    materials: { fiber: 16, wood: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },

  // Orbs/Tomes (Off-hand)
  tome_of_spells: {
    id: "tome_of_spells",
    name: "Tome of Spells",
    category: "weapons",
    slot: "offhand",
    tier: 4,
    materials: { fiber: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  orb: {
    id: "orb",
    name: "Orb", 
    category: "weapons",
    slot: "offhand",
    tier: 4,
    materials: { fiber: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
};

// Leather/Hide Equipment Recipes  
export const LEATHER_EQUIPMENT: Record<string, EquipmentRecipe> = {
  // Leather Armor
  leather_hood: {
    id: "leather_hood",
    name: "Leather Hood",
    category: "armor", 
    slot: "head",
    tier: 4,
    materials: { hide: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  leather_jacket: {
    id: "leather_jacket",
    name: "Leather Jacket",
    category: "armor",
    slot: "chest",
    tier: 4,
    materials: { hide: 16 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  leather_shoes: {
    id: "leather_shoes",
    name: "Leather Shoes",
    category: "armor",
    slot: "shoes", 
    tier: 4,
    materials: { hide: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },

  // Ranged Weapons (Hide-based)
  bow: {
    id: "bow",
    name: "Bow",
    category: "weapons",
    slot: "mainhand",
    tier: 4,
    materials: { hide: 16, wood: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  crossbow: {
    id: "crossbow", 
    name: "Crossbow",
    category: "weapons",
    slot: "mainhand",
    tier: 4,
    materials: { hide: 16, wood: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },

  // Quivers (Off-hand)
  quiver: {
    id: "quiver",
    name: "Quiver",
    category: "weapons",
    slot: "offhand", 
    tier: 4,
    materials: { hide: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
};

// Plate/Metal Equipment Recipes
export const PLATE_EQUIPMENT: Record<string, EquipmentRecipe> = {
  // Plate Armor
  plate_helmet: {
    id: "plate_helmet",
    name: "Plate Helmet",
    category: "armor",
    slot: "head",
    tier: 4,
    materials: { ore: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  plate_armor: {
    id: "plate_armor",
    name: "Plate Armor", 
    category: "armor",
    slot: "chest",
    tier: 4,
    materials: { ore: 16 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  plate_boots: {
    id: "plate_boots",
    name: "Plate Boots",
    category: "armor",
    slot: "shoes",
    tier: 4,
    materials: { ore: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },

  // Melee Weapons (Metal-based)
  sword: {
    id: "sword",
    name: "Sword",
    category: "weapons",
    slot: "mainhand",
    tier: 4,
    materials: { ore: 16 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  axe: {
    id: "axe",
    name: "Axe",
    category: "weapons", 
    slot: "mainhand",
    tier: 4,
    materials: { ore: 16 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  mace: {
    id: "mace",
    name: "Mace",
    category: "weapons",
    slot: "mainhand",
    tier: 4,
    materials: { ore: 16 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  hammer: {
    id: "hammer",
    name: "Hammer",
    category: "weapons",
    slot: "mainhand",
    tier: 4,
    materials: { ore: 20 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  spear: {
    id: "spear",
    name: "Spear",
    category: "weapons",
    slot: "mainhand",
    tier: 4,
    materials: { ore: 16, wood: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  dagger: {
    id: "dagger",
    name: "Dagger",
    category: "weapons",
    slot: "mainhand",
    tier: 4,
    materials: { ore: 12 },
    craftingFee: 0,
    returnRate: 15.2,
  },

  // Shields (Off-hand)
  shield: {
    id: "shield",
    name: "Shield",
    category: "weapons",
    slot: "offhand",
    tier: 4,
    materials: { ore: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
};

// Tools
export const TOOLS: Record<string, EquipmentRecipe> = {
  pickaxe: {
    id: "pickaxe",
    name: "Pickaxe",
    category: "tools",
    slot: "tool",
    tier: 4,
    materials: { ore: 16, wood: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  sickle: {
    id: "sickle", 
    name: "Sickle",
    category: "tools",
    slot: "tool",
    tier: 4,
    materials: { ore: 16, wood: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  skinning_knife: {
    id: "skinning_knife",
    name: "Skinning Knife",
    category: "tools",
    slot: "tool",
    tier: 4,
    materials: { ore: 16, wood: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  stone_hammer: {
    id: "stone_hammer",
    name: "Stone Hammer", 
    category: "tools",
    slot: "tool",
    tier: 4,
    materials: { ore: 16, wood: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
  fishing_rod: {
    id: "fishing_rod",
    name: "Fishing Rod",
    category: "tools",
    slot: "tool",
    tier: 4,
    materials: { wood: 16, fiber: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
};

// Bags  
export const BAGS: Record<string, EquipmentRecipe> = {
  bag: {
    id: "bag",
    name: "Bag",
    category: "accessories",
    slot: "bag",
    tier: 4,
    materials: { hide: 8, fiber: 4 },
    craftingFee: 0,
    returnRate: 15.2,
  },
};

// Capes
export const CAPES: Record<string, EquipmentRecipe> = {
  cape: {
    id: "cape",
    name: "Cape",
    category: "accessories", 
    slot: "cape",
    tier: 4,
    materials: { fiber: 8 },
    craftingFee: 0,
    returnRate: 15.2,
  },
};

// All equipment combined
export const ALL_EQUIPMENT: Record<string, EquipmentRecipe> = {
  ...CLOTH_EQUIPMENT,
  ...LEATHER_EQUIPMENT,
  ...PLATE_EQUIPMENT,
  ...TOOLS,
  ...BAGS,
  ...CAPES,
};

// Helper functions
export const getEquipmentsByCategory = (category: EquipmentCategory): EquipmentRecipe[] => {
  return Object.values(ALL_EQUIPMENT).filter(eq => eq.category === category);
};

export const getEquipmentsByMaterial = (materialType: MaterialType): EquipmentRecipe[] => {
  return Object.values(ALL_EQUIPMENT).filter(eq => 
    Object.keys(eq.materials).includes(materialType)
  );
};

export const getEquipmentById = (id: string): EquipmentRecipe | undefined => {
  return ALL_EQUIPMENT[id];
};

// Material type mapping for equipment
export const EQUIPMENT_MATERIAL_MAPPING = {
  cloth: "fiber",
  leather: "hide", 
  plate: "ore",
  tools: ["ore", "wood", "fiber"],
  accessories: ["hide", "fiber"],
} as const;
