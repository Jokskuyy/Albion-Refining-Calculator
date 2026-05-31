import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResultsDisplay from '../ResultsDisplay';

describe('ResultsDisplay', () => {
  const dummyResult = {
    totalRevenue: 10000,
    totalCost: 5000,
    totalProfit: 5000,
    profitMargin: 50,
    taxCost: 0,
    setupCost: 0,
    focusCost: 0,
    journalRevenue: 0,
    materialBreakdown: [],
    returnedMaterials: []
  };

  it('renders positive profit correctly', () => {
    render(
      <ResultsDisplay 
        hasResult={true}
        result={dummyResult}
        useFocus={false}
      />
    );
    // Currency formatter adds commas
    expect(screen.getByText('+5,000')).toBeInTheDocument();
    expect(screen.getByText('50.00%')).toBeInTheDocument();
  });

  it('renders negative profit correctly', () => {
    render(
      <ResultsDisplay 
        hasResult={true}
        result={{ ...dummyResult, totalProfit: -2000, profitMargin: -10 }}
        useFocus={false}
      />
    );
    expect(screen.getByText('-2,000')).toBeInTheDocument();
    expect(screen.getByText('-10.00%')).toBeInTheDocument();
  });

  it('shows empty state when no result', () => {
    render(
      <ResultsDisplay 
        hasResult={false}
        result={null as any}
        useFocus={false}
      />
    );
    expect(screen.getByText(/Configure your calculation/i)).toBeInTheDocument();
  });
});
