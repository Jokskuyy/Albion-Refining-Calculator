import React from 'react';
import { Calculator } from 'lucide-react';
import type { CalculationResult } from './types';

interface ResultsDisplayProps {
  hasResult: boolean;
  result: CalculationResult | null;
  useFocus: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US').format(Math.floor(value));
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ hasResult, result, useFocus }) => {
  return (
    <div className="bg-albion-panel rounded-xl border border-albion-border overflow-hidden shadow-lg shadow-black/20">
      <div className="bg-albion-card/30 px-6 py-4 border-b border-albion-border backdrop-blur-md">
        <h3 className="text-white font-display font-semibold flex items-center gap-2.5 text-lg">
          <span className="material-symbols-outlined text-primary text-[20px]">monitoring</span>
          Results Display
        </h3>
      </div>

      {hasResult && result ? (
        <>
          {/* Profit Summary */}
          <div className="p-6 bg-albion-card/20 border-b border-albion-border">
            <div className="text-center space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-albion-muted">
                Estimated Net Profit
              </div>
              <div
                className={`text-5xl font-display font-bold ${
                  result.totalProfit >= 0
                    ? 'text-primary drop-shadow-[0_0_20px_rgba(23,207,84,0.4)]'
                    : 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                }`}
              >
                {result.totalProfit >= 0 ? '+' : ''}
                {formatCurrency(result.totalProfit)}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                <span className="text-xs text-albion-muted">Profit Margin:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    result.profitMargin >= 0
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-red-500/20 text-red-500 border border-red-500/30'
                  }`}
                >
                  {result.profitMargin.toFixed(2)}%
                </span>
                {useFocus && result.profitPerFocus && result.profitPerFocus > 0 && (
                  <>
                    <span className="text-xs text-albion-muted ml-2">Silver / Focus:</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {formatCurrency(result.profitPerFocus)}
                    </span>
                  </>
                )}
              </div>
            </div>
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
                      className="flex items-center justify-between bg-albion-card p-3 rounded-lg hover:bg-albion-card/80 transition-colors min-h-[44px]"
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

            {/* Total Revenue & Cost Summary */}
            <div className="pt-4 border-t border-albion-border space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-albion-muted">Total Revenue</span>
                <span className="text-primary font-mono font-semibold">
                  {formatCurrency(result.totalRevenue)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-albion-muted">Total Cost</span>
                <span className="text-red-400 font-mono font-semibold">
                  {formatCurrency(result.totalCost)}
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
  );
};

export default ResultsDisplay;
