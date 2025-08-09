import React from 'react';

export default function InfographicPage() {
  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', padding: 40 }}>
      <h1 style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 32, color: '#22c55e', textAlign: 'center' }}>
        Инфографика: шаг за шагом
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* Здесь будут шаги инфографики */}
        <div style={{ background: '#f6f6f6', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#22c55e', marginBottom: 12 }}>Шаг 1: Начало</h2>
          <p style={{ fontSize: 16, color: '#333' }}>Добавьте первый шаг инфографики...</p>
        </div>
        <div style={{ background: '#fffbe6', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(255,152,0,0.08)' }}>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#ff9800', marginBottom: 12 }}>Шаг 2: Следующий этап</h2>
          <p style={{ fontSize: 16, color: '#333' }}>Добавьте второй шаг инфографики...</p>
        </div>
        {/* Добавляйте новые шаги ниже по мере необходимости */}
      </div>
      <div style={{ marginTop: 48, textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
        Шаблон инфографики: современный, яркий, с акцентом на шаги и визуальные блоки.
      </div>
    </div>
  );
}
