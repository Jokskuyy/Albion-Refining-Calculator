import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PlayerSpecConfig from '../PlayerSpecConfig';

describe('PlayerSpecConfig', () => {
  it('renders input fields for mastery, tier spec, and other specs', () => {
    render(
      <PlayerSpecConfig
        masteryLevel={50}
        tierSpecLevel={50}
        otherSpecsTotal={200}
        onMasteryChange={vi.fn()}
        onTierSpecChange={vi.fn()}
        onOtherSpecsChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/Mastery Level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tier Spec Level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Other Specs Total/i)).toBeInTheDocument();
  });

  it('calls change handlers when inputs change', () => {
    const handleMasteryChange = vi.fn();
    const handleTierSpecChange = vi.fn();
    const handleOtherSpecsChange = vi.fn();

    render(
      <PlayerSpecConfig
        masteryLevel={0}
        tierSpecLevel={0}
        otherSpecsTotal={0}
        onMasteryChange={handleMasteryChange}
        onTierSpecChange={handleTierSpecChange}
        onOtherSpecsChange={handleOtherSpecsChange}
      />
    );

    const masteryInput = screen.getByLabelText(/Mastery Level/i);
    fireEvent.change(masteryInput, { target: { value: '10' } });
    expect(handleMasteryChange).toHaveBeenCalledWith(10);

    const tierSpecInput = screen.getByLabelText(/Tier Spec Level/i);
    fireEvent.change(tierSpecInput, { target: { value: '20' } });
    expect(handleTierSpecChange).toHaveBeenCalledWith(20);

    const otherSpecsInput = screen.getByLabelText(/Other Specs Total/i);
    fireEvent.change(otherSpecsInput, { target: { value: '30' } });
    expect(handleOtherSpecsChange).toHaveBeenCalledWith(30);
  });
});
