import EquipmentMode from './calculator/EquipmentMode';
import ResourceMode from './calculator/ResourceMode';
import MultiTierMode from './calculator/MultiTierMode';
import PlayerSpecConfig from './calculator/PlayerSpecConfig';
import EfficiencyBonuses from './calculator/EfficiencyBonuses';
import ResultsDisplay from './calculator/ResultsDisplay';
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

  // Player Specialization State
  const [masteryLevel, setMasteryLevel] = useState<number>(100);
  const [tierSpecLevel, setTierSpecLevel] = useState<number>(100);
  const [otherSpecsTotal, setOtherSpecsTotal] = useState<number>(400);

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
        masteryLevel,
        tierSpecLevel,
        otherSpecsTotal,
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
        masteryLevel,
        tierSpecLevel,
        otherSpecsTotal,
        useFocus,
        marketTaxPercent,
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
        masteryLevel,
        tierSpecLevel,
        otherSpecsTotal,
        useFocus,
        marketTaxPercent,
        stationFeePercent: 4.5,
        isPremium: false,
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
    masteryLevel,
    tierSpecLevel,
    otherSpecsTotal,
  ]);

  // Session Management Handlers
  const handleSaveSession = useCallback(async (sessionName: string) => {
    setIsSaving(true);
    try {
      const sessionData: SessionData = {
        sessionName,
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
        masteryLevel,
        tierSpecLevel,
        otherSpecsTotal,
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
    materialPrices, isBonusCity, isRefiningDay, useFocus, masteryLevel, tierSpecLevel, otherSpecsTotal, equipmentResult, resourceResult, multiTierResult
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
    if (session.masteryLevel !== undefined) setMasteryLevel(session.masteryLevel);
    if (session.tierSpecLevel !== undefined) setTierSpecLevel(session.tierSpecLevel);
    if (session.otherSpecsTotal !== undefined) setOtherSpecsTotal(session.otherSpecsTotal);
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
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}>
      </div>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <section className="relative z-10 w-full lg:w-[60%] flex flex-col h-full overflow-y-auto border-r border-albion-border bg-albion-dark/95 backdrop-blur-sm p-6 lg:p-10 space-y-8">
          
          <div className="pb-2 border-b border-albion-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-1 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                Workshop Configuration
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSessions(!showSessions)}
                className={`px-3 py-2 ${showSessions ? 'bg-primary text-albion-dark' : 'bg-albion-panel border border-albion-border text-albion-muted hover:text-white'} rounded-lg transition-all flex items-center gap-2 text-sm font-medium`}
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
            <div className="mb-8">
              <SessionsList 
                onLoadSession={handleLoadSession}
                calculationMode={calculationMode}
              />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex bg-albion-panel rounded-lg p-1 border border-albion-border">
                {['equipment', 'resources', 'multi-tier'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setCalculationMode(mode)}
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium capitalize transition-all ${
                      calculationMode === mode 
                        ? 'bg-albion-card text-white shadow-md border border-albion-border-light' 
                        : 'text-albion-muted hover:text-white'
                    }`}
                  >
                    {mode.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {calculationMode === 'equipment' && (
                <EquipmentMode
                  category={selectedEquipmentCategory}
                  tier={tier}
                  quantity={equipmentQuantity}
                  onCategoryChange={(val) => setSelectedEquipmentCategory(val as any)}
                  onTierChange={(val) => setTier(val as any)}
                  onQuantityChange={setEquipmentQuantity}
                />
              )}

              {calculationMode === 'resources' && (
                <ResourceMode
                  tier={tier}
                  ownedRawMaterials={ownedRawMaterials}
                  ownedRefinedMaterials={ownedLowerTierRefined}
                  onTierChange={(val) => setTier(val as any)}
                  onRawMaterialsChange={setOwnedRawMaterials}
                  onRefinedMaterialsChange={setOwnedLowerTierRefined}
                />
              )}

              {calculationMode === 'multi-tier' && (
                <MultiTierMode
                  startTier={startTier}
                  endTier={endTier}
                  startRawMaterials={ownedStartMaterials}
                  onStartTierChange={(val) => setStartTier(val as any)}
                  onEndTierChange={(val) => setEndTier(val as any)}
                  onStartRawMaterialsChange={setOwnedStartMaterials}
                />
              )}

              <PlayerSpecConfig
                masteryLevel={masteryLevel}
                tierSpecLevel={tierSpecLevel}
                otherSpecsTotal={otherSpecsTotal}
                onMasteryChange={setMasteryLevel}
                onTierSpecChange={setTierSpecLevel}
                onOtherSpecsChange={setOtherSpecsTotal}
              />

              <EfficiencyBonuses
                isBonusCity={isBonusCity}
                isRefiningDay={isRefiningDay}
                useFocus={useFocus}
                onBonusCityToggle={handleBonusCityToggle}
                onRefiningDayToggle={handleRefiningDayToggle}
                onUseFocusToggle={handleUseFocusToggle}
              />
            </div>
          )}
        </section>

        <section className="relative z-20 w-full lg:w-[40%] flex flex-col bg-albion-panel h-full border-t lg:border-t-0 lg:border-l border-albion-border p-6 shadow-[-4px_0_24px_rgba(0,0,0,0.3)]">
          <ResultsDisplay 
            hasResult={hasResult}
            result={result}
            useFocus={useFocus}
          />
        </section>
      </main>

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
