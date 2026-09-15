import React from 'react';
import { Studio } from './cv/Studio.jsx';

export default function CvPage() {
  return (
    <div>
      <a
        href="/"
        style={{
          display: 'inline-block',
          margin: '12px 16px 0',
          color: '#22c55e',
          fontWeight: 'bold',
          position: 'relative',
          zIndex: 60,
        }}
      >
        ← Галерея
      </a>
      <Studio />
    </div>
  );
}
