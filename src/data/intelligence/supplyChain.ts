/**
 * Culinary Intelligence — co-man, distributor, and route-to-market logic.
 */

export type SupplyChainInsight = {
  id: string;
  domain: 'supply_chain';
  insight: string;
  payload: {
    lane?: string;
    moqDriver?: string;
    riskFactors?: string[];
    partnerTier?: string;
    checkpoints?: string[];
  };
};

export const SUPPLY_CHAIN_INSIGHTS: SupplyChainInsight[] = [
  {
    id: 'sc-copack-moq',
    domain: 'supply_chain',
    insight:
      'Insight: Co-packer MOQ often tracks clean-line changeover hours, not ingredient cost—switching from 10k to 25k units may only move unit cost ~6–9% if SKU complexity is flat.',
    payload: {
      lane: 'co_manufacturing',
      moqDriver: 'changeover_labor',
      riskFactors: ['allergen_line_segregation', 'kosher_window'],
      partnerTier: 'tier_2_regional',
    },
  },
  {
    id: 'sc-distributor-fill',
    domain: 'supply_chain',
    insight:
      'Insight: Distributor fill-rate risk rises when case packs mix slow movers; aim ≥70% velocity in the same pallet family to protect OTIF on broadline partners.',
    payload: {
      lane: 'broadline_distribution',
      riskFactors: ['case_pack_fragmentation', 'seasonal_velocity'],
    },
  },
  {
    id: 'sc-import-cold',
    domain: 'supply_chain',
    insight:
      'Insight: Cold-chain import lanes: document chain-of-custody at first U.S. touch; gaps >30 minutes in reefer logs correlate with downstream quality tickets in audit samples.',
    payload: {
      lane: 'import_cold_chain',
      checkpoints: ['first_touch_temp', 'reefer_log_continuity'],
    },
  },
];
