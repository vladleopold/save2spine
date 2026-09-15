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
function isWebm(src) {
  return typeof src === 'string' && src.trim() !== '' && src.split('?')[0].split('.').pop().toLowerCase() === 'webm';
}

// webm — только видео-тегом (img видео не показывает), остальное — img
function Media({ src, alt, className, style, ...rest }) {
  if (isWebm(src)) {
    return (
      <video
        src={src}
        className={className}
        style={style}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        {...rest}
      />
    );
  }
  return <img src={src} alt={alt} className={className} style={style} {...rest} />;
}

export default function IPage() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/i-items`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        const pid = new URLSearchParams(window.location.search).get('p');
        if (pid != null) {
          const idx = data.findIndex((p) => String(p.id) === String(pid));
          if (idx >= 0) {
            setActiveProject(idx);
            setActiveImage(0);
            setTimeout(() => {
              document.getElementById(`card-${data[idx].id}`)?.scrollIntoView({ block: 'center' });
            }, 600);
          }
        }
      })
      .catch((err) => console.error('Ошибка загрузки проектов:', err));
  }, []);

  const openProject = (projectIdx, pushState = true) => {
    setActiveProject(projectIdx);
    setActiveImage(0);
    if (pushState && projects[projectIdx]) {
      const url = new URL(window.location.href);
      url.searchParams.set('p', String(projects[projectIdx].id));
      window.history.replaceState(null, '', url.toString());
    }
  };
  const closePopup = () => {
    setActiveProject(null);
    setActiveImage(0);
    const url = new URL(window.location.href);
    url.searchParams.delete('p');
    window.history.replaceState(null, '', url.toString());
  };
  const copyPopupLink = async () => {
    if (activeProject === null || !projects[activeProject]) return;
    const url = new URL(window.location.href);
    url.searchParams.set('p', String(projects[activeProject].id));
    const link = url.toString();
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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

  // автоплей: играет то, что видно (хоть частично); попап открыт — главная стоит
  useEffect(() => {
    const vids = Array.from(document.querySelectorAll('video.gallery-video'));
    if (activeProject !== null) {
      vids.forEach((v) => v.pause());
      document.querySelectorAll('video.popup-video').forEach((v) => v.play().catch(() => {}));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target;
          if (e.intersectionRatio > 0) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: [0, 0.05] }
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [projects, activeProject]);

  // соотношение сторон карточки = первому видео внутри
  useEffect(() => {
    const vids = Array.from(document.querySelectorAll('video.gallery-video'));
    const onMeta = (e) => {
      const v = e.target;
      const card = v.closest('[data-card]');
      if (card && v.videoWidth && v.videoHeight) {
        card.style.aspectRatio = `${v.videoWidth} / ${v.videoHeight}`;
      }
    };
    vids.forEach((v) => v.addEventListener('loadedmetadata', onMeta));
    return () => vids.forEach((v) => v.removeEventListener('loadedmetadata', onMeta));
  }, [projects]);

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
        <h1 className="text-2xl font-bold">portfolio</h1>
        <button
          style={{
            background: '#22c55e',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: 8,
            padding: '8px 28px',
            fontSize: 18,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(34,197,94,0.10)'
          }}
        >
          resume
        </button>
      </div>
      {projects.length === 0 ? (
        <p className="col-span-3 text-center">loading...</p>
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
                  id={`card-${project.id}`}
                  data-card
                  onClick={() => openProject(idx)}
                  className={isFullWidth ? 'full-width-image' : ''}
                >
                  <Media
                    src={src}
                    alt={project.description || 'project'}
                    className="gallery-video"
                    style={{
                      width: '100%',
                      display: 'block',
                      borderRadius: 8,
                      objectFit: isGif(src) || isWebp(src) || isWebm(src) ? 'contain' : 'cover'
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
            <div className="touch-placeholder" aria-hidden="true"></div>
            <button
              className="close-button"
              onClick={closePopup}
              aria-label="Закрыть"
            >
              ×
            </button>
            <button
              className="copy-link-button"
              onClick={copyPopupLink}
              aria-label="Скопировать ссылку"
              title={copied ? 'Скопировано!' : 'Скопировать ссылку'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </button>
            <h2 className="font-bold text-2xl mb-4">
              {projects[activeProject].title}
            </h2>
            <p className="mb-4">{projects[activeProject].description}</p>
            <Media
              src={getValidImages(activeProject)[0]}
              alt={projects[activeProject].title || 'Изображение'}
              className="mb-4 popup-video"
              {...swipeHandlers}
              draggable={false}
              style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
            />
            <div className="additional-images">
              {getValidImages(activeProject).slice(1).map((src, idx) => (
                <Media
                  key={idx}
                  src={src}
                  alt={`Дополнительное изображение ${idx + 1}`}
                  className="mb-4 popup-video"
                  {...swipeHandlers}
                  draggable={false}
                  style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
                />
              ))}
              {Array.isArray(projects[activeProject].panoramaThirds) && projects[activeProject].panoramaThirds.map((src, idx) => (
                <Media
                  key={`third-${idx}`}
                  src={src}
                  alt={`Фрагмент ${idx + 1}`}
                  className="mb-4 popup-video"
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
