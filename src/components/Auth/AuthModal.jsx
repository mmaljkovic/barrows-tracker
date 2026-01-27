import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthModal = ({ onClose }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const { signIn, signUp, error: authError, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (!error) {
          onClose();
        }
      } else {
        const { error } = await signUp(email, password);
        if (!error) {
          setSignupSuccess(true);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setLocalError('');
    clearError();
    setSignupSuccess(false);
  };

  const displayError = localError || authError;

  if (signupSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg shadow-2xl p-6 max-w-md w-full border-4 border-amber-900 rs-border">
          <h3 className="text-2xl font-bold rs-text-gold mb-4">Check Your Email</h3>
          <p className="text-amber-200 mb-4">
            We've sent a confirmation link to <strong className="text-amber-100">{email}</strong>.
          </p>
          <p className="text-amber-300 text-sm mb-6">
            Please check your email and click the confirmation link to activate your account.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg font-bold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg shadow-2xl p-6 max-w-md w-full border-4 border-amber-900 rs-border">
        <h3 className="text-2xl font-bold rs-text-gold mb-4">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h3>

        {/* Tab Toggle */}
        <div className="flex border-b-2 border-amber-900 mb-6">
          <button
            onClick={() => switchMode()}
            className={`flex-1 px-4 py-2 font-bold ${
              mode === 'login'
                ? 'bg-gradient-to-b from-amber-700 to-amber-900 text-yellow-100 border-b-2 border-yellow-400'
                : 'bg-transparent text-amber-300 hover:text-amber-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchMode()}
            className={`flex-1 px-4 py-2 font-bold ${
              mode === 'signup'
                ? 'bg-gradient-to-b from-amber-700 to-amber-900 text-yellow-100 border-b-2 border-yellow-400'
                : 'bg-transparent text-amber-300 hover:text-amber-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-amber-200 mb-2 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-900 text-amber-100 px-4 py-2 rounded border-2 border-amber-900 focus:border-amber-600 focus:outline-none"
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-amber-200 mb-2 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-900 text-amber-100 px-4 py-2 rounded border-2 border-amber-900 focus:border-amber-600 focus:outline-none"
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-amber-200 mb-2 font-semibold">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-stone-900 text-amber-100 px-4 py-2 rounded border-2 border-amber-900 focus:border-amber-600 focus:outline-none"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
          )}

          {displayError && (
            <div className="bg-red-900/50 border-2 border-red-700 rounded p-3 text-red-200 text-sm font-semibold">
              {displayError}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 disabled:from-stone-600 disabled:to-stone-800 text-white px-4 py-2 rounded border-2 border-amber-950 shadow-lg font-bold"
            >
              {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-gradient-to-b from-stone-600 to-stone-800 hover:from-stone-500 hover:to-stone-700 text-white px-4 py-2 rounded border-2 border-stone-950 shadow-lg font-bold"
            >
              Cancel
            </button>
          </div>
        </form>

        <p className="text-amber-400 text-sm mt-4 text-center">
          {mode === 'login' ? (
            <>Don't have an account? <button onClick={switchMode} className="text-yellow-300 hover:text-yellow-200 font-bold">Sign up</button></>
          ) : (
            <>Already have an account? <button onClick={switchMode} className="text-yellow-300 hover:text-yellow-200 font-bold">Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
