export const evaluators = [
  { id: "aischa", name: "Aïscha"},
  { id: "alexandra", name: "Alexandra"},
  { id: "cassy", name: "Cassy"},
  { id: "joelle", name: "Joelle"},
  { id: 'iana', name: 'Iana' },
  { id: 'katherine', name: 'Katherine' },
  { id: 'linus', name: 'Linus' },
  { id: 'tabea', name: 'Tabea' },
  { id: 'lea', name: 'Léa' },
  { id: 'camille', name: 'Camille' },
  { id: 'adrien', name: 'Adrien' },
  { id: 'nina', name: 'Nina' },
  { id: 'nirosh', name: 'Nirosh' },
  { id: 'naima', name: 'Naïma' },
  { id: 'raphael', name: 'Raphaël' }
];

// Rating scale with categorical values (fixed with proper mapping)
export const ratingScale = [
  { value: 1, label: 'Maladroit', color: '#ff6b6b', description: 'Défaillances notables' },
  { value: 3, label: 'Convenu', color: '#ffa726', description: 'Sans surprise' },
  { value: 5, label: 'Bon', color: '#66bb6a', description: 'Solide qualité' },
  { value: 8, label: 'Excellent', color: '#42a5f5', description: 'Remarquable' },
  { value: 10, label: 'Exceptionnel', color: '#ab47bc', description: 'Chef-d\'œuvre' }
];

// Simplified evaluation criteria with cleaner weights
export const evaluationCriteria = {
  fond: {
    label: 'Fond',
    weight: 0.4, // 40% of total score
    icon: '📖',
    subcriteria: {
      message: { 
        label: 'Message', 
        weight: 0.25, // 25% of fond category = 10% of total
        description: 'Pertinence et profondeur du propos' 
      },
      universalite: { 
        label: 'Universalité', 
        weight: 0.25, // 25% of fond category = 10% of total
        description: 'Portée et résonance générale' 
      },
      impact: { 
        label: 'Impact mémoriel', 
        weight: 0.25, // 25% of fond category = 10% of total
        description: 'Capacité à marquer durablement' 
      },
      actualite: { 
        label: 'Actualité', 
        weight: 0.25, // 25% of fond category = 10% of total
        description: 'Pertinence contemporaine' 
      }
    }
  },
  forme: {
    label: 'Forme',
    weight: 0.4, // 40% of total score
    icon: '✍️',
    subcriteria: {
      style: { 
        label: 'Style', 
        weight: 0.375, // 37.5% of forme category = 15% of total
        description: 'Qualité et originalité de l\'écriture' 
      },
      originalite: { 
        label: 'Originalité', 
        weight: 0.25, // 25% of forme category = 10% of total
        description: 'Innovation narrative et stylistique' 
      },
      construction: { 
        label: 'Construction', 
        weight: 0.25, // 25% of forme category = 10% of total
        description: 'Architecture et cohérence' 
      },
      risque: { 
        label: 'Prise de risque', 
        weight: 0.125, // 12.5% of forme category = 5% of total
        description: 'Audace créative' 
      }
    }
  },
  experience: {
    label: 'Expérience',
    weight: 0.2, // 20% of total score
    icon: '💫',
    subcriteria: {
      emotions: { 
        label: 'Émotions', 
        weight: 0.5, // 50% of experience category = 10% of total
        description: 'Intensité émotionnelle' 
      },
      fluidite: { 
        label: 'Fluidité', 
        weight: 0.25, // 25% of experience category = 5% of total
        description: 'Facilité de lecture' 
      },
      identification: { 
        label: 'Identification', 
        weight: 0.25, // 25% of experience category = 5% of total
        description: 'Proximité avec le lecteur' 
      }
    }
  }
};