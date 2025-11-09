'use client';

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState(0);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Generate or get session ID
    let sid = localStorage.getItem('visitor-session-id');
    if (!sid) {
      sid = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor-session-id', sid);
    }
    setSessionId(sid);

    // Track visitor and get count
    const trackVisitor = async () => {
      try {
        const res = await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sid }),
        });
        const data = await res.json();
        setCount(data.count || 0);
      } catch (error) {
        console.error('Failed to track visitor:', error);
      }
    };

    trackVisitor();

    // Update every 30 seconds
    const interval = setInterval(trackVisitor, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 border-4 border-black dark:border-purple-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(168,85,247,0.5)] px-6 py-3 animate-pulse z-50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <span className="text-2xl animate-bounce">👥</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black animate-ping"></span>
        </div>
        <div>
          <p className="text-white font-black text-lg leading-none">
            {count} {count === 1 ? 'User' : 'Users'}
          </p>
          <p className="text-white/90 font-bold text-xs">Tracking Prices Now</p>
        </div>
      </div>
    </div>
  );
}
