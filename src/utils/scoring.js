import { evaluationCriteria } from '../data/evaluators';

// Score mapping for the categorical rating system
const scoreMapping = { 1: 0.1, 3: 0.3, 5: 0.5, 8: 0.8, 10: 1.0 };

// Calculate the total score for an individual evaluation with fixed categorical system
export const calculateTotalScore = (evaluation) => {
  let totalScore = 0;
  
  Object.keys(evaluationCriteria).forEach(criteriaKey => {
    const criteria = evaluationCriteria[criteriaKey];
    let criteriaScore = 0;
    
    Object.keys(criteria.subcriteria).forEach(subKey => {
      const subcriteria = criteria.subcriteria[subKey];
      const score = evaluation[criteriaKey]?.[subKey] || 0;
      // Use proper score mapping instead of linear division
      const normalizedScore = scoreMapping[score] || 0;
      criteriaScore += normalizedScore * subcriteria.weight;
    });
    
    totalScore += criteriaScore * criteria.weight * 10; // Scale to 10-point system
  });
  
  return Math.round(totalScore * 100) / 100; // Round to 2 decimal places
};

// Calculate average scores for a book across all evaluations
export const calculateBookAverages = (bookId, allEvaluations) => {
  const bookEvaluations = Object.values(allEvaluations).filter(
    evaluation => evaluation.bookId === bookId
  );
  
  if (bookEvaluations.length === 0) {
    return {
      totalScore: 0,
      criteriaScores: {},
      evaluationCount: 0,
      distributionData: {},
      weightedCriteriaScores: { fond: 0, forme: 0, experience: 0 }
    };
  }
  
  const criteriaScores = {};
  const distributionData = {};
  let totalScoreSum = 0;
  
  // Initialize
  Object.keys(evaluationCriteria).forEach(criteriaKey => {
    criteriaScores[criteriaKey] = {};
    distributionData[criteriaKey] = {};
    Object.keys(evaluationCriteria[criteriaKey].subcriteria).forEach(subKey => {
      criteriaScores[criteriaKey][subKey] = 0;
      distributionData[criteriaKey][subKey] = [];
    });
  });
  
  // Collect scores
  bookEvaluations.forEach(evaluationData => {
    totalScoreSum += evaluationData.evaluation.totalScore || 0;
    
    Object.keys(evaluationCriteria).forEach(criteriaKey => {
      Object.keys(evaluationCriteria[criteriaKey].subcriteria).forEach(subKey => {
        const score = evaluationData.evaluation[criteriaKey]?.[subKey] || 0;
        criteriaScores[criteriaKey][subKey] += score;
        if (score > 0) {
          distributionData[criteriaKey][subKey].push(score);
        }
      });
    });
  });
  
  // Calculate averages
  const count = bookEvaluations.length;
  Object.keys(criteriaScores).forEach(criteriaKey => {
    Object.keys(criteriaScores[criteriaKey]).forEach(subKey => {
      criteriaScores[criteriaKey][subKey] = 
        Math.round((criteriaScores[criteriaKey][subKey] / count) * 100) / 100;
    });
  });
  
  // Calculate simple weighted criteria averages (simplified approach)
  const weightedCriteriaScores = {};
  Object.keys(evaluationCriteria).forEach(criteriaKey => {
    const criteria = evaluationCriteria[criteriaKey];
    let weightedSum = 0;
    let totalWeight = 0;
    
    Object.keys(criteria.subcriteria).forEach(subKey => {
      const subcriteria = criteria.subcriteria[subKey];
      const avgScore = criteriaScores[criteriaKey][subKey];
      const normalizedScore = scoreMapping[avgScore] || (avgScore / 10); // Fallback for non-exact matches
      
      weightedSum += normalizedScore * subcriteria.weight;
      totalWeight += subcriteria.weight;
    });
    
    // Convert to 10-point scale considering this criteria's overall weight
    weightedCriteriaScores[criteriaKey] = Math.round((weightedSum / totalWeight) * criteria.weight * 10 * 100) / 100;
  });
  
  return {
    totalScore: Math.round((totalScoreSum / count) * 100) / 100,
    criteriaScores,
    weightedCriteriaScores,
    evaluationCount: count,
    distributionData
  };
};

// Get overall ranking of all books
export const getBookRankings = (books, allEvaluations) => {
  const bookScores = books.map(book => {
    const averages = calculateBookAverages(book.id, allEvaluations);
    return {
      ...book,
      ...averages
    };
  });
  
  // Sort by total score (descending)
  return bookScores.sort((a, b) => b.totalScore - a.totalScore);
};

// Calculate completion percentage for each user
export const getUserProgress = (evaluators, books, allEvaluations) => {
  return evaluators.map(evaluator => {
    const userEvaluations = Object.values(allEvaluations).filter(
      evaluationData => evaluationData.user === evaluator.name
    );
    
    return {
      ...evaluator,
      completedBooks: userEvaluations.length,
      totalBooks: books.length,
      completionPercentage: Math.round((userEvaluations.length / books.length) * 100)
    };
  });
};

// Check if evaluation is complete
export const isEvaluationComplete = (evaluation) => {
  return Object.entries(evaluationCriteria).every(([criteriaKey, criteria]) =>
    Object.keys(criteria.subcriteria).every(subKey =>
      evaluation[criteriaKey]?.[subKey] > 0
    )
  );
};

// Get simple statistics for distributions (replacing complex violin plots)
export const getSimpleStats = (ratings) => {
  if (!ratings || ratings.length === 0) {
    return { count: 0, average: 0, most_common: null };
  }
  
  const sum = ratings.reduce((total, rating) => total + rating, 0);
  const average = sum / ratings.length;
  
  // Find most common rating
  const counts = {};
  ratings.forEach(rating => {
    counts[rating] = (counts[rating] || 0) + 1;
  });
  
  const most_common = Object.keys(counts).reduce((a, b) => 
    counts[a] > counts[b] ? a : b
  );
  
  return {
    count: ratings.length,
    average: Math.round(average * 10) / 10,
    most_common: parseInt(most_common)
  };
};