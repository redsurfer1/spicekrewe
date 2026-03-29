/**
 * Culinary Intelligence — flavor chemistry, pairings, and ingredient behavior.
 * Machine-readable payloads for DaaS / COS integrations.
 */

export type IngredientInsight = {
  id: string;
  domain: 'ingredient';
  insight: string;
  payload: {
    pairingType?: string;
    compounds?: string[];
    ratioHint?: string;
    shelfLifeDriver?: string;
    notes?: string;
  };
};

export const INGREDIENT_INSIGHTS: IngredientInsight[] = [
  {
    id: 'ing-emulsion-shelf',
    domain: 'ingredient',
    insight:
      'Insight: Shelf-stable oil-in-water emulsions often target ≥3:1 oil-to-acid (by weight) with chelator + emulsifier synergy to protect against rancidity over 9–12 months ambient.',
    payload: {
      pairingType: 'emulsion_stability',
      ratioHint: '3:1_oil_to_acid_weight',
      compounds: ['lecithin', 'DATEM', 'citrate'],
      shelfLifeDriver: 'oxidation + droplet coalescence',
      notes: 'Validate with accelerated shelf-life and water activity for your matrix.',
    },
  },
  {
    id: 'ing-maillard-map',
    domain: 'ingredient',
    insight:
      'Insight: Maillard depth scales with reducing sugar × amino nitrogen; fructose + cysteine peaks faster than glucose + lysine at equivalent moisture—tune for “brown without bitter.”',
    payload: {
      pairingType: 'maillard_kinetics',
      compounds: ['fructose', 'glucose', 'cysteine', 'lysine'],
      notes: 'Surface moisture 8–15% typical for crust browning.',
    },
  },
  {
    id: 'ing-volatile-bridge',
    domain: 'ingredient',
    insight:
      'Insight: Shared terpene bridges (e.g., limonene ↔ herbal pinenes) explain classic citrus–herb affinity; pairings score higher when top-note overlap exceeds 25% by normalized VOC profile.',
    payload: {
      pairingType: 'aroma_affinity',
      compounds: ['limonene', 'pinene'],
      notes: 'Use as heuristic; consumer panel still required.',
    },
  },
];
