/**
 * Culinary Intelligence — unit economics, COGS heuristics, and margin levers.
 */

export type FinancialInsight = {
  id: string;
  domain: 'financial';
  insight: string;
  payload: {
    model?: string;
    cogsDrivers?: string[];
    marginLever?: string;
    unit?: string;
  };
};

export const FINANCIAL_INSIGHTS: FinancialInsight[] = [
  {
    id: 'fin-cogs-ingredient',
    domain: 'financial',
    insight:
      'Insight: Ingredient COGS sensitivity: a 5% move in hero ingredient price typically flows ~2.2–2.8× to landed COGS when packaging and labor are fixed—model tiered hedges before promo.',
    payload: {
      model: 'cogs_elasticity',
      cogsDrivers: ['hero_ingredient', 'packaging', 'labor'],
      marginLever: 'formula_yield + pack_weight',
      unit: 'usd_per_case',
    },
  },
  {
    id: 'fin-contribution-sku',
    domain: 'financial',
    insight:
      'Insight: Contribution margin per SKU improves faster from yield +1.5 pts than from list price +3% when trade spend is already >18% of net sales.',
    payload: {
      model: 'contribution_margin',
      marginLever: 'yield_first',
      cogsDrivers: ['trade_spend', 'manufacturing_yield'],
    },
  },
  {
    id: 'fin-npd-burn',
    domain: 'financial',
    insight:
      'Insight: NPD burn rate: bench-to-pilot cycles average 2.3× calendar time vs. single-line extensions—budget R&D hours with parallel formulation tracks, not serial gates only.',
    payload: {
      model: 'npd_cycle',
      unit: 'rd_hours',
    },
  },
];
