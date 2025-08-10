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
  stationFee: number;
  netProfit: number;

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

  // Calculate maximum possible crafts based on available materials
  const maxCraftsFromRaw = Math.floor(ownedRawMaterials / requirements.raw);
  const maxCraftsFromRefined =
    tier > 2
      ? Math.floor(ownedLowerTierRefined / requirements.refined)
      : Infinity;
  const maxPossibleCrafts = Math.min(maxCraftsFromRaw, maxCraftsFromRefined);

  // Calculate actual materials used
  const rawMaterialsUsed = maxPossibleCrafts * requirements.raw;
  const lowerTierRefinedUsed =
    tier > 2 ? maxPossibleCrafts * requirements.refined : 0;

  // Calculate returns
  const rawMaterialsReturned = Math.floor(
    rawMaterialsUsed * (effectiveReturnRate / 100)
  );
  const lowerTierRefinedReturned = Math.floor(
    lowerTierRefinedUsed * (effectiveReturnRate / 100)
  );

  // Calculate final inventory
  const finalRawMaterials =
    ownedRawMaterials - rawMaterialsUsed + rawMaterialsReturned;
  const finalLowerTierRefined =
    ownedLowerTierRefined - lowerTierRefinedUsed + lowerTierRefinedReturned;

  // Calculate costs (only for net materials consumed)
  const netRawMaterialsUsed = rawMaterialsUsed - rawMaterialsReturned;
  const netLowerTierRefinedUsed =
    lowerTierRefinedUsed - lowerTierRefinedReturned;

  const rawMaterialCost = netRawMaterialsUsed * rawMaterialPrice;
  const lowerTierRefinedCost = netLowerTierRefinedUsed * lowerTierRefinedPrice;
  const totalMaterialCost = rawMaterialCost + lowerTierRefinedCost;

  const baseStationFee = totalMaterialCost * (stationFeePercent / 100);
  const stationFee = isPremium ? baseStationFee * 0.5 : baseStationFee;

  const totalRevenue = maxPossibleCrafts * refinedMaterialPrice;

  const totalCost = totalMaterialCost + stationFee;
  const netProfit = totalRevenue - totalCost;

  // Calculate total value of final inventory
  const finalInventoryValue =
    finalRawMaterials * rawMaterialPrice +
    finalLowerTierRefined * lowerTierRefinedPrice +
    maxPossibleCrafts * refinedMaterialPrice;

  return {
    refinementsMade: maxPossibleCrafts,
    actualRefinedOutput: maxPossibleCrafts,

    rawMaterialsUsed,
    lowerTierRefinedUsed,

    rawMaterialsReturned,
    lowerTierRefinedReturned,

    finalInventory: {
      rawMaterials: finalRawMaterials,
      lowerTierRefined: finalLowerTierRefined,
      refinedMaterials: maxPossibleCrafts,
      higherTierRefined: 0, // No higher tier production in basic refining
    },

    totalValueProduced: finalInventoryValue,
    materialCosts: totalMaterialCost,
    stationFee,
    netProfit,

    focusUsed: useFocus ? maxPossibleCrafts * focusCostPerCraft : 0,
    effectiveReturnRate,
  };
};
