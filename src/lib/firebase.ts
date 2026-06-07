import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0330602361",
  appId: "1:374901746331:web:dba41fd11cb51e5f0a743e",
  storageBucket: "gen-lang-client-0330602361.firebasestorage.app",
  apiKey: "AIzaSyAZzyAamsv4mYPSbswx9SWemPgchRCtLHs",
  authDomain: "gen-lang-client-0330602361.firebaseapp.com",
  messagingSenderId: "374901746331",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
