import React from 'react';
import { Package, Sword } from 'lucide-react';

interface EquipmentModeProps {
  category: string;
  tier: number;
  quantity: number;
  onCategoryChange: (val: string) => void;
  onTierChange: (val: number) => void;
  onQuantityChange: (val: number) => void;
}

const EquipmentMode: React.FC<EquipmentModeProps> = ({
  category,
  tier,
  quantity,
  onCategoryChange,
  onTierChange,
  onQuantityChange,
}) => {
  return (
    <div className="bg-albion-panel rounded-xl border border-albion-border overflow-hidden shadow-lg shadow-black/20 backdrop-blur-md">
      <div className="bg-albion-card/30 px-6 py-4 border-b border-albion-border">
        <h3 className="text-white font-display font-semibold flex items-center gap-2.5 text-lg">
          <span className="material-symbols-outlined text-primary text-[20px]">construction</span>
          Equipment Configuration
        </h3>
      </div>
      <div className="p-6 space-y-6">
        
        {/* Category Selection */}
        <div>
          <label className="text-sm font-medium text-albion-muted mb-3 block">
            Item Category
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onCategoryChange('armor')}
              className={`p-3 rounded-lg border flex items-center justify-center gap-2 min-h-[44px] ${
                category === 'armor'
                  ? 'bg-primary/20 border-primary text-white'
                  : 'bg-albion-panel border-albion-border text-albion-muted hover:border-albion-border-light'
              }`}
            >
              <Package className="w-4 h-4" />
              Armor & Bags
            </button>
            <button
              onClick={() => onCategoryChange('weapon')}
              className={`p-3 rounded-lg border flex items-center justify-center gap-2 min-h-[44px] ${
                category === 'weapon'
                  ? 'bg-primary/20 border-primary text-white'
                  : 'bg-albion-panel border-albion-border text-albion-muted hover:border-albion-border-light'
              }`}
            >
              <Sword className="w-4 h-4" />
              Weapons & Off-hands
            </button>
          </div>
        </div>

        {/* Tier Selection */}
        <div>
          <label className="text-sm font-medium text-albion-muted mb-3 block">
            Item Tier
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

        {/* Quantity */}
        <div>
          <label htmlFor="craftQty" className="text-sm font-medium text-albion-muted mb-2 block">
            Crafting Quantity
          </label>
          <input
            id="craftQty"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(1, Number(e.target.value)))}
            className="albion-input w-full h-12 px-4 rounded-lg font-mono text-white min-h-[44px]"
          />
        </div>

      </div>
    </div>
  );
};

export default EquipmentMode;
