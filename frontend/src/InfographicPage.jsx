import React, { useEffect, useState } from 'react';

  const [steps, setSteps] = useState([]);
  useEffect(() => {
    fetch('https://portfolio-backend-23pv.onrender.com/api/x')
      .then(res => res.json())
      .then(data => setSteps(data))
      .catch(() => setSteps([]));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', padding: 40 }}>
      <h1 style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 32, color: '#22c55e', textAlign: 'center' }}>
        Инфографика: шаг за шагом
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {steps.map((step, idx) => (
          <div key={step.id || idx} style={{ background: idx % 2 === 0 ? '#f6f6f6' : '#fffbe6', borderRadius: 12, padding: 24, boxShadow: idx % 2 === 0 ? '0 2px 8px rgba(0,0,0,0.04)' : '0 2px 8px rgba(255,152,0,0.08)' }}>
            <h2 style={{ fontSize: 24, fontWeight: 'bold', color: idx % 2 === 0 ? '#22c55e' : '#ff9800', marginBottom: 12 }}>Шаг {idx + 1}: {step.title}</h2>
            <p style={{ fontSize: 16, color: '#333' }}>{step.description}</p>
            {Array.isArray(step.images) && step.images[0] && (
              <img src={step.images[0]} alt={step.title} style={{ maxWidth: 320, borderRadius: 8, marginTop: 16 }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 48, textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
        Шаблон инфографики: современный шаблон инфографики с шагами.
      </div>
    </div>
  );
}
