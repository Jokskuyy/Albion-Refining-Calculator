import React, { useState, useEffect } from "react";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Settings,
  Zap,
  Focus,
  Archive,
  Package,
  Sun,
  Moon,
  Sparkles,
  Crown,
  Hammer,
  Save,
} from "lucide-react";
import type { MaterialType, Tier } from "../constants/gameData";
import {
  MATERIAL_TYPES,
  TIER_REQUIREMENTS,
  RETURN_RATES,
  CRAFTING_RETURN_RATES,
  MATERIAL_NAMES,
  REFINED_NAMES,
} from "../constants/gameData";
// Removed unused RefiningResult import
import {
  calculateResourceBasedRefining,
  type ResourceBasedInput,
  type ResourceBasedResult,
} from "../utils/resourceCalculations";
import {
  calculateEquipmentCrafting,
  type EquipmentCraftingInput,
  type EquipmentCraftingResult,
} from "../utils/equipmentCalculations";
import {
  ALL_EQUIPMENT,
  EQUIPMENT_CATEGORIES,
  getEquipmentsByCategory,
  type EquipmentCategory,
} from "../constants/equipmentData";
import { SaveSessionModal } from "./SaveSessionModal";
import { SessionsList } from "./SessionsList";
import { sessionService, type SessionData } from "../services/sessionService";

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
    "equipment" | "resources"
  >("equipment");
  const [materialType, setMaterialType] = useState<MaterialType>("ore");
  const [tier, setTier] = useState<Tier>(4);

  // For equipment crafting
  const [selectedEquipmentCategory, setSelectedEquipmentCategory] =
    useState<EquipmentCategory>("armor");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("cloth_sandals");
  const [equipmentQuantity, setEquipmentQuantity] = useState<number>(10);
  const [equipmentPrice, setEquipmentPrice] = useState<number>(1000);

  // For resource-based calculation
  const [ownedRawMaterials, setOwnedRawMaterials] = useState<number>(1000);
  const [ownedLowerTierRefined, setOwnedLowerTierRefined] =
    useState<number>(500);
  const [rawMaterialPrice, setRawMaterialPrice] = useState<number>(100);
  const [refinedMaterialPrice, setRefinedMaterialPrice] = useState<number>(300);
  const [lowerTierRefinedPrice, setLowerTierRefinedPrice] =
    useState<number>(200);
    
  // Material prices for equipment crafting
  const [materialPrices, setMaterialPrices] = useState<Record<MaterialType, number>>({
    ore: 300,
    hide: 250,
    fiber: 200,
    wood: 150,
    stone: 180,
  });

  const [isBonusCity, setIsBonusCity] = useState<boolean>(true);
  const [isRefiningDay, setIsRefiningDay] = useState<boolean>(false);
  const [useFocus, setUseFocus] = useState<boolean>(false);
  const [marketTaxPercent] = useState<number>(4);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Save session state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Sessions view state
  const [showSessions, setShowSessions] = useState<boolean>(false);

  const [resourceResult, setResourceResult] =
    useState<ResourceBasedResult | null>(null);
  const [equipmentResult, setEquipmentResult] =
    useState<EquipmentCraftingResult | null>(null);

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
    if (calculationMode === "equipment") {
      const equipment = ALL_EQUIPMENT[selectedEquipment];
      if (!equipment) return;

      const input: EquipmentCraftingInput = {
        equipment,
        tier,
        quantity: equipmentQuantity,
        materialPrices,
        equipmentPrice,
        returnRate: isBonusCity
          ? isRefiningDay
            ? CRAFTING_RETURN_RATES.bonusCityWithRefiningDay
            : CRAFTING_RETURN_RATES.bonusCity
          : CRAFTING_RETURN_RATES.nonBonusCity,
        useFocus,
        stationFeePercent: 0,
        marketTaxPercent,
        isPremium: false,
      };

      const calculatedResult = calculateEquipmentCrafting(input);
      setEquipmentResult(calculatedResult);
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
      setEquipmentResult(null);
    }
  };

  useEffect(() => {
    calculateResult();
  }, [
    calculationMode,
    materialType,
    tier,
    selectedEquipment,
    equipmentQuantity,
    equipmentPrice,
    materialPrices,
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

  // Save session functionality
  const handleSaveSession = async (sessionName: string) => {
    setIsSaving(true);
    
    try {
      const currentResult = calculationMode === "equipment" ? equipmentResult : resourceResult;
      
      const sessionData: Omit<SessionData, 'id' | 'createdAt' | 'updatedAt'> = {
        sessionName,
        calculationMode,
        tier,
        returnRate: isBonusCity
          ? isRefiningDay
            ? calculationMode === "equipment" 
              ? CRAFTING_RETURN_RATES.bonusCityWithRefiningDay
              : RETURN_RATES.bonusCityWithRefiningDay
            : calculationMode === "equipment"
              ? CRAFTING_RETURN_RATES.bonusCity
              : RETURN_RATES.bonusCity
          : calculationMode === "equipment"
            ? CRAFTING_RETURN_RATES.nonBonusCity
            : RETURN_RATES.nonBonusCity,
        useFocus,
        isBonusCity,
        isRefiningDay,
        marketTaxPercent,
        
        // Equipment specific
        ...(calculationMode === "equipment" && {
          equipmentId: selectedEquipment,
          equipmentQuantity,
          equipmentPrice,
          materialPrices,
        }),
        
        // Resource specific  
        ...(calculationMode === "resources" && {
          materialType,
          ownedRawMaterials,
          ownedLowerTierRefined,
          rawMaterialPrice,
          refinedMaterialPrice,
          lowerTierRefinedPrice,
        }),
        
        // Results
        totalProfit: currentResult?.netProfit || 0,
        profitPerItem: currentResult?.profitPerUnit || 0,
      };

      const response = await sessionService.saveSession(sessionData);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save session');
      }
      
      // Success is handled by the modal
    } catch (error) {
      console.error('Save session error:', error);
      throw error; // Re-throw to let modal handle the error display
    } finally {
      setIsSaving(false);
    }
  };

  // Load session functionality
  const handleLoadSession = (sessionData: SessionData) => {
    // Set common fields
    setTier(sessionData.tier as Tier);
    setIsBonusCity(sessionData.isBonusCity);
    setIsRefiningDay(sessionData.isRefiningDay);
    setUseFocus(sessionData.useFocus);
    setCalculationMode(sessionData.calculationMode);

    if (sessionData.calculationMode === 'equipment') {
      // Load equipment specific data
      if (sessionData.equipmentId) {
        setSelectedEquipment(sessionData.equipmentId);
      }
      if (sessionData.equipmentQuantity) {
        setEquipmentQuantity(sessionData.equipmentQuantity);
      }
      if (sessionData.equipmentPrice) {
        setEquipmentPrice(sessionData.equipmentPrice);
      }
      if (sessionData.materialPrices) {
        setMaterialPrices(sessionData.materialPrices);
      }
    } else {
      // Load resource specific data
      if (sessionData.materialType) {
        setMaterialType(sessionData.materialType as any);
      }
      if (sessionData.ownedRawMaterials) {
        setOwnedRawMaterials(sessionData.ownedRawMaterials);
      }
      if (sessionData.ownedLowerTierRefined) {
        setOwnedLowerTierRefined(sessionData.ownedLowerTierRefined);
      }
      if (sessionData.rawMaterialPrice) {
        setRawMaterialPrice(sessionData.rawMaterialPrice);
      }
      if (sessionData.refinedMaterialPrice) {
        setRefinedMaterialPrice(sessionData.refinedMaterialPrice);
      }
      if (sessionData.lowerTierRefinedPrice) {
        setLowerTierRefinedPrice(sessionData.lowerTierRefinedPrice);
      }
    }

    // Close sessions view and show calculator
    setShowSessions(false);
  };

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

  const theme = isDarkMode ? themeConfig.dark : themeConfig.light;

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} p-2 sm:p-4 transition-all duration-500`}
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
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}
                >
                  Albion Online Calculator
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className={`text-sm ${theme.textMuted} font-medium`}>
                    Crafting & Refining Profit Calculator
                  </span>
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              {/* View Sessions Button */}
              <button
                onClick={() => setShowSessions(!showSessions)}
                className={`px-3 sm:px-4 py-2 ${showSessions 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600' 
                  : 'bg-gradient-to-r from-gray-500 to-gray-600'
                } text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm sm:text-base`}
              >
                <Archive className="w-4 h-4" />
                <span className="hidden sm:inline">{showSessions ? 'Hide Saved' : 'View Saved'}</span>
                <span className="sm:hidden">{showSessions ? 'Hide' : 'Saved'}</span>
              </button>

              {/* Save Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className={`px-3 sm:px-4 py-2 bg-gradient-to-r ${theme.accent} text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm sm:text-base`}
                disabled={(!equipmentResult && !resourceResult)}
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save Setup</span>
                <span className="sm:hidden">Save</span>
              </button>

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
          </div>
          <p
            className={`text-lg ${
              isDarkMode
                ? themeConfig.dark.textSecondary
                : themeConfig.light.textSecondary
            }`}
          >
            Calculate crafting costs, refining profits, and material requirements 
            using accurate Albion Online game mechanics
          </p>
        </div>

        {showSessions ? (
          // Sessions View
          <div className="mb-8">
            <SessionsList 
              onLoadSession={handleLoadSession}
              calculationMode={calculationMode}
            />
          </div>
        ) : (
          // Calculator View
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Input Panel */}
          <div className="xl:col-span-2 space-y-4 md:space-y-6">
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
                  onClick={() => setCalculationMode("equipment")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    calculationMode === "equipment"
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
                  <div className="text-left flex items-center gap-2">
                    <Hammer className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Equipment Crafting</div>
                      <div
                        className={`text-sm mt-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Calculate profits when crafting weapons & armor from refined materials
                      </div>
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
                  <div className="text-left flex items-center gap-2">
                    <Archive className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Material Refining</div>
                      <div
                        className={`text-sm mt-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Calculate profits when refining raw materials you already own
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Configuration Panel */}
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
{calculationMode === "equipment" ? "Equipment Setup" : "Material & Inventory Setup"}
              </h2>

              {calculationMode === "equipment" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Equipment Category
                    </label>
                    <select
                      value={selectedEquipmentCategory}
                      onChange={(e) => {
                        setSelectedEquipmentCategory(e.target.value as EquipmentCategory);
                        // Reset selected equipment when category changes
                        const equipmentsInCategory = getEquipmentsByCategory(e.target.value as EquipmentCategory);
                        if (equipmentsInCategory.length > 0) {
                          setSelectedEquipment(equipmentsInCategory[0].id);
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    >
                      {Object.entries(EQUIPMENT_CATEGORIES).map(([key, category]) => (
                        <option key={key} value={key}>
                          {category.icon} {category.name}
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
                      Equipment
                    </label>
                    <select
                      value={selectedEquipment}
                      onChange={(e) => setSelectedEquipment(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    >
                      {getEquipmentsByCategory(selectedEquipmentCategory).map((equipment) => (
                        <option key={equipment.id} value={equipment.id}>
                          {equipment.name}
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
                          T{t}
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
                      How Many to Craft
                    </label>
                    <input
                      type="number"
                      value={equipmentQuantity}
                      onChange={(e) =>
                        setEquipmentQuantity(Number(e.target.value))
                      }
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                      min="1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Market Selling Price (per piece)
                    </label>
                    <input
                      type="number"
                      value={equipmentPrice}
                      onChange={(e) =>
                        setEquipmentPrice(Number(e.target.value))
                      }
                      className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                      min="0"
                    />
                  </div>
                </div>
              ) : (
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

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Materials Owned: {rawMaterialName}
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
                        Lower Tier Owned: {lowerTierRefinedName}
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
                </div>
              )}
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
                Market Prices (Silver per unit)
              </h2>

              {calculationMode === "equipment" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {Object.entries(MATERIAL_TYPES).map(([key, material]) => (
                    <div key={key}>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        T{tier} {REFINED_NAMES[key as MaterialType][tier]}
                      </label>
                      <input
                        type="number"
                        value={materialPrices[key as MaterialType]}
                        onChange={(e) =>
                          setMaterialPrices(prev => ({
                            ...prev,
                            [key]: Number(e.target.value)
                          }))
                        }
                        className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode
                            ? "bg-slate-700 border-slate-600 text-gray-100 placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                        min="0"
                        placeholder={`${material.refined} price`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Raw Material: {rawMaterialName}
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
                      Refined Material: {refinedMaterialName}
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
                        Lower Tier: {lowerTierRefinedName}
                      </label>
                      <input
                        type="number"
                        value={lowerTierRefinedPrice}
                        onChange={(e) =>
                          setLowerTierRefinedPrice(Number(e.target.value))
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
                </div>
              )}
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
                Bonus & Return Rate Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <ToggleSwitch
                    checked={isBonusCity}
                    onChange={handleBonusCityToggle}
                    label={`Bonus City - Higher return rate (${
                      calculationMode === "equipment" 
                        ? CRAFTING_RETURN_RATES.bonusCity 
                        : RETURN_RATES.bonusCity
                    }%)`}
                  />

                  {isBonusCity && (
                    <ToggleSwitch
                      checked={isRefiningDay}
                      onChange={handleRefiningDayToggle}
                      label={`Refining Day - Additional +10% bonus (Total: ${
                        calculationMode === "equipment" 
                          ? CRAFTING_RETURN_RATES.bonusCityWithRefiningDay 
                          : RETURN_RATES.bonusCityWithRefiningDay
                      }%)`}
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <ToggleSwitch
                    checked={useFocus}
                    onChange={handleUseFocusToggle}
                    label="Use Focus - Guaranteed high returns (53.9% rate)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-4 md:space-y-6">
            {(equipmentResult || resourceResult) && (
              <>
                {calculationMode === "equipment" && equipmentResult && (
                  <>
                    {/* Equipment Info */}
                    <div className={`${cardClass} animate-scale-in`}>
                      <h3
                        className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                          isDarkMode
                            ? themeConfig.dark.text
                            : themeConfig.light.text
                        }`}
                      >
                        <Hammer
                          className={`w-5 h-5 ${
                            isDarkMode
                              ? themeConfig.dark.accent
                              : themeConfig.light.accent
                          }`}
                        />
                        Crafting Summary
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-secondary">Equipment:</span>
                          <span className="font-medium text-primary">
                            T{equipmentResult.equipmentTier} {equipmentResult.equipmentName}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-secondary">Items to craft:</span>
                          <span className="font-medium text-primary">
                            {equipmentResult.quantityCrafted.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-secondary">Return rate:</span>
                          <span className="font-medium status-profitable">
                            {equipmentResult.effectiveReturnRate.toFixed(1)}%
                          </span>
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
                        <Package
                          className={`w-5 h-5 ${
                            isDarkMode
                              ? themeConfig.dark.accent
                              : themeConfig.light.accent
                          }`}
                        />
                        Materials Needed
                      </h3>

                      <div className="space-y-3 text-sm">
                        {equipmentResult.materialRequirements.map((req) => (
                          <div key={req.materialType} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-secondary">
                                {req.refinedName} required:
                              </span>
                              <span className="font-medium text-primary">
                                {req.amount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted">
                                Materials returned:
                              </span>
                              <span className="font-medium text-green-400">
                                {req.returned.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted">Actually consumed:</span>
                              <span className="font-medium text-red-400">
                                {req.netUsed.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}

                        <div
                          className={`border-t pt-2 ${
                            isDarkMode ? "border-slate-600" : "border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className="text-secondary font-medium">
                              Total material investment:
                            </span>
                            <span className="font-bold status-unprofitable">
                              {equipmentResult.totalMaterialCost.toLocaleString()} 🪙
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-secondary">
                            Actual material cost:
                          </span>
                          <span className="font-medium text-red-400">
                            {equipmentResult.totalNetMaterialCost.toLocaleString()} 🪙
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-secondary">
                            Returned materials value:
                          </span>
                          <span className="font-medium text-green-400">
                            {equipmentResult.returnedMaterialsValue.toLocaleString()} 🪙
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className={`${cardClass} animate-scale-in`}>
                      <h3
                        className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                          isDarkMode
                            ? themeConfig.dark.text
                            : themeConfig.light.text
                        }`}
                      >
                        <TrendingDown className="w-5 h-5 text-red-400" />
                        Cost Breakdown
                      </h3>

                      <div className="space-y-3 text-sm">
                        {equipmentResult.materialRequirements.map((req) => (
                          <div key={req.materialType} className="flex justify-between">
                            <span className="text-secondary">
                              {req.refinedName} (net):
                            </span>
                            <span className="font-medium text-primary">
                              {req.netCost.toLocaleString()} 🪙
                            </span>
                          </div>
                        ))}

                        <div className="flex justify-between">
                          <span className="text-secondary">
                            Station fee:
                          </span>
                          <span className="font-medium text-primary">
                            {equipmentResult.stationFee.toLocaleString()} 🪙
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-secondary">
                            Market tax:
                          </span>
                          <span className="font-medium text-primary">
                            {equipmentResult.marketTax.toLocaleString()} 🪙
                          </span>
                        </div>

                        {useFocus && equipmentResult.focusCost > 0 && (
                          <div className="flex justify-between">
                            <span className="text-secondary flex items-center gap-1">
                              <Focus className="w-3 h-3" />
                              Focus cost:
                            </span>
                            <span className="font-medium text-primary">
                              {equipmentResult.focusCost.toLocaleString()} ⚡
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
                              {equipmentResult.totalCost.toLocaleString()} 🪙
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profit Analysis */}
                    <div className={`${cardClass} animate-scale-in`}>
                      <h3
                        className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                          isDarkMode
                            ? themeConfig.dark.text
                            : themeConfig.light.text
                        }`}
                      >
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Profit Analysis
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-secondary">Total revenue:</span>
                          <span className="font-medium text-green-400">
                            {equipmentResult.totalRevenue.toLocaleString()} 🪙
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Materials returned value:
                          </span>
                          <span className="font-medium text-blue-400">
                            {equipmentResult.returnedMaterialsValue.toLocaleString()} 🪙
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Gross profit:</span>
                          <span
                            className={`font-medium ${
                              equipmentResult.grossProfit >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {equipmentResult.grossProfit.toLocaleString()} 🪙
                          </span>
                        </div>

                        <div className="border-t border-dark-600 pt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-medium">
                              Net profit:
                            </span>
                            <span
                              className={`font-bold text-lg ${
                                equipmentResult.netProfit >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {equipmentResult.netProfit.toLocaleString()} 🪙
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Profit per unit:
                          </span>
                          <span
                            className={`font-medium ${
                              equipmentResult.profitPerUnit >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {equipmentResult.profitPerUnit.toFixed(0)} 🪙
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Profit margin:</span>
                          <span
                            className={`font-medium ${
                              equipmentResult.profitMargin >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {equipmentResult.profitMargin.toFixed(1)}%
                          </span>
                        </div>

                        {useFocus && equipmentResult.profitPerFocus > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Profit per focus:
                            </span>
                            <span className="font-medium text-purple-400">
                              {equipmentResult.profitPerFocus.toFixed(0)} 🪙
                            </span>
                          </div>
                        )}
                      </div>

                      {equipmentResult.isProfitable ? (
                        <div
                          className={`rounded-lg p-3 mt-4 ${
                            isDarkMode
                              ? "bg-green-900/20 border border-green-700"
                              : "bg-green-50 border border-green-200"
                          }`}
                        >
                          <div className="status-profitable text-xs font-medium">
                            ✅ This crafting operation is profitable!
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
                            ❌ This crafting operation will lose money
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
                            ✅ Refining your materials is profitable!
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
                            ❌ Better to sell raw materials directly
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
        )}
      </div>

      {/* Save Session Modal */}
      <SaveSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSession}
        isLoading={isSaving}
      />
    </div>
  );
};
