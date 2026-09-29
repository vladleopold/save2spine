import React, { useCallback, useEffect, useRef, useState } from 'react';

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

// Сколько роликов играют одновременно. Больше — картинка рвётся и
// процессор загружен на 100%, особенно на ноутбуках.
export const MAX_PLAYING = 7;

const playing = new Set();

// Резервирует слот под ролик ротации: он уже играет, play() звать нельзя.
function reserve(v) {
  if (playing.has(v)) return;
  playing.add(v);
  enforce();
}

// Регистрирует видео, запущенное по видимости. Ролик к этому моменту
// уже играет, поэтому play() не зовём — только занимаем слот.
function register(v) {
  reserve(v);
}

// Вытесняет ролики, пока не уложимся в лимит. Берём самого старого по
// времени старта: Set хранит порядок вставки, он стабилен, в отличие от
// getBoundingClientRect — при быстром скролле у всех карточек прямоугольник
// около нуля, и выбор «самого дальнего от центра» выдавал случайного.
function enforce() {
  while (playing.size > MAX_PLAYING) {
    const oldest = playing.values().next().value;
    if (!oldest) break;
    playing.delete(oldest);
    // Помечаем вытесненным: иначе опрос в карточке снова включит это
    // видео, оно вытеснит кого-то ещё, и по кругу пойдут play/pause.
    oldest.dataset.capped = "1";
    try { oldest.pause(); } catch {}
  }
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
  // within — старт из ротации. Ролик внутри карточки обязан доиграть, иначе
  // цепочка 1→2→3 обрывается, но слот он тоже занимает: иначе реестр из
  // видимых + ролики ротации дают до 15 роликов сразу.
  const playAt = useCallback((i, within = false) => {
    const v = videoRefs.current[i];
    if (!v) return;
    if (!v.paused) return;          // уже играет — не дёргаем заново
    if (!within && v.dataset.capped === "1") return;
    try {
      v.muted = true;
      const pr = v.play();
      // Ротация карточки слот тоже занимает, но минует проверку capped:
      // её ролик обязан доиграть, иначе цепочка 1→2→3 обрывается.
      if (within) { reserve(v); return; }
      if (pr && pr.then) pr.then(() => register(v)).catch(() => {});
      else register(v);
    } catch {}
  }, []);

  const stopAt = useCallback((i) => {
    const v = videoRefs.current[i];
    if (!v) return;
    playing.delete(v);
    // Карточка ушла из экрана: снимаем метку вытеснения, чтобы при
    // возвращении видео снова участвовало в лимите.
    delete v.dataset.capped;
    if (!v.paused) { try { v.pause(); } catch {} }
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
        if (ev.intersectionRatio >= 0.1) {
          const v = videoRefs.current[idx];
          // Ролик качается только когда карточка в кадре: preload=none
          // держит сеть закрытой до этого момента.
          if (v && v.preload === "none") {
            v.preload = "auto";
            try { v.load(); } catch {}
            // Качаем сразу все кадры карточки: без них очередь доходит
            // до неготового ролика и цепочка обрывается.
            for (let k = 1; k < count; k++) {
              const nx = videoRefs.current[k];
              if (nx && nx.preload === "none") {
                nx.preload = "auto";
                try { nx.load(); } catch {}
              }
            }
          }
          playAt(idx);
        } else {
          stopAt(idx);
        }
      },
      { threshold: 0 }
    );
    io.observe(el);

    // Страховка на случай пропущеного пересечения: раз в 300мс смотрим,
    // не в кадре ли карточка. Дёшево — только когда в зоне ничего не играет.
    const poll = setInterval(() => {
      const cur = videoRefs.current[idx];
      if (!cur) return;
      const r = el.getBoundingClientRect();
      const inView = r.bottom > 0 && r.top < window.innerHeight;
      if (inView) {
        if (cur.preload === "none") {
          cur.preload = "auto";
          try { cur.load(); } catch {}
        }
        if (cur.paused) playAt(idx);
      } else if (!cur.paused) {
        stopAt(idx);
      }
    }, 300);

    return () => { clearInterval(poll); io.disconnect(); };
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
        playAt(next, true);   // внутри карточки: без лимита
      }, SLIDE_MS * START_AT));
      return;
    }

    // доехали до клона: возвращаемся наверх без анимации
    setAnim(false);
    setIdx(0);
    timers.current.push(setTimeout(() => {
      if (seq.current !== my) return;
      stopAt(count);
      playAt(0, true);      // внутри карточки: без лимита
    }, 60));
  };

  const mediaStyle = (i) => (count > 1 ? { height: '100%', flex: 'none' } : {});
  const wrapStyle = count > 1
    ? { overflow: 'hidden', borderRadius: 8, width: '100%', height: '100%' }
    : undefined;

  if (count === 1) {
    // mediaRef обязателен: без него videoRefs.current[0] пуст, playAt()
    // выходит сразу и одиночные видео (88 карточек из 104) не играют.
    return (
      <div ref={wrapRef}>
        <Media
          src={images[0]}
          alt={alt}
          className="gallery-video"
          style={mediaStyle(0)}
          preload="none"
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
