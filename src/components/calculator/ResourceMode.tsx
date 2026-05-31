import React from 'react';
import { Hammer } from 'lucide-react';

interface ResourceModeProps {
  tier: number;
  ownedRawMaterials: number;
  ownedRefinedMaterials: number;
  onTierChange: (val: number) => void;
  onRawMaterialsChange: (val: number) => void;
  onRefinedMaterialsChange: (val: number) => void;
}

const ResourceMode: React.FC<ResourceModeProps> = ({
  tier,
  ownedRawMaterials,
  ownedRefinedMaterials,
  onTierChange,
  onRawMaterialsChange,
  onRefinedMaterialsChange,
}) => {
  return (
    <div className="bg-albion-panel rounded-xl border border-albion-border overflow-hidden shadow-lg shadow-black/20 backdrop-blur-md">
      <div className="bg-albion-card/30 px-6 py-4 border-b border-albion-border">
        <h3 className="text-white font-display font-semibold flex items-center gap-2.5 text-lg">
          <span className="material-symbols-outlined text-primary text-[20px]">hardware</span>
          Material Refining
        </h3>
      </div>
      <div className="p-6 space-y-6">
        
        {/* Tier Selection */}
        <div>
          <label className="text-sm font-medium text-albion-muted mb-3 block">
            Target Tier
          </label>
          <div className="flex flex-wrap gap-2">
            {[4, 5, 6, 7, 8].map((t) => (
              <button
                key={t}
                onClick={() => onTierChange(t)}
                className={`w-12 h-12 rounded-lg border font-bold text-lg min-h-[44px] ${
                  tier === t
                    ? 'bg-primary border-primary text-black'
                    : 'bg-albion-panel border-albion-border text-white hover:border-albion-border-light'
                }`}
              >
                T{t}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="rawMat" className="text-sm font-medium text-albion-muted mb-2 block">
              Owned Raw Materials
            </label>
            <input
              id="rawMat"
              type="number"
              min="0"
              value={ownedRawMaterials}
              onChange={(e) => onRawMaterialsChange(Math.max(0, Number(e.target.value)))}
              className="albion-input w-full h-12 px-4 rounded-lg font-mono text-white min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor="refinedMat" className="text-sm font-medium text-albion-muted mb-2 block">
              Owned Base Refined (T-1)
            </label>
            <input
              id="refinedMat"
              type="number"
              min="0"
              value={ownedRefinedMaterials}
              onChange={(e) => onRefinedMaterialsChange(Math.max(0, Number(e.target.value)))}
              className="albion-input w-full h-12 px-4 rounded-lg font-mono text-white min-h-[44px]"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResourceMode;
