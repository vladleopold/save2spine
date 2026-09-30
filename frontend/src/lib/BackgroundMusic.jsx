import { useEffect, useRef } from 'react';

/**
 * Фоновая музыка на весь сайт.
 *
 * Браузеры блокируют автозапуск звука до действия пользователя, поэтому
 * пробуем сразу, а если не вышло — включаем при первом же касании
 * (клик, тап, скролл, клавиша). Кнопки на сайте нет: музыка фоновая.
 *
 * Громкость 0.3 — 30% от исходной записи.
 */
const VOLUME = 0.3;

export default function BackgroundMusic({ src = '/mesa_under_moonlight.mp3' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.volume = VOLUME;

    let started = false;
    const tryPlay = () => {
      if (started) return;
      started = true;
      const p = el.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    // сначала пробуем сразу — на части браузеров и профилей сработает
    const immediate = el.play();
    if (immediate && typeof immediate.then === 'function') {
      immediate.then(() => { started = true; }).catch(() => {});
    }

    // иначе ловим первое взаимодействие пользователя
    const events = ['pointerdown', 'touchstart', 'keydown', 'wheel', 'click'];
    const onInteract = () => {
      tryPlay();
      events.forEach((e) => window.removeEventListener(e, onInteract));
    };
    events.forEach((e) => window.addEventListener(e, onInteract, { passive: true, once: true }));

    return () => {
      events.forEach((e) => window.removeEventListener(e, onInteract));
      try { el.pause(); } catch {}
    };
  }, [src]);

  return <audio ref={ref} src={src} loop preload="auto" aria-hidden="true" />;
}
