import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for E2E testing mock user
    if (typeof window !== 'undefined' && (window as any).__E2E_MOCK_USER__) {
      setUser((window as any).__E2E_MOCK_USER__);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (typeof window !== 'undefined' && (window as any).__E2E_MOCK_USER__) {
        setUser((window as any).__E2E_MOCK_USER__);
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === 'tsur.david@gmail.com';

  const signInWithGoogle = async () => {
    if (typeof window !== 'undefined' && (window as any).__E2E_MOCK_USER__) {
      setUser((window as any).__E2E_MOCK_USER__);
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (typeof window !== 'undefined' && (window as any).__E2E_MOCK_USER__) {
      setUser((window as any).__E2E_MOCK_USER__);
      return;
    }
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (typeof window !== 'undefined' && (window as any).__E2E_MOCK_USER__) {
      setUser((window as any).__E2E_MOCK_USER__);
      return;
    }
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    if (typeof window !== 'undefined' && (window as any).__E2E_MOCK_USER__) {
      setUser(null);
      (window as any).__E2E_MOCK_USER__ = null;
      return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
