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

<<<<<<< HEAD
  // swipeable handlers для фото (переключение фото)
  const imageSwipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeProject !== null && getValidImages(activeProject).length > 1) {
        setActiveImage((prev) => (prev + 1) % getValidImages(activeProject).length);
      }
    },
    onSwipedRight: () => {
      if (activeProject !== null && getValidImages(activeProject).length > 1) {
        setActiveImage((prev) => (prev - 1 + getValidImages(activeProject).length) % getValidImages(activeProject).length);
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // swipeable handlers для попапа (переключение фото)
  const popupSwipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeProject !== null && getValidImages(activeProject).length > 1) {
        setActiveImage((prev) => (prev + 1) % getValidImages(activeProject).length);
      }
    },
    onSwipedRight: () => {
      if (activeProject !== null && getValidImages(activeProject).length > 1) {
        setActiveImage((prev) => (prev - 1 + getValidImages(activeProject).length) % getValidImages(activeProject).length);
      }
    },
    preventDefaultTouchmoveEvent: true,
=======
  // swipeable handlers для popup
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setActiveProject((prev) => (prev + 1) % projects.length),
    onSwipedRight: () => setActiveProject((prev) => (prev - 1 + projects.length) % projects.length),
>>>>>>> parent of 3a1522a (свайп)
    trackMouse: true
  });

  useEffect(() => {
    if (activeProject !== null) {
      const articlePopup = document.querySelector('.article-popup');
      if (articlePopup) {
        // Скроллим на 250px вниз и сразу возвращаемся в начало
        articlePopup.scrollTo({ top: 250, behavior: 'smooth' });
        articlePopup.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [activeProject]);

  return (
    <div className="p-4 relative z-10">
      <ParticlesBackground />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h1 className="text-2xl font-bold">spine animator portfolio</h1>
        <a
          href="https://drive.google.com/file/d/1_h0KVlLw2ClgD8xeSn8lNfJpy7jyml1L/view?usp=sharing"
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
              const isFullWidth = project.isFullWidth; // Условие для полноразмерного изображения
              return (
                <div
                  key={project.id}
                  onClick={() => openProject(idx)}
                  className={isFullWidth ? 'full-width-image' : ''} // Применяем класс для полноразмерного изображения
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

      {/* Новое модальное окно "страница/статья" с дополнительными картинками, описанием и заголовком */}
      {activeProject !== null && projects[activeProject] && (
        <>
          <div className="article-popup-overlay" onClick={closePopup}></div>
          <div
            className="article-popup"
            {...popupSwipeHandlers}
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
<<<<<<< HEAD
              {...imageSwipeHandlers}
            />
            <div className="additional-images">
<<<<<<< HEAD
              {getValidImages(activeProject).map((src, idx) => (
                idx !== activeImage && (
                  <img
                    key={idx}
                    src={src}
                    alt={`Дополнительное изображение ${idx + 1}`}
                    className="mb-4"
                    onClick={() => setActiveImage(idx)}
                  />
                )
=======
            />
            <div className="additional-images">
=======
>>>>>>> parent of 3a1522a (свайп)
              {getValidImages(activeProject).slice(1).map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Дополнительное изображение ${idx + 1}`}
                  className="mb-4"
<<<<<<< HEAD
                />
>>>>>>> parent of 6d366f8 (front edit)
=======
                  {...swipeHandlers}
                />
>>>>>>> parent of 3a1522a (свайп)
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
