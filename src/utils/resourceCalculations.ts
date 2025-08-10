import type { MaterialType, Tier } from "../constants/gameData";
import {
  TIER_REQUIREMENTS,
  calculateReturnRate,
  FOCUS_COSTS,
} from "../constants/gameData";

export interface ResourceBasedInput {
  materialType: MaterialType;
  tier: Tier;
  ownedRawMaterials: number;
  ownedLowerTierRefined: number;
  rawMaterialPrice: number;
  refinedMaterialPrice: number;
  lowerTierRefinedPrice: number;
  returnRate: number;
  masteryLevel: number;
  useFocus: boolean;
  stationFeePercent: number;
  marketTaxPercent: number;
  isPremium: boolean;
}

export interface ResourceBasedResult {
  // Production details
  refinementsMade: number;
  actualRefinedOutput: number;
  iterations: number; // Number of refining iterations performed

  // Materials consumed
  rawMaterialsUsed: number;
  lowerTierRefinedUsed: number;

  // Materials returned
  rawMaterialsReturned: number;
  lowerTierRefinedReturned: number;

  // Final inventory after refining
  finalInventory: {
    rawMaterials: number;
    lowerTierRefined: number;
    refinedMaterials: number;
    higherTierRefined: number;
  };

  // Financial analysis
  totalValueProduced: number;
  materialCosts: number;
  rawMaterialCost: number;
  lowerTierRefinedCost: number;
  returnedMaterialsValue: number;
  totalRevenue: number;
  grossProfit: number;
  stationFee: number;
  netProfit: number;
  profitMargin: number;
  profitPerUnit: number;

  // Focus usage
  focusUsed: number;

  // Rates
  effectiveReturnRate: number;
}

