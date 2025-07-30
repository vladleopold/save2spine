// Анимированный фон с частицами (canvas)
function ParticlesBackground() {
  const canvasRef = React.useRef(null);
  const colors = ['#22c55e', '#fde047', '#ef4444', '#22c55e']; // зеленый, желтый, красный, зеленый
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

    // Инициализация частиц
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
        // Зацикливание
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

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}





import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { useSwipeable } from 'react-swipeable';

// Fade-in компонент для анимации появления изображений
function FadeImg({ src }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, [src]);
  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      className={`max-w-[90%] max-h-[50vh] w-full aspect-video rounded transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'} select-none pointer-events-auto`}
      draggable={false}
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}

function isGif(src) {
  return typeof src === 'string' && src.trim() !== '' && src.split('.').pop().toLowerCase() === 'gif';
}

function isWebp(src) {
  return typeof src === 'string' && src.trim() !== '' && src.split('.').pop().toLowerCase() === 'webp';
}

export default function App() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null); // индекс выбранного проекта
  const [activeImage, setActiveImage] = useState(0); // индекс фото внутри popup

  useEffect(() => {
    fetch('https://portfolio-backend-23pv.onrender.com/api/images')
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

  // Получаем только валидные изображения для текущего проекта
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

  return (
    <div className="p-4 relative z-10">
      <ParticlesBackground />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h1 className="text-2xl font-bold">spine animator portfolio</h1>
        <a
          href="https://www.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-bold bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200"
          style={{ height: '2.25rem', display: 'flex', alignItems: 'center' }}
        >
          resume
        </a>
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
              return (
                <div key={project.id} onClick={() => openProject(idx)}>
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

      {/* Popup: все фото проекта в столбик + свайп для смены проекта */}
      {activeProject !== null && projects[activeProject] && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 overflow-auto"
          onClick={closePopup}
          {...swipeHandlers}
        >
          <div
            className="bg-white rounded-lg p-4 max-w-xl w-full flex flex-col items-center relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex w-full justify-between mb-2">
              <button
                onClick={() => setActiveProject((prev) => (prev - 1 + projects.length) % projects.length)}
                className="bg-gray-200 rounded px-3 py-1"
                aria-label="Предыдущий проект"
              >
                ←
              </button>
              <button onClick={closePopup} className="bg-red-600 text-white rounded px-3 py-1">Закрыть</button>
              <button
                onClick={() => setActiveProject((prev) => (prev + 1) % projects.length)}
                className="bg-gray-200 rounded px-3 py-1"
                aria-label="Следующий проект"
              >
                →
              </button>
            </div>
            <h2 className="font-bold text-xl mb-2">{projects[activeProject].title}</h2>
            <p className="text-gray-700 mb-4 text-center">{projects[activeProject].description}</p>
            <div className="flex flex-col gap-4 w-full items-center">
              {getValidImages(activeProject).map((src, idx) => {
                const isJoyvi1 = src.includes('joyvi1.gif');
                return (
                  <div key={idx} style={isJoyvi1 ? { maxWidth: 300, width: '100%' } : { width: '100%' }}>
                    <FadeImg src={src} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
