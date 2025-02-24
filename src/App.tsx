import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { PDFUploader } from './components/PDFUploader';
import { UnitSection } from './components/UnitSection';
import { useStudyStore } from './store/studyStore';
import { LoginButton } from './components/LoginButton';
import { auth } from './lib/firebase';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';

function App() {
  const units = useStudyStore((state) => state.units);
  const [user, setUser] = useState(auth.currentUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result
    getRedirectResult(auth).catch((error) => {
      console.error('Error with redirect sign-in:', error);
    });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Active Recall Study</h1>
            </div>
            <LoginButton isLoggedIn={!!user} userEmail={user?.email} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!user ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Sign in to start studying
            </h2>
            <p className="text-gray-600 mb-8">
              Sign in with your Google account to create and manage your study materials.
            </p>
          </div>
        ) : units.length === 0 ? (
          <div className="flex flex-col items-center gap-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upload your study material
              </h2>
              <p className="text-gray-600 mb-8 max-w-md">
                Upload a PDF and we'll analyze it to create flashcards organized by units
                and concepts to help you study effectively.
              </p>
              <PDFUploader />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {units.map((unit, index) => (
              <UnitSection key={unit.name} unit={unit} unitIndex={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
