import React from 'react';

interface PlayerSpecConfigProps {
  masteryLevel: number;
  tierSpecLevel: number;
  otherSpecsTotal: number;
  onMasteryChange: (val: number) => void;
  onTierSpecChange: (val: number) => void;
  onOtherSpecsChange: (val: number) => void;
}

const PlayerSpecConfig: React.FC<PlayerSpecConfigProps> = ({
  masteryLevel,
  tierSpecLevel,
  otherSpecsTotal,
  onMasteryChange,
  onTierSpecChange,
  onOtherSpecsChange,
}) => {
  return (
    <div className="bg-albion-panel rounded-xl border border-albion-border overflow-hidden shadow-lg shadow-black/20 backdrop-blur-md">
      <div className="bg-albion-card/30 px-6 py-4 border-b border-albion-border">
        <h3 className="text-white font-display font-semibold flex items-center gap-2.5 text-lg">
          <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
          Player Specs
        </h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="masteryLevel" className="text-sm font-medium text-albion-muted ml-1">
              Mastery Level (0-100)
            </label>
            <input
              id="masteryLevel"
              type="number"
              value={masteryLevel}
              onChange={(e) => onMasteryChange(Math.min(100, Math.max(0, Number(e.target.value))))}
              className="albion-input h-12 px-4 rounded-lg text-right font-mono text-white min-h-[44px]"
              min="0"
              max="100"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="tierSpecLevel" className="text-sm font-medium text-albion-muted ml-1">
              Tier Spec Level (0-100)
            </label>
            <input
              id="tierSpecLevel"
              type="number"
              value={tierSpecLevel}
              onChange={(e) => onTierSpecChange(Math.min(100, Math.max(0, Number(e.target.value))))}
              className="albion-input h-12 px-4 rounded-lg text-right font-mono text-white min-h-[44px]"
              min="0"
              max="100"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="otherSpecsTotal" className="text-sm font-medium text-albion-muted ml-1">
              Other Specs Total (0-400)
            </label>
            <input
              id="otherSpecsTotal"
              type="number"
              value={otherSpecsTotal}
              onChange={(e) => onOtherSpecsChange(Math.min(400, Math.max(0, Number(e.target.value))))}
              className="albion-input h-12 px-4 rounded-lg text-right font-mono text-white min-h-[44px]"
              min="0"
              max="400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerSpecConfig;
