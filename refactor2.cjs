const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/RefiningCalculatorNew.tsx');
let fileContent = fs.readFileSync(filePath, 'utf8');

// 1. Add imports at the top
const imports = `import EquipmentMode from './calculator/EquipmentMode';
import ResourceMode from './calculator/ResourceMode';
import MultiTierMode from './calculator/MultiTierMode';
import PlayerSpecConfig from './calculator/PlayerSpecConfig';
import EfficiencyBonuses from './calculator/EfficiencyBonuses';
import ResultsDisplay from './calculator/ResultsDisplay';\n`;

fileContent = imports + fileContent;

// 2. Replace the return block
// The return block starts with '  return (' and goes to the end of the file.
const returnPattern = /  return \([\s\S]*$/;

const newReturnBlock = `  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\\\'60\\\\' height=\\\\'60\\\\' viewBox=\\\\'0 0 60 60\\\\' xmlns=\\\\'http://www.w3.org/2000/svg\\\\'%3E%3Cg fill=\\\\'none\\\\' fill-rule=\\\\'evenodd\\\\'%3E%3Cg fill=\\\\'%23ffffff\\\\' fill-opacity=\\\\'1\\\\'%3E%3Cpath d=\\\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}>
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
                className={\`px-3 py-2 \${showSessions ? 'bg-primary text-albion-dark' : 'bg-albion-panel border border-albion-border text-albion-muted hover:text-white'} rounded-lg transition-all flex items-center gap-2 text-sm font-medium\`}
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
                    className={\`flex-1 py-3 px-4 rounded-md text-sm font-medium capitalize transition-all \${
                      calculationMode === mode 
                        ? 'bg-albion-card text-white shadow-md border border-albion-border-light' 
                        : 'text-albion-muted hover:text-white'
                    }\`}
                  >
                    {mode.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {calculationMode === 'equipment' && (
                <EquipmentMode
                  category={equipmentCategory}
                  tier={equipmentTier}
                  quantity={equipmentQuantity}
                  onCategoryChange={(val) => setEquipmentCategory(val)}
                  onTierChange={setEquipmentTier}
                  onQuantityChange={setEquipmentQuantity}
                />
              )}

              {calculationMode === 'resources' && (
                <ResourceMode
                  tier={startTier}
                  ownedRawMaterials={ownedRawMaterials}
                  ownedRefinedMaterials={ownedRefinedMaterials}
                  onTierChange={setStartTier}
                  onRawMaterialsChange={setOwnedRawMaterials}
                  onRefinedMaterialsChange={setOwnedRefinedMaterials}
                />
              )}

              {calculationMode === 'multi-tier' && (
                <MultiTierMode
                  startTier={startTier}
                  endTier={endTier}
                  startRawMaterials={ownedRawMaterials}
                  onStartTierChange={setStartTier}
                  onEndTierChange={setEndTier}
                  onStartRawMaterialsChange={setOwnedRawMaterials}
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
`;

fileContent = fileContent.replace(returnPattern, newReturnBlock);
fs.writeFileSync(filePath, fileContent);
console.log('Regex replace complete!');
