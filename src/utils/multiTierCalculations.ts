import type { MaterialType, Tier } from "../constants/gameData";
import {
  TIER_REQUIREMENTS,
  calculateReturnRate,
  FOCUS_COSTS,
  MATERIAL_NAMES,
  REFINED_NAMES,
} from "../constants/gameData";

export interface MultiTierInput {
  materialType: MaterialType;
  startTier: Tier;
  endTier: Tier;
  ownedStartMaterials: number; // Amount of starting tier refined materials owned
  ownedRawMaterials: Record<Tier, number>; // Raw materials for each tier
  materialPrices: {
    raw: Record<Tier, number>; // Prices for raw materials by tier
    refined: Record<Tier, number>; // Prices for refined materials by tier
  };
  returnRate: number;
  masteryLevel: number;
  useFocus: boolean;
  stationFeePercent: number;
  marketTaxPercent: number;
  isPremium: boolean;
}

export interface TierRefiningStep {
  fromTier: Tier;
  toTier: Tier;
  
  // Materials input
  startingRefined: number; // Lower tier refined materials available
  rawMaterialsUsed: number; // Raw materials consumed
  lowerTierRefinedUsed: number; // Lower tier refined consumed
  
  // Materials output
  refinedProduced: number; // Higher tier refined produced
  rawMaterialsReturned: number; // Raw materials returned
  lowerTierRefinedReturned: number; // Lower tier refined returned
  
  // Economics
  rawMaterialCost: number;
  lowerTierRefinedCost: number;
  totalInputCost: number;
  returnedMaterialsValue: number;
  netCost: number;
  outputValue: number;
  stepProfit: number;
  
  // Focus and fees
  focusUsed: number;
  stationFee: number;
  iterations: number;
  effectiveReturnRate: number;
}

export interface MultiTierResult {
  // Overview
  totalTiers: number;
  startTier: Tier;
  endTier: Tier;
  materialType: MaterialType;
  
  // Step-by-step breakdown
  refiningSteps: TierRefiningStep[];
  
  // Final results
  finalRefinedProduced: number;
  totalRawMaterialsConsumed: Record<Tier, number>;
  totalRawMaterialsReturned: Record<Tier, number>;
  totalCosts: number;
  totalRevenue: number;
  totalReturnedValue: number;
  grossProfit: number;
  totalStationFees: number;
  totalFocusUsed: number;
  netProfit: number;
  profitPerUnit: number;
  profitMargin: number;
  
  // Efficiency metrics
  materialEfficiency: number; // % of raw materials that became final product
  economicEfficiency: number; // Profit per silver invested
  
  // Remaining inventory
  remainingMaterials: {
    raw: Record<Tier, number>;
    refined: Record<Tier, number>;
  };
}

