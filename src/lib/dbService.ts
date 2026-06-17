import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { OptionId } from '../data/quizData';

export interface UserFeedback {
  id?: string;
  userId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  feedbackText: string;
  rating?: number;
  source: string;
  sessionId?: string | null;
  read: boolean;
  createdAt?: number | any;
}

export const saveUserFeedback = async (feedbackData: Partial<UserFeedback>) => {
  if (typeof window !== 'undefined' && (window as any).__E2E_MOCK_USER__) {
    console.log("Mock feedback submitted:", feedbackData);
    return { id: "mock-feedback-id" };
  }
  const user = auth.currentUser;
  if (!user) throw new Error("Must be authenticated to submit feedback.");

  return await addDoc(collection(db, 'feedback'), {
    ...feedbackData,
    userId: user.uid,
    userEmail: user.email,
    userName: user.displayName,
    read: false,
    createdAt: serverTimestamp(),
  });
};

export const listFeedbacks = async () => {
  if (typeof window !== 'undefined' && (window as any).__E2E_MOCK_USER__) {
    return [
      {
        id: "mock-feedback-1",
        userId: "mock-user-1",
        userEmail: "user1@example.com",
        userName: "Alice User",
        feedbackText: "Great quiz! Very accurate.",
        rating: 5,
        source: "inline_feedback",
        read: false,
        createdAt: Date.now()
      },
      {
        id: "mock-feedback-2",
        userId: "mock-user-2",
        userEmail: "user2@example.com",
        userName: "Bob User",
        feedbackText: "It would be better if it was longer.",
        rating: 3,
        source: "inline_feedback",
        read: true,
        createdAt: Date.now() - 3600000
      }
    ];
  }
  const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserFeedback));
};

export const updateFeedbackRead = async (feedbackId: string, read: boolean) => {
  if (typeof window !== 'undefined' && (window as any).__E2E_MOCK_USER__) {
    console.log(`Mock feedback ${feedbackId} read status updated to ${read}`);
    return;
  }
  const feedbackRef = doc(db, 'feedback', feedbackId);
  return await updateDoc(feedbackRef, { read });
};

export interface AssessmentResult {
  id?: string;
  userId: string;
  userEmail?: string | null;
  userName?: string | null;
  userRole: 'manager' | 'employee';
  scores: Record<OptionId, number>;
  primaryStyle: OptionId;
  answers: Record<number, OptionId>;
  createdAt?: number | any;
}

export const saveAssessmentResult = async (resultData: Omit<AssessmentResult, 'userId' | 'createdAt'>) => {
  if (typeof window !== 'undefined' && (window as any).__E2E_MOCK_USER__) {
    console.log("Mock assessment result saved:", resultData);
    return { id: "mock-result-id" };
  }
  
  const user = auth.currentUser;
  if (!user) throw new Error("Must be authenticated to save assessment result.");

  return await addDoc(collection(db, 'results'), {
    ...resultData,
    userId: user.uid,
    userEmail: user.email,
    userName: user.displayName,
    createdAt: serverTimestamp(),
  });
};

export const getAssessmentResult = async (resultId: string): Promise<AssessmentResult | null> => {
  if (typeof window !== 'undefined' && (window as any).__E2E_MOCK_USER__) {
    console.log(`Mock assessment result fetched for ID: ${resultId}`);
    return {
      id: resultId,
      userId: 'mock-user-1',
      userRole: 'employee',
      scores: { A: 5, B: 3, C: 2, D: 0, E: 1 },
      primaryStyle: 'A',
      answers: { 1: 'A' },
    };
  }

  const docRef = doc(db, 'results', resultId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as AssessmentResult;
  } else {
    return null;
  }
};

export const listAllResults = async (): Promise<AssessmentResult[]> => {
  if (typeof window !== 'undefined' && (window as any).__E2E_MOCK_USER__) {
    return [
      { id: 'mock-1', userId: 'user1', userRole: 'employee', primaryStyle: 'A', scores: { A: 5, B: 3, C: 2, D: 0, E: 1 }, answers: {} },
      { id: 'mock-2', userId: 'user2', userRole: 'manager', primaryStyle: 'B', scores: { A: 2, B: 6, C: 1, D: 1, E: 0 }, answers: {} },
    ];
  }

  const q = query(collection(db, 'results'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AssessmentResult));
};
