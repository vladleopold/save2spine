import React, { useEffect, useRef, useState } from 'react';

export function isWebm(src) {
  return typeof src === 'string' && src.trim() !== '' && src.split('?')[0].split('.').pop().toLowerCase() === 'webm';
}

export function Media({ src, alt, className, style, loop = true, autoPlay = false, preload = 'none', mediaRef, ...rest }) {
  if (isWebm(src)) {
    // отдельный проп mediaRef: ref на <img> нельзя — это DOM-узел, а не видео
    return (
      <video ref={mediaRef} src={src} className={className} style={style} autoPlay={autoPlay} muted
        loop={loop} playsInline preload={preload} {...rest} />
    );
  }
  return <img src={src} alt={alt} className={className} style={style} {...rest} />;
}

const SLIDE_MS = 620;   // длительность переезда кадра

/**
 * Ротация нескольких анимаций по кругу, снизу вверх.
 *
 * Требование: анимация не пропускается и не начинается, пока её кадр
 * ещё едет. Порядок такой:
 *   1. предыдущее видео доиграло — сдвигаем ленту вверх на следующий кадр;
 *   2. НЕ ждём transitionEnd: событие приходит с задержкой и при быстрых
 *      коротких анимациях теряется, из-за чего кадр остаётся непроигранным.
 *      Вместо этого запускаем новое видео по таймеру ровно на момент, когда
 *      кадр встаёт в центр (SLIDE_MS / 2 — середина переезда);
 *   3. в этот же момент глушим предыдущее: оно уже ушло наверх.
 *
 * Почему так: анимация должна быть видна целиком. Если ждать конца
 * переезда, короткие ролики (1–2 с) успевают закончиться, пока кадр ещё
 * внизу, и визуально кажется, что анимация «пропущена».
 */
export default function CardRotator({ images, alt, paused }) {
  const [idx, setIdx] = useState(0);
  const [anim, setAnim] = useState(true);
  const wrapRef = useRef(null);
  const videoRefs = useRef([]);
  const timers = useRef([]);
  const seq = useRef(0);

  const count = images.length;
  // клон первого в конце: уезжаем вниз на клон, потом прыгаем наверх без анимации
  const slides = count > 1 ? [...images, images[0]] : images;

  useEffect(() => { setIdx(0); setAnim(true); }, [images.join('|')]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const playAt = (i) => {
    const v = videoRefs.current[i];
    if (!v) return;
    try {
      v.currentTime = 0;
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } catch {}
  };

  const stopAt = (i) => {
    const v = videoRefs.current[i];
    if (v && !v.paused) { try { v.pause(); } catch {} }
  };

  // Пауза, когда карточка ушла из экрана или открыт попап
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (paused) {
      clearTimers();
      videoRefs.current.forEach((v) => { if (v && !v.paused) { try { v.pause(); } catch {} } });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.intersectionRatio >= 0.1);
        if (visible) {
          const cur = videoRefs.current[idx];
          // НЕ проверяем readyState: на старте он 0, и условие отбрасывало
          // запуск навсегда — видео оставалось остановленным. play() сам
          // дождётся готовности и запустит ролик.
          if (cur && cur.paused) playAt(idx);
        } else {
          videoRefs.current.forEach((v) => { if (v && !v.paused) { try { v.pause(); } catch {} } });
        }
      },
      { threshold: [0, 0.1, 0.5] }
    );
    io.observe(wrap);
    // страховка: если observer не сработал (headless, нестандартный вьюпорт),
    // запускаем текущий кадр сами, как только он в зоне видимости
    const r = wrap.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) {
      const cur = videoRefs.current[idx];
      if (cur && cur.paused) playAt(idx);
    }
    return () => io.disconnect();
  }, [paused, idx, count]);

  const onEnded = (i) => {
    if (i !== idx) return;          // событие от неактивного кадра
    if (count <= 1) return;
    if (paused) return;
    const my = ++seq.current;       // защита от гонки при быстрых переходах

    clearTimers();

    if (idx < count) {
      setAnim(true);
      const next = idx + 1;
      setIdx(next);
      // запускаем следующий кадр в момент, когда он встаёт по центру
      timers.current.push(setTimeout(() => {
        if (seq.current !== my) return;
        stopAt(idx);      // предыдущий ушёл наверх — глушим
        playAt(next);
      }, SLIDE_MS / 2));
      return;
    }

    // доехали до клона: возвращаемся наверх без анимации и стартуем заново
    timers.current.push(setTimeout(() => {
      if (seq.current !== my) return;
      setAnim(false);
      setIdx(0);
      // следующий кадр уже на месте — сразу играем
      timers.current.push(setTimeout(() => {
        if (seq.current !== my) return;
        stopAt(count);
        playAt(0);
      }, 40));
    }, SLIDE_MS + 20));
  };

  const mediaStyle = (i) => (count > 1 ? { height: '100%', flex: 'none' } : {});
  const wrapStyle = count > 1
    ? { overflow: 'hidden', borderRadius: 8, width: '100%', height: '100%' }
    : undefined;

  if (count === 1) {
    return (
      <div ref={wrapRef}>
        <Media src={images[0]} alt={alt} className="gallery-video" style={mediaStyle(0)} preload="metadata" />
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
          transition: anim ? `transform ${SLIDE_MS}ms ease-in-out` : 'none',
        }}
      >
        {slides.map((src, i) => (
          <Media
            key={i}
            mediaRef={(el) => { videoRefs.current[i] = el; }}
            src={src}
            alt={`${alt} ${i + 1}`}
            className="gallery-video"
            style={mediaStyle(i)}
            loop={false}
            autoPlay={false}
            preload={i <= 1 ? 'metadata' : 'auto'}
            onEnded={i === idx ? () => onEnded(i) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
