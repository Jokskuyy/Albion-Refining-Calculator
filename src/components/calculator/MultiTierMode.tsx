import React from 'react';
import { Layers } from 'lucide-react';

interface MultiTierModeProps {
  startTier: number;
  endTier: number;
  startRawMaterials: number;
  onStartTierChange: (val: number) => void;
  onEndTierChange: (val: number) => void;
  onStartRawMaterialsChange: (val: number) => void;
}

const MultiTierMode: React.FC<MultiTierModeProps> = ({
  startTier,
  endTier,
  startRawMaterials,
  onStartTierChange,
  onEndTierChange,
  onStartRawMaterialsChange,
}) => {
  return (
    <div className="bg-albion-panel rounded-xl border border-albion-border overflow-hidden shadow-lg shadow-black/20 backdrop-blur-md">
      <div className="bg-albion-card/30 px-6 py-4 border-b border-albion-border">
        <h3 className="text-white font-display font-semibold flex items-center gap-2.5 text-lg">
          <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
          Multi-Tier Refining
        </h3>
      </div>
      <div className="p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tiers */}
          <div>
            <label htmlFor="startTier" className="text-sm font-medium text-albion-muted mb-2 block">
              Start Tier
            </label>
            <select
              id="startTier"
              value={startTier}
              onChange={(e) => onStartTierChange(Number(e.target.value))}
              className="albion-input w-full h-12 px-4 rounded-lg font-mono text-white min-h-[44px]"
            >
              {[4, 5, 6, 7].map(t => (
                <option key={t} value={t}>T{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="endTier" className="text-sm font-medium text-albion-muted mb-2 block">
              End Tier
            </label>
            <select
              id="endTier"
              value={endTier}
              onChange={(e) => onEndTierChange(Number(e.target.value))}
              className="albion-input w-full h-12 px-4 rounded-lg font-mono text-white min-h-[44px]"
            >
              {[5, 6, 7, 8].filter(t => t > startTier).map(t => (
                <option key={t} value={t}>T{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Inventory Input */}
        <div>
          <label htmlFor="startRaw" className="text-sm font-medium text-albion-muted mb-2 block">
            Starting Raw Materials (T{startTier})
          </label>
          <input
            id="startRaw"
            type="number"
            min="0"
            value={startRawMaterials}
            onChange={(e) => onStartRawMaterialsChange(Math.max(0, Number(e.target.value)))}
            className="albion-input w-full h-12 px-4 rounded-lg font-mono text-white min-h-[44px]"
          />
        </div>

      </div>
    </div>
  );
};

export default MultiTierMode;
