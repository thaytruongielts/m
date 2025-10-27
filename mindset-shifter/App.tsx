import React, { useState, useCallback, useEffect } from 'react';
import { transformBelief } from './services/geminiService';
import BeliefsDisplay from './components/EvaluationDisplay';
import { EXAMPLE_LIMITING_BELIEFS } from './constants';
import type { TransformedBeliefs } from './types';

const App: React.FC = () => {
  const [limitingBelief, setLimitingBelief] = useState<string>("");
  const [transformedBeliefs, setTransformedBeliefs] = useState<TransformedBeliefs | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState<string>("");

  useEffect(() => {
    setPlaceholder(EXAMPLE_LIMITING_BELIEFS[Math.floor(Math.random() * EXAMPLE_LIMITING_BELIEFS.length)]);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!limitingBelief.trim() || isLoading) return;

    setIsLoading(true);
    setTransformedBeliefs(null);
    setError(null);

    try {
      const result = await transformBelief(limitingBelief);
      setTransformedBeliefs(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while transforming your belief.');
    } finally {
      setIsLoading(false);
    }
  }, [limitingBelief, isLoading]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-gradient-to-br from-gray-900 to-slate-800 text-white">
      <main className="w-full max-w-3xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Mindset Shifter</h1>
          <p className="text-slate-400 mt-2 text-lg">Turn limiting beliefs into large-scale power.</p>
        </header>

        {/* User Input Area */}
        <div className="bg-slate-700/50 rounded-xl shadow-lg p-6 w-full transition-all backdrop-blur-sm border border-slate-600">
          <label htmlFor="belief-input" className="block text-lg font-semibold text-slate-100 mb-3">
            Enter a limiting belief (Nhập vào niềm tin giới hạn):
          </label>
          <textarea
            id="belief-input"
            value={limitingBelief}
            onChange={(e) => setLimitingBelief(e.target.value)}
            placeholder={`e.g., "${placeholder}"`}
            className="w-full h-32 p-3 border border-slate-500 rounded-lg bg-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow placeholder:text-slate-500"
            aria-label="Your limiting belief"
          />
          <button
            onClick={handleSubmit}
            disabled={!limitingBelief.trim() || isLoading}
            className="mt-4 w-full px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Transforming...
              </>
            ) : (
                'Transform Belief'
            )}
          </button>
        </div>
        
        {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg shadow animate-fade-in" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}

        {transformedBeliefs && !isLoading && (
            <BeliefsDisplay beliefs={transformedBeliefs} />
        )}

      </main>
      <footer className="text-center mt-8 text-slate-500">
        <p>Powered by Gemini</p>
      </footer>
    </div>
  );
};

export default App;