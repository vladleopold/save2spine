import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

import { getAspect } from './lib/mediaDims.js';
import { pickCardType } from './lib/cardTypes.js';
import Masonry from './lib/Masonry.jsx';
import SiteHeader from './SiteHeader.jsx';
import BackgroundMusic from './lib/BackgroundMusic.jsx';
import CardRotator from './lib/CardRotator.jsx';
import PopupMedia from './lib/PopupMedia.jsx';
import { setGroupEnabled } from './lib/autoPlay.js';

const API_URL = import.meta.env.VITE_API_URL || '';

// Реалистичные частицы: мерцание, переменный ветер, звёздная пыль сверху/сбоку,
// свайп сдувает с физикой (разлетаются и улетают, новые появляются сбоку)
function ParticlesBackground() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId;

    // предрендер светящихся спрайтов (дешево для производительности)
    const COLORS = ['#22c55e', '#fde047', '#ef4444', '#ffffff'];
    const sprites = COLORS.map((color) => {
      const s = document.createElement('canvas');
      s.width = s.height = 32;
      const c = s.getContext('2d');
      const g = c.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.25, color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g;
      c.fillRect(0, 0, 32, 32);
      return s;
    });

    const COUNT = 70;
    const spawn = (fromEdge) => {
      const side = fromEdge ?? Math.floor(Math.random() * 4);
      const p = {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.15 + Math.random() * 0.45, // пыль сыплется вниз как снег
        r: 1.5 + Math.random() * 3.5,
        sprite: sprites[Math.floor(Math.random() * sprites.length)],
        life: 0.6 + Math.random() * 0.4,
        decay: 0.0006 + Math.random() * 0.0012,
        tw: Math.random() * Math.PI * 2,
        twSpeed: 0.02 + Math.random() * 0.05,
        gustX: 0,
        gustY: 0,
      };
      if (side === 0) { p.y = -10; p.x = Math.random() * width; } // сверху
      else if (side === 1) { p.x = -10; p.vx = Math.abs(p.vx) + 0.2; } // слева
      else if (side === 2) { p.x = width + 10; p.vx = -Math.abs(p.vx) - 0.2; } // справа
      return p;
    };
    let particles = Array.from({ length: COUNT }).map(() => spawn());

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    resize();
    window.addEventListener('resize', resize);

    // свайп: порыв ветра в сторону жеста + новые частицы сбоку
    let touchX = null, touchY = null;
    const onTouchStart = (e) => {
      const t = e.touches[0];
      touchX = t.clientX; touchY = t.clientY;
    };
    const onTouchEnd = (e) => {
      if (touchX == null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchX, dy = t.clientY - touchY;
      const dist = Math.hypot(dx, dy);
      if (dist > 24) {
        const nx = dx / dist, ny = dy / dist;
        const force = Math.min(6, 2 + dist / 60);
        particles.forEach((p) => { p.gustX += nx * force; p.gustY += ny * force; });
        // новые частицы с противоположной стороны
        for (let i = 0; i < 8; i++) {
          const p = spawn(nx > 0 ? 2 : 1);
          p.gustX = nx * force * 0.7; p.gustY = ny * force * 0.7;
          particles.push(p);
        }
        if (particles.length > 140) particles = particles.slice(-140);
      }
      touchX = touchY = null;
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    let time = 0;
    function animate() {
      time += 0.016;
      // переменный ветер
      const wind = Math.sin(time * 0.4) * 0.25 + Math.sin(time * 1.1) * 0.08;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        // порыв затухает, частица продолжает лететь сама
        p.gustX *= 0.985; p.gustY *= 0.985;
        p.x += p.vx + wind + p.gustX;
        p.y += p.vy + p.gustY * 0.6;
        p.tw += p.twSpeed;
        p.life -= p.decay;
        // мерцание + выгорание в 0
        const blink = 0.45 + 0.55 * Math.abs(Math.sin(p.tw));
        const alpha = Math.max(0, Math.min(1, p.life)) * blink;
        if (p.life <= 0 || p.x < -20 || p.x > width + 20 || p.y > height + 20) {
          particles[i] = spawn();
          continue;
        }
        const size = p.r * (0.6 + 0.4 * Math.abs(Math.sin(p.tw * 0.7)));
        ctx.globalAlpha = alpha * 0.9;
        ctx.drawImage(p.sprite, p.x - size, p.y - size, size * 2, size * 2);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      animationId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      cancelAnimationFrame(animationId);
    };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 1001, pointerEvents: 'none' }} />;
}


export default function IPage() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState(() =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

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

  // Автоплей целиком в lib/autoPlay.js. Пока попап открыт, группа gallery
  // выключается и вся галерея на фоне замолкает; в группе popup играет всё
  // видимое. Решение принимается здесь, в одном месте, а не в каждой из
  // 104 карточек: иначе они перекрывают друг друга.
  useEffect(() => { setGroupEnabled('gallery', activeProject === null); }, [activeProject]);

  // соотношение сторон карточки = первому видео внутри
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
      <BackgroundMusic />
      <SiteHeader />
      {projects.length === 0 ? (
        <p className="col-span-3 text-center">loading...</p>
      ) : (
                <Masonry
          items={projects
            .map((project, idx) => ({
              key: project.id,
              project,
              idx,
              validImages: (project.images || []).filter(src => typeof src === 'string' && src.trim() !== ''),
            }))
            .filter(({ validImages }) => validImages.length > 0)
            .map(({ project, idx, validImages }) => {
              const aspect = getAspect(validImages[0], 1);
              return {
                key: project.id,
                idx,
                project,
                validImages,
                aspect,
                // один из пяти размеров — ближайший к реальным пропорциям
                type: pickCardType(aspect),
                isFullWidth: !!project.isFullWidth,
              };
            })}
          renderItem={(item) => (
            <div
              id={`card-${item.project.id}`}
              data-card
              data-card-type={item.type.id}
              onClick={() => openProject(item.idx)}
              className={`gallery-card gallery-card--${item.type.id}${item.isFullWidth ? ' full-width-image' : ''}`}
              style={{ '--card-aspect': String(item.type.aspect) }}
            >
              <CardRotator images={item.validImages} alt={item.project.description || 'project'} paused={activeProject !== null} />
            </div>
          )}
          gap={12}
          ariaLabel="Галерея работ"
        />
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
            <PopupMedia
              src={getValidImages(activeProject)[0]}
              alt={projects[activeProject].title || 'Изображение'}
              className="mb-4 popup-video"
              {...swipeHandlers}
              draggable={false}
              style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
            />
            <div className="additional-images">
              {getValidImages(activeProject).slice(1).map((src, idx) => (
                <PopupMedia
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
                <PopupMedia
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
