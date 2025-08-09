import React, { useEffect, useState } from 'react';

export default function JPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', images: '', isFullWidth: false });
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/j-items')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(() => setItems([]));
  }, [status]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('');
    const payload = {
      title: form.title,
      description: form.description,
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      isFullWidth: form.isFullWidth
    };
    try {
      const res = await fetch('/api/j-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setStatus('Успешно добавлено!');
        setForm({ title: '', description: '', images: '', isFullWidth: false });
      } else {
        setStatus('Ошибка: ' + (data.error || 'Не удалось добавить'));
      }
    } catch (err) {
      setStatus('Ошибка сети');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24, color: '#ff9800' }}>J Page</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 12 }}>
          <label>title: <input name="title" type="text" value={form.title} onChange={handleChange} style={{ width: '100%' }} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>description: <input name="description" type="text" value={form.description} onChange={handleChange} style={{ width: '100%' }} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>images (через запятую): <input name="images" type="text" value={form.images} onChange={handleChange} style={{ width: '100%' }} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label><input name="isFullWidth" type="checkbox" checked={form.isFullWidth} onChange={handleChange} /> Широкий блок (занимает всю ширину)</label>
        </div>
        <button type="submit" style={{ padding: '8px 24px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>Сохранить</button>
      </form>
      {status && <div style={{ marginBottom: 16, color: status.includes('Ошибка') ? 'red' : 'green' }}>{status}</div>}
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
