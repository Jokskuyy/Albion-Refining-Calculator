import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EquipmentMode from '../EquipmentMode';

describe('EquipmentMode', () => {
  it('calls onChange handlers when selecting items', () => {
    const handleCategory = vi.fn();
    const handleTier = vi.fn();
    const handleQty = vi.fn();

    render(
      <EquipmentMode 
        category="armor"
        tier={4}
        quantity={1}
        onCategoryChange={handleCategory}
        onTierChange={handleTier}
        onQuantityChange={handleQty}
      />
    );

    // Change tier
    fireEvent.click(screen.getByRole('button', { name: /T5/i }));
    expect(handleTier).toHaveBeenCalledWith(5);

    // Change quantity
    const qtyInput = screen.getByLabelText(/Crafting Quantity/i);
    fireEvent.change(qtyInput, { target: { value: '10' } });
    expect(handleQty).toHaveBeenCalledWith(10);
  });
});