export const calculateResourceBasedRefining = (
  input: ResourceBasedInput
): ResourceBasedResult => {
  const {
    tier,
    ownedRawMaterials,
    ownedLowerTierRefined,
    rawMaterialPrice,
    refinedMaterialPrice,
    lowerTierRefinedPrice,
    returnRate,
    masteryLevel,
    useFocus,
    stationFeePercent,
    isPremium,
  } = input;

  const requirements = TIER_REQUIREMENTS[tier];
  const focusCostPerCraft = FOCUS_COSTS[tier] || 0;

  // Calculate effective return rate with mastery and focus
  const effectiveReturnRate = calculateReturnRate(
    returnRate,
    masteryLevel,
    useFocus
  );

  // Iterative refining simulation
  let currentRawMaterials = ownedRawMaterials;
  let currentLowerTierRefined = ownedLowerTierRefined;
  let totalRefinedProduced = 0;
  let totalRawMaterialsConsumed = 0;
  let totalLowerTierRefinedConsumed = 0;
  let totalRawMaterialsReturned = 0;
  let totalLowerTierRefinedReturned = 0;
  let lastIterationRawReturned = 0;
  let lastIterationLowerTierReturned = 0;
  let iterations = 0;
  const maxIterations = 1000; // Safety limit to prevent infinite loops

  while (iterations < maxIterations) {
    // Check if we have enough materials for at least one craft
    const canCraftFromRaw = currentRawMaterials >= requirements.raw;
    const canCraftFromRefined =
      tier <= 2 || currentLowerTierRefined >= requirements.refined;

    if (!canCraftFromRaw || !canCraftFromRefined) {
      break; // Not enough materials to continue
    }

    // Calculate how many crafts we can do this iteration
    const maxCraftsFromRaw = Math.floor(currentRawMaterials / requirements.raw);
    const maxCraftsFromRefined =
      tier > 2
        ? Math.floor(currentLowerTierRefined / requirements.refined)
        : Infinity;
    const craftsThisIteration = Math.min(
      maxCraftsFromRaw,
      maxCraftsFromRefined
    );

    if (craftsThisIteration === 0) {
      break; // Can't craft anything
    }

    // Calculate materials used this iteration
    const rawUsedThisIteration = craftsThisIteration * requirements.raw;
    const lowerTierUsedThisIteration =
      tier > 2 ? craftsThisIteration * requirements.refined : 0;

    // Calculate returns this iteration
    const rawReturnedThisIteration = Math.floor(
      rawUsedThisIteration * (effectiveReturnRate / 100)
    );
    const lowerTierReturnedThisIteration = Math.floor(
      lowerTierUsedThisIteration * (effectiveReturnRate / 100)
    );

    // Update materials
    currentRawMaterials =
      currentRawMaterials - rawUsedThisIteration + rawReturnedThisIteration;
    currentLowerTierRefined =
      currentLowerTierRefined -
      lowerTierUsedThisIteration +
      lowerTierReturnedThisIteration;

    // Update totals
    totalRefinedProduced += craftsThisIteration;
    totalRawMaterialsConsumed += rawUsedThisIteration;
    totalLowerTierRefinedConsumed += lowerTierUsedThisIteration;
    totalRawMaterialsReturned += rawReturnedThisIteration;
    totalLowerTierRefinedReturned += lowerTierReturnedThisIteration;

    // Track last iteration returns
    lastIterationRawReturned = rawReturnedThisIteration;
    lastIterationLowerTierReturned = lowerTierReturnedThisIteration;

    iterations++;
  }

  // Calculate final costs and profits
  // Cost should be based on initial materials owned (opportunity cost)
  const rawMaterialCost = ownedRawMaterials * rawMaterialPrice;
  const lowerTierRefinedCost = ownedLowerTierRefined * lowerTierRefinedPrice;
  const totalMaterialCost = rawMaterialCost + lowerTierRefinedCost;

  // Calculate value of returned materials from all refining iterations
  const returnedMaterialsValue =
    lastIterationRawReturned * rawMaterialPrice +
    lastIterationLowerTierReturned * lowerTierRefinedPrice;

  const baseStationFee = totalMaterialCost * (stationFeePercent / 100);
  const stationFee = isPremium ? baseStationFee * 0.5 : baseStationFee;

  // Calculate total value of final inventory first
  const finalInventoryValue =
    currentRawMaterials * rawMaterialPrice +
    currentLowerTierRefined * lowerTierRefinedPrice +
    totalRefinedProduced * refinedMaterialPrice;

  const totalRevenue = totalRefinedProduced * refinedMaterialPrice;
  const grossProfit = finalInventoryValue - totalMaterialCost;
  const totalCost = totalMaterialCost + stationFee;
  const netProfit = finalInventoryValue - totalCost;

  const profitMargin =
    finalInventoryValue > 0 ? (netProfit / finalInventoryValue) * 100 : 0;
  const profitPerUnit =
    totalRefinedProduced > 0 ? netProfit / totalRefinedProduced : 0;

  return {
    refinementsMade: totalRefinedProduced,
    actualRefinedOutput: totalRefinedProduced,
    iterations: iterations,

    rawMaterialsUsed: ownedRawMaterials - currentRawMaterials,
    lowerTierRefinedUsed: ownedLowerTierRefined - currentLowerTierRefined,

    rawMaterialsReturned: totalRawMaterialsReturned,
    lowerTierRefinedReturned: totalLowerTierRefinedReturned,

    finalInventory: {
      rawMaterials: currentRawMaterials,
      lowerTierRefined: currentLowerTierRefined,
      refinedMaterials: totalRefinedProduced,
      higherTierRefined: 0, // No higher tier production in basic refining
    },

    totalValueProduced: finalInventoryValue,
    materialCosts: totalMaterialCost,
    rawMaterialCost,
    lowerTierRefinedCost,
    returnedMaterialsValue,
    totalRevenue,
    grossProfit,
    stationFee,
    netProfit,
    profitMargin,
    profitPerUnit,

    focusUsed: useFocus ? totalRefinedProduced * focusCostPerCraft : 0,
    effectiveReturnRate,
  };
};
