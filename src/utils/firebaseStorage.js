// utils/firebaseStorage.js
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Collection name for evaluations
const EVALUATIONS_COLLECTION = 'evaluations';

// Save an evaluation to Firebase
export const saveEvaluationToFirebase = async (userId, bookId, evaluation) => {
  try {
    const evaluationId = `${userId}_${bookId}`;
    const evaluationData = {
      user: userId,
      bookId,
      evaluation,
      timestamp: serverTimestamp(),
      lastModified: new Date().toISOString()
    };
    
    await setDoc(doc(db, EVALUATIONS_COLLECTION, evaluationId), evaluationData);
    console.log('Evaluation saved to Firebase:', evaluationId);
    return true;
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    // Fallback to localStorage if Firebase fails
    localStorage.setItem(`evaluation_${userId}_${bookId}`, JSON.stringify({
      user: userId,
      bookId,
      evaluation,
      timestamp: new Date().toISOString()
    }));
    return false;
  }
};

// Get a specific user's evaluation for a book
export const getUserEvaluationFromFirebase = async (userId, bookId) => {
  try {
    const evaluationId = `${userId}_${bookId}`;
    const docRef = doc(db, EVALUATIONS_COLLECTION, evaluationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().evaluation;
    }
    
    // Fallback to localStorage
    const localData = localStorage.getItem(`evaluation_${userId}_${bookId}`);
    if (localData) {
      const parsed = JSON.parse(localData);
      return parsed.evaluation;
    }
    
    return null;
  } catch (error) {
    console.error('Error reading from Firebase:', error);
    // Fallback to localStorage
    const localData = localStorage.getItem(`evaluation_${userId}_${bookId}`);
    if (localData) {
      const parsed = JSON.parse(localData);
      return parsed.evaluation;
    }
    return null;
  }
};

// Get all evaluations from Firebase
export const getAllEvaluationsFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, EVALUATIONS_COLLECTION));
    const evaluations = {};
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      evaluations[doc.id] = {
        user: data.user,
        bookId: data.bookId,
        evaluation: data.evaluation,
        timestamp: data.lastModified || data.timestamp?.toDate?.()?.toISOString?.() || new Date().toISOString()
      };
    });
    
    // Merge with any localStorage data (for offline support)
    const localKeys = Object.keys(localStorage);
    localKeys.forEach(key => {
      if (key.startsWith('evaluation_')) {
        const localData = JSON.parse(localStorage.getItem(key));
        const evaluationId = `${localData.user}_${localData.bookId}`;
        
        // Only use local data if not already in Firebase data
        if (!evaluations[evaluationId]) {
          evaluations[evaluationId] = localData;
        }
      }
    });
    
    return evaluations;
  } catch (error) {
    console.error('Error reading all evaluations from Firebase:', error);
    
    // Fallback to localStorage only
    const evaluations = {};
    const localKeys = Object.keys(localStorage);
    localKeys.forEach(key => {
      if (key.startsWith('evaluation_')) {
        const localData = JSON.parse(localStorage.getItem(key));
        const evaluationId = `${localData.user}_${localData.bookId}`;
        evaluations[evaluationId] = localData;
      }
    });
    
    return evaluations;
  }
};

// Real-time listener for evaluations (optional - for live updates)
export const subscribeToEvaluations = (callback) => {
  try {
    const unsubscribe = onSnapshot(collection(db, EVALUATIONS_COLLECTION), (snapshot) => {
      const evaluations = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        evaluations[doc.id] = {
          user: data.user,
          bookId: data.bookId,
          evaluation: data.evaluation,
          timestamp: data.lastModified || data.timestamp?.toDate?.()?.toISOString?.() || new Date().toISOString()
        };
      });
      callback(evaluations);
    });
    
    return unsubscribe; // Call this function to stop listening
  } catch (error) {
    console.error('Error setting up real-time listener:', error);
    return () => {}; // Return empty function if setup fails
  }
};

// Export functions for backward compatibility
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