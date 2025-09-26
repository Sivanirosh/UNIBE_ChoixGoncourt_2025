export const evaluators = [
  { id: 'cupsa', name: 'Cupsa' },
  { id: 'geldmacher', name: 'Geldmacher' },
  { id: 'linus', name: 'Linus' },
  { id: 'tabea', name: 'Tabea' },
  { id: 'jorg', name: 'Jörg' },
  { id: 'camille', name: 'Camille' },
  { id: 'adrien', name: 'Adrien' },
  { id: 'ouguemat', name: 'Ouguemat' },
  { id: 'nirosh', name: 'Nirosh' },
  { id: 'naima', name: 'Naïma' },
  { id: 'raphael', name: 'Raphaël' }
];

// Evaluation criteria with weights
export const evaluationCriteria = {
  fond: {
    label: 'Fond',
    weight: 0.4,
    subcriteria: {
      message: { label: 'Message', weight: 0.1 },
      universalite: { label: 'Universalité', weight: 0.1 },
      impact: { label: 'Impact mémoriel', weight: 0.1 },
      actualite: { label: 'Actualité', weight: 0.1 }
    }
  },
  forme: {
    label: 'Forme',
    weight: 0.4,
    subcriteria: {
      style: { label: 'Style', weight: 0.15 },
      originalite: { label: 'Originalité', weight: 0.1 },
      construction: { label: 'Construction', weight: 0.1 },
      risque: { label: 'Prise de risque', weight: 0.05 }
    }
  },
  experience: {
    label: 'Expérience',
    weight: 0.2,
    subcriteria: {
      emotions: { label: 'Émotions', weight: 0.1 },
      fluidite: { label: 'Fluidité', weight: 0.05 },
      identification: { label: 'Identification', weight: 0.05 }
    }
  }
};