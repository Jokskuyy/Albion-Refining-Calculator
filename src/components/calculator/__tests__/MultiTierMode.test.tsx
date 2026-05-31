import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MultiTierMode from '../MultiTierMode';

describe('MultiTierMode', () => {
  it('calls onChange handlers when editing multi-tier config', () => {
    const handleStart = vi.fn();
    const handleEnd = vi.fn();
    const handleRaw = vi.fn();
    
    render(
      <MultiTierMode 
        startTier={4}
        endTier={8}
        startRawMaterials={100}
        onStartTierChange={handleStart}
        onEndTierChange={handleEnd}
        onStartRawMaterialsChange={handleRaw}
      />
    );

    const rawInput = screen.getByLabelText(/Starting Raw Materials/i);
    fireEvent.change(rawInput, { target: { value: '500' } });
    expect(handleRaw).toHaveBeenCalledWith(500);

    // Verify select works (in real DOM it's a select element)
    fireEvent.change(screen.getByLabelText(/End Tier/i), { target: { value: '7' } });
    expect(handleEnd).toHaveBeenCalledWith(7);
  });
});
