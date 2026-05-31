import React from 'react';
import { Crown, Sparkles, Focus } from 'lucide-react';

interface EfficiencyBonusesProps {
  isBonusCity: boolean;
  isRefiningDay: boolean;
  useFocus: boolean;
  onBonusCityToggle: (val: boolean) => void;
  onRefiningDayToggle: (val: boolean) => void;
  onUseFocusToggle: (val: boolean) => void;
}

const EfficiencyBonuses: React.FC<EfficiencyBonusesProps> = ({
  isBonusCity,
  isRefiningDay,
  useFocus,
  onBonusCityToggle,
  onRefiningDayToggle,
  onUseFocusToggle,
}) => {
  return (
    <div className="bg-albion-panel rounded-xl border border-albion-border overflow-hidden shadow-lg shadow-black/20 backdrop-blur-md">
      <div className="bg-albion-card/30 px-6 py-4 border-b border-albion-border">
        <h3 className="text-white font-display font-semibold flex items-center gap-2.5 text-lg">
          <span className="material-symbols-outlined text-primary text-[20px]">percent</span>
          Efficiency & Bonuses
        </h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onBonusCityToggle(!isBonusCity)}
            className={`p-4 rounded-lg border transition-all min-h-[44px] ${
              isBonusCity
                ? 'bg-primary/10 border-primary text-white'
                : 'bg-albion-panel border-albion-border text-albion-muted hover:border-albion-border-light'
            }`}
          >
            <div className="flex items-center gap-2 justify-center">
              <Crown className="w-5 h-5" />
              <span className="font-medium">Bonus City</span>
            </div>
          </button>

          <button
            onClick={() => onRefiningDayToggle(!isRefiningDay)}
            disabled={!isBonusCity}
            className={`p-4 rounded-lg border transition-all min-h-[44px] ${
              isRefiningDay
                ? 'bg-primary/10 border-primary text-white'
                : isBonusCity
                ? 'bg-albion-panel border-albion-border text-albion-muted hover:border-albion-border-light'
                : 'bg-albion-dark border-albion-border text-albion-muted/50 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Refining Day</span>
            </div>
          </button>

          <button
            onClick={() => onUseFocusToggle(!useFocus)}
            className={`p-4 rounded-lg border transition-all min-h-[44px] ${
              useFocus
                ? 'bg-primary/10 border-primary text-white'
                : 'bg-albion-panel border-albion-border text-albion-muted hover:border-albion-border-light'
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
  );
};

export default EfficiencyBonuses;
