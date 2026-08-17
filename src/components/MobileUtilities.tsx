'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MobileUtilities() {
  const [showWarning, setShowWarning] = useState(false);

  // Auto-hide warning after 5 seconds
  useEffect(() => {
    if (showWarning) {
      const timer = setTimeout(() => setShowWarning(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showWarning]);

  return (
    <>
      <div className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex gap-3">
        {/* Info Icon (Disclaimer) */}
        <Link 
          href="/disclaimer" 
          className="glass p-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all drop-shadow-md"
          aria-label="Disclaimer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
        </Link>

        {/* Warning Icon (Gambling Notice) */}
        <button 
          onClick={() => setShowWarning(!showWarning)}
          className="glass p-2 rounded-full border border-orange-500/30 text-orange-400 hover:text-orange-300 hover:border-orange-500/60 transition-all drop-shadow-md"
          aria-label="Show Warning"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Warning Toast/Tooltip */}
      {showWarning && (
        <div className="md:hidden fixed top-16 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="glass border border-orange-500/30 rounded-xl p-3 text-center drop-shadow-2xl">
            <p className="text-[11px] text-orange-200/90 font-medium leading-relaxed">
              ⚠️ Third-party gambling content may appear. T Double H FM does not endorse or operate such services.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
