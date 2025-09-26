// Local storage utilities for persistent data

export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const getStoredData = (key) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error retrieving data from localStorage:', error);
    return null;
  }
};

export const removeStoredData = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data from localStorage:', error);
  }
};

export const exportToJSON = (data, filename = 'evaluations.json') => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (data, filename = 'evaluations.csv') => {
  // Convert evaluation data to CSV format
  const headers = [
    'User', 'Book', 'Message', 'Universalité', 'Impact mémoriel', 'Actualité',
    'Style', 'Originalité', 'Construction', 'Prise de risque',
    'Émotions', 'Fluidité', 'Identification', 'Total Score', 'Timestamp'
  ];
  
  let csvContent = headers.join(',') + '\n';
  
  Object.values(data).forEach(evaluation => {
    const row = [
      evaluation.user,
      evaluation.bookId,
      evaluation.evaluation.fond?.message || '',
      evaluation.evaluation.fond?.universalite || '',
      evaluation.evaluation.fond?.impact || '',
      evaluation.evaluation.fond?.actualite || '',
      evaluation.evaluation.forme?.style || '',
      evaluation.evaluation.forme?.originalite || '',
      evaluation.evaluation.forme?.construction || '',
      evaluation.evaluation.forme?.risque || '',
      evaluation.evaluation.experience?.emotions || '',
      evaluation.evaluation.experience?.fluidite || '',
      evaluation.evaluation.experience?.identification || '',
      evaluation.evaluation.totalScore || '',
      evaluation.timestamp
    ];
    csvContent += row.join(',') + '\n';
  });
  
  const dataBlob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};