import type { MaterialType, Tier } from "../constants/gameData";
import type { EquipmentRecipe } from "../constants/equipmentData";
import { REFINED_NAMES, MATERIAL_NAMES } from "../constants/gameData";

export interface EquipmentCraftingInput {
  equipment: EquipmentRecipe;
  tier: Tier;
  quantity: number;
  materialPrices: Record<MaterialType, number>; // Price per refined material
  equipmentPrice: number; // Selling price of the equipment
  returnRate: number;
  useFocus: boolean;
  stationFeePercent: number;
  marketTaxPercent: number;
  isPremium: boolean;
}

export interface MaterialRequirement {
  materialType: MaterialType;
  materialName: string;
  refinedName: string;
  amount: number;
  cost: number;
  returned: number;
  netUsed: number;
  netCost: number;
}

export interface EquipmentCraftingResult {
  // Equipment info
  equipmentName: string;
  equipmentTier: Tier;
  quantityCrafted: number;

  // Material requirements
  materialRequirements: MaterialRequirement[];
  totalMaterialCost: number;
  totalMaterialsReturned: number;
  totalNetMaterialCost: number;

  // Returns
  effectiveReturnRate: number;

  // Costs and fees
  stationFee: number;
  marketTax: number;
  focusCost: number;
  totalCost: number;

  // Revenue and profit
  totalRevenue: number;
  grossProfit: number;
  netProfit: number;
  profitPerUnit: number;
  profitMargin: number;
  returnedMaterialsValue: number;

  // Focus efficiency
  profitPerFocus: number;

  // Profitability status
  isProfitable: boolean;
}

export const calculateEquipmentCrafting = (
  input: EquipmentCraftingInput
): EquipmentCraftingResult => {
  const {
    equipment,
    tier,
    quantity,
    materialPrices,
    equipmentPrice,
    returnRate,
    useFocus,
    stationFeePercent,
    marketTaxPercent,
    isPremium,
  } = input;

  // Calculate effective return rate (Focus gives fixed 53.9% return rate)
  const effectiveReturnRate = useFocus ? 53.9 : returnRate;

  // Calculate material requirements for each material type
  const materialRequirements: MaterialRequirement[] = [];
  let totalMaterialCost = 0;
  let totalMaterialsReturned = 0;
  let totalNetMaterialCost = 0;

  Object.entries(equipment.materials).forEach(([materialType, amount]) => {
    const matType = materialType as MaterialType;
    const totalAmount = amount * quantity;
    const materialPrice = materialPrices[matType] || 0;
    const cost = totalAmount * materialPrice;
    
    // Calculate returned materials
    const returned = Math.floor(totalAmount * (effectiveReturnRate / 100));
    const netUsed = totalAmount - returned;
    const netCost = netUsed * materialPrice;
    const returnedValue = returned * materialPrice;

    const requirement: MaterialRequirement = {
      materialType: matType,
      materialName: MATERIAL_NAMES[matType][tier],
      refinedName: REFINED_NAMES[matType][tier],
      amount: totalAmount,
      cost: cost,
      returned: returned,
      netUsed: netUsed,
      netCost: netCost,
    };

    materialRequirements.push(requirement);
    totalMaterialCost += cost;
    totalMaterialsReturned += returnedValue;
    totalNetMaterialCost += netCost;
  });

  // Calculate fees
  const baseStationFee = totalMaterialCost * (stationFeePercent / 100);
  const stationFee = isPremium ? baseStationFee * 0.5 : baseStationFee;

  const totalRevenue = quantity * equipmentPrice;
  const baseMarketTax = totalRevenue * (marketTaxPercent / 100);
  const marketTax = isPremium ? baseMarketTax * 0.5 : baseMarketTax;

  // Focus cost calculation (simplified - using tier 4 as base)
  const focusCostPerItem = useFocus ? (equipment.focusCost || 3) : 0;
  const focusCost = focusCostPerItem * quantity;

  // Total costs
  const totalCost = totalNetMaterialCost + stationFee + marketTax;

  // Profit calculations
  const grossProfit = totalRevenue - totalMaterialCost;
  const netProfit = totalRevenue - totalCost;
  const profitPerUnit = netProfit / quantity;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const profitPerFocus = useFocus && focusCostPerItem > 0 ? netProfit / (focusCost / focusCostPerItem) : 0;

  return {
    equipmentName: equipment.name,
    equipmentTier: tier,
    quantityCrafted: quantity,

    materialRequirements,
    totalMaterialCost,
    totalMaterialsReturned,
    totalNetMaterialCost,

    effectiveReturnRate,

    stationFee,
    marketTax,
    focusCost,
    totalCost,

    totalRevenue,
    grossProfit,
    netProfit,
    profitPerUnit,
    profitMargin,
    returnedMaterialsValue: totalMaterialsReturned,

    profitPerFocus,

    isProfitable: netProfit > 0,
  };
};
