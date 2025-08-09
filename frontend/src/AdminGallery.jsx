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
    try {
      const res = await fetch('https://portfolio-backend-23pv.onrender.com/api/dev-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setStatus('Успешно сохранено!');
        setForm({ id: '', title: '', description: '', link: '', img: '', images: '', isFullWidth: false });
      } else {
        setStatus('Ошибка: ' + (data.error || 'Не удалось сохранить'));
      }
    } catch (err) {
      setStatus('Ошибка сети');
    }
  };
  // Данные для dev-портфолио (локально, если нет API)
  const devProjectsLocal = [
    {
      id: 1,
      title: 'Unity Кот-симулятор',
      description: 'Погладь кота, пока он не убежит в реальный мир. Встроенный генератор мемов и случайных мурлыканий.',
      img: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
      link: 'https://unity.com/cat-simulator'
    },
    {
      id: 2,
      title: 'Гравитация для чайников',
      description: 'Платформер, где гравитация меняется по настроению игрока. Иногда вверх — это вниз, а иногда вообще вбок.',
      img: 'https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif',
      link: 'https://unity.com/gravity-fun'
    },
    {
      id: 3,
      title: 'Битва багов',
      description: 'Мультиплеерная арена, где игроки сражаются за звание самого креативного баг-репортера. Побеждает тот, кто вылетит последним.',
      img: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
      link: 'https://unity.com/bug-battle'
    },
    {
      id: 4,
      title: 'Симулятор кофе-брейка',
      description: 'Только ты, Unity и бесконечная чашка кофе. Главная цель — не пролить на клавиатуру!',
      img: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif',
      link: 'https://unity.com/coffee-break'
    },
    {
      id: 5,
      title: 'Пингвин против Unity Editor',
      description: 'Пингвин пытается собрать билд, но Editor сопротивляется. Кто победит — холод или баги?',
      img: 'https://media.giphy.com/media/2wYQbQpU5hI4A/giphy.gif',
      link: 'https://unity.com/penguin-vs-editor'
    }
  ];
  // Корневые страницы
  const rootPages = [
    { value: 'home', label: 'Главная' },
    { value: 'dev', label: 'Dev-портфолио' },
    { value: 'x', label: 'Инфографика' }
  ];
  const [selectedPage, setSelectedPage] = useState('home');
  const [form, setForm] = useState({
    id: '',
    title: '',
    description: '',
    link: '',
    img: '',
    images: '',
    isFullWidth: false
  });
  const [status, setStatus] = useState('');
  const [usedIds, setUsedIds] = useState([]);

  const [projects, setProjects] = useState([]);
  useEffect(() => {
    let url = '';
    if (selectedPage === 'dev') {
      url = 'https://portfolio-backend-23pv.onrender.com/api/dev-projects';
    } else if (selectedPage === 'x') {
      url = 'https://portfolio-backend-23pv.onrender.com/api/infographic-steps';
    } else {
      url = 'https://portfolio-backend-23pv.onrender.com/api/images';
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setUsedIds(data.map(p => ({ id: p.id, description: p.description })));
      })
      .catch(() => {
        setProjects([]);
        setUsedIds([]);
      });
  }, [status, selectedPage]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('');
    const payload = {
      id: Number(form.id),
      title: form.title,
      description: form.description,
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      isFullWidth: form.isFullWidth
    };
    try {
      const res = await fetch('https://portfolio-backend-23pv.onrender.com/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setStatus('Успешно добавлено!');
        setForm({ id: '', title: '', description: '', images: '', isFullWidth: false });
      } else {
        setStatus('Ошибка: ' + (data.error || 'Не удалось добавить'));
      }
    } catch (err) {
      setStatus('Ошибка сети');
    }
  };

  // Drag-and-drop reorder logic
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(usedIds);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setUsedIds(items);
  };

  // Клик по id: загрузить проект в форму
  const handleIdClick = (id) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setForm({
        id: project.id,
        title: project.title || '',
        description: project.description || '',
        images: Array.isArray(project.images) ? project.images.join(', ') : '',
        isFullWidth: !!project.isFullWidth
      });
    }
  };

  return (
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
        {selectedPage === 'dev' ? (
              
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Dev-портфолио проекты</h3>
              <table style={{ width: '100%', fontSize: 15 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>id</th>
                    <th style={{ textAlign: 'left' }}>название</th>
                    <th style={{ textAlign: 'left' }}>описание</th>
                    <th style={{ textAlign: 'left' }}>ссылка</th>
                    <th style={{ textAlign: 'left' }}>картинка</th>
                  </tr>
                </thead>
                <tbody>
                  {devProjectsLocal.map((p) => (
                    <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => {
                      setForm({
                        id: p.id,
                        title: p.title,
                        description: p.description,
                        link: p.link,
                        img: p.img,
                        images: '',
                        isFullWidth: false
                      });
                    }}>
                      <td style={{ padding: '2px 8px', fontWeight: 'bold', color: '#05A302' }}>{p.id}</td>
                      <td style={{ padding: '2px 8px', color: '#398dd3', fontWeight: 'bold' }}>{p.title}</td>
                      <td style={{ padding: '2px 8px', color: '#555' }}>{p.description}</td>
                      <td style={{ padding: '2px 8px' }}>
                        <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: '#ff9800', textDecoration: 'underline' }}>ссылка</a>
                      </td>
                      <td style={{ padding: '2px 8px' }}>
                        <img src={p.img} alt={p.title} style={{ maxWidth: 60, borderRadius: 4 }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ margin: '24px 0', background: '#f2f2f2', borderRadius: 12, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
                <h4 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#ff9800' }}>Редактировать проект</h4>
                <form onSubmit={handleDevSubmit}>
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
                    <label>Картинка (URL): <input name="img" type="text" value={form.img} onChange={handleChange} style={{ width: '100%' }} /></label>
                  </div>
                  <button type="submit" style={{ padding: '8px 24px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>Сохранить</button>
                </form>
                {status && <div style={{ marginTop: 16, color: status.includes('Ошибка') ? 'red' : 'green' }}>{status}</div>}
              </div>
            </div>
            ) : (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>all items</h3>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="ids-list">
                    {(provided) => (
                      <table style={{ width: '100%', fontSize: 15 }} ref={provided.innerRef} {...provided.droppableProps}>
                        <thead>
                          <tr><th style={{ textAlign: 'left' }}>id</th><th style={{ textAlign: 'left' }}>описание</th></tr>
                        </thead>
                        <tbody>
                          {usedIds.map(({ id, description }, idx) => (
                            <Draggable key={id} draggableId={id.toString()} index={idx}>
                              {(provided, snapshot) => (
                                <tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    background: snapshot.isDragging ? '#e0ffe0' : 'inherit',
                                    cursor: 'grab'
                                  }}
                                >
                                  <td style={{ padding: '2px 8px', fontWeight: 'bold', color: '#05A302' }}>
                                    {id}
                                  </td>
                                  <td style={{ padding: '2px 8px', color: '#555', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {description}
                                    <button
                                      title="Редактировать"
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        marginLeft: 8,
                                        display: 'flex',
                                        alignItems: 'center'
                                      }}
                                      onClick={() => handleIdClick(id)}
                                    >
                                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 17l2.1-6.3a1 1 0 0 1 .25-0.4l8.1-8.1a1.5 1.5 0 0 1 2.1 2.1l-8.1 8.1a1 1 0 0 1-0.4.25L3 17z" stroke="#ff9800" strokeWidth="2.5" fill="#ff9800"/>
                                        <rect x="13.5" y="2.5" width="3" height="1.5" rx="0.75" transform="rotate(45 13.5 2.5)" fill="#ff9800" />
                                      </svg>
                                    </button>
                                  </td>
                                </tr>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </tbody>
                      </table>
                    )}
                  </Droppable>
                </DragDropContext>
              </>
            )}
          </div>
          </>
        )}
      </div>
      <div style={{ flex: 1, background: '#f2f2f2', borderRadius: 12, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', minHeight: 500 }}>
        <div style={{ flex: '0 0 auto' }}>
          {selectedPage === 'home' && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#22c55e' }}>Редактирование главной страницы</h2>
              <div style={{ marginBottom: 16, color: '#555' }}>Здесь вы можете добавить или изменить контент главной страницы сайта.</div>
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
