function AdminGallery() {
  const [form, setForm] = useState({
    id: '',
    title: '',
    description: '',
    images: '',
    isFullWidth: false
  });
  const [status, setStatus] = useState('');
  const [usedIds, setUsedIds] = useState([]);

  useEffect(() => {
    fetch('https://portfolio-backend-23pv.onrender.com/api/images')
      .then(res => res.json())
      .then(data => setUsedIds(data.map(p => ({ id: p.id, description: p.description }))))
      .catch(() => setUsedIds([]));
  }, [status]);

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

  return (
    <div style={{ display: 'flex', maxWidth: 900, margin: '40px auto', gap: 32 }}>
      <div style={{ minWidth: 180, background: '#f6f6f6', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 'fit-content' }}>
        <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Используемые id</h3>
        <table style={{ width: '100%', fontSize: 15 }}>
          <thead>
            <tr><th style={{ textAlign: 'left' }}>id</th><th style={{ textAlign: 'left' }}>описание</th></tr>
          </thead>
          <tbody>
            {usedIds.map(({ id, description }) => (
              <tr key={id}>
                <td style={{ padding: '2px 8px', fontWeight: 'bold' }}>{id}</td>
                <td style={{ padding: '2px 8px', color: '#555' }}>{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Добавить проект в галерею</h2>
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
          <button type="submit" style={{ padding: '8px 24px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>Добавить</button>
        </form>
        {status && <div style={{ marginTop: 16, color: status.includes('Ошибка') ? 'red' : 'green' }}>{status}</div>}
      </div>
    </div>
  );
}

/*export default AdminGallery;*/
