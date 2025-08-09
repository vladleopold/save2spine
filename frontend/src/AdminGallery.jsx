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
}

export default AdminGallery;
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
