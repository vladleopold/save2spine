import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function AdminGallery() {
  // Обработчик submit для dev-проекта
  const handleDevSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    const payload = {
      id: Number(form.id),
      title: form.title,
      description: form.description,
      link: form.link,
      img: form.img
    };
    // ...existing code...
    // Основной return
    return (
      <div>
        <div style={{ display: 'flex', maxWidth: 900, margin: '40px auto', gap: 32 }}>
          {/* Левый блок: меню и контент */}
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
                {/* Левая часть: таблица проектов */}
                <div style={{ flex: '0 0 380px', background: '#f6f6f6', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Dev-портфолио проекты</h3>
                  <table style={{ width: '100%', fontSize: 15 }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Описание</th>
                        <th>Ссылка</th>
                        <th>Картинка</th>
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
                            <img src={p.img} alt={p.title} style={{ maxWidth: 60, borderRadius: 4 }} />
                          </td>
                          <td style={{ padding: '2px 8px' }}>
                            <button
                              title="Редактировать"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              onClick={() => {
                                setForm({
                                  id: p.id,
                                  title: p.title,
                                  description: p.description,
                                  link: p.link,
                                  img: p.img,
                                  images: '',
                                  isFullWidth: false
                                });
                              }}
                            >
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 17l2.1-6.3a1 1 0 0 1 .25-0.4l8.1-8.1a1.5 1.5 0 0 1 2.1 2.1l-8.1 8.1a1 1 0 0 1-0.4.25L3 17z" stroke="#ff9800" strokeWidth="2.5" fill="#ff9800"/>
                                <rect x="13.5" y="2.5" width="3" height="1.5" rx="0.75" transform="rotate(45 13.5 2.5)" fill="#ff9800" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Правая часть: форма редактирования */}
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
                    <div style={{ marginBottom: 12 }}>
                      <label>Картинка: <input name="img" type="text" value={form.img} onChange={handleChange} style={{ width: '100%' }} /></label>
                    </div>
                    <button type="submit" style={{ padding: '8px 24px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>Сохранить</button>
                  </form>
                  {status && <div style={{ marginTop: 16, color: status.includes('Ошибка') ? 'red' : 'green' }}>{status}</div>}
                </div>
              </div>
            )}
            {/* ...остальные блоки для других страниц... */}
          </div>
          {/* Правый блок: заметки */}
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
                  <label>description: <input name="description" type="text" value={form.description} onChange={handleChange} style={{ width: '100%' }} /></label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>images (через запятую): <input name="images" type="text" value={form.images} onChange={handleChange} required style={{ width: '100%' }} /></label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label><input name="isFullWidth" type="checkbox" checked={form.isFullWidth} onChange={handleChange} /> Широкий блок (занимает всю ширину)</label>
                </div>
                <button type="submit" style={{ padding: '8px 24px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>Сохранить</button>
              </form>
              {status && <div style={{ marginTop: 16, color: status.includes('Ошибка') ? 'red' : 'green' }}>{status}</div>}
            </>
          )}
          {selectedPage === 'dev' && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#ff9800' }}>Редактирование портфолио Unity</h2>
              <div style={{ marginBottom: 16, color: '#555' }}>Добавьте или измените демо-проекты для портфолио Unity.</div>
              {/* Можно добавить отдельную форму для проектов, если потребуется */}
            </>
          )}
          {selectedPage === 'x' && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#398dd3' }}>Редактирование инфографики</h2>
              <div style={{ marginBottom: 16, color: '#555' }}>Соберите инфографику шаг за шагом по шаблону.</div>
              {/* Можно добавить отдельную форму для инфографики, если потребуется */}
            </>
          )}
          {selectedPage !== 'home' && selectedPage !== 'dev' && selectedPage !== 'x' && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#398dd3' }}>add/edit item</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                  <label>id: <input name="id" type="number" value={form.id} onChange={handleChange} required style={{ width: '100%' }} /></label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>title: <input name="title" type="text" value={form.title} onChange={handleChange} style={{ width: '100%' }} /></label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>description: <input name="description" type="text" value={form.description} onChange={handleChange} style={{ width: '100%' }} /></label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>images (через запятую): <input name="images" type="text" value={form.images} onChange={handleChange} required style={{ width: '100%' }} /></label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label><input name="isFullWidth" type="checkbox" checked={form.isFullWidth} onChange={handleChange} /> Широкий блок (занимает всю ширину)</label>
                </div>
                <button type="submit" style={{ padding: '8px 24px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>Сохранить</button>
              </form>
              {status && <div style={{ marginTop: 16, color: status.includes('Ошибка') ? 'red' : 'green' }}>{status}</div>}
            </>
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
