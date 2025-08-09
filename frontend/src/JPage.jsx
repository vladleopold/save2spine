import React, { useEffect, useState } from 'react';

export default function JPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/j-items')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(() => setItems([]));
  }, []);



  return (
    <div style={{ maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24, color: '#ff9800' }}>J Page — демо-галерея</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: '#fffbe6', borderRadius: 12, boxShadow: '0 1px 8px rgba(0,0,0,0.04)', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {item.images && item.images[0] && <img src={item.images[0]} alt={item.title} style={{ width: '100%', maxWidth: 220, borderRadius: 8, marginBottom: 12 }} />}
            <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#ff9800', marginBottom: 8 }}>{item.title}</h2>
            <p style={{ fontSize: 15, color: '#333', marginBottom: 8 }}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
