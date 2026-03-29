/**
 * Culinary Intelligence — sensory texture maps, cultural flavor bridges, and perception cues.
 */

export type SensoryInsight = {
  id: string;
  domain: 'sensory';
  insight: string;
  payload: {
    textureAxis?: string;
    cultureBridge?: string;
    perceptionTags?: string[];
    mouthfeelCue?: string;
  };
};

export const SENSORY_INSIGHTS: SensoryInsight[] = [
  {
    id: 'sen-texture-map',
    domain: 'sensory',
    insight:
      'Insight: “Creamy without dairy” maps to fat globule mimicry + polysaccharide shear-thinning; target 8–14 µm equivalent droplet feel with starch–gum synergy for spoonable body.',
    payload: {
      textureAxis: 'creaminess_non_dairy',
      mouthfeelCue: 'droplet_size_equivalent',
      perceptionTags: ['round', 'lingering', 'fat_forward'],
    },
  },
  {
    id: 'sen-culture-heat',
    domain: 'sensory',
    insight:
      'Insight: Cross-cultural heat bridges: capsaicin “burn” + Sichuan hydro-α-sanshool tingle register on different trigeminal channels—layer for complexity without linear Scoville stacking.',
    payload: {
      cultureBridge: 'capsaicin_sanshool',
      perceptionTags: ['tingle', 'numbing', 'warmth'],
    },
  },
  {
    id: 'sen-acoustic-crisp',
    domain: 'sensory',
    insight:
      'Insight: Crispness perception correlates with acoustic peak frequency ~2–6 kHz first bite; moisture migration >2% in 24h collapses both sound and liking scores.',
    payload: {
      textureAxis: 'crispness',
      perceptionTags: ['acoustic_peak', 'moisture_migration'],
    },
  },
];
