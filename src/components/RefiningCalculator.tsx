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
  Sun,
  Moon,
  Sparkles,
  Crown,
  Coins,
  BarChart3,
  Activity,
  Target,
  Layers,
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
    <span className="text-sm font-medium text-secondary">{label}</span>
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const [result, setResult] = useState<RefiningResult | null>(null);
  const [resourceResult, setResourceResult] =
    useState<ResourceBasedResult | null>(null);

  // Update document theme attribute
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  // Handler untuk toggle Use Focus dengan logic auto-off untuk bonus city dan refining day
  const handleUseFocusToggle = (value: boolean) => {
    setUseFocus(value);
    if (value) {
      // Jika Use Focus dinyalakan, matikan Bonus City dan Refining Day
      setIsBonusCity(false);
      setIsRefiningDay(false);
    }
  };

  // Handler untuk toggle Bonus City dengan logic auto-off untuk Use Focus
  const handleBonusCityToggle = (value: boolean) => {
    setIsBonusCity(value);
    if (value) {
      // Jika Bonus City dinyalakan, matikan Use Focus
      setUseFocus(false);
    }
    if (!value) {
      // Jika Bonus City dimatikan, matikan juga Refining Day
      setIsRefiningDay(false);
    }
  };

  // Handler untuk toggle Refining Day dengan logic auto-off untuk Use Focus
  const handleRefiningDayToggle = (value: boolean) => {
    setIsRefiningDay(value);
    if (value) {
      // Jika Refining Day dinyalakan, matikan Use Focus
      setUseFocus(false);
    }
  };

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

  // Theme configuration
  const themeConfig = {
    dark: {
      bg: "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950",
      cardBg: "bg-slate-800/80 backdrop-blur-sm border-slate-700/60",
      text: "text-gray-100",
      textSecondary: "text-gray-300",
      textMuted: "text-gray-400",
      accent: "from-blue-500 to-purple-600",
      accentHover: "from-blue-600 to-purple-700",
      inputBg: "bg-slate-700/80 border-slate-600",
      inputFocus: "focus:ring-blue-500/50 focus:border-blue-500",
    },
    light: {
      bg: "bg-gradient-to-br from-blue-50 via-white to-indigo-50",
      cardBg: "bg-white/90 backdrop-blur-sm border-gray-200/60 shadow-lg",
      text: "text-gray-900",
      textSecondary: "text-gray-700",
      textMuted: "text-gray-500",
      accent: "from-blue-600 to-purple-700",
      accentHover: "from-blue-700 to-purple-800",
      inputBg: "bg-gray-50 border-gray-300",
      inputFocus: "focus:ring-blue-500/50 focus:border-blue-500",
    },
  };

  // Reusable classes
  const cardClass = `${
    isDarkMode ? themeConfig.dark.cardBg : themeConfig.light.cardBg
  } border ${
    isDarkMode ? "border-slate-700" : "border-gray-200"
  } rounded-lg shadow-lg p-6`;

  const inputClass = `w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    isDarkMode
      ? "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  }`;

  const labelClass = `block text-sm font-medium mb-2 ${
    isDarkMode ? "text-gray-300" : "text-gray-700"
  }`;

  const theme = isDarkMode ? themeConfig.dark : themeConfig.light;

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} p-4 transition-all duration-500`}
      data-theme={isDarkMode ? "dark" : "light"}
    >
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header with Theme Toggle */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${theme.accent} shadow-lg`}
              >
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1
                  className={`text-4xl font-bold bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}
                >
                  Albion Refining Calculator
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className={`text-sm ${theme.textMuted} font-medium`}>
                    Premium Analytics Suite
                  </span>
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center gap-3">
              <span className={`text-sm ${theme.textMuted}`}>
                {isDarkMode ? "Dark" : "Light"}
              </span>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative w-14 h-7 ${theme.cardBg} rounded-full border transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-gradient-to-r ${
                    theme.accent
                  } rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center ${
                    isDarkMode ? "translate-x-7" : "translate-x-0"
                  }`}
                >
                  {isDarkMode ? (
                    <Moon className="w-3 h-3 text-white" />
                  ) : (
                    <Sun className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
            </div>
          </div>
          <p
            className={`text-lg ${
              isDarkMode
                ? themeConfig.dark.textSecondary
                : themeConfig.light.textSecondary
            }`}
          >
            Calculate refining costs, profits, and material requirements with
            Albion Online mechanics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calculation Mode Selection */}
            <div
              className={`${
                isDarkMode ? themeConfig.dark.cardBg : themeConfig.light.cardBg
              } border ${
                isDarkMode ? "border-slate-700" : "border-gray-200"
              } rounded-lg shadow-lg p-6 animate-slide-up`}
            >
              <h2
                className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                  isDarkMode ? themeConfig.dark.text : themeConfig.light.text
                }`}
              >
                <Calculator
                  className={`w-5 h-5 ${
                    isDarkMode
                      ? themeConfig.dark.accent
                      : themeConfig.light.accent
                  }`}
                />
                Calculation Mode
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setCalculationMode("target")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    calculationMode === "target"
                      ? `border-blue-500 ${
                          isDarkMode
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-blue-50 text-blue-600"
                        }`
                      : `${
                          isDarkMode
                            ? "border-slate-600 hover:border-slate-500 text-slate-300"
                            : "border-gray-300 hover:border-gray-400 text-gray-700"
                        }`
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">Target Based</div>
                    <div
                      className={`text-sm mt-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Calculate materials needed for specific quantity
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setCalculationMode("resources")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    calculationMode === "resources"
                      ? `border-blue-500 ${
                          isDarkMode
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-blue-50 text-blue-600"
                        }`
                      : `${
                          isDarkMode
                            ? "border-slate-600 hover:border-slate-500 text-slate-300"
                            : "border-gray-300 hover:border-gray-400 text-gray-700"
                        }`
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">Resource Based</div>
                    <div
                      className={`text-sm mt-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Calculate output from owned materials
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Material Selection */}
            <div
              className={`${
                isDarkMode ? themeConfig.dark.cardBg : themeConfig.light.cardBg
              } border ${
                isDarkMode ? "border-slate-700" : "border-gray-200"
              } rounded-lg shadow-lg p-6 animate-slide-up`}
            >
              <h2
                className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                  isDarkMode ? themeConfig.dark.text : themeConfig.light.text
                }`}
              >
                <Settings
                  className={`w-5 h-5 ${
                    isDarkMode
                      ? themeConfig.dark.accent
                      : themeConfig.light.accent
                  }`}
                />
                Material Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Material Type
                  </label>
                  <select
                    value={materialType}
                    onChange={(e) =>
                      setMaterialType(e.target.value as MaterialType)
                    }
                    className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  >
                    {Object.entries(MATERIAL_TYPES).map(([key, material]) => (
                      <option key={key} value={key}>
                        {material.icon} {material.name} → {material.refined}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(Number(e.target.value) as Tier)}
                    className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
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
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Target Quantity
                    </label>
                    <input
                      type="number"
                      value={targetQuantity}
                      onChange={(e) =>
                        setTargetQuantity(Number(e.target.value))
                      }
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                      min="1"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Owned {rawMaterialName}
                      </label>
                      <input
                        type="number"
                        value={ownedRawMaterials}
                        onChange={(e) =>
                          setOwnedRawMaterials(Number(e.target.value))
                        }
                        className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode
                            ? "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                        min="0"
                      />
                    </div>

                    {tier > 2 && (
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Owned {lowerTierRefinedName}
                        </label>
                        <input
                          type="number"
                          value={ownedLowerTierRefined}
                          onChange={(e) =>
                            setOwnedLowerTierRefined(Number(e.target.value))
                          }
                          className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            isDarkMode
                              ? "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                          min="0"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Price Configuration */}
            <div
              className={`${
                isDarkMode ? themeConfig.dark.cardBg : themeConfig.light.cardBg
              } border ${
                isDarkMode ? "border-slate-700" : "border-gray-200"
              } rounded-lg shadow-lg p-6 animate-slide-up`}
            >
              <h2
                className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                  isDarkMode ? themeConfig.dark.text : themeConfig.light.text
                }`}
              >
                <TrendingUp
                  className={`w-5 h-5 ${
                    isDarkMode
                      ? themeConfig.dark.accent
                      : themeConfig.light.accent
                  }`}
                />
                Price Configuration (Silver)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {rawMaterialName} Price
                  </label>
                  <input
                    type="number"
                    value={rawMaterialPrice}
                    onChange={(e) =>
                      setRawMaterialPrice(Number(e.target.value))
                    }
                    className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    min="0"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {refinedMaterialName} Price
                  </label>
                  <input
                    type="number"
                    value={refinedMaterialPrice}
                    onChange={(e) =>
                      setRefinedMaterialPrice(Number(e.target.value))
                    }
                    className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    min="0"
                  />
                </div>

                {tier > 2 && (
                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
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
            <div className={`${cardClass} animate-slide-up`}>
              <h2
                className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                  isDarkMode ? themeConfig.dark.text : themeConfig.light.text
                }`}
              >
                <Settings
                  className={`w-5 h-5 ${
                    isDarkMode
                      ? themeConfig.dark.accent
                      : themeConfig.light.accent
                  }`}
                />
                Refining Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <ToggleSwitch
                    checked={isBonusCity}
                    onChange={handleBonusCityToggle}
                    label={`Bonus City (${RETURN_RATES.bonusCity}% return rate)`}
                  />

                  {isBonusCity && (
                    <ToggleSwitch
                      checked={isRefiningDay}
                      onChange={handleRefiningDayToggle}
                      label={`Refining Day (+10% bonus = ${RETURN_RATES.bonusCityWithRefiningDay}%)`}
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <ToggleSwitch
                    checked={useFocus}
                    onChange={handleUseFocusToggle}
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
                    <div
                      className={`${
                        isDarkMode
                          ? themeConfig.dark.cardBg
                          : themeConfig.light.cardBg
                      } border ${
                        isDarkMode ? "border-slate-700" : "border-gray-200"
                      } rounded-lg shadow-lg p-6 animate-scale-in`}
                    >
                      <div
                        className={`border rounded-lg p-4 ${
                          isDarkMode
                            ? "bg-yellow-900/20 border-yellow-700"
                            : "bg-yellow-50 border-yellow-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Settings
                            className={`w-5 h-5 ${
                              isDarkMode ? "text-yellow-400" : "text-yellow-600"
                            }`}
                          />
                          <div>
                            <div
                              className={`font-medium ${
                                isDarkMode
                                  ? "text-yellow-400"
                                  : "text-yellow-800"
                              }`}
                            >
                              Target Mode - Under Construction
                            </div>
                            <div
                              className={`text-sm mt-1 ${
                                isDarkMode
                                  ? "text-yellow-300/80"
                                  : "text-yellow-700"
                              }`}
                            >
                              This mode is currently being refined. Some
                              features may not work correctly.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Material Requirements */}
                    <div className={`${cardClass} animate-scale-in`}>
                      <h3
                        className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                          isDarkMode
                            ? themeConfig.dark.text
                            : themeConfig.light.text
                        }`}
                      >
                        <Calculator
                          className={`w-5 h-5 ${
                            isDarkMode
                              ? themeConfig.dark.accent
                              : themeConfig.light.accent
                          }`}
                        />
                        Material Requirements
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-secondary">
                            {rawMaterialName} needed:
                          </span>
                          <span className="font-medium text-primary">
                            {result.rawMaterialsNeeded.toLocaleString()}
                          </span>
                        </div>

                        {tier > 2 && (
                          <div className="flex justify-between">
                            <span className="text-secondary">
                              {lowerTierRefinedName} needed:
                            </span>
                            <span className="font-medium text-primary">
                              {result.lowerTierRefinedNeeded.toLocaleString()}
                            </span>
                          </div>
                        )}

                        <div
                          className={`border-t pt-2 ${
                            isDarkMode ? "border-slate-600" : "border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className="text-secondary">
                              Expected output:
                            </span>
                            <span className="font-medium text-primary">
                              {result.expectedOutput.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-secondary">Return rate:</span>
                          <span className="font-medium status-profitable">
                            {result.effectiveReturnRate.toFixed(1)}%
                          </span>
                        </div>

                        {!result.canCraftAll && (
                          <div
                            className={`rounded-lg p-3 mt-3 ${
                              isDarkMode
                                ? "bg-red-900/20 border border-red-700"
                                : "bg-red-50 border border-red-200"
                            }`}
                          >
                            <div className="flex items-center gap-2 status-unprofitable text-xs font-medium mb-1">
                              <AlertCircle className="w-4 h-4" />
                              Insufficient Materials
                            </div>
                            {result.missingRawMaterials > 0 && (
                              <div className="text-xs status-unprofitable">
                                Missing{" "}
                                {result.missingRawMaterials.toLocaleString()}{" "}
                                {rawMaterialName}
                              </div>
                            )}
                            {result.missingLowerTierRefined > 0 && (
                              <div className="text-xs status-unprofitable">
                                Missing{" "}
                                {result.missingLowerTierRefined.toLocaleString()}{" "}
                                {lowerTierRefinedName}
                              </div>
                            )}
                            <div className="text-xs text-muted mt-1">
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
                          <span className="text-secondary">
                            {rawMaterialName}:
                          </span>
                          <span className="font-medium text-primary">
                            {result.rawMaterialCost.toLocaleString()} 🪙
                          </span>
                        </div>

                        {tier > 2 && (
                          <div className="flex justify-between">
                            <span className="text-secondary">
                              {lowerTierRefinedName}:
                            </span>
                            <span className="font-medium text-primary">
                              {result.lowerTierRefinedCost.toLocaleString()} 🪙
                            </span>
                          </div>
                        )}

                        {useFocus && (
                          <div className="flex justify-between">
                            <span className="text-secondary flex items-center gap-1">
                              <Focus className="w-3 h-3" />
                              Focus cost:
                            </span>
                            <span className="font-medium text-primary">
                              {result.focusCost.toLocaleString()} ⚡
                            </span>
                          </div>
                        )}

                        <div
                          className={`border-t pt-2 ${
                            isDarkMode ? "border-slate-600" : "border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className="text-secondary font-medium">
                              Total cost:
                            </span>
                            <span className="font-bold status-unprofitable">
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
                          <span className="text-secondary">Total revenue:</span>
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
                        <div
                          className={`rounded-lg p-3 mt-4 ${
                            isDarkMode
                              ? "bg-green-900/20 border border-green-700"
                              : "bg-green-50 border border-green-200"
                          }`}
                        >
                          <div className="status-profitable text-xs font-medium">
                            ✅ Profitable refining operation
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`rounded-lg p-3 mt-4 ${
                            isDarkMode
                              ? "bg-red-900/20 border border-red-700"
                              : "bg-red-50 border border-red-200"
                          }`}
                        >
                          <div className="status-unprofitable text-xs font-medium">
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
                        <div
                          className={`rounded-lg p-3 mt-4 ${
                            isDarkMode
                              ? "bg-green-900/20 border border-green-700"
                              : "bg-green-50 border border-green-200"
                          }`}
                        >
                          <div className="status-profitable text-xs font-medium">
                            ✅ Profitable refining from owned resources
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`rounded-lg p-3 mt-4 ${
                            isDarkMode
                              ? "bg-red-900/20 border border-red-700"
                              : "bg-red-50 border border-red-200"
                          }`}
                        >
                          <div className="status-unprofitable text-xs font-medium">
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
