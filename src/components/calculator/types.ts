export interface MaterialBreakdown {
  name: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
}

export interface ReturnedMaterial {
  name: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
}

export interface CalculationResult {
  totalCost: number;
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  materialBreakdown: MaterialBreakdown[];
  returnedMaterials: ReturnedMaterial[];
  taxCost: number;
  setupCost: number;
  focusCost?: number;
  journalRevenue?: number;
  profitPerFocus?: number;
}
