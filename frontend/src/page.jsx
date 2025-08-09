import React from 'react';

export default function Page() {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24, color: '#22c55e' }}>Новая страница</h1>
      <p style={{ fontSize: 18, marginBottom: 16 }}>
        Здесь будет ваш контент!
      </p>
    </div>
  );
}
