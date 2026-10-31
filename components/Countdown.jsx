import React, { useState, useEffect } from 'react';
import site from '../content/site.json';

const Countdown = ({ targetDate = site.countdownTarget }) => {
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    
    tick(); // Esegui subito per evitare 1 secondo di ritardo visivo
    const id = setInterval(tick, 1000);
    
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className="vb-cd-grid">
      {[
        { v: countdown.d, l: 'Giorni' },
        { v: countdown.h, l: 'Ore' },
        { v: countdown.m, l: 'Minuti' },
        { v: countdown.s, l: 'Sec.' },
      ].map((x, i) => (
        <div key={i} className="vb-cd-cell">
          <div className="vb-cd-num">{String(x.v).padStart(2, '0')}</div>
          <div className="vb-cd-lab">{x.l}</div>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
