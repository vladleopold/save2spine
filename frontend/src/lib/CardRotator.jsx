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
 * Требование: кадр не пропускается, не стартует, пока едет, и
 * останавливается только когда ушёл наверх. Порядок:
 *   1. предыдущее видео доиграло — сдвигаем ленту на кадр выше;
 *   2. ждём конца переезда (transitionEnd) — ровно тогда кадр встал
 *      в середину и остановился;
 *   3. только теперь стартуем новое видео, и в тот же момент глушим
 *      предыдущее: оно к этому моменту уже уехало наверх.
 *
 * Старт по середине переезда давал пропуски: короткий ролик успевал
 * доиграть, пока его кадр ещё был внизу. Ждём полной остановки.
 */
export default function CardRotator({ images, alt, paused }) {
  const [idx, setIdx] = useState(0);
  const [anim, setAnim] = useState(true);
  const wrapRef = useRef(null);
  const videoRefs = useRef([]);
  const timers = useRef([]);
  const seq = useRef(0);
  const pending = useRef(0);

  const count = images.length;
  // клон первого в конце: уезжаем вниз на клон, потом прыгаем наверх без анимации
  const slides = count > 1 ? [...images, images[0]] : images;

  useEffect(() => { setIdx(0); setAnim(true); pending.current = 0; }, [images.join('|')]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  // Против повторного play() на играющем видео: дёрганье сбрасывает
  // currentTime и ролик начинается заново. Отмечаем не индекс, а сам
  // элемент — иначе после окончания ролика индекс навсегда остаётся
  // в Set и видео больше никогда не запускается.
  const playing = useRef(new WeakSet());

  const playAt = (i) => {
    const v = videoRefs.current[i];
    if (!v || playing.current.has(v)) return;
    playing.current.add(v);
    try {
      v.muted = true;
      v.currentTime = 0;
      const pr = v.play();
      if (pr && pr.catch) pr.catch(() => { playing.current.delete(v); });
    } catch { playing.current.delete(v); }
  };

  const stopAt = (i) => {
    const v = videoRefs.current[i];
    if (!v) return;
    playing.current.delete(v);
    if (!v.paused) { try { v.pause(); } catch {} }
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
    pending.current = my;           // ждём завершения переезда этого шага

    if (idx < count) {
      setAnim(true);
      const next = idx + 1;
      setIdx(next);
      // Старт нового кадра — по завершении переезда. Страхуемся таймером:
      // onTransitionEnd иногда не приходит (переход без изменения значения,
      // прерывание анимации), и тогда кадр остался бы остановленным навсегда.
      // Ровно в этот момент кадр стоит по центру — запускаем его и глушим
      // предыдущий, который уже ушёл наверх.
      timers.current.push(setTimeout(() => onSlideDone(), SLIDE_MS + 30));
      return;
    }

    // доехали до клона: возвращаемся наверх без анимации
    setAnim(false);
    setIdx(0);
    // первый кадр уже на месте — запускаем после кадра
    timers.current.push(setTimeout(() => {
      if (seq.current !== my) return;
      stopAt(count);
      playAt(0);
    }, 40));
  };

  // Кадр доехал до середины и остановился — только теперь запускаем его,
  // и в тот же момент глушим предыдущий: тот уже ушёл наверх.
  const onSlideDone = () => {
    const my = pending.current;
    if (!my || seq.current !== my) return;
    pending.current = 0;
    const cur = videoRefs.current[idx];
    if (cur) {
      if (cur.paused) playAt(idx);
      if (idx > 0) stopAt(idx - 1);
    }
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
        onTransitionEnd={(e) => {
          if (e.propertyName !== 'transform') return;
          onSlideDone();
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
