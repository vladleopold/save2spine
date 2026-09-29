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

  // Флаг, чтобы play() не вызывался повторно на уже играющем видео:
  // дёргание play() сбрасывает currentTime и ролик начинается заново.
  const playing = useRef(new Set());

  const playAt = (i) => {
    const v = videoRefs.current[i];
    if (!v || playing.current.has(i)) return;
    playing.current.add(i);
    try {
      v.muted = true;
      v.currentTime = 0;
      const pr = v.play();
      if (pr && pr.catch) pr.catch(() => { playing.current.delete(i); });
    } catch { playing.current.delete(i); }
  };

  const stopAt = (i) => {
    const v = videoRefs.current[i];
    playing.current.delete(i);
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
    // Один IntersectionObserver на карточку, но порог один — без
    // threshold 0 и 0.5, иначе при прокрутке он срабатывает десятки раз
    // за кадр и гоняет play/pause по всем видео подряд.
    const io = new IntersectionObserver(
      (entries) => {
        const ev = entries[entries.length - 1];
        const cur = videoRefs.current[idx];
        if (ev && ev.intersectionRatio >= 0.1) {
          // Запускаем только если реально остановлено: иначе при каждом
          // срабатывании observer дёргается play() и ролик начинается заново.
          if (cur && cur.paused) playAt(idx);
        } else if (cur && !cur.paused) {
          // Глушим только текущий кадр, а не все видео подряд.
          stopAt(idx);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(wrap);
    // Стартуем сами, если карточка уже в зоне видимости при монтировании.
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
