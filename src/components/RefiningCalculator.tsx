import React, { useState, useEffect } from "react";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Settings,
  Zap,
  Focus,
  Archive,
  Package,
} from "lucide-react";
import type { MaterialType, Tier } from "../constants/gameData";
import {
  MATERIAL_TYPES,
  TIER_REQUIREMENTS,
  RETURN_RATES,
  MATERIAL_NAMES,
  REFINED_NAMES,
} from "../constants/gameData";
import {
  calculateRefiningProfit,
  type RefiningInput,
  type RefiningResult,
} from "../utils/calculations";
import {
  calculateResourceBasedRefining,
  type ResourceBasedInput,
  type ResourceBasedResult,
} from "../utils/resourceCalculations";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
}) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-300">{label}</span>
    <button
      type="button"
      className={`toggle-switch ${checked ? "toggle-switch-active" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`toggle-switch-thumb ${
          checked ? "toggle-switch-thumb-active" : ""
        }`}
      />
    </button>
  </div>
);

export const RefiningCalculator: React.FC = () => {
  const [calculationMode, setCalculationMode] = useState<
    "target" | "resources"
  >("target");
  const [materialType, setMaterialType] = useState<MaterialType>("ore");
  const [tier, setTier] = useState<Tier>(4);
  const [targetQuantity, setTargetQuantity] = useState<number>(100);

  // For resource-based calculation
  const [ownedRawMaterials, setOwnedRawMaterials] = useState<number>(1000);
  const [ownedLowerTierRefined, setOwnedLowerTierRefined] =
    useState<number>(500);
  const [rawMaterialPrice, setRawMaterialPrice] = useState<number>(100);
  const [refinedMaterialPrice, setRefinedMaterialPrice] = useState<number>(300);
  const [lowerTierRefinedPrice, setLowerTierRefinedPrice] =
    useState<number>(200);
  const [isBonusCity, setIsBonusCity] = useState<boolean>(true);
  const [isRefiningDay, setIsRefiningDay] = useState<boolean>(false);
  const [useFocus, setUseFocus] = useState<boolean>(false);
  const [marketTaxPercent, setMarketTaxPercent] = useState<number>(4);

  const [result, setResult] = useState<RefiningResult | null>(null);
  const [resourceResult, setResourceResult] =
    useState<ResourceBasedResult | null>(null);

  const calculateResult = () => {
    if (calculationMode === "target") {
      const input: RefiningInput = {
        materialType,
        tier,
        targetQuantity,
        rawMaterialPrice,
        refinedMaterialPrice,
        lowerTierRefinedPrice,
        returnRate: isBonusCity
          ? isRefiningDay
            ? RETURN_RATES.bonusCityWithRefiningDay
            : RETURN_RATES.bonusCity
          : RETURN_RATES.nonBonusCity,
        masteryLevel: 0,
        useFocus,
        stationFeePercent: 0,
        marketTaxPercent,
        isPremium: false,
        availableRawMaterials: 0,
        availableLowerTierRefined: 0,
      };

      const calculatedResult = calculateRefiningProfit(input);
      setResult(calculatedResult);
      setResourceResult(null);
    } else {
      const input: ResourceBasedInput = {
        materialType,
        tier,
        ownedRawMaterials,
        ownedLowerTierRefined,
        rawMaterialPrice,
        refinedMaterialPrice,
        lowerTierRefinedPrice,
        returnRate: isBonusCity
          ? isRefiningDay
            ? RETURN_RATES.bonusCityWithRefiningDay
            : RETURN_RATES.bonusCity
          : RETURN_RATES.nonBonusCity,
        masteryLevel: 0,
        useFocus,
        stationFeePercent: 0,
        marketTaxPercent,
        isPremium: false,
      };

      const calculatedResult = calculateResourceBasedRefining(input);
      setResourceResult(calculatedResult);
      setResult(null);
    }
  };

  useEffect(() => {
    calculateResult();
  }, [
    calculationMode,
    materialType,
    tier,
    targetQuantity,
    ownedRawMaterials,
    ownedLowerTierRefined,
    rawMaterialPrice,
    refinedMaterialPrice,
    lowerTierRefinedPrice,
    isBonusCity,
    isRefiningDay,
    useFocus,
    marketTaxPercent,
  ]);

  const rawMaterialName = MATERIAL_NAMES[materialType][tier];
  const refinedMaterialName = REFINED_NAMES[materialType][tier];
  const lowerTierRefinedName =
    tier > 2 ? REFINED_NAMES[materialType][(tier - 1) as Tier] : "";

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Albion Refining Calculator
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Calculate refining costs, profits, and material requirements with
            Albion Online mechanics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calculation Mode Selection */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 animate-slide-up">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-500" />
                Calculation Mode
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setCalculationMode("target")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    calculationMode === "target"
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">Target Based</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Calculate materials needed for specific quantity
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setCalculationMode("resources")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    calculationMode === "resources"
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">Resource Based</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Calculate output from owned materials
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Material Selection */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 animate-slide-up">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                Material Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Material Type
                  </label>
                  <select
                    value={materialType}
                    onChange={(e) =>
                      setMaterialType(e.target.value as MaterialType)
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Object.entries(MATERIAL_TYPES).map(([key, material]) => (
                      <option key={key} value={key}>
                        {material.icon} {material.name} → {material.refined}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(Number(e.target.value) as Tier)}
                    className="input-field"
                  >
                    {Object.keys(TIER_REQUIREMENTS).map((t) => (
                      <option key={t} value={t}>
                        T{t} {MATERIAL_NAMES[materialType][Number(t) as Tier]}
                      </option>
                    ))}
                  </select>
                </div>

                {calculationMode === "target" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Quantity
                    </label>
                    <input
                      type="number"
                      value={targetQuantity}
                      onChange={(e) =>
                        setTargetQuantity(Number(e.target.value))
                      }
                      className="input-field"
                      min="1"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Owned {rawMaterialName}
                      </label>
                      <input
                        type="number"
                        value={ownedRawMaterials}
                        onChange={(e) =>
                          setOwnedRawMaterials(Number(e.target.value))
                        }
                        className="input-field"
                        min="0"
                      />
                    </div>

                    {tier > 2 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Owned {lowerTierRefinedName}
                        </label>
                        <input
                          type="number"
                          value={ownedLowerTierRefined}
                          onChange={(e) =>
                            setOwnedLowerTierRefined(Number(e.target.value))
                          }
                          className="input-field"
                          min="0"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Price Configuration */}
            <div className="card p-6 animate-slide-up">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Price Configuration (Silver)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {rawMaterialName} Price
                  </label>
                  <input
                    type="number"
                    value={rawMaterialPrice}
                    onChange={(e) =>
                      setRawMaterialPrice(Number(e.target.value))
                    }
                    className="input-field"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {refinedMaterialName} Price
                  </label>
                  <input
                    type="number"
                    value={refinedMaterialPrice}
                    onChange={(e) =>
                      setRefinedMaterialPrice(Number(e.target.value))
                    }
                    className="input-field"
                    min="0"
                  />
                </div>

                {tier > 2 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {lowerTierRefinedName} Price
                    </label>
                    <input
                      type="number"
                      value={lowerTierRefinedPrice}
                      onChange={(e) =>
                        setLowerTierRefinedPrice(Number(e.target.value))
                      }
                      className="input-field"
                      min="0"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="card p-6 animate-slide-up">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                Refining Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <ToggleSwitch
                    checked={isBonusCity}
                    onChange={setIsBonusCity}
                    label={`Bonus City (${RETURN_RATES.bonusCity}% return rate)`}
                  />

                  {isBonusCity && (
                    <ToggleSwitch
                      checked={isRefiningDay}
                      onChange={setIsRefiningDay}
                      label={`Refining Day (+10% bonus = ${RETURN_RATES.bonusCityWithRefiningDay}%)`}
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <ToggleSwitch
                    checked={useFocus}
                    onChange={setUseFocus}
                    label="Use Focus (53.9% return rate)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {(result || resourceResult) && (
              <>
                {calculationMode === "target" && result && (
                  <>
                    {/* Under Construction Notice */}
                    <div className="card p-6 animate-scale-in">
                      <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Settings className="w-5 h-5 text-yellow-400" />
                          <div>
                            <div className="text-yellow-400 font-medium">
                              Target Mode - Under Construction
                            </div>
                            <div className="text-yellow-300/80 text-sm mt-1">
                              This mode is currently being refined. Some
                              features may not work correctly.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Material Requirements */}
                    <div className="card p-6 animate-scale-in">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-blue-500" />
                        Material Requirements
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            {rawMaterialName} needed:
                          </span>
                          <span className="font-medium">
                            {result.rawMaterialsNeeded.toLocaleString()}
                          </span>
                        </div>

                        {tier > 2 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              {lowerTierRefinedName} needed:
                            </span>
                            <span className="font-medium">
                              {result.lowerTierRefinedNeeded.toLocaleString()}
                            </span>
                          </div>
                        )}

                        <div className="border-t border-dark-600 pt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Expected output:
                            </span>
                            <span className="font-medium text-primary-400">
                              {result.expectedOutput.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Return rate:</span>
                          <span className="font-medium text-green-400">
                            {result.effectiveReturnRate.toFixed(1)}%
                          </span>
                        </div>

                        {!result.canCraftAll && (
                          <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mt-3">
                            <div className="flex items-center gap-2 text-red-400 text-xs font-medium mb-1">
                              <AlertCircle className="w-4 h-4" />
                              Insufficient Materials
                            </div>
                            {result.missingRawMaterials > 0 && (
                              <div className="text-xs text-red-300">
                                Missing{" "}
                                {result.missingRawMaterials.toLocaleString()}{" "}
                                {rawMaterialName}
                              </div>
                            )}
                            {result.missingLowerTierRefined > 0 && (
                              <div className="text-xs text-red-300">
                                Missing{" "}
                                {result.missingLowerTierRefined.toLocaleString()}{" "}
                                {lowerTierRefinedName}
                              </div>
                            )}
                            <div className="text-xs text-gray-400 mt-1">
                              Max possible crafts:{" "}
                              {result.maxPossibleCrafts.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="card p-6 animate-scale-in">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-red-400" />
                        Cost Breakdown
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            {rawMaterialName}:
                          </span>
                          <span className="font-medium">
                            {result.rawMaterialCost.toLocaleString()} 🪙
                          </span>
                        </div>

                        {tier > 2 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              {lowerTierRefinedName}:
                            </span>
                            <span className="font-medium">
                              {result.lowerTierRefinedCost.toLocaleString()} 🪙
                            </span>
                          </div>
                        )}

                        {useFocus && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Focus className="w-3 h-3" />
                              Focus cost:
                            </span>
                            <span className="font-medium">
                              {result.focusCost.toLocaleString()} ⚡
                            </span>
                          </div>
                        )}

                        <div className="border-t border-dark-600 pt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-medium">
                              Total cost:
                            </span>
                            <span className="font-bold text-red-400">
                              {result.totalCost.toLocaleString()} 🪙
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profit Analysis */}
                    <div className="card p-6 animate-scale-in">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Profit Analysis
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total revenue:</span>
                          <span className="font-medium text-green-400">
                            {result.totalRevenue.toLocaleString()} 🪙
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Materials returned value:
                          </span>
                          <span className="font-medium text-blue-400">
                            {result.returnedMaterialsValue.toLocaleString()} 🪙
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Gross profit:</span>
                          <span
                            className={`font-medium ${
                              result.grossProfit >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {result.grossProfit.toLocaleString()} 🪙
                          </span>
                        </div>

                        <div className="border-t border-dark-600 pt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-medium">
                              Net profit:
                            </span>
                            <span
                              className={`font-bold text-lg ${
                                result.netProfit >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {result.netProfit.toLocaleString()} 🪙
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Profit per unit:
                          </span>
                          <span
                            className={`font-medium ${
                              result.profitPerUnit >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {result.profitPerUnit.toFixed(0)} 🪙
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Profit margin:</span>
                          <span
                            className={`font-medium ${
                              result.profitMargin >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {result.profitMargin.toFixed(1)}%
                          </span>
                        </div>

                        {useFocus && result.profitPerFocus > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Profit per focus:
                            </span>
                            <span className="font-medium text-purple-400">
                              {result.profitPerFocus.toFixed(0)} 🪙
                            </span>
                          </div>
                        )}
                      </div>

                      {result.netProfit >= 0 ? (
                        <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 mt-4">
                          <div className="text-green-400 text-xs font-medium">
                            ✅ Profitable refining operation
                          </div>
                        </div>
                      ) : (
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mt-4">
                          <div className="text-red-400 text-xs font-medium">
                            ❌ Loss-making operation
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {calculationMode === "resources" && resourceResult && (
                  <>
                    {/* Resource Consumption */}
                    <div className="card p-6 animate-scale-in">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-orange-500" />
                        Resource Consumption
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            {rawMaterialName} used:
                          </span>
                          <span className="font-medium text-red-400">
                            -{resourceResult.rawMaterialsUsed.toLocaleString()}
                          </span>
                        </div>

                        {tier > 2 &&
                          resourceResult.lowerTierRefinedUsed > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                {lowerTierRefinedName} used:
                              </span>
                              <span className="font-medium text-red-400">
                                -
                                {resourceResult.lowerTierRefinedUsed.toLocaleString()}
                              </span>
                            </div>
                          )}

                        <div className="border-t border-dark-600 pt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Refinements made:
                            </span>
                            <span className="font-medium text-primary-400">
                              {resourceResult.refinementsMade.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Iterations:</span>
                          <span className="font-medium text-blue-400">
                            {resourceResult.iterations}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Return rate:</span>
                          <span className="font-medium text-green-400">
                            {resourceResult.effectiveReturnRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Final Inventory */}
                    <div className="card p-6 animate-scale-in">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Archive className="w-5 h-5 text-blue-500" />
                        Final Inventory
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            {rawMaterialName} remaining:
                          </span>
                          <span className="font-medium">
                            {resourceResult.finalInventory.rawMaterials.toLocaleString()}
                          </span>
                        </div>

                        {tier > 2 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              {lowerTierRefinedName} remaining:
                            </span>
                            <span className="font-medium">
                              {resourceResult.finalInventory.lowerTierRefined.toLocaleString()}
                            </span>
                          </div>
                        )}

                        <div className="border-t border-dark-600 pt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-medium">
                              {refinedMaterialName} produced:
                            </span>
                            <span className="font-bold text-lg text-primary-400">
                              {resourceResult.finalInventory.refinedMaterials.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {resourceResult.finalInventory.higherTierRefined >
                          0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              T{tier + 1} {materialType} produced:
                            </span>
                            <span className="font-medium text-purple-400">
                              {resourceResult.finalInventory.higherTierRefined.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profit Analysis */}
                    <div className="card p-6 animate-scale-in">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Profit Analysis
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Total value produced:
                          </span>
                          <span className="font-medium text-green-400">
                            {resourceResult.totalValueProduced.toLocaleString()}{" "}
                            🪙
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            {rawMaterialName}:
                          </span>
                          <span className="font-medium text-red-400">
                            {resourceResult.rawMaterialCost.toLocaleString()} 🪙
                          </span>
                        </div>

                        {tier > 2 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              {lowerTierRefinedName}:
                            </span>
                            <span className="font-medium text-red-400">
                              {resourceResult.lowerTierRefinedCost.toLocaleString()}{" "}
                              🪙
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Materials returned value:
                          </span>
                          <span className="font-medium text-blue-400">
                            {resourceResult.returnedMaterialsValue.toLocaleString()}{" "}
                            🪙
                          </span>
                        </div>

                        <div className="border-t border-dark-600 pt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Total revenue:
                            </span>
                            <span className="font-medium text-green-400">
                              {resourceResult.totalRevenue.toLocaleString()} 🪙
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Gross profit:</span>
                          <span
                            className={`font-medium ${
                              resourceResult.grossProfit >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {resourceResult.grossProfit.toLocaleString()} 🪙
                          </span>
                        </div>

                        <div className="border-t border-dark-600 pt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-medium">
                              Net profit:
                            </span>
                            <span
                              className={`font-bold text-lg ${
                                resourceResult.netProfit >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {resourceResult.netProfit.toLocaleString()} 🪙
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Profit per unit:
                          </span>
                          <span
                            className={`font-medium ${
                              resourceResult.profitPerUnit >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {resourceResult.profitPerUnit.toFixed(0)} 🪙
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Profit margin:</span>
                          <span
                            className={`font-medium ${
                              resourceResult.profitMargin >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {resourceResult.profitMargin.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {resourceResult.netProfit >= 0 ? (
                        <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 mt-4">
                          <div className="text-green-400 text-xs font-medium">
                            ✅ Profitable refining from owned resources
                          </div>
                        </div>
                      ) : (
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mt-4">
                          <div className="text-red-400 text-xs font-medium">
                            ❌ Loss compared to selling raw materials
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
