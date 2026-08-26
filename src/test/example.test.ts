import { describe, it, expect } from "vitest";
import { calculate, useModel } from "@/store/model";

describe("milk cost calculation", () => {
  it("calculates production volume from realization and 97.5% marketability", () => {
    const state = useModel.getState();
    const result = calculate(state);

    expect(result.total_production_kg).toBeCloseTo(result.total_volume_kg / 0.975, 6);
  });

  it("builds milk cost from feed and fixed annual costs", () => {
    const state = useModel.getState();
    const result = calculate(state);

    expect(result.feed_cost_milk_2026_total).toBeCloseTo(
      state.feed_cost_milk_2025_total * state.cost_milk_coeff,
      2,
    );
    expect(result.fixed_cost_milk_2026_total).toBeCloseTo(
      state.fixed_cost_milk_2025_total * state.cost_milk_coeff,
      2,
    );
    expect(result.cost_milk_total).toBeCloseTo(
      result.feed_cost_milk_2026_total + result.fixed_cost_milk_2026_total,
      2,
    );
  });

  it("changes only feed cost when herd size changes", () => {
    const state = useModel.getState();
    const doubled = calculate({ ...state, milk_herd_heads: state.milk_herd_heads * 2 });
    const baseline = calculate(state);

    expect(doubled.feed_cost_milk_2026_total).toBeCloseTo(baseline.feed_cost_milk_2026_total * 2, 2);
    expect(doubled.fixed_cost_milk_2026_total).toBeCloseTo(baseline.fixed_cost_milk_2026_total, 2);
  });

  it("raises unit cost when milk yield falls while annual costs stay fixed", () => {
    const state = useModel.getState();
    const baseline = calculate(state);
    const lowerYield = calculate({
      ...state,
      daily_volume_m: state.daily_volume_m.map((value) => value * 0.9),
    });

    expect(lowerYield.cost_milk_total).toBeCloseTo(baseline.cost_milk_total, 2);
    expect(lowerYield.cost_milk_2026).toBeGreaterThan(baseline.cost_milk_2026);
  });

  it("keeps the 2025-to-2026 factor bridge reconciled", () => {
    const result = calculate(useModel.getState());
    const factorTotal = result.factors.reduce((sum, factor) => sum + factor.value, 0);

    expect(factorTotal).toBeCloseTo(result.result_production, 2);
  });
});