export const calculateMultiTierRefining = (
  input: MultiTierInput
): MultiTierResult => {
  const {
    materialType,
    startTier,
    endTier,
    ownedStartMaterials,
    ownedRawMaterials,
    materialPrices,
    returnRate,
    masteryLevel,
    useFocus,
    stationFeePercent,
    marketTaxPercent,
    isPremium,
  } = input;

  // Validate input
  if (startTier >= endTier) {
    throw new Error("Start tier must be lower than end tier");
  }

  // Initialize tracking variables
  const refiningSteps: TierRefiningStep[] = [];
  const totalRawMaterialsConsumed: Record<Tier, number> = {} as Record<Tier, number>;
  const totalRawMaterialsReturned: Record<Tier, number> = {} as Record<Tier, number>;
  const remainingRawMaterials = { ...ownedRawMaterials };
  const remainingRefinedMaterials: Record<Tier, number> = {} as Record<Tier, number>;
  
  // Initialize remaining refined materials
  Object.keys(TIER_REQUIREMENTS).forEach(tier => {
    const t = parseInt(tier) as Tier;
    remainingRefinedMaterials[t] = 0;
    totalRawMaterialsConsumed[t] = 0;
    totalRawMaterialsReturned[t] = 0;
  });
  
  // Set starting refined materials
  remainingRefinedMaterials[startTier] = ownedStartMaterials;

  let totalCosts = 0;
  let totalRevenue = 0;
  let totalReturnedValue = 0;
  let totalStationFees = 0;
  let totalFocusUsed = 0;

  // Process each tier progression
  for (let currentTier = startTier + 1; currentTier <= endTier; currentTier++) {
    const fromTier = (currentTier - 1) as Tier;
    const toTier = currentTier as Tier;
    
    const step = calculateSingleTierStep({
      materialType,
      fromTier,
      toTier,
      availableRefined: remainingRefinedMaterials[fromTier],
      availableRaw: remainingRawMaterials[toTier],
      rawPrice: materialPrices.raw[toTier],
      refinedPriceFrom: materialPrices.refined[fromTier],
      refinedPriceTo: materialPrices.refined[toTier],
      returnRate,
      masteryLevel,
      useFocus,
      stationFeePercent,
      isPremium,
    });

    refiningSteps.push(step);

    // Update remaining materials
    remainingRefinedMaterials[fromTier] -= step.lowerTierRefinedUsed;
    remainingRefinedMaterials[fromTier] += step.lowerTierRefinedReturned;
    remainingRefinedMaterials[toTier] += step.refinedProduced;
    remainingRawMaterials[toTier] -= step.rawMaterialsUsed;
    remainingRawMaterials[toTier] += step.rawMaterialsReturned;

    // Update totals
    totalRawMaterialsConsumed[toTier] += step.rawMaterialsUsed;
    totalRawMaterialsReturned[toTier] += step.rawMaterialsReturned;
    totalCosts += step.totalInputCost;
    totalReturnedValue += step.returnedMaterialsValue;
    totalStationFees += step.stationFee;
    totalFocusUsed += step.focusUsed;
  }

  // Calculate final revenue (selling the final tier refined materials)
  const finalRefinedProduced = remainingRefinedMaterials[endTier];
  totalRevenue = finalRefinedProduced * materialPrices.refined[endTier];

  // Calculate market tax on final sale
  const baseMarketTax = totalRevenue * (marketTaxPercent / 100);
  const marketTax = isPremium ? baseMarketTax * 0.5 : baseMarketTax;

  // Calculate final profits
  const grossProfit = totalRevenue + totalReturnedValue - totalCosts;
  const netProfit = grossProfit - totalStationFees - marketTax;
  const profitPerUnit = finalRefinedProduced > 0 ? netProfit / finalRefinedProduced : 0;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Calculate efficiency metrics
  const totalRawMaterialsUsed = Object.values(totalRawMaterialsConsumed).reduce((sum, amount) => sum + amount, 0);
  const materialEfficiency = totalRawMaterialsUsed > 0 ? (finalRefinedProduced / totalRawMaterialsUsed) * 100 : 0;
  const economicEfficiency = totalCosts > 0 ? (netProfit / totalCosts) * 100 : 0;

  return {
    totalTiers: endTier - startTier,
    startTier,
    endTier,
    materialType,
    refiningSteps,
    finalRefinedProduced,
    totalRawMaterialsConsumed,
    totalRawMaterialsReturned,
    totalCosts,
    totalRevenue,
    totalReturnedValue,
    grossProfit,
    totalStationFees,
    totalFocusUsed,
    netProfit,
    profitPerUnit,
    profitMargin,
    materialEfficiency,
    economicEfficiency,
    remainingMaterials: {
      raw: remainingRawMaterials,
      refined: remainingRefinedMaterials,
    },
  };
};

interface SingleTierStepInput {
  materialType: MaterialType;
  fromTier: Tier;
  toTier: Tier;
  availableRefined: number;
  availableRaw: number;
  rawPrice: number;
  refinedPriceFrom: number;
  refinedPriceTo: number;
  returnRate: number;
  masteryLevel: number;
  useFocus: boolean;
  stationFeePercent: number;
  isPremium: boolean;
}

