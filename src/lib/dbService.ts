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
  const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserFeedback));
};

export const updateFeedbackRead = async (feedbackId: string, read: boolean) => {
  const feedbackRef = doc(db, 'feedback', feedbackId);
  return await updateDoc(feedbackRef, { read });
};
