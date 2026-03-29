/**
 * Culinary Intelligence — SOP patterns, batch scaling, and process ratios.
 */

export type OperationalInsight = {
  id: string;
  domain: 'operational';
  insight: string;
  payload: {
    sopFamily?: string;
    scaleRule?: string;
    batchRange?: string;
    checkpoints?: string[];
  };
};

export const OPERATIONAL_INSIGHTS: OperationalInsight[] = [
  {
    id: 'op-scale-surface',
    domain: 'operational',
    insight:
      'Insight: Convection scaling from pilot to line: hold ΔT within ±5°F by adjusting belt speed before dwell time—surface-area-to-mass drives browning more than absolute temperature.',
    payload: {
      sopFamily: 'thermal_scale',
      scaleRule: 'surface_area_to_mass_first',
      batchRange: 'pilot_10kg_to_line_200kg',
      checkpoints: ['belt_speed', 'RH_load', 'exit_moisture'],
    },
  },
  {
    id: 'op-haccp-handoff',
    domain: 'operational',
    insight:
      'Insight: CCP handoff template: log time–temp at cook/chill boundaries; deviation >2σ triggers hold-and-test—reduces recall risk on co-man lines with split ownership.',
    payload: {
      sopFamily: 'haccp_ccp',
      checkpoints: ['cook_temp', 'chill_curve', 'metal_detection'],
    },
  },
  {
    id: 'op-yield-brine',
    domain: 'operational',
    insight:
      'Insight: Brine uptake scales sub-linearly above 12% pick-up; use 0.85 exponent on dwell when doubling protein mass to avoid over-salt on large cuts.',
    payload: {
      sopFamily: 'brine_pickup',
      scaleRule: 'pickup_exponent_0.85',
      batchRange: 'portion_family',
    },
  },
];
