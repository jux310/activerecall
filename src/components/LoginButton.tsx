import React from 'react';
import { signOut } from 'firebase/auth';
import { auth, signInWithGoogle } from '../lib/firebase';

interface LoginButtonProps {
  isLoggedIn: boolean;
  userEmail?: string | null;
}

export function LoginButton({ isLoggedIn, userEmail }: LoginButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {isLoggedIn ? (
        <>
          <span className="text-sm text-gray-600">{userEmail}</span>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-4 h-4"
          />
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      )}
    </div>
  );
}