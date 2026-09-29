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

const SLIDE_MS = 650;   // длительность переезда кадра
const START_DELAY = 16; // кадр между сменой transform и стартом видео

/**
 * Ротация нескольких анимаций по кругу, снизу вверх.
 *
 * Ключевое требование: анимация не должна проигрываться, пока её кадр
 * ещё едет. Поэтому порядок такой:
 *   1. сдвинули ленту (transform) — кадр уезжает снизу вверх;
 *   2. ждём окончания переезда;
 *   3. только теперь включаем видео текущего кадра, а предыдущее
 *      останавливаем — оно уже уехало наверх;
 *   4. ждём, пока новое видео доиграет, и только тогда переходим дальше.
 *
 * Без этого видео успевало стартовать в начале переезда, и при быстром
 * переходе анимации терялись: кадр успевал проиграться, пока был ещё
 * внизу кадра, и его не было видно.
 */
export default function CardRotator({ images, alt, paused }) {
  const [idx, setIdx] = useState(0);
  const [anim, setAnim] = useState(true);
  const wrapRef = useRef(null);
  const videoRefs = useRef([]);
  const clearTimer = useRef(null);
  const seq = useRef(0);

  const count = images.length;
  // клон первого в конце: уезжаем вниз на клон, потом прыгаем наверх без анимации
  const slides = count > 1 ? [...images, images[0]] : images;

  useEffect(() => { setIdx(0); setAnim(true); }, [images.join('|')]);

  // пауза, когда карточка ушла из экрана или открыт попап
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const vids = () => videoRefs.current.filter(Boolean);
    const pauseAll = () => vids().forEach((v) => { if (!v.paused) v.pause(); });

    if (paused) { pauseAll(); return; }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.intersectionRatio >= 0.1);
        if (!visible) { pauseAll(); return; }
        // карточка появилась — доиграть текущий кадр с начала
        const v = videoRefs.current[idx];
        if (v && v.paused) {
          v.currentTime = 0;
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        }
      },
      { threshold: [0, 0.1, 0.5] }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [paused, idx, count]);

  useEffect(() => () => { if (clearTimer.current) clearTimeout(clearTimer.current); }, []);

  const onEnded = (i) => {
    if (i !== idx) return;          // событие от неактивного кадра
    if (count <= 1) return;
    const my = ++seq.current;       // защита от гонки при быстрых переходах
    if (idx < count) {
      setAnim(true);
      setIdx((n) => n + 1);
      return;
    }
    // доехали до клона: вернуться наверх без анимации
    if (clearTimer.current) clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => {
      if (seq.current !== my) return;
      setAnim(false);
      setIdx(0);
    }, SLIDE_MS + START_DELAY);
  };

  const mediaStyle = (i) => (count > 1 ? { height: '100%', flex: 'none' } : {});
  const wrapStyle = count > 1
    ? { overflow: 'hidden', borderRadius: 8, width: '100%', height: '100%' }
    : undefined;

  if (count === 1) {
    return (
      <div ref={wrapRef}>
        <Media src={images[0]} alt={alt} className="gallery-video" style={mediaStyle(0)} preload="none" />
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
        onTransitionEnd={(e) => {
          if (e.propertyName !== 'transform') return;
          if (!anim) return;                       // это был прыжок наверх
          // кадр доехал и остановился посередине — только теперь играем
          const prev = videoRefs.current[idx - 1];
          if (prev && !prev.paused) prev.pause();  // предыдущий ушёл наверх
          const cur = videoRefs.current[idx];
          if (cur) {
            cur.currentTime = 0;
            const p = cur.play();
            if (p && p.catch) p.catch(() => {});
          }
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
            preload={i === 0 ? 'metadata' : 'none'}
            onEnded={i === idx ? () => onEnded(i) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
