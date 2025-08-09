import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function AdminGallery() {
  // Пример состояния и данных
  const [selectedPage, setSelectedPage] = useState('dev');
  const [form, setForm] = useState({ id: '', title: '', description: '', link: '', img: '', images: '', isFullWidth: false });
  const [status, setStatus] = useState('');
  const rootPages = [
    { value: 'home', label: 'Главная' },
    { value: 'dev', label: 'Dev-портфолио' },
    { value: 'x', label: 'Инфографика' }
  ];
  const [devProjectsLocal, setDevProjectsLocal] = useState([
    { id: 1, title: 'Unity Demo 1', description: 'Описание 1', link: '#', img: '', images: '', isFullWidth: false },
    { id: 2, title: 'Unity Demo 2', description: 'Описание 2', link: '#', img: '', images: '', isFullWidth: false }
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDevSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    // Здесь логика сохранения
    setStatus('Сохранено!');
  };

  return (
    <div>
      <div style={{ display: 'flex', maxWidth: 900, margin: '40px auto', gap: 32 }}>
        <div style={{ minWidth: 220, background: '#f6f6f6', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 'fit-content' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>Корневая страница:</label>
            <select value={selectedPage} onChange={e => setSelectedPage(e.target.value)} style={{ fontSize: 15, padding: '4px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 120 }}>
              {rootPages.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          {selectedPage === 'dev' && (
            <div style={{ display: 'flex', gap: 32 }}>
              <div style={{ flex: '0 0 380px', background: '#f6f6f6', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Dev-портфолио проекты</h3>
                <table style={{ width: '100%', fontSize: 15 }}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Название</th>
                      <th>Описание</th>
                      <th>Ссылка</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {devProjectsLocal.map((p) => (
                      <tr key={p.id}>
                        <td style={{ padding: '2px 8px', fontWeight: 'bold', color: '#05A302' }}>{p.id}</td>
                        <td style={{ padding: '2px 8px', color: '#398dd3', fontWeight: 'bold' }}>{p.title}</td>
                        <td style={{ padding: '2px 8px', color: '#555' }}>{p.description}</td>
                        <td style={{ padding: '2px 8px' }}>
                          <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: '#ff9800', textDecoration: 'underline' }}>ссылка</a>
                        </td>
                        <td style={{ padding: '2px 8px' }}>
                          <button
                            title="Редактировать"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            onClick={() => setForm({ ...p })}
                          >✏️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ flex: '1 1 auto', marginLeft: 32 }}>
                <form onSubmit={handleDevSubmit} style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ marginBottom: 12 }}>
                    <label>ID: <input name="id" type="number" value={form.id} onChange={handleChange} required style={{ width: '100%' }} /></label>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label>Название: <input name="title" type="text" value={form.title} onChange={handleChange} style={{ width: '100%' }} /></label>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label>Описание: <input name="description" type="text" value={form.description} onChange={handleChange} style={{ width: '100%' }} /></label>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label>Ссылка: <input name="link" type="text" value={form.link} onChange={handleChange} style={{ width: '100%' }} /></label>
                  </div>
                  <button type="submit" style={{ padding: '8px 24px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>Сохранить</button>
                </form>
                {status && <div style={{ marginTop: 16, color: status.includes('Ошибка') ? 'red' : 'green' }}>{status}</div>}
              </div>
            </div>
          )}
        </div>
        <div style={{ flex: '1 1 auto', marginTop: 32, background: '#fffff0', borderRadius: 8, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#FFD000' }}>keepnote</h3>
          <textarea
            placeholder="text..."
            style={{ width: '100%', minHeight: 80, resize: 'vertical', borderRadius: 6, border: '1px solid rgb(238 159 159)', padding: 8, fontSize: 15, background: 'rgb(255 251 251)', color: '#333' }}
          />
        </div>
      </div>
    </div>
  );
}


export default AdminGallery;
