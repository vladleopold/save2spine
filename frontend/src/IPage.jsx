import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { useSwipeable } from 'react-swipeable';

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

function isGif(src) {
  return typeof src === 'string' && src.trim() !== '' && src.split('.').pop().toLowerCase() === 'gif';
}
function isWebp(src) {
  return typeof src === 'string' && src.trim() !== '' && src.split('.').pop().toLowerCase() === 'webp';
}

// Ротация внутри карточки: вертикальная прокрутка по кругу строго вниз 1>2>3>1,
// переезд после окончания каждого видео, плавно (0.6s ease-in-out).
// Играет ТОЛЬКО текущее видео и ТОЛЬКО если карточка видна (хоть частично).
function CardRotator({ images, alt, paused }) {
  const [idx, setIdx] = useState(0);
  const [ratio, setRatio] = useState(null);
  const wrapRef = React.useRef(null);
  const count = images.length;
  useEffect(() => { setIdx(0); }, [images.join('|')]);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const vids = Array.from(wrap.querySelectorAll('video'));
    const sync = (visible) => {
      vids.forEach((v, i) => {
        if (paused || !visible || i !== idx) v.pause();
        else v.play().catch(() => {});
      });
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => sync(e.intersectionRatio > 0)),
      { threshold: [0, 0.05] }
    );
    io.observe(wrap);
    sync(true);
    return () => io.disconnect();
  }, [paused, idx, count]);
  const onFirstMeta = (e) => {
    const v = e.target;
    if (v.videoWidth && v.videoHeight) setRatio(`${v.videoWidth} / ${v.videoHeight}`);
  };
  const mediaStyle = (i) => ({
    width: '100%',
    display: 'block',
    borderRadius: 8,
    objectFit: 'contain',
    ...(count > 1 ? { height: '100%', flex: 'none' } : {}),
  });
  const wrapStyle =
    count > 1
      ? { overflow: 'hidden', borderRadius: 8, width: '100%', ...(ratio ? { aspectRatio: ratio } : { aspectRatio: '1 / 1' }) }
      : undefined;
  const firstMetaProps = { onLoadedMetadata: onFirstMeta };
  if (count === 1) {
    return (
      <div ref={wrapRef}>
        <Media src={images[0]} alt={alt} className="gallery-video" style={mediaStyle(0)} {...firstMetaProps} />
      </div>
    );
  }
  return (
    <div ref={wrapRef} style={wrapStyle}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transform: `translateY(-${idx * 100}%)`,
          transition: 'transform 0.6s ease-in-out',
        }}
      >
        {images.map((src, i) => (
          <Media
            key={i}
            src={src}
            alt={`${alt} ${i + 1}`}
            className="gallery-video"
            style={mediaStyle(i)}
            loop={false}
            autoPlay={false}
            onEnded={i === idx ? () => setIdx((p) => (p + 1) % count) : undefined}
            {...(i === 0 ? firstMetaProps : {})}
          />
        ))}
      </div>
    </div>
  );
}
function isWebm(src) {
  return typeof src === 'string' && src.trim() !== '' && src.split('?')[0].split('.').pop().toLowerCase() === 'webm';
}

// webm — только видео-тегом (img видео не показывает), остальное — img
function Media({ src, alt, className, style, loop = true, autoPlay = true, ...rest }) {
  if (isWebm(src)) {
    return (
      <video
        src={src}
        className={className}
        style={style}
        autoPlay={autoPlay}
        muted
        loop={loop}
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

  // автоплей главной handled внутри CardRotator (видно — играет, попап открыт — стоит)

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
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          aria-label="Переключить тему"
          title="Тёмная / светлая тема"
          style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <a
          href="/cv"
          style={{
            background: '#22c55e',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: 8,
            padding: '8px 28px',
            fontSize: 18,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(34,197,94,0.10)',
            textDecoration: 'none'
          }}
        >
          resume
        </a>
        </div>
      </div>
      {projects.length === 0 ? (
        <p className="col-span-3 text-center">loading...</p>
      ) : (
        <Masonry
          breakpointCols={{ default: 5, 1500: 4, 1100: 3, 900: 2, 600: 1 }}
          className="gallery-masonry"
          columnClassName="gallery-column"
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
                  <CardRotator images={validImages} alt={project.description || 'project'} paused={activeProject !== null} />
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
