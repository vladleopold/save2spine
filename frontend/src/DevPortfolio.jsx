import React, { useEffect, useState } from 'react';

export default function DevPortfolio() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch('https://portfolio-backend-23pv.onrender.com/api/dev')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(() => setProjects([]));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24, color: '#ff9800' }}>Unity Developer Portfolio</h1>
      <p style={{ fontSize: 18, marginBottom: 16 }}>
        Здесь — демо-проекты Unity с юмором:
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {projects.map((p, i) => (
          <div key={p.id || i} style={{ background: '#fffbe6', borderRadius: 12, boxShadow: '0 1px 8px rgba(0,0,0,0.04)', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {Array.isArray(p.images) && p.images[0] && (
              <img src={p.images[0]} alt={p.title} style={{ width: '100%', maxWidth: 220, borderRadius: 8, marginBottom: 12 }} />
            )}
            <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#ff9800', marginBottom: 8 }}>{p.title}</h2>
            <p style={{ fontSize: 15, color: '#333', marginBottom: 8 }}>{p.description}</p>
            {p.link && (
              <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: '#ff9800', textDecoration: 'underline', fontWeight: 'bold', fontSize: 15 }}>Подробнее</a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
