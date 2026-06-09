import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export function LoginCard() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    try {
      await resetPassword(email);
      setError('Password reset email sent. Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    }
  };

  return (
    <div className="w-full bg-card p-5 md:p-8 rounded-[var(--r-xl)] border border-[var(--border)] shadow-md text-left rtl:text-right shrink-0">
        
        {/* Google Sign In */}
        <button 
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="font-bold text-slate-700">Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-slate-100"></div>
          <span className="text-xs font-bold text-slate-400">OR</span>
          <div className="flex-1 h-px bg-slate-100"></div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input 
            type="email" 
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 placeholder-slate-400"
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 placeholder-slate-400"
          />
          
          <div className="flex justify-end mt-1">
            <button 
              type="button"
              onClick={handleResetPassword}
              className="text-sm font-bold text-slate-400 hover:text-sky-600 transition-colors focus:outline-none focus:underline"
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div className={`text-sm text-center font-medium ${error.includes('sent') ? 'text-emerald-500' : 'text-red-500'}`}>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 rounded-2xl font-bold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            style={{ backgroundImage: 'linear-gradient(to right, #8b5cf6, #3b82f6, #06b6d4)' }}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-medium">
          <span className="text-slate-400">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 font-bold text-sky-500 hover:text-sky-600 focus:outline-none focus:underline"
          >
            {isSignUp ? "Sign In" : "Sign up"}
          </button>
        </div>
    </div>
  );
}