const calculateSingleTierStep = (input: SingleTierStepInput): TierRefiningStep => {
  const {
    materialType,
    fromTier,
    toTier,
    availableRefined,
    availableRaw,
    rawPrice,
    refinedPriceFrom,
    refinedPriceTo,
    returnRate,
    masteryLevel,
    useFocus,
    stationFeePercent,
    isPremium,
  } = input;

  const requirements = TIER_REQUIREMENTS[toTier];
  const focusCostPerCraft = FOCUS_COSTS[toTier] || 0;

  // Calculate effective return rate
  const effectiveReturnRate = calculateReturnRate(returnRate, masteryLevel, useFocus);

  // Calculate maximum crafts possible
  const maxCraftsFromRaw = Math.floor(availableRaw / requirements.raw);
  const maxCraftsFromRefined = Math.floor(availableRefined / requirements.refined);
  const maxCrafts = Math.min(maxCraftsFromRaw, maxCraftsFromRefined);

  if (maxCrafts === 0) {
    // Can't craft anything
    return {
      fromTier,
      toTier,
      startingRefined: availableRefined,
      rawMaterialsUsed: 0,
      lowerTierRefinedUsed: 0,
      refinedProduced: 0,
      rawMaterialsReturned: 0,
      lowerTierRefinedReturned: 0,
      rawMaterialCost: 0,
      lowerTierRefinedCost: 0,
      totalInputCost: 0,
      returnedMaterialsValue: 0,
      netCost: 0,
      outputValue: 0,
      stepProfit: 0,
      focusUsed: 0,
      stationFee: 0,
      iterations: 1,
      effectiveReturnRate,
    };
  }

  // Calculate materials used
  const rawMaterialsUsed = maxCrafts * requirements.raw;
  const lowerTierRefinedUsed = maxCrafts * requirements.refined;

  // Calculate materials returned
  const rawMaterialsReturned = Math.floor(rawMaterialsUsed * (effectiveReturnRate / 100));
  const lowerTierRefinedReturned = Math.floor(lowerTierRefinedUsed * (effectiveReturnRate / 100));

  // Calculate materials produced
  const refinedProduced = maxCrafts;

  // Calculate costs
  const rawMaterialCost = rawMaterialsUsed * rawPrice;
  const lowerTierRefinedCost = lowerTierRefinedUsed * refinedPriceFrom;
  const totalInputCost = rawMaterialCost + lowerTierRefinedCost;

  // Calculate returned materials value
  const returnedMaterialsValue = 
    (rawMaterialsReturned * rawPrice) + 
    (lowerTierRefinedReturned * refinedPriceFrom);

  // Calculate station fee
  const baseStationFee = totalInputCost * (stationFeePercent / 100);
  const stationFee = isPremium ? baseStationFee * 0.5 : baseStationFee;

  // Calculate net cost and output value
  const netCost = totalInputCost - returnedMaterialsValue + stationFee;
  const outputValue = refinedProduced * refinedPriceTo;

  // Calculate step profit
  const stepProfit = outputValue - netCost;

  // Calculate focus used
  const focusUsed = useFocus ? maxCrafts * focusCostPerCraft : 0;

  return {
    fromTier,
    toTier,
    startingRefined: availableRefined,
    rawMaterialsUsed,
    lowerTierRefinedUsed,
    refinedProduced,
    rawMaterialsReturned,
    lowerTierRefinedReturned,
    rawMaterialCost,
    lowerTierRefinedCost,
    totalInputCost,
    returnedMaterialsValue,
    netCost,
    outputValue,
    stepProfit,
    focusUsed,
    stationFee,
    iterations: 1,
    effectiveReturnRate,
  };
};

// Helper function to generate tier range options
export const generateTierRanges = (): Array<{ startTier: Tier; endTier: Tier; label: string }> => {
  const ranges: Array<{ startTier: Tier; endTier: Tier; label: string }> = [];
  
  Object.keys(TIER_REQUIREMENTS).forEach(startTierStr => {
    const startTier = parseInt(startTierStr) as Tier;
    
    Object.keys(TIER_REQUIREMENTS).forEach(endTierStr => {
      const endTier = parseInt(endTierStr) as Tier;
      
      if (endTier > startTier) {
        ranges.push({
          startTier,
          endTier,
          label: `T${startTier} → T${endTier}`,
        });
      }
    });
  });
  
  return ranges;
};

// Helper function to validate multi-tier input
export const validateMultiTierInput = (input: Partial<MultiTierInput>): string[] => {
  const errors: string[] = [];
  
  if (!input.startTier || !input.endTier) {
    errors.push("Start tier and end tier are required");
  } else if (input.startTier >= input.endTier) {
    errors.push("Start tier must be lower than end tier");
  }
  
  if (!input.ownedStartMaterials || input.ownedStartMaterials <= 0) {
    errors.push("Starting materials amount must be greater than 0");
  }
  
  if (!input.ownedRawMaterials) {
    errors.push("Raw materials amounts are required");
  } else {
    // Check if we have raw materials for all required tiers
    for (let tier = (input.startTier! + 1); tier <= input.endTier!; tier++) {
      if (!input.ownedRawMaterials[tier as Tier] || input.ownedRawMaterials[tier as Tier] <= 0) {
        errors.push(`Raw materials for T${tier} are required`);
      }
    }
  }
  
  if (!input.materialPrices) {
    errors.push("Material prices are required");
  }
  
  return errors;
};
