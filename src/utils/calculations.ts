import type { MaterialType, Tier } from "../constants/gameData";
import {
  TIER_REQUIREMENTS,
  calculateReturnRate,
  FOCUS_COSTS,
} from "../constants/gameData";

export interface RefiningInput {
  materialType: MaterialType;
  tier: Tier;
  targetQuantity: number;
  rawMaterialPrice: number;
  refinedMaterialPrice: number;
  lowerTierRefinedPrice: number;
  returnRate: number;
  masteryLevel: number;
  useFocus: boolean;
  stationFeePercent: number;
  marketTaxPercent: number;
  isPremium: boolean;
  availableRawMaterials: number;
  availableLowerTierRefined: number;
}

export interface RefiningResult {
  // Material requirements
  rawMaterialsNeeded: number;
  lowerTierRefinedNeeded: number;
  totalCraftingAttempts: number;

  // Returns and efficiency
  expectedOutput: number;
  rawMaterialsReturned: number;
  lowerTierRefinedReturned: number;
  effectiveReturnRate: number;

  // Costs
  rawMaterialCost: number;
  lowerTierRefinedCost: number;
  stationFee: number;
  marketTax: number;
  focusCost: number;
  totalCost: number;

  // Revenue and profit
  totalRevenue: number;
  grossProfit: number;
  netProfit: number;
  profitPerUnit: number;
  profitPerFocus: number;
  profitMargin: number;
  returnedMaterialsValue: number;

  // Efficiency metrics
  canCraftAll: boolean;
  missingRawMaterials: number;
  missingLowerTierRefined: number;
  maxPossibleCrafts: number;
}

export const calculateRefiningProfit = (
  input: RefiningInput
): RefiningResult => {
  const {
    tier,
    targetQuantity,
    rawMaterialPrice,
    refinedMaterialPrice,
    lowerTierRefinedPrice,
    returnRate,
    masteryLevel,
    useFocus,
    stationFeePercent,
    marketTaxPercent,
    isPremium,
    availableRawMaterials,
    availableLowerTierRefined,
  } = input;

  const requirements = TIER_REQUIREMENTS[tier];
  const focusCostPerCraft = FOCUS_COSTS[tier] || 0;

  // Calculate effective return rate with mastery and focus
  const effectiveReturnRate = calculateReturnRate(
    returnRate,
    masteryLevel,
    useFocus
  );

  // Calculate base material requirements for target quantity
  const rawMaterialsNeeded = targetQuantity * requirements.raw;
  const lowerTierRefinedNeeded =
    tier > 2 ? targetQuantity * requirements.refined : 0;

  // Calculate expected returns
  const rawMaterialsReturned = Math.floor(
    rawMaterialsNeeded * (effectiveReturnRate / 100)
  );
  const lowerTierRefinedReturned = Math.floor(
    lowerTierRefinedNeeded * (effectiveReturnRate / 100)
  );

  // Calculate net material consumption
  const netRawMaterialsUsed = rawMaterialsNeeded - rawMaterialsReturned;
  const netLowerTierRefinedUsed =
    lowerTierRefinedNeeded - lowerTierRefinedReturned;

  // Check if we have enough materials
  const canCraftAll =
    availableRawMaterials >= rawMaterialsNeeded &&
    availableLowerTierRefined >= lowerTierRefinedNeeded;

  const missingRawMaterials = Math.max(
    0,
    rawMaterialsNeeded - availableRawMaterials
  );
  const missingLowerTierRefined = Math.max(
    0,
    lowerTierRefinedNeeded - availableLowerTierRefined
  );

  // Calculate maximum possible crafts based on available materials
  const maxCraftsFromRaw = Math.floor(availableRawMaterials / requirements.raw);
  const maxCraftsFromRefined =
    tier > 2
      ? Math.floor(availableLowerTierRefined / requirements.refined)
      : Infinity;
  const maxPossibleCrafts = Math.min(maxCraftsFromRaw, maxCraftsFromRefined);

  // Calculate costs
  const rawMaterialCost = netRawMaterialsUsed * rawMaterialPrice;
  const lowerTierRefinedCost = netLowerTierRefinedUsed * lowerTierRefinedPrice;

  const baseStationFee =
    (rawMaterialCost + lowerTierRefinedCost) * (stationFeePercent / 100);
  const stationFee = isPremium ? baseStationFee * 0.5 : baseStationFee; // 50% reduction for premium

  const totalRevenue = targetQuantity * refinedMaterialPrice;
  const baseMarketTax = totalRevenue * (marketTaxPercent / 100);
  const marketTax = isPremium ? baseMarketTax * 0.5 : baseMarketTax; // 50% reduction for premium

  const focusCost = useFocus ? targetQuantity * focusCostPerCraft : 0;

  const totalCost =
    rawMaterialCost + lowerTierRefinedCost + stationFee + marketTax + focusCost;

  // Calculate profit
  const grossProfit = totalRevenue - rawMaterialCost - lowerTierRefinedCost;
  const netProfit = totalRevenue - totalCost;
  const profitPerUnit = netProfit / targetQuantity;
  const profitPerFocus =
    useFocus && focusCost > 0 ? netProfit / (focusCost / focusCostPerCraft) : 0;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const returnedMaterialsValue = 
    rawMaterialsReturned * rawMaterialPrice + 
    lowerTierRefinedReturned * lowerTierRefinedPrice;

  return {
    rawMaterialsNeeded,
    lowerTierRefinedNeeded,
    totalCraftingAttempts: targetQuantity,

    expectedOutput: targetQuantity,
    rawMaterialsReturned,
    lowerTierRefinedReturned,
    effectiveReturnRate,

    rawMaterialCost,
    lowerTierRefinedCost,
    stationFee,
    marketTax,
    focusCost,
    totalCost,

    totalRevenue,
    grossProfit,
    netProfit,
    profitPerUnit,
    profitPerFocus,
    profitMargin,
    returnedMaterialsValue,

    canCraftAll,
    missingRawMaterials,
    missingLowerTierRefined,
    maxPossibleCrafts,
  };
};
