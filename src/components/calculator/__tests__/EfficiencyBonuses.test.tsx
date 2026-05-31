import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EfficiencyBonuses from '../EfficiencyBonuses';

describe('EfficiencyBonuses', () => {
  it('disables Refining Day when City Bonus is off', () => {
    render(
      <EfficiencyBonuses
        isBonusCity={false}
        isRefiningDay={false}
        useFocus={false}
        onBonusCityToggle={vi.fn()}
        onRefiningDayToggle={vi.fn()}
        onUseFocusToggle={vi.fn()}
      />
    );

    const refiningDayBtn = screen.getByRole('button', { name: /Refining Day/i });
    expect(refiningDayBtn).toBeDisabled();
  });

  it('calls toggles when clicked', () => {
    const handleCity = vi.fn();
    const handleDay = vi.fn();
    const handleFocus = vi.fn();

    render(
      <EfficiencyBonuses
        isBonusCity={true} // Enabled so Day can be clicked
        isRefiningDay={false}
        useFocus={false}
        onBonusCityToggle={handleCity}
        onRefiningDayToggle={handleDay}
        onUseFocusToggle={handleFocus}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Bonus City/i }));
    expect(handleCity).toHaveBeenCalledWith(false);

    fireEvent.click(screen.getByRole('button', { name: /Refining Day/i }));
    expect(handleDay).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole('button', { name: /Use Focus/i }));
    expect(handleFocus).toHaveBeenCalledWith(true);
  });
});
