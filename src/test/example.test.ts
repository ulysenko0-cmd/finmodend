import { describe, it, expect } from "vitest";
import { calculate, useModel } from "@/store/model";

describe("milk cost calculation", () => {
  it("calculates production from herd and yield, then applies marketability", () => {
    const state = useModel.getState();
    const result = calculate(state);

    expect(result.total_production_kg).toBeCloseTo(
      state.milk_herd_heads * state.milk_yield_per_head,
      6,
    );
    expect(result.total_volume_kg).toBeCloseTo(result.total_production_kg * 0.975, 6);
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
    expect(result.cost_milk_2026).toBeCloseTo(
      (result.feed_cost_milk_2026_total + result.fixed_cost_milk_2026_total) /
        result.total_production_kg,
      8,
    );
    expect(result.cost_milk_total).toBeCloseTo(
      result.cost_milk_2026 * result.total_volume_kg,
      2,
    );
  });

  it("keeps annual milk costs fixed when herd size changes", () => {
    const state = useModel.getState();
    const doubled = calculate({ ...state, milk_herd_heads: state.milk_herd_heads * 2 });
    const baseline = calculate(state);

    expect(doubled.total_production_kg).toBeCloseTo(baseline.total_production_kg * 2, 2);
    expect(doubled.total_volume_kg).toBeCloseTo(baseline.total_volume_kg * 2, 2);
    expect(doubled.feed_cost_milk_2026_total).toBeCloseTo(baseline.feed_cost_milk_2026_total, 2);
    expect(doubled.fixed_cost_milk_2026_total).toBeCloseTo(baseline.fixed_cost_milk_2026_total, 2);
    expect(doubled.cost_milk_2026).toBeCloseTo(baseline.cost_milk_2026 / 2, 8);
  });

  it("raises unit cost when milk yield falls while annual costs stay fixed", () => {
    const state = useModel.getState();
    const baseline = calculate(state);
    const lowerYield = calculate({
      ...state,
      milk_yield_per_head: state.milk_yield_per_head * 0.9,
    });

    expect(lowerYield.cost_milk_total).toBeCloseTo(baseline.cost_milk_total, 2);
    expect(lowerYield.cost_milk_2026).toBeGreaterThan(baseline.cost_milk_2026);
  });

  it("matches the approved Excel milk result", () => {
    const result = calculate(useModel.getState());

    expect(result.feed_cost_milk_2026_total).toBeCloseTo(757_023_120.88, 2);
    expect(result.fixed_cost_milk_2026_total).toBeCloseTo(750_260_487.97, 2);
    expect(result.cost_milk_2026).toBeCloseTo(41.0085547003, 8);
    expect(result.cost_milk_total).toBeCloseTo(1_469_601_518.63, 2);
    expect(result.revenue_milk_total - result.cost_milk_total).toBeCloseTo(-148_055_539.95, 2);
  });

  it("applies the annual production unit cost to each month's realized volume", () => {
    const result = calculate(useModel.getState());

    result.monthly.forEach((month) => {
      expect(month.milk_cost_per_kg).toBeCloseTo(result.cost_milk_2026, 8);
      expect(month.milk_cost_total).toBeCloseTo(
        result.cost_milk_2026 * month.volume,
        2,
      );
    });
    expect(result.monthly.reduce((sum, month) => sum + month.milk_cost_total, 0)).toBeCloseTo(
      result.cost_milk_total,
      2,
    );
  });

  it("keeps the 2025-to-2026 factor bridge reconciled", () => {
    const result = calculate(useModel.getState());
    const factorTotal = result.factors.reduce((sum, factor) => sum + factor.value, 0);

    expect(factorTotal).toBeCloseTo(result.result_production, 2);
  });
});
