import React, { useState, useEffect } from 'react';
// Классический UI без drag-and-drop

function AdminGallery() {
  // Корневые страницы
  const rootPages = [
    { value: 'home', label: 'Главная' },
    { value: 'dev', label: 'Dev-портфолио' },
    { value: 'x', label: 'Инфографика' },
    { value: 'j', label: 'J страница' }
  ];
  const [selectedPage, setSelectedPage] = useState('home');
  // --- UI для выбора страницы (селектор)
  // --- useState для jItems (J страница)
  const [items, setItems] = useState([]);

  // --- useEffect для загрузки jItems
  useEffect(() => {
    let url = '';
    if (selectedPage === 'j') {
      url = '/api/j-items';
    } else if (selectedPage === 'dev') {
      url = 'https://portfolio-backend-23pv.onrender.com/api/dev-projects';
    } else if (selectedPage === 'x') {
      url = 'https://portfolio-backend-23pv.onrender.com/api/infographic-steps';
    } else {
      url = 'https://portfolio-backend-23pv.onrender.com/api/images';
    }
    fetch(url)
      .then(res => res.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, [selectedPage, status]);

  // --- handleJSubmit для J страницы
  const handleJSubmit = async (e) => {
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
      const res = await fetch('/api/j-items', {
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
  // --- Селектор страниц (UI)
  const pageSelector = (
    <div style={{ marginBottom: 24 }}>
      <label style={{ fontWeight: 'bold', marginRight: 8 }}>Страница:</label>
      <select value={selectedPage} onChange={e => setSelectedPage(e.target.value)} style={{ fontSize: 16, padding: '4px 12px', borderRadius: 6 }}>
        {rootPages.map(p => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>
    </div>
  );

  // Универсальный список для всех страниц
  const leftBlock = (
    <>
      <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Элементы страницы</h3>
      <table style={{ width: '100%', fontSize: 15, marginBottom: 24 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>id</th>
            <th style={{ textAlign: 'left' }}>название</th>
            <th style={{ textAlign: 'left' }}>описание</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => setForm({
              id: item.id,
              title: item.title || '',
              description: item.description || '',
              images: Array.isArray(item.images) ? item.images.join(', ') : '',
              isFullWidth: !!item.isFullWidth
            })}>
              <td style={{ padding: '2px 8px', fontWeight: 'bold', color: '#05A302' }}>{item.id}</td>
              <td style={{ padding: '2px 8px', color: '#398dd3', fontWeight: 'bold' }}>{item.title}</td>
              <td style={{ padding: '2px 8px', color: '#555' }}>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
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
  const [form, setForm] = useState({
    id: '',
    title: '',
    description: '',
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
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 'bold', marginRight: 8 }}>Страница:</label>
        <select value={selectedPage} onChange={e => setSelectedPage(e.target.value)} style={{ fontSize: 16, padding: '4px 12px', borderRadius: 6 }}>
          {rootPages.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#22c55e' }}>Админка: редактирование страниц</h1>
      {leftBlock}
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
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
          <label>images (через запятую): <input name="images" type="text" value={form.images} onChange={handleChange} style={{ width: '100%' }} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label><input name="isFullWidth" type="checkbox" checked={form.isFullWidth} onChange={handleChange} /> Широкий блок (занимает всю ширину)</label>
        </div>
        <button type="submit" style={{ padding: '8px 24px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>Сохранить</button>
      </form>
      {status && <div style={{ marginTop: 8, color: status.includes('Ошибка') ? 'red' : 'green' }}>{status}</div>}
    </div>
  );
}

export default AdminGallery;
