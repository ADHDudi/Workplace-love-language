import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

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
