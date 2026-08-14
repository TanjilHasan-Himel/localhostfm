'use client';

import React, { useEffect, useState } from 'react';

const SCHEDULED_PROGRAMS = [
  {
    id: 'ratro-line',
    name: 'Ratro Line',
    dayOfWeek: 1, // Monday
    startTime: '22:30',
    endTime: '23:30',
    description: 'Every Monday',
    theme: 'from-blue-500/20 to-purple-500/20',
  },
  {
    id: 'besi-raat',
    name: 'Besi Raat',
    dayOfWeek: 5, // Friday
    startTime: '01:00',
    endTime: '02:00',
    description: 'Every Friday',
    theme: 'from-orange-500/20 to-red-500/20',
  }
];

export default function ScheduleCards() {
  const [activeProgram, setActiveProgram] = useState<string | null>(null);

  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeStr = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

      let found = null;

      for (const prog of SCHEDULED_PROGRAMS) {
        if (currentDay === prog.dayOfWeek) {
          if (currentTimeStr >= prog.startTime && currentTimeStr < prog.endTime) {
            found = prog.id;
            break;
          }
        }
      }
      
      setActiveProgram(found);
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-12 right-4 md:right-12 flex flex-col gap-4 z-40 pointer-events-none">
      {SCHEDULED_PROGRAMS.map((prog, index) => {
        const isLiveNow = activeProgram === prog.id;
        const animationClass = index % 2 === 0 ? 'animate-float-1' : 'animate-float-2';

        return (
          <div 
            key={prog.id} 
            className={`glass relative overflow-hidden rounded-2xl p-4 w-64 shadow-xl border border-white/10 transition-all duration-700 pointer-events-auto ${animationClass}`}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${prog.theme} opacity-50 pointer-events-none`}></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider bg-black/20 px-2 py-1 rounded-md">
                  {prog.description}
                </span>
                
                {isLiveNow && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/20 rounded-md border border-red-500/30 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping absolute"></div>
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span className="text-[10px] text-red-400 uppercase tracking-widest font-bold">Live</span>
                  </div>
                )}
              </div>

              <h3 className={`text-xl font-bold mb-1 ${isLiveNow ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-white/90'}`}>
                {prog.name}
              </h3>
              
              <p className="text-sm font-medium text-white/70 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white/50">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>
                {prog.startTime} - {prog.endTime}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
