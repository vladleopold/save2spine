//import Admin from './Admin.jsx';

// This file has been removed as part of the update.
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Admin() {
  const [newPageName, setNewPageName] = useState('');
  const [customPages, setCustomPages] = useState([]);
  const [newPageTemplate, setNewPageTemplate] = useState('page');
  const [selectedPage, setSelectedPage] = useState('home');
  const [form, setForm] = useState({
    id: '',
    title: '',
    description: '',
    images: '',
    isFullWidth: false
    }
  // ...existing code...
  // Добавление новой страницы
  const handleAddPage = async () => {
    const name = newPageName.trim();
    if (!name || customPages.includes(name) || ['home','dev','x'].includes(name)) return;
    setCustomPages([...customPages, name]);
    setNewPageName('');
    // Создать файл-страницу
    try {
      const filePath = `/Users/vladyslavchaplygin/save2spine.online/frontend/src/${name}.jsx`;
      let content = '';
      if (newPageTemplate === 'gallery') {
        content = 'import React, { useState, useEffect } from "react";\nimport Masonry from "react-masonry-css";\nimport { useSwipeable } from "react-swipeable";\n\nfunction ParticlesBackground() {\n  const canvasRef = React.useRef(null);\n  const colors = ["#22c55e", "#fde047", "#ef4444", "#22c55e"];\n  const PARTICLE_COUNT = 60;\n  const MIN_SIZE = 2;\n  const MAX_SIZE = 4;\n  const SPEED = 0.2;\n\n  React.useEffect(() => {\n    const canvas = canvasRef.current;\n    if (!canvas) return;\n    const ctx = canvas.getContext("2d");\n    let width = window.innerWidth;\n    let height = window.innerHeight;\n    let animationId;\n    function resize() {\n      width = window.innerWidth;\n      height = window.innerHeight;\n      canvas.width = width;\n      canvas.height = height;\n    }\n    resize();\n    window.addEventListener("resize", resize);\n    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => {\n      const angle = Math.random() * 2 * Math.PI;\n      const speed = SPEED + Math.random() * SPEED;\n      return {\n        x: Math.random() * width,\n        y: Math.random() * height,\n        r: MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE),\n        color: colors[Math.floor(Math.random() * colors.length)],\n        dx: Math.cos(angle) * speed,\n        dy: Math.sin(angle) * speed,\n      };\n    });\n    function animate() {\n      ctx.clearRect(0, 0, width, height);\n      for (const p of particles) {\n        ctx.beginPath();\n        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);\n        ctx.fillStyle = p.color;\n        ctx.globalAlpha = 0.7;\n        ctx.fill();\n        ctx.globalAlpha = 1;\n        p.x += p.dx;\n        p.y += p.dy;\n        if (p.x < -p.r) p.x = width + p.r;\n        if (p.x > width + p.r) p.x = -p.r;\n        if (p.y < -p.r) p.y = height + p.r;\n        if (p.y > height + p.r) p.y = -p.r;\n      }\n      animationId = requestAnimationFrame(animate);\n    }\n    animate();\n    return () => {\n      window.removeEventListener("resize", resize);\n      cancelAnimationFrame(animationId);\n    };\n  }, []);\n  return (\n    <canvas\n      ref={canvasRef}\n      style={{\n        position: "fixed",\n        top: 0,\n        left: 0,\n        width: "100vw",\n        height: "100vh",\n        zIndex: 0,\n        pointerEvents: "none",\n      }}\n    />\n  );\n}\n\nexport default function Gallery() {\n  const [projects, setProjects] = useState([]);\n  const [activeProject, setActiveProject] = useState(null);\n  const [activeImage, setActiveImage] = useState(0);\n  useEffect(() => {\n    fetch("https://portfolio-backend-23pv.onrender.com/api/images")\n      .then((res) => res.json())\n      .then((data) => setProjects(data))\n      .catch((err) => console.error("Ошибка загрузки проектов:", err));\n  }, []);\n  const openProject = (projectIdx) => {\n    setActiveProject(projectIdx);\n    setActiveImage(0);\n  };\n  const closePopup = () => {\n    setActiveProject(null);\n    setActiveImage(0);\n  };\n  const getValidImages = (projectIdx) => {\n    if (projectIdx === null || !projects[projectIdx]) return [];\n    return (projects[projectIdx].images || []).filter(src => typeof src === "string" && src.trim() !== "");\n  };\n  const swipeHandlers = useSwipeable({\n    onSwipedLeft: () => setActiveProject((prev) => (prev + 1) % projects.length),\n    onSwipedRight: () => setActiveProject((prev) => (prev - 1 + projects.length) % projects.length),\n    trackMouse: true\n  });\n  return (\n    <div className="p-4 relative z-10">\n      <ParticlesBackground />\n      <div className="flex items-center justify-between mb-4 relative z-10">\n        <h1 className="text-2xl font-bold">gallery page</h1>\n      </div>\n      {projects.length === 0 ? (<p className="col-span-3 text-center">Загрузка проектов...</p>) : (\n        <Masonry breakpointCols={{ default: 3, 900: 2, 600: 1 }} className="flex w-auto gap-4" columnClassName="masonry-column">\n          {projects.map((project, idx) => ({ project, idx, validImages: (project.images || []).filter(src => typeof src === "string" && src.trim() !== "") })).filter(({ validImages }) => validImages.length > 0).map(({ project, idx, validImages }) => {\n            const src = validImages[0];\n            const isFullWidth = project.isFullWidth;\n            return (\n              <div key={project.id} onClick={() => openProject(idx)} className={isFullWidth ? "full-width-image" : ""}>\n                <img src={src} alt={project.description || "project"} style={{ width: "100%", display: "block", borderRadius: 8, objectFit: "cover" }} />\n              </div>\n            );\n          })}\n        </Masonry>\n      )}\n      {activeProject !== null && projects[activeProject] && (\n        <>\n          <div className="article-popup-overlay" onClick={closePopup}></div>\n          <div className="article-popup" {...swipeHandlers} onClick={(e) => e.stopPropagation()}>\n            <button className="close-button" onClick={closePopup} aria-label="Закрыть">×</button>\n            <h2 className="font-bold text-2xl mb-4">{projects[activeProject].title}</h2>\n            <p className="mb-4">{projects[activeProject].description}</p>\n            <img src={getValidImages(activeProject)[0]} alt={projects[activeProject].title || "Изображение"} className="mb-4" {...swipeHandlers} draggable={false} style={{ userSelect: "none", WebkitUserDrag: "none" }} />\n            <div className="additional-images">{getValidImages(activeProject).slice(1).map((src, idx) => (<img key={idx} src={src} alt={`Дополнительное изображение ${idx + 1}`} className="mb-4" {...swipeHandlers} draggable={false} style={{ userSelect: "none", WebkitUserDrag: "none" }} />))}</div>\n          </div>\n        </>\n      )}\n    </div>\n  );\n}\n';
      } else {
        content = `import React from 'react';\n\nexport default function ${name.charAt(0).toUpperCase() + name.slice(1)}() {\n  return (\n    <div style={{ maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>\n      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24, color: '#22c55e' }}>${name}</h1>\n      <p style={{ fontSize: 18, marginBottom: 16 }}>\n        Здесь будет ваш контент!\n      </p>\n    </div>\n  );\n}\n`;
      }
      await fetch(filePath, { method: 'PUT', body: content });
    } catch {}
    // Добавить роут в main.jsx
    try {
      const mainPath = '/Users/vladyslavchaplygin/save2spine.online/frontend/src/main.jsx';
      const mainCode = await (await fetch(mainPath)).text();
      const importLine = `import ${name} from './${name}.jsx';\n`;
      const routeLine = `  <Route path="/${name}" element={<${name} />} />\n`;
      let newCode = mainCode;
      if (!mainCode.includes(importLine)) {
        newCode = newCode.replace(/(import Xx from '\.\/xx\.jsx';\n)/, `$1${importLine}`);
      }
      if (!mainCode.includes(routeLine)) {
        newCode = newCode.replace(/(\s*<Route path=\"\/x\" element=\{<Xx \/>\} \/>\n)/, `$1${routeLine}`);
      }
      await fetch(mainPath, { method: 'PUT', body: newCode });
    } catch {}
  };
    // home
    fetch('https://portfolio-backend-23pv.onrender.com/api/images')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
      })
      .catch(() => setProjects([]));
    // dev
    fetch('https://portfolio-backend-23pv.onrender.com/api/dev')
      .then(res => res.json())
      .then(data => {
        setDevProjects(data);
      })
      .catch(() => setDevProjects([]));
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
  // ...existing code...
      }
    } catch (err) {
      setStatus('Ошибка сети');
  } else {
  };

  // Получить список id для выбранной страницы
  const getUsedIds = () => {
    if (selectedPage === 'dev') {
      return devProjects.map(p => ({ id: p.id, description: p.description }));
    }
    return projects.map(p => ({ id: p.id, description: p.description }));
  };

  // Drag-and-drop reorder logic
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(getUsedIds());
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
      }
      if (newPageTemplate === 'gallery') {
        // gallery шаблон с экранированными кавычками и переносами
        content = `import React, { useState, useEffect } from 'react';
  // Клик по id: загрузить проект в форму
  const handleIdClick = (id) => {
    let project = null;
    if (selectedPage === 'dev') {
      project = devProjects.find(p => p.id === id);
    } else {
      project = projects.find(p => p.id === id);
    }
    if (project) {
      setForm({
        id: project.id,
        title: project.title || '',
        description: project.description || '',
        images: Array.isArray(project.images) ? project.images.join(', ') : '',
        isFullWidth: !!project.isFullWidth
    if (!name || customPages.includes(name) || ['home','dev','x'].includes(name)) return;
    setCustomPages([...customPages, name]);
    setNewPageName('');
    // Создать файл-страницу
    try {
      const filePath = `/Users/vladyslavchaplygin/save2spine.online/frontend/src/${name}.jsx;
      let content = '';
        if (newPageTemplate === 'gallery') {
          content = 'import React, { useState, useEffect } from "react";\nimport Masonry from "react-masonry-css";\nimport { useSwipeable } from "react-swipeable";\n\nfunction ParticlesBackground() {\n  const canvasRef = React.useRef(null);\n  const colors = ["#22c55e", "#fde047", "#ef4444", "#22c55e"];\n  const PARTICLE_COUNT = 60;\n  const MIN_SIZE = 2;\n  const MAX_SIZE = 4;\n  const SPEED = 0.2;\n\n  React.useEffect(() => {\n    const canvas = canvasRef.current;\n    if (!canvas) return;\n    const ctx = canvas.getContext("2d");\n    let width = window.innerWidth;\n    let height = window.innerHeight;\n    let animationId;\n    function resize() {\n      width = window.innerWidth;\n      height = window.innerHeight;\n      canvas.width = width;\n      canvas.height = height;\n    }\n    resize();\n    window.addEventListener("resize", resize);\n    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => {\n      const angle = Math.random() * 2 * Math.PI;\n      const speed = SPEED + Math.random() * SPEED;\n      return {\n        x: Math.random() * width,\n        y: Math.random() * height,\n        r: MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE),\n        color: colors[Math.floor(Math.random() * colors.length)],\n        dx: Math.cos(angle) * speed,\n        dy: Math.sin(angle) * speed,\n      };\n    });\n    function animate() {\n      ctx.clearRect(0, 0, width, height);\n      for (const p of particles) {\n        ctx.beginPath();\n        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);\n        ctx.fillStyle = p.color;\n        ctx.globalAlpha = 0.7;\n        ctx.fill();\n        ctx.globalAlpha = 1;\n        p.x += p.dx;\n        p.y += p.dy;\n        if (p.x < -p.r) p.x = width + p.r;\n        if (p.x > width + p.r) p.x = -p.r;\n        if (p.y < -p.r) p.y = height + p.r;\n        if (p.y > height + p.r) p.y = -p.r;\n      }\n      animationId = requestAnimationFrame(animate);\n    }\n    animate();\n    return () => {\n      window.removeEventListener("resize", resize);\n      cancelAnimationFrame(animationId);\n    };\n  }, []);\n  return (\n    <canvas\n      ref={canvasRef}\n      style={{\n        position: "fixed",\n        top: 0,\n        left: 0,\n        width: "100vw",\n        height: "100vh",\n        zIndex: 0,\n        pointerEvents: "none",\n      }}\n    />\n  );\n}\n\nexport default function Gallery() {\n  const [projects, setProjects] = useState([]);\n  const [activeProject, setActiveProject] = useState(null);\n  const [activeImage, setActiveImage] = useState(0);\n  useEffect(() => {\n    fetch("https://portfolio-backend-23pv.onrender.com/api/images")\n      .then((res) => res.json())\n      .then((data) => setProjects(data))\n      .catch((err) => console.error("Ошибка загрузки проектов:", err));\n  }, []);\n  const openProject = (projectIdx) => {\n    setActiveProject(projectIdx);\n    setActiveImage(0);\n  };\n  const closePopup = () => {\n    setActiveProject(null);\n    setActiveImage(0);\n  };\n  const getValidImages = (projectIdx) => {\n    if (projectIdx === null || !projects[projectIdx]) return [];\n    return (projects[projectIdx].images || []).filter(src => typeof src === "string" && src.trim() !== "");\n  };\n  const swipeHandlers = useSwipeable({\n    onSwipedLeft: () => setActiveProject((prev) => (prev + 1) % projects.length),\n    onSwipedRight: () => setActiveProject((prev) => (prev - 1 + projects.length) % projects.length),\n    trackMouse: true\n  });\n  return (\n    <div className="p-4 relative z-10">\n      <ParticlesBackground />\n      <div className="flex items-center justify-between mb-4 relative z-10">\n        <h1 className="text-2xl font-bold">gallery page</h1>\n      </div>\n      {projects.length === 0 ? (<p className="col-span-3 text-center">Загрузка проектов...</p>) : (\n        <Masonry breakpointCols={{ default: 3, 900: 2, 600: 1 }} className="flex w-auto gap-4" columnClassName="masonry-column">\n          {projects.map((project, idx) => ({ project, idx, validImages: (project.images || []).filter(src => typeof src === "string" && src.trim() !== "") })).filter(({ validImages }) => validImages.length > 0).map(({ project, idx, validImages }) => {\n            const src = validImages[0];\n            const isFullWidth = project.isFullWidth;\n            return (\n              <div key={project.id} onClick={() => openProject(idx)} className={isFullWidth ? "full-width-image" : ""}>\n                <img src={src} alt={project.description || "project"} style={{ width: "100%", display: "block", borderRadius: 8, objectFit: "cover" }} />\n              </div>\n            );\n          })}\n        </Masonry>\n      )}\n      {activeProject !== null && projects[activeProject] && (\n        <>\n          <div className="article-popup-overlay" onClick={closePopup}></div>\n          <div className="article-popup" {...swipeHandlers} onClick={(e) => e.stopPropagation()}>\n            <button className="close-button" onClick={closePopup} aria-label="Закрыть">×</button>\n            <h2 className="font-bold text-2xl mb-4">{projects[activeProject].title}</h2>\n            <p className="mb-4">{projects[activeProject].description}</p>\n            <img src={getValidImages(activeProject)[0]} alt={projects[activeProject].title || "Изображение"} className="mb-4" {...swipeHandlers} draggable={false} style={{ userSelect: "none", WebkitUserDrag: "none" }} />\n            <div className="additional-images">{getValidImages(activeProject).slice(1).map((src, idx) => (<img key={idx} src={src} alt={`Дополнительное изображение ${idx + 1}`} className="mb-4" {...swipeHandlers} draggable={false} style={{ userSelect: "none", WebkitUserDrag: "none" }} />))}</div>\n          </div>\n        </>\n      )}\n    </div>\n  );\n}\n';
        } else {
          content = 'import React from "react";\n\nexport default function Page() {\n  return (\n    <div style={{ maxWidth: 800, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: 32 }}>\n      <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 24, color: "#22c55e" }}>Новая страница</h1>\n      <p style={{ fontSize: 18, marginBottom: 16 }}>Здесь будет ваш контент!</p>\n    </div>\n  );\n}\n';
        }
      } else {
        content = `import React from 'react';\n\nexport default function ${name.charAt(0).toUpperCase() + name.slice(1)}() {\n  return (\n    <div style={{ maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>\n      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24, color: '#22c55e' }}>${name}</h1>\n      <p style={{ fontSize: 18, marginBottom: 16 }}>\n        Здесь будет ваш контент!\n      </p>\n    </div>\n  );\n}\n`;
      }
      await fetch(filePath, { method: 'PUT', body: content });
    } catch {}
    // Добавить роут в main.jsx
    try {
      const mainPath = '/Users/vladyslavchaplygin/save2spine.online/frontend/src/main.jsx';
      const mainCode = await (await fetch(mainPath)).text();
      const importLine = `import ${name} from './${name}.jsx';\n`;
      const routeLine = `  <Route path="/${name}" element={<${name} />} />\n`;
      let newCode = mainCode;
      if (!mainCode.includes(importLine)) {
        newCode = newCode.replace(/(import Xx from \'\.\/xx\.jsx\';\n)/, `$1${importLine}`);
      }
      if (!mainCode.includes(routeLine)) {
        newCode = newCode.replace(/(\s*<Route path=\"\/x\" element=\{<Xx \/>\} \/>\n)/, `$1${routeLine}`);
      }
      await fetch(mainPath, { method: 'PUT', body: newCode });
    } catch {}
  };

  return (
    <div style={{ display: 'flex', maxWidth: 900, margin: '40px auto', gap: 32 }}>
      <div style={{ minWidth: 220, background: '#f6f6f6', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 'fit-content' }}>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            value={newPageName}
            onChange={e => setNewPageName(e.target.value)}
            placeholder="Имя новой страницы"
            style={{ fontSize: 15, padding: '4px 12px', borderRadius: 6, border: '1px solid #ddd' }}
          />
          <select value={newPageTemplate} onChange={e => setNewPageTemplate(e.target.value)} style={{ fontSize: 15, padding: '4px 12px', borderRadius: 6, border: '1px solid #ddd' }}>
            <option value="page">page</option>
            <option value="gallery">gallery</option>
          </select>
          <button
            onClick={handleAddPage}
            style={{ fontSize: 15, padding: '4px 16px', borderRadius: 6, border: 'none', background: '#22c55e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >Добавить</button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>Страница:</label>
          <select value={selectedPage} onChange={e => setSelectedPage(e.target.value)} style={{ fontSize: 15, padding: '4px 12px', borderRadius: 6, border: '1px solid #ddd' }}>
            <option value="home">Главная</option>
            <option value="dev">Dev-портфолио</option>
            <option value="x">Инфографика</option>
            {customPages.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>all items</h3>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="ids-list">
            {(provided) => (
              <table style={{ width: '100%', fontSize: 15 }} ref={provided.innerRef} {...provided.droppableProps}>
                <thead>
                  <tr><th style={{ textAlign: 'left' }}>id</th><th style={{ textAlign: 'left' }}>описание</th></tr>
                </thead>
                <tbody>
                  {getUsedIds().map(({ id, description }, idx) => (
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
                          <td style={{ padding: '2px 8px', fontWeight: 'bold', color: '#22c55e' }}>
                            {id}
                          </td>
                          <td style={{ padding: '2px 8px', color: '#555', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 8, display: 'flex', alignItems: 'center' }} onClick={() => handleIdClick(id)}>
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
      </div>
      <div style={{ flex: 1, background: '#f2f2f2', borderRadius: 12, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', minHeight: 500 }}>
        <div style={{ flex: '0 0 auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: "#398dd3" }}>add/edit item</h2>
          <form onSubmit={handleSubmit}>
                        };

                        // ...existing code...

                        const handleAddPage = async () => {
                          const name = newPageName.trim();
                          if (!name || customPages.includes(name) || ['home','dev','x'].includes(name)) return;
                          setCustomPages([...customPages, name]);
                          setNewPageName('');
                          // Создать файл-страницу
                          try {
                            const filePath = `/Users/vladyslavchaplygin/save2spine.online/frontend/src/${name}.jsx`;
                            let content = '';
                            if (newPageTemplate === 'gallery') {
                              content = 'import React, { useState, useEffect } from "react";\nimport Masonry from "react-masonry-css";\nimport { useSwipeable } from "react-swipeable";\n\nfunction ParticlesBackground() {\n  const canvasRef = React.useRef(null);\n  const colors = ["#22c55e", "#fde047", "#ef4444", "#22c55e"];\n  const PARTICLE_COUNT = 60;\n  const MIN_SIZE = 2;\n  const MAX_SIZE = 4;\n  const SPEED = 0.2;\n\n  React.useEffect(() => {\n    const canvas = canvasRef.current;\n    if (!canvas) return;\n    const ctx = canvas.getContext("2d");\n    let width = window.innerWidth;\n    let height = window.innerHeight;\n    let animationId;\n    function resize() {\n      width = window.innerWidth;\n      height = window.innerHeight;\n      canvas.width = width;\n      canvas.height = height;\n    }\n    resize();\n    window.addEventListener("resize", resize);\n    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => {\n      const angle = Math.random() * 2 * Math.PI;\n      const speed = SPEED + Math.random() * SPEED;\n      return {\n        x: Math.random() * width,\n        y: Math.random() * height,\n        r: MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE),\n        color: colors[Math.floor(Math.random() * colors.length)],\n        dx: Math.cos(angle) * speed,\n        dy: Math.sin(angle) * speed,\n      };\n    });\n    function animate() {\n      ctx.clearRect(0, 0, width, height);\n      for (const p of particles) {\n        ctx.beginPath();\n        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);\n        ctx.fillStyle = p.color;\n        ctx.globalAlpha = 0.7;\n        ctx.fill();\n        ctx.globalAlpha = 1;\n        p.x += p.dx;\n        p.y += p.dy;\n        if (p.x < -p.r) p.x = width + p.r;\n        if (p.x > width + p.r) p.x = -p.r;\n        if (p.y < -p.r) p.y = height + p.r;\n        if (p.y > height + p.r) p.y = -p.r;\n      }\n      animationId = requestAnimationFrame(animate);\n    }\n    animate();\n    return () => {\n      window.removeEventListener("resize", resize);\n      cancelAnimationFrame(animationId);\n    };\n  }, []);\n  return (\n    <canvas\n      ref={canvasRef}\n      style={{\n        position: "fixed",\n        top: 0,\n        left: 0,\n        width: "100vw",\n        height: "100vh",\n        zIndex: 0,\n        pointerEvents: "none",\n      }}\n    />\n  );\n}\n\nexport default function Gallery() {\n  const [projects, setProjects] = useState([]);\n  const [activeProject, setActiveProject] = useState(null);\n  const [activeImage, setActiveImage] = useState(0);\n  useEffect(() => {\n    fetch("https://portfolio-backend-23pv.onrender.com/api/images")\n      .then((res) => res.json())\n      .then((data) => setProjects(data))\n      .catch((err) => console.error("Ошибка загрузки проектов:", err));\n  }, []);\n  const openProject = (projectIdx) => {\n    setActiveProject(projectIdx);\n    setActiveImage(0);\n  };\n  const closePopup = () => {\n    setActiveProject(null);\n    setActiveImage(0);\n  };\n  const getValidImages = (projectIdx) => {\n    if (projectIdx === null || !projects[projectIdx]) return [];\n    return (projects[projectIdx].images || []).filter(src => typeof src === "string" && src.trim() !== "");\n  };\n  const swipeHandlers = useSwipeable({\n    onSwipedLeft: () => setActiveProject((prev) => (prev + 1) % projects.length),\n    onSwipedRight: () => setActiveProject((prev) => (prev - 1 + projects.length) % projects.length),\n    trackMouse: true\n  });\n  return (\n    <div className="p-4 relative z-10">\n      <ParticlesBackground />\n      <div className="flex items-center justify-between mb-4 relative z-10">\n        <h1 className="text-2xl font-bold">gallery page</h1>\n      </div>\n      {projects.length === 0 ? (<p className="col-span-3 text-center">Загрузка проектов...</p>) : (\n        <Masonry breakpointCols={{ default: 3, 900: 2, 600: 1 }} className="flex w-auto gap-4" columnClassName="masonry-column">\n          {projects.map((project, idx) => ({ project, idx, validImages: (project.images || []).filter(src => typeof src === "string" && src.trim() !== "") })).filter(({ validImages }) => validImages.length > 0).map(({ project, idx, validImages }) => {\n            const src = validImages[0];\n            const isFullWidth = project.isFullWidth;\n            return (\n              <div key={project.id} onClick={() => openProject(idx)} className={isFullWidth ? "full-width-image" : ""}>\n                <img src={src} alt={project.description || "project"} style={{ width: "100%", display: "block", borderRadius: 8, objectFit: "cover" }} />\n              </div>\n            );\n          })}\n        </Masonry>\n      )}\n      {activeProject !== null && projects[activeProject] && (\n        <>\n          <div className="article-popup-overlay" onClick={closePopup}></div>\n          <div className="article-popup" {...swipeHandlers} onClick={(e) => e.stopPropagation()}>\n            <button className="close-button" onClick={closePopup} aria-label="Закрыть">×</button>\n            <h2 className="font-bold text-2xl mb-4">{projects[activeProject].title}</h2>\n            <p className="mb-4">{projects[activeProject].description}</p>\n            <img src={getValidImages(activeProject)[0]} alt={projects[activeProject].title || "Изображение"} className="mb-4" {...swipeHandlers} draggable={false} style={{ userSelect: "none", WebkitUserDrag: "none" }} />\n            <div className="additional-images">{getValidImages(activeProject).slice(1).map((src, idx) => (<img key={idx} src={src} alt={`Дополнительное изображение ${idx + 1}`} className="mb-4" {...swipeHandlers} draggable={false} style={{ userSelect: "none", WebkitUserDrag: "none" }} />))}</div>\n          </div>\n        </>\n      )}\n    </div>\n  );\n}\n';
                            } else {
                              content = `import React from 'react';\n\nexport default function ${name.charAt(0).toUpperCase() + name.slice(1)}() {\n  return (\n    <div style={{ maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>\n      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24, color: '#22c55e' }}>${name}</h1>\n      <p style={{ fontSize: 18, marginBottom: 16 }}>\n        Здесь будет ваш контент!\n      </p>\n    </div>\n  );\n}\n`;
                            }
                            await fetch(filePath, { method: 'PUT', body: content });
                          } catch {}
                          // Добавить роут в main.jsx
                          try {
                            const mainPath = '/Users/vladyslavchaplygin/save2spine.online/frontend/src/main.jsx';
                            const mainCode = await (await fetch(mainPath)).text();
                            const importLine = `import ${name} from './${name}.jsx';\n`;
                            const routeLine = `  <Route path="/${name}" element={<${name} />} />\n`;
                            let newCode = mainCode;
                            if (!mainCode.includes(importLine)) {
                              newCode = newCode.replace(/(import Xx from '\.\/xx\.jsx';\n)/, `$1${importLine}`);
                            }
                            if (!mainCode.includes(routeLine)) {
                              newCode = newCode.replace(/(\s*<Route path=\"\/x\" element=\{<Xx \/>\} \/>\n)/, `$1${routeLine}`);
                            }
                            await fetch(mainPath, { method: 'PUT', body: newCode });
                          } catch {}
                        };
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

export default Admin;
