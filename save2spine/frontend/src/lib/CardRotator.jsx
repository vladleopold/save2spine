import React, { useCallback, useEffect, useRef, useState } from 'react';
import { registerVideo, observeZone, warmUp, play, stop } from './autoPlay.js';

export function isWebm(src) {
  return typeof src === 'string' && src.trim() !== '' && src.split('?')[0].split('.').pop().toLowerCase() === 'webm';
}

export function Media({ src, alt, className, style, loop = false, autoPlay = false, preload = 'none', mediaRef, lazy = true, ...rest }) {
  if (isWebm(src)) {
    return (
      <video ref={mediaRef} src={src || undefined} className={className} style={style} autoPlay={autoPlay} muted
        loop={loop} playsInline preload={preload} {...rest} />
    );
  }
  return <img src={src} alt={alt} className={className} style={style} {...rest} />;
}

const SLIDE_MS = 620;   // длительность переезда кадра
const START_AT = 0.55;  // доля переезда, на которой кадр уже в центре

/**
 * Ротация нескольких роликов по кругу, снизу вверх.
 *
 * Анимация не пропускается и не стартует, пока её кадр ещё едет:
 *   1. текущий ролик доиграл — сдвигаем ленту вверх на следующий кадр;
 *   2. через START_AT от начала переезда кадр стоит по центру — запускаем
 *      его и в тот же момент глушим предыдущий, он уже ушёл наверх;
 *   3. ждём следующего onEnded.
 *
 * Таймер, а не onTransitionEnd: событие приходит с задержкой и теряется, если
 * переход прерван или значение не изменилось. Из-за этого часть кадров
 * оставалась непроигранной.
 *
 * Видимостью карточки целиком занимается общий менеджер autoPlay. Он же
 * решает, в кадре ли карточка: пока она в кадре — играет активный кадр ленты,
 * ушла за экран — все кадры стоят. Отдельного счётчика одновременно играющих
 * роликов нет: их и так ровно столько, сколько карточек в кадре.
 */
export default function CardRotator({ images, alt, paused, group = 'gallery' }) {
  const [idx, setIdx] = useState(0);
  const [anim, setAnim] = useState(true);
  const wrapRef = useRef(null);
  const videoRefs = useRef([]);
  const unregister = useRef([]);
  const timers = useRef([]);
  const seq = useRef(0);
  const activeRef = useRef(0);    // текущий кадр: таймеры и обработчики смотрят сюда

  const count = images.length;
  // клон первого в конце: уезжаем вниз на клон, потом прыгаем наверх
  const slides = count > 1 ? [...images, images[0]] : images;

  useEffect(() => {
    activeRef.current = 0;
    setIdx(0);
    setAnim(true);
  }, [images.join('|')]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // Зона «рядом с экраном» отвечает только за подготовку: как только карточка
  // приблизилась, качаем всю ленту, чтобы очередь не упёрлась в неготовый файл.
  // Запуск и остановку делает observeZoneVideo ниже — по настоящему пересечению
  // с окном, без запаса, поэтому вне экрана ролики не играют.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    return observeZone(el, (near) => {
      if (near) warmUp(el);
      else {
        clearTimers();
        videoRefs.current.forEach((v) => stop(v));
      }
    });
  }, [clearTimers, slides.length]);

  // Регистрация роликов. onShow от менеджера приходит только для тех кадров,
  // что пересекли границу кадра, поэтому он служит страховкой: если активный
  // кадр стал виден — запускаем его, остальные в покое.
  useEffect(() => {
    unregister.current = videoRefs.current.map((v, i) =>
      registerVideo(v, {
        group,
        onShow: (el) => { if (i === activeRef.current) { play(el); return true; } return false; },
        onHide: (el) => { if (i === activeRef.current) stop(el); },
      })
    );
    return () => {
      unregister.current.forEach((fn) => fn());
      unregister.current = [];
    };
  }, [group, slides.length]);

  // Сторож: если активный кадр висит на одном месте, а цепочка не идёт —
  // значит потерялось событие ended. Двигаем ленту сами, иначе карточка
  // замирает навсегда. Срабатывает только на действительно застрявшем кадре.
  useEffect(() => {
    if (count <= 1 || paused) return undefined;
    const tick = () => {
      const v = videoRefs.current[activeRef.current];
      if (!v || v.paused) return;          // не играет — значит всё в порядке
      if (v.ended || (v.duration && v.currentTime >= v.duration - 0.05)) onEnded(activeRef.current);
    };
    const id = setInterval(tick, 400);
    return () => clearInterval(id);
  });

  const onEnded = (i) => {
    if (i !== activeRef.current) return;   // событие от неактивного кадра
    if (count <= 1 || paused) return;
    const my = ++seq.current;             // защита от гонки

    clearTimers();

    if (i < count) {
      const next = i + 1;
      activeRef.current = next;
      setAnim(true);
      setIdx(next);
      // Кадр встаёт по центру на этой отметке переезда — стартуем его
      // и глушим предыдущий, который к этому моменту уже ушёл наверх.
      timers.current.push(setTimeout(() => {
        if (seq.current !== my) return;
        stop(videoRefs.current[i]);
        play(videoRefs.current[next]);
      }, SLIDE_MS * START_AT));
      return;
    }

    // доехали до клона: возвращаемся наверх без анимации
    setAnim(false);
    activeRef.current = 0;
    setIdx(0);
    timers.current.push(setTimeout(() => {
      if (seq.current !== my) return;
      stop(videoRefs.current[count]);
      play(videoRefs.current[0]);
    }, 60));
  };

  const mediaStyle = (i) => (count > 1 ? { height: '100%', flex: 'none' } : {});
  const wrapStyle = count > 1
    ? { overflow: 'hidden', borderRadius: 8, width: '100%', height: '100%' }
    : undefined;

  if (count === 1) {
    // Одиночный ролик зациклен: ленты из одного кадра нет, а без loop видео
    // доиграет и навсегда замрёт на последнем кадре.
    return (
      <div ref={wrapRef}>
        <Media
          src={images[0]}
          alt={alt}
          className="gallery-video"
          style={mediaStyle(0)}
          preload="none"
          loop
          mediaRef={(el) => { videoRefs.current[0] = el; }}
        />
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
            preload="none"
            onEnded={i === idx ? () => onEnded(i) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
