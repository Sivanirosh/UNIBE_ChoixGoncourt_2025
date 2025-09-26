import { evaluationCriteria } from '../data/evaluators';

// Calculate the total score for an individual evaluation
export const calculateTotalScore = (evaluation) => {
  let totalScore = 0;
  
  Object.keys(evaluationCriteria).forEach(criteriaKey => {
    const criteria = evaluationCriteria[criteriaKey];
    let criteriaScore = 0;
    
    Object.keys(criteria.subcriteria).forEach(subKey => {
      const subcriteria = criteria.subcriteria[subKey];
      const score = evaluation[criteriaKey]?.[subKey] || 0;
      criteriaScore += score * subcriteria.weight;
    });
    
    totalScore += criteriaScore;
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
      evaluationCount: 0
    };
  }
  
  const criteriaScores = {};
  let totalScoreSum = 0;
  
  // Initialize criteria scores
  Object.keys(evaluationCriteria).forEach(criteriaKey => {
    criteriaScores[criteriaKey] = {};
    Object.keys(evaluationCriteria[criteriaKey].subcriteria).forEach(subKey => {
      criteriaScores[criteriaKey][subKey] = 0;
    });
  });
  
  // Sum all scores
  bookEvaluations.forEach(evaluationData => {
    totalScoreSum += evaluationData.evaluation.totalScore || 0;
    
    Object.keys(evaluationCriteria).forEach(criteriaKey => {
      Object.keys(evaluationCriteria[criteriaKey].subcriteria).forEach(subKey => {
        criteriaScores[criteriaKey][subKey] += 
          evaluationData.evaluation[criteriaKey]?.[subKey] || 0;
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
  
  return {
    totalScore: Math.round((totalScoreSum / count) * 100) / 100,
    criteriaScores,
    evaluationCount: count
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