import React, { useState, useEffect, useCallback } from "react";
import {
  Calculator,
  TrendingUp,
  Focus,
  Archive,
  Package,
  Sparkles,
  Crown,
  Hammer,
  Save,
} from "lucide-react";
import type { MaterialType, Tier } from "../constants/gameData";
import {
  MATERIAL_TYPES,
  RETURN_RATES,
  CRAFTING_RETURN_RATES,
} from "../constants/gameData";
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
  calculateMultiTierRefining,
  type MultiTierInput,
  type MultiTierResult,
} from "../utils/multiTierCalculations";
import {
  ALL_EQUIPMENT,
  EQUIPMENT_CATEGORIES,
  getEquipmentsByCategory,
  type EquipmentCategory,
} from "../constants/equipmentData";
import { SaveSessionModal } from "./SaveSessionModal";
import { SessionsList } from "./SessionsList";
import { sessionService, type SessionData } from "../services/sessionService";

const RefiningCalculatorNew: React.FC = () => {
  // Calculation Mode State
  const [calculationMode, setCalculationMode] = useState<
    "equipment" | "resources" | "multi-tier"
  >("equipment");
  const [materialType, setMaterialType] = useState<MaterialType>("ore");
  const [tier, setTier] = useState<Tier>(4);

  // Equipment Crafting State
  const [selectedEquipmentCategory, setSelectedEquipmentCategory] =
    useState<EquipmentCategory>("armor");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("cloth_sandals");
  const [equipmentQuantity, setEquipmentQuantity] = useState<number>(10);
  const [equipmentPrice, setEquipmentPrice] = useState<number>(1000);

  // Resource-based Calculation State
  const [ownedRawMaterials, setOwnedRawMaterials] = useState<number>(1000);
  const [ownedLowerTierRefined, setOwnedLowerTierRefined] = useState<number>(500);
  const [rawMaterialPrice, setRawMaterialPrice] = useState<number>(100);
  const [refinedMaterialPrice, setRefinedMaterialPrice] = useState<number>(300);
  const [lowerTierRefinedPrice, setLowerTierRefinedPrice] = useState<number>(200);
    
  // Multi-tier Calculation State
  const [startTier, setStartTier] = useState<Tier>(3);
  const [endTier, setEndTier] = useState<Tier>(6);
  const [ownedStartMaterials, setOwnedStartMaterials] = useState<number>(1000);
  const [multiTierRawMaterials, setMultiTierRawMaterials] = useState<Record<Tier, number>>({
    2: 0, 3: 1000, 4: 1000, 5: 1000, 6: 1000, 7: 1000, 8: 1000
  });
  const [multiTierRawPrices, setMultiTierRawPrices] = useState<Record<Tier, number>>({
    2: 50, 3: 100, 4: 200, 5: 400, 6: 800, 7: 1600, 8: 3200
  });
  const [multiTierRefinedPrices, setMultiTierRefinedPrices] = useState<Record<Tier, number>>({
    2: 150, 3: 300, 4: 600, 5: 1200, 6: 2400, 7: 4800, 8: 9600
  });
    
  // Material Prices for Equipment Crafting
  const [materialPrices, setMaterialPrices] = useState<Record<MaterialType, number>>({
    ore: 300,
    hide: 250,
    fiber: 200,
    wood: 150,
    stone: 180,
  });

  // Bonus & Focus State
  const [isBonusCity, setIsBonusCity] = useState<boolean>(true);
  const [isRefiningDay, setIsRefiningDay] = useState<boolean>(false);
  const [useFocus, setUseFocus] = useState<boolean>(false);
  const [marketTaxPercent] = useState<number>(4);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Session Management State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSessions, setShowSessions] = useState<boolean>(false);

  // Results State
  const [resourceResult, setResourceResult] = useState<ResourceBasedResult | null>(null);
  const [equipmentResult, setEquipmentResult] = useState<EquipmentCraftingResult | null>(null);
  const [multiTierResult, setMultiTierResult] = useState<MultiTierResult | null>(null);

  // Theme Effect
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  // Handler untuk toggle Use Focus dengan logic auto-off untuk bonus city dan refining day
  const handleUseFocusToggle = useCallback((value: boolean) => {
    setUseFocus(value);
    if (value) {
      setIsBonusCity(false);
      setIsRefiningDay(false);
    }
  }, []);

  // Handler untuk toggle Bonus City dengan logic auto-off untuk Use Focus
  const handleBonusCityToggle = useCallback((value: boolean) => {
    setIsBonusCity(value);
    if (value) {
      setUseFocus(false);
    }
    if (!value) {
      setIsRefiningDay(false);
    }
  }, []);

  // Handler untuk toggle Refining Day dengan logic auto-off untuk Use Focus
  const handleRefiningDayToggle = useCallback((value: boolean) => {
    setIsRefiningDay(value);
    if (value) {
      setUseFocus(false);
    }
  }, []);

  // Calculate Result Function
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
        marketTaxPercent,
        stationFeePercent: 4.5,
        isPremium: false,
      };

      const result = calculateEquipmentCrafting(input);
      setEquipmentResult(result);
      setResourceResult(null);
      setMultiTierResult(null);
    } else if (calculationMode === "resources") {
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
        useFocus,
        marketTaxPercent,
        masteryLevel: 0,
        stationFeePercent: 4.5,
        isPremium: false,
      };

      const result = calculateResourceBasedRefining(input);
      setResourceResult(result);
      setEquipmentResult(null);
      setMultiTierResult(null);
    } else if (calculationMode === "multi-tier") {
      const input: MultiTierInput = {
        materialType,
        startTier,
        endTier,
        ownedStartMaterials,
        multiTierRawPrices,
        refinedPrices: multiTierRefinedPrices,
        ownedRawMaterials: multiTierRawMaterials,
        returnRate: isBonusCity
          ? isRefiningDay
            ? RETURN_RATES.bonusCityWithRefiningDay
            : RETURN_RATES.bonusCity
          : RETURN_RATES.nonBonusCity,
        useFocus,
        marketTaxPercent,
      };

      const result = calculateMultiTierRefining(input);
      setMultiTierResult(result);
      setEquipmentResult(null);
      setResourceResult(null);
    }
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateResult();
  }, [
    calculationMode,
    materialType,
    tier,
    selectedEquipment,
    equipmentQuantity,
    equipmentPrice,
    ownedRawMaterials,
    ownedLowerTierRefined,
    rawMaterialPrice,
    refinedMaterialPrice,
    lowerTierRefinedPrice,
    startTier,
    endTier,
    ownedStartMaterials,
    multiTierRawMaterials,
    multiTierRawPrices,
    multiTierRefinedPrices,
    materialPrices,
    isBonusCity,
    isRefiningDay,
    useFocus,
  ]);

  // Session Management Handlers
  const handleSaveSession = useCallback(async (sessionName: string) => {
    setIsSaving(true);
    try {
      const sessionData: SessionData = {
        name: sessionName,
        calculationMode,
        materialType,
        tier,
        selectedEquipmentCategory,
        selectedEquipment,
        equipmentQuantity,
        equipmentPrice,
        ownedRawMaterials,
        ownedLowerTierRefined,
        rawMaterialPrice,
        refinedMaterialPrice,
        lowerTierRefinedPrice,
        startTier,
        endTier,
        ownedStartMaterials,
        multiTierRawMaterials,
        multiTierRawPrices,
        multiTierRefinedPrices,
        materialPrices,
        isBonusCity,
        isRefiningDay,
        useFocus,
        result: equipmentResult || resourceResult || multiTierResult || null,
      };

      await sessionService.saveSession(sessionData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save session:", error);
    } finally {
      setIsSaving(false);
    }
  }, [
    calculationMode, materialType, tier, selectedEquipmentCategory, selectedEquipment,
    equipmentQuantity, equipmentPrice, ownedRawMaterials, ownedLowerTierRefined,
    rawMaterialPrice, refinedMaterialPrice, lowerTierRefinedPrice, startTier, endTier,
    ownedStartMaterials, multiTierRawMaterials, multiTierRawPrices, multiTierRefinedPrices,
    materialPrices, isBonusCity, isRefiningDay, useFocus, equipmentResult, resourceResult, multiTierResult
  ]);

  const handleLoadSession = useCallback((session: SessionData) => {
    setCalculationMode(session.calculationMode);
    setMaterialType(session.materialType);
    setTier(session.tier);
    setSelectedEquipmentCategory(session.selectedEquipmentCategory);
    setSelectedEquipment(session.selectedEquipment);
    setEquipmentQuantity(session.equipmentQuantity);
    setEquipmentPrice(session.equipmentPrice);
    setOwnedRawMaterials(session.ownedRawMaterials);
    setOwnedLowerTierRefined(session.ownedLowerTierRefined);
    setRawMaterialPrice(session.rawMaterialPrice);
    setRefinedMaterialPrice(session.refinedMaterialPrice);
    setLowerTierRefinedPrice(session.lowerTierRefinedPrice);
    setStartTier(session.startTier);
    setEndTier(session.endTier);
    setOwnedStartMaterials(session.ownedStartMaterials);
    setMultiTierRawMaterials(session.multiTierRawMaterials);
    setMultiTierRawPrices(session.multiTierRawPrices);
    setMultiTierRefinedPrices(session.multiTierRefinedPrices);
    setMaterialPrices(session.materialPrices);
    setIsBonusCity(session.isBonusCity);
    setIsRefiningDay(session.isRefiningDay);
    setUseFocus(session.useFocus);
    setShowSessions(false);
  }, []);

  // Format currency - memoized to prevent recreation
  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat("en-US").format(Math.round(value));
  }, []);

  // Calculate current result for display
  const currentResult = equipmentResult || resourceResult || multiTierResult;
  const hasResult = currentResult !== null;
  const result = currentResult;
  
  // Get profit values - handle different result types
  const totalProfit = currentResult 
    ? ('netProfit' in currentResult ? currentResult.netProfit : currentResult.profit)
    : 0;
  const profitMargin = currentResult?.profitMargin || 0;
  const totalRevenue = currentResult?.totalRevenue || 0;
  const totalCost = currentResult?.totalCost || 0;

  return (
    <>
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}>
      </div>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT PANEL - Workshop Configuration (58-62%) */}
        <section className="relative z-10 w-full lg:w-[58%] xl:w-[62%] flex flex-col h-full overflow-y-auto border-r border-albion-border bg-albion-dark/95 backdrop-blur-sm shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
          <div className="max-w-5xl mx-auto w-full p-6 lg:p-10 space-y-8">
            
            {/* Page Header */}
            <div className="pb-2 border-b border-albion-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-white mb-1 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  Workshop Configuration
                </h2>
                <p className="text-albion-muted text-sm pl-4.5">Configure crafting parameters, market rates, and bonuses.</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSessions(!showSessions)}
                  className={`px-3 py-2 ${showSessions 
                    ? 'bg-primary text-albion-dark' 
                    : 'bg-albion-panel border border-albion-border text-albion-muted hover:text-white'
                  } rounded-lg transition-all flex items-center gap-2 text-sm font-medium`}
                >
                  <Archive className="w-4 h-4" />
                  <span className="hidden md:inline">{showSessions ? 'Hide' : 'Saved'}</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-2 bg-primary hover:bg-primary-dark text-albion-dark rounded-lg transition-all flex items-center gap-2 text-sm font-medium shadow-[0_0_15px_rgba(23,207,84,0.3)]"
                  disabled={!hasResult}
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden md:inline">Save</span>
                </button>
              </div>
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
              <>
                {/* Calculation Mode Selection Card */}
                <div className="bg-albion-panel rounded-xl border border-albion-border overflow-hidden shadow-lg shadow-black/20">
                  <div className="bg-albion-card/30 px-6 py-4 border-b border-albion-border flex justify-between items-center backdrop-blur-md">
                    <h3 className="text-white font-display font-semibold flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[20px]">category</span>
                      Calculation Mode
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setCalculationMode("equipment")}
                        className={`flex-1 p-4 rounded-lg border transition-all ${
                          calculationMode === "equipment"
                            ? "bg-albion-card border-primary text-white shadow-[0_0_15px_rgba(23,207,84,0.2)]"
                            : "bg-albion-panel border-albion-border text-albion-muted hover:border-albion-border-light hover:text-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Hammer className="w-5 h-5 mt-0.5" />
                          <div className="text-left">
                            <div className="font-semibold mb-1">Equipment Crafting</div>
                            <div className="text-xs text-albion-muted">
                              Calculate profits from crafting gear
                            </div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setCalculationMode("resources")}
                        className={`flex-1 p-4 rounded-lg border transition-all ${
                          calculationMode === "resources"
                            ? "bg-albion-card border-primary text-white shadow-[0_0_15px_rgba(23,207,84,0.2)]"
                            : "bg-albion-panel border-albion-border text-albion-muted hover:border-albion-border-light hover:text-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Package className="w-5 h-5 mt-0.5" />
                          <div className="text-left">
                            <div className="font-semibold mb-1">Material Refining</div>
                            <div className="text-xs text-albion-muted">
                              Calculate refining profits
                            </div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setCalculationMode("multi-tier")}
                        className={`flex-1 p-4 rounded-lg border transition-all ${
                          calculationMode === "multi-tier"
                            ? "bg-albion-card border-primary text-white shadow-[0_0_15px_rgba(23,207,84,0.2)]"
                            : "bg-albion-panel border-albion-border text-albion-muted hover:border-albion-border-light hover:text-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 mt-0.5" />
                          <div className="text-left">
                            <div className="font-semibold mb-1">Multi-Tier</div>
                            <div className="text-xs text-albion-muted">
                              Refine through tiers
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Configuration Card - Item Details */}
                <div className="bg-albion-panel rounded-xl border border-albion-border overflow-hidden shadow-lg shadow-black/20">
                  <div className="bg-albion-card/30 px-6 py-4 border-b border-albion-border flex justify-between items-center backdrop-blur-md">
                    <h3 className="text-white font-display font-semibold flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[20px]">settings</span>
                      Item Details
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {calculationMode === "equipment" ? (
                      <>
                        {/* Equipment Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">
                              Equipment Category
                            </label>
                            <select
                              value={selectedEquipmentCategory}
                              onChange={(e) => {
                                setSelectedEquipmentCategory(e.target.value as EquipmentCategory);
                                const equipments = getEquipmentsByCategory(e.target.value as EquipmentCategory);
                                if (equipments.length > 0) {
                                  setSelectedEquipment(equipments[0].id);
                                }
                              }}
                              className="albion-input h-12 pl-4 pr-10 rounded-lg appearance-none text-sm font-medium cursor-pointer"
                            >
                              {Object.entries(EQUIPMENT_CATEGORIES).map(([key, label]) => (
                                <option key={key} value={key}>
                                  {label.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">
                              Select Item
                            </label>
                            <select
                              value={selectedEquipment}
                              onChange={(e) => setSelectedEquipment(e.target.value)}
                              className="albion-input h-12 pl-4 pr-10 rounded-lg appearance-none text-sm font-medium cursor-pointer"
                            >
                              {getEquipmentsByCategory(selectedEquipmentCategory).map((eq) => (
                                <option key={eq.id} value={eq.id}>
                                  {eq.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Tier and Enchantment */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">Tier</label>
                            <div className="flex bg-[#0f1411] rounded-lg p-1 border border-albion-border gap-1">
                              {([4, 5, 6, 7, 8] as Tier[]).map((t) => (
                                <button
                                  key={t}
                                  onClick={() => setTier(t)}
                                  className={`flex-1 py-2 text-sm font-medium rounded transition-all ${
                                    tier === t
                                      ? "bg-albion-border border-albion-text text-white"
                                      : "bg-albion-panel border-albion-border text-albion-muted hover:bg-albion-card hover:text-white"
                                  }`}
                                >
                                  T{t}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">Quantity</label>
                            <input
                              type="number"
                              value={equipmentQuantity}
                              onChange={(e) => setEquipmentQuantity(Number(e.target.value))}
                              className="albion-input h-12 px-4 rounded-lg text-right font-mono"
                              min="1"
                            />
                          </div>
                        </div>

                        {/* Equipment Price */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">
                            Sell Price per Item
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={equipmentPrice}
                              onChange={(e) => setEquipmentPrice(Number(e.target.value))}
                              className="albion-input w-full h-12 pl-4 pr-16 rounded-lg text-right font-mono"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                              <span className="text-albion-muted text-xs font-bold uppercase">Silver</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : calculationMode === "resources" ? (
                      <>
                        {/* Material Type Selection */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">
                            Material Type
                          </label>
                          <div className="grid grid-cols-5 gap-2">
                            {(Object.keys(MATERIAL_TYPES) as MaterialType[]).map((mat) => (
                              <button
                                key={mat}
                                onClick={() => setMaterialType(mat)}
                                className={`p-3 rounded-lg border transition-all capitalize ${
                                  materialType === mat
                                    ? "bg-albion-card border-primary text-white shadow-[0_0_10px_rgba(23,207,84,0.1)]"
                                    : "bg-albion-panel border-albion-border text-albion-muted hover:border-albion-border-light hover:text-white"
                                }`}
                              >
                                {mat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Tier Selection */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">Tier</label>
                          <div className="flex bg-[#0f1411] rounded-lg p-1 border border-albion-border gap-1">
                            {([4, 5, 6, 7, 8] as Tier[]).map((t) => (
                              <button
                                key={t}
                                onClick={() => setTier(t)}
                                className={`flex-1 py-2 text-sm font-medium rounded transition-all ${
                                  tier === t
                                    ? "bg-albion-border border-albion-text text-white"
                                    : "bg-albion-panel border-albion-border text-albion-muted hover:bg-albion-card hover:text-white"
                                }`}
                              >
                                T{t}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Inventory */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">
                              Raw Materials Owned
                            </label>
                            <input
                              type="number"
                              value={ownedRawMaterials}
                              onChange={(e) => setOwnedRawMaterials(Number(e.target.value))}
                              className="albion-input h-12 px-4 rounded-lg text-right font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">
                              Lower Tier Refined Owned
                            </label>
                            <input
                              type="number"
                              value={ownedLowerTierRefined}
                              onChange={(e) => setOwnedLowerTierRefined(Number(e.target.value))}
                              className="albion-input h-12 px-4 rounded-lg text-right font-mono"
                            />
                          </div>
                        </div>

                        {/* Prices */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">
                              Raw Material Price
                            </label>
                            <input
                              type="number"
                              value={rawMaterialPrice}
                              onChange={(e) => setRawMaterialPrice(Number(e.target.value))}
                              className="albion-input h-12 px-4 rounded-lg text-right font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">
                              Refined Price
                            </label>
                            <input
                              type="number"
                              value={refinedMaterialPrice}
                              onChange={(e) => setRefinedMaterialPrice(Number(e.target.value))}
                              className="albion-input h-12 px-4 rounded-lg text-right font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">
                              Lower Tier Price
                            </label>
                            <input
                              type="number"
                              value={lowerTierRefinedPrice}
                              onChange={(e) => setLowerTierRefinedPrice(Number(e.target.value))}
                              className="albion-input h-12 px-4 rounded-lg text-right font-mono"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Multi-Tier: Material Type & Tier Range */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">
                            Material Type
                          </label>
                          <div className="grid grid-cols-5 gap-2">
                            {(Object.keys(MATERIAL_TYPES) as MaterialType[]).map((mat) => (
                              <button
                                key={mat}
                                onClick={() => setMaterialType(mat)}
                                className={`p-3 rounded-lg border transition-all capitalize ${
                                  materialType === mat
                                    ? "bg-albion-card border-primary text-white shadow-[0_0_10px_rgba(23,207,84,0.1)]"
                                    : "bg-albion-panel border-albion-border text-albion-muted hover:border-albion-border-light hover:text-white"
                                }`}
                              >
                                {mat}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">
                              Start Tier
                            </label>
                            <select
                              value={startTier}
                              onChange={(e) => setStartTier(Number(e.target.value) as Tier)}
                              className="albion-input h-12 pl-4 pr-10 rounded-lg appearance-none text-sm font-medium cursor-pointer"
                            >
                              {[3, 4, 5, 6, 7].map((t) => (
                                <option key={t} value={t}>
                                  T{t}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">
                              End Tier
                            </label>
                            <select
                              value={endTier}
                              onChange={(e) => setEndTier(Number(e.target.value) as Tier)}
                              className="albion-input h-12 pl-4 pr-10 rounded-lg appearance-none text-sm font-medium cursor-pointer"
                            >
                              {[4, 5, 6, 7, 8].map((t) => (
                                <option key={t} value={t}>
                                  T{t}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-albion-muted ml-1">
                            Starting Materials Owned
                          </label>
                          <input
                            type="number"
                            value={ownedStartMaterials}
                            onChange={(e) => setOwnedStartMaterials(Number(e.target.value))}
                            className="albion-input h-12 px-4 rounded-lg text-right font-mono"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bonuses & Settings Card */}
                <div className="bg-albion-panel rounded-xl border border-albion-border overflow-hidden shadow-lg shadow-black/20 mb-10">
                  <div className="bg-albion-card/30 px-6 py-4 border-b border-albion-border flex justify-between items-center backdrop-blur-md">
                    <h3 className="text-white font-display font-semibold flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[20px]">percent</span>
                      Efficiency & Bonuses
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Toggle Switches */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => handleBonusCityToggle(!isBonusCity)}
                        className={`p-4 rounded-lg border transition-all ${
                          isBonusCity
                            ? "bg-primary/10 border-primary text-white"
                            : "bg-albion-panel border-albion-border text-albion-muted hover:border-albion-border-light"
                        }`}
                      >
                        <div className="flex items-center gap-2 justify-center">
                          <Crown className="w-5 h-5" />
                          <span className="font-medium">Bonus City</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleRefiningDayToggle(!isRefiningDay)}
                        disabled={!isBonusCity}
                        className={`p-4 rounded-lg border transition-all ${
                          isRefiningDay
                            ? "bg-primary/10 border-primary text-white"
                            : isBonusCity
                            ? "bg-albion-panel border-albion-border text-albion-muted hover:border-albion-border-light"
                            : "bg-albion-dark border-albion-border text-albion-muted/50 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center gap-2 justify-center">
                          <Sparkles className="w-5 h-5" />
                          <span className="font-medium">Refining Day</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleUseFocusToggle(!useFocus)}
                        className={`p-4 rounded-lg border transition-all ${
                          useFocus
                            ? "bg-primary/10 border-primary text-white"
                            : "bg-albion-panel border-albion-border text-albion-muted hover:border-albion-border-light"
                        }`}
                      >
                        <div className="flex items-center gap-2 justify-center">
                          <Focus className="w-5 h-5" />
                          <span className="font-medium">Use Focus</span>
                        </div>
                      </button>
                    </div>

                    <p className="text-xs text-albion-muted px-1">
                      Toggle bonuses to calculate return rates. Focus cannot be used with Bonus City or Refining Day.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* RIGHT PANEL - Results Display (42-38%) */}
        <section className="relative z-20 w-full lg:w-[42%] xl:w-[38%] flex flex-col bg-albion-panel h-full border-t lg:border-t-0 lg:border-l border-albion-border shadow-[-4px_0_24px_rgba(0,0,0,0.3)]">
          <div className="lg:sticky lg:top-6 p-6">
            <div className="bg-albion-panel rounded-xl border border-albion-border overflow-hidden shadow-lg shadow-black/20">
              {/* Results Header */}
              <div className="bg-albion-card/30 px-6 py-4 border-b border-albion-border backdrop-blur-md">
                <h3 className="text-white font-display font-semibold flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">monitoring</span>
                  Results Display
                </h3>
              </div>

              {hasResult ? (
                <>
                  {/* Profit Summary */}
                  <div className="p-6 bg-albion-card/20 border-b border-albion-border">
                    <div className="text-center space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-albion-muted">
                        Estimated Net Profit
                      </div>
                      <div
                        className={`text-5xl font-display font-bold ${
                          totalProfit >= 0
                            ? "text-primary drop-shadow-[0_0_20px_rgba(23,207,84,0.4)]"
                            : "text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                        }`}
                      >
                        {totalProfit >= 0 ? "+" : ""}
                        {formatCurrency(totalProfit)}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-albion-muted">Profit Margin:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            profitMargin >= 0
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-red-500/20 text-red-500 border border-red-500/30"
                          }`}
                        >
                          {profitMargin.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex border-b border-albion-border bg-albion-card/10">
                    <button className="tab-btn active flex-1 py-3 px-4 text-sm font-medium">
                      Breakdown
                    </button>
                    <button className="tab-btn flex-1 py-3 px-4 text-sm font-medium" disabled>
                      Cost Analysis
                    </button>
                    <button className="tab-btn flex-1 py-3 px-4 text-sm font-medium" disabled>
                      Sell Orders
                    </button>
                  </div>

                  {/* Breakdown Content */}
                  <div className="p-6 space-y-5">
                    {/* Resources Required */}
                    {result.materialBreakdown && result.materialBreakdown.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-albion-muted uppercase tracking-wider mb-3">
                          Resources Required
                        </h4>
                        <div className="space-y-2">
                          {result.materialBreakdown.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-albion-card p-3 rounded-lg hover:bg-albion-card/80 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-albion-panel border border-albion-border flex items-center justify-center">
                                  <span className="material-symbols-outlined text-primary text-[16px]">
                                    inventory_2
                                  </span>
                                </div>
                                <div>
                                  <div className="text-white text-sm font-medium">{item.name}</div>
                                  <div className="text-xs text-albion-muted">
                                    {item.quantity.toLocaleString()} units
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-white text-sm font-mono font-semibold">
                                  {formatCurrency(item.totalCost)}
                                </div>
                                <div className="text-xs text-albion-muted">
                                  @{formatCurrency(item.unitPrice)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Returned Materials */}
                    {result.returnedMaterials && result.returnedMaterials.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-albion-muted uppercase tracking-wider mb-3">
                          Returned Materials
                        </h4>
                        <div className="space-y-2">
                          {result.returnedMaterials.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-albion-card p-3 rounded-lg border-l-4 border-l-primary hover:bg-albion-card/80 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-albion-panel border border-albion-border flex items-center justify-center">
                                  <span className="material-symbols-outlined text-primary text-[16px]">
                                    autorenew
                                  </span>
                                </div>
                                <div>
                                  <div className="text-white text-sm font-medium">{item.name}</div>
                                  <div className="text-xs text-albion-muted">
                                    {item.quantity.toLocaleString()} returned
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-primary text-sm font-mono font-semibold">
                                  +{formatCurrency(item.totalValue)}
                                </div>
                                <div className="text-xs text-albion-muted">
                                  @{formatCurrency(item.unitPrice)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Journal Revenue */}
                    {result.journalRevenue && result.journalRevenue > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-albion-muted uppercase tracking-wider mb-3">
                          Journal Revenue
                        </h4>
                        <div className="bg-albion-card p-3 rounded-lg border-l-4 border-l-primary">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-albion-panel border border-albion-border flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-[16px]">book</span>
                              </div>
                              <span className="text-white text-sm font-medium">Filled Journal</span>
                            </div>
                            <div className="text-primary text-sm font-mono font-semibold">
                              +{formatCurrency(result.journalRevenue)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expenses & Fees */}
                    <div>
                      <h4 className="text-sm font-bold text-albion-muted uppercase tracking-wider mb-3">
                        Expenses & Fees
                      </h4>
                      <div className="space-y-2">
                        {result.focusCost && result.focusCost > 0 && (
                          <div className="flex items-center justify-between bg-albion-card p-3 rounded-lg">
                            <span className="text-albion-muted text-sm">Focus Cost</span>
                            <span className="text-red-400 text-sm font-mono">
                              -{formatCurrency(result.focusCost)}
                            </span>
                          </div>
                        )}
                        {result.taxCost && result.taxCost > 0 && (
                          <div className="flex items-center justify-between bg-albion-card p-3 rounded-lg">
                            <span className="text-albion-muted text-sm">Tax (6.5%)</span>
                            <span className="text-red-400 text-sm font-mono">
                              -{formatCurrency(result.taxCost)}
                            </span>
                          </div>
                        )}
                        {result.setupCost && result.setupCost > 0 && (
                          <div className="flex items-center justify-between bg-albion-card p-3 rounded-lg">
                            <span className="text-albion-muted text-sm">Station Usage Fee</span>
                            <span className="text-red-400 text-sm font-mono">
                              -{formatCurrency(result.setupCost)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total Revenue & Cost Summary */}
                    <div className="pt-4 border-t border-albion-border space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-albion-muted">Total Revenue</span>
                        <span className="text-primary font-mono font-semibold">
                          {formatCurrency(totalRevenue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-albion-muted">Total Cost</span>
                        <span className="text-red-400 font-mono font-semibold">
                          {formatCurrency(totalCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-albion-card border border-albion-border mb-4">
                    <Calculator className="w-8 h-8 text-albion-muted" />
                  </div>
                  <p className="text-albion-muted text-sm">
                    Configure your calculation and results will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Save Session Modal */}
      <SaveSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSession}
        isLoading={isSaving}
      />
    </>
  );
};

export default RefiningCalculatorNew;
