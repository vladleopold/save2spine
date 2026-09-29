import React, { useCallback, useEffect, useRef, useState } from 'react';

export function isWebm(src) {
  return typeof src === 'string' && src.trim() !== '' && src.split('?')[0].split('.').pop().toLowerCase() === 'webm';
}

export function Media({ src, alt, className, style, loop = false, autoPlay = false, preload = 'none', mediaRef, ...rest }) {
  if (isWebm(src)) {
    // mediaRef вместо ref: ref на <img> дал бы DOM-узел, а не видео
    return (
      <video ref={mediaRef} src={src} className={className} style={style} autoPlay={autoPlay} muted
        loop={loop} playsInline preload={preload} {...rest} />
    );
  }
  return <img src={src} alt={alt} className={className} style={style} {...rest} />;
}

const SLIDE_MS = 620;   // длительность переезда кадра
const START_AT = 0.55;  // доля переезда, на которой кадр уже в центре

/**
 * Ротация нескольких анимаций по кругу, снизу вверх.
 *
 * Требование: анимация не пропускается и не стартует, пока её кадр ещё
 * едет. Порядок шага:
 *   1. текущий ролик доиграл — сдвигаем ленту вверх на следующий кадр;
 *   2. через START_AT от начала переезда кадр стоит по центру — запускаем
 *      его и в тот же момент глушим предыдущий, он уже ушёл наверх;
 *   3. ждём следующего onEnded.
 *
 * Почему таймер, а не onTransitionEnd: событие приходит с задержкой и
 * теряется, если переход прерван или значение не изменилось. Из-за этого
 * часть кадров оставалась непроигранной. Таймер не зависит от браузера.
 *
 * Запуск по видимости — общий IntersectionObserver на страницу, а не на
 * карточку: 104 наблюдателя подряд давали сотни play/pause за прокрутку.
 */
export default function CardRotator({ images, alt, paused }) {
  const [idx, setIdx] = useState(0);
  const [anim, setAnim] = useState(true);
  const wrapRef = useRef(null);
  const videoRefs = useRef([]);
  const timers = useRef([]);
  const seq = useRef(0);

  const count = images.length;
  // клон первого в конце: уезжаем вниз на клон, потом прыгаем наверх
  const slides = count > 1 ? [...images, images[0]] : images;

  useEffect(() => { setIdx(0); setAnim(true); }, [images.join('|')]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // Единственная точка запуска. Проверяем само состояние элемента, а не
  // отдельный флаг: флаг рассинхронизировался с реальностью, и видео
  // после первого цикла больше не запускалось.
  const playAt = useCallback((i) => {
    const v = videoRefs.current[i];
    if (!v) return;
    if (!v.paused) return;          // уже играет — не дёргаем заново
    try {
      v.muted = true;
      const pr = v.play();
      if (pr && pr.catch) pr.catch(() => {});
    } catch {}
  }, []);

  const stopAt = useCallback((i) => {
    const v = videoRefs.current[i];
    if (v && !v.paused) { try { v.pause(); } catch {} }
  }, []);

  // Запуск текущего кадра, когда карточка в зоне видимости.
  // Один observer на страницу, карточки просто подписываются.
  useEffect(() => {
    if (paused) return;
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const ev = entries[entries.length - 1];
        if (!ev) return;
        if (ev.intersectionRatio >= 0.1) playAt(idx);
        else stopAt(idx);
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [paused, idx, count, playAt, stopAt]);

  const onEnded = (i) => {
    if (i !== idx) return;          // событие от неактивного кадра
    if (count <= 1 || paused) return;
    const my = ++seq.current;       // защита от гонки

    clearTimers();

    if (idx < count) {
      const next = idx + 1;
      setAnim(true);
      setIdx(next);
      // Кадр встаёт по центру на этой отметке переезда — стартуем его
      // и глушим предыдущий, который к этому моменту уже ушёл наверх.
      timers.current.push(setTimeout(() => {
        if (seq.current !== my) return;
        stopAt(idx);
        playAt(next);
      }, SLIDE_MS * START_AT));
      return;
    }

    // доехали до клона: возвращаемся наверх без анимации
    setAnim(false);
    setIdx(0);
    timers.current.push(setTimeout(() => {
      if (seq.current !== my) return;
      stopAt(count);
      playAt(0);
    }, 60));
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
            preload={i === 0 ? 'auto' : 'metadata'}
            onEnded={i === idx ? () => onEnded(i) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
