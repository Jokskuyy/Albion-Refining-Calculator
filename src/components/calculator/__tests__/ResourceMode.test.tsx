import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResourceMode from '../ResourceMode';

describe('ResourceMode', () => {
  it('calls onChange handlers when editing resources', () => {
    const handleRaw = vi.fn();
    const handleRefined = vi.fn();
    
    render(
      <ResourceMode 
        tier={4}
        ownedRawMaterials={10}
        ownedRefinedMaterials={0}
        onTierChange={vi.fn()}
        onRawMaterialsChange={handleRaw}
        onRefinedMaterialsChange={handleRefined}
      />
    );

    const rawInput = screen.getByLabelText(/Owned Raw Materials/i);
    fireEvent.change(rawInput, { target: { value: '20' } });
    expect(handleRaw).toHaveBeenCalledWith(20);
  });
});
