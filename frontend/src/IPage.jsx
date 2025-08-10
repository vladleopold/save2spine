import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { useSwipeable } from 'react-swipeable';

const API_URL = import.meta.env.VITE_API_URL || '';

function ParticlesBackground() {
  const canvasRef = React.useRef(null);
  const colors = ['#22c55e', '#fde047', '#ef4444', '#22c55e'];
  const PARTICLE_COUNT = 60;
  const MIN_SIZE = 2;
  const MAX_SIZE = 4;
  const SPEED = 0.2;
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId;
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => {
      const angle = Math.random() * 2 * Math.PI;
      const speed = SPEED + Math.random() * SPEED;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE),
        color: colors[Math.floor(Math.random() * colors.length)],
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
      };
    });
    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -p.r) p.x = width + p.r;
        if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        if (p.y > height + p.r) p.y = -p.r;
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

function isGif(src) {
  return typeof src === 'string' && src.trim() !== '' && src.split('.').pop().toLowerCase() === 'gif';
}
function isWebp(src) {
  return typeof src === 'string' && src.trim() !== '' && src.split('.').pop().toLowerCase() === 'webp';
}

export default function IPage() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/i-items`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error('Ошибка загрузки проектов:', err));
  }, []);

  const openProject = (projectIdx) => {
    setActiveProject(projectIdx);
    setActiveImage(0);
  };
  const closePopup = () => {
    setActiveProject(null);
    setActiveImage(0);
  };
  const getValidImages = (projectIdx) => {
    if (projectIdx === null || !projects[projectIdx]) return [];
    return (projects[projectIdx].images || []).filter(src => typeof src === 'string' && src.trim() !== '');
  };
  const nextImage = () => {
    if (activeProject === null) return;
    const validImages = getValidImages(activeProject);
    setActiveImage((prev) => (prev + 1) % validImages.length);
  };
  const prevImage = () => {
    if (activeProject === null) return;
    const validImages = getValidImages(activeProject);
    setActiveImage((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  // swipeable handlers для popup
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setActiveProject((prev) => (prev + 1) % projects.length),
    onSwipedRight: () => setActiveProject((prev) => (prev - 1 + projects.length) % projects.length),
    trackMouse: true
  });

  useEffect(() => {
    if (activeProject !== null) {
      const articlePopup = document.querySelector('.article-popup');
      if (articlePopup) {
        articlePopup.scrollTo({ top: 250, behavior: 'smooth' });
        articlePopup.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [activeProject]);

  return (
    <div className="p-4 relative z-10">
      <ParticlesBackground />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h1 className="text-2xl font-bold">spine animator portfolio (I)</h1>
      </div>
      {projects.length === 0 ? (
        <p className="col-span-3 text-center">Загрузка проектов...</p>
      ) : (
        <Masonry
          breakpointCols={{ default: 3, 900: 2, 600: 1 }}
          className="flex w-auto gap-4"
          columnClassName="masonry-column"
        >
          {projects
            .map((project, idx) => ({ project, idx, validImages: (project.images || []).filter(src => typeof src === 'string' && src.trim() !== '') }))
            .filter(({ validImages }) => validImages.length > 0)
            .map(({ project, idx, validImages }) => {
              const src = validImages[0];
              const isFullWidth = project.isFullWidth;
              return (
                <div
                  key={project.id}
                  onClick={() => openProject(idx)}
                  className={isFullWidth ? 'full-width-image' : ''}
                >
                  <img
                    src={src}
                    alt={project.description || 'project'}
                    style={{
                      width: '100%',
                      display: 'block',
                      borderRadius: 8,
                      objectFit: isGif(src) || isWebp(src) ? 'contain' : 'cover'
                    }}
                  />
                </div>
              );
            })}
        </Masonry>
      )}

      {activeProject !== null && projects[activeProject] && (
        <>
          <div className="article-popup-overlay" onClick={closePopup}></div>
          <div
            className="article-popup"
            {...swipeHandlers}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={closePopup}
              aria-label="Закрыть"
            >
              ×
            </button>
            <h2 className="font-bold text-2xl mb-4">
              {projects[activeProject].title}
            </h2>
            <p className="mb-4">{projects[activeProject].description}</p>
            <img
              src={getValidImages(activeProject)[0]}
              alt={projects[activeProject].title || 'Изображение'}
              className="mb-4"
              {...swipeHandlers}
              draggable={false}
              style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
            />
            <div className="additional-images">
              {getValidImages(activeProject).slice(1).map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Дополнительное изображение ${idx + 1}`}
                  className="mb-4"
                  {...swipeHandlers}
                  draggable={false}
                  style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
