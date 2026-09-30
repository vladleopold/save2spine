import { useEffect, useRef, useState } from 'react';

/**
 * Мелодия под 5 одновременно играющих мультфильмов.
 *
 * Не берём готовый файл: генерируем аудио в браузере через Web Audio API.
 * Так нет лишней загрузки, и звук подстраивается под тему.
 *
 * Идея: 5 голосов = 5 мультфильмов. Каждый мультфильм на экране — это
 * одна нота в общей теме. Несколько голосов звучат одновременно, как
 * и работают карточки, но в разных октавах, чтобы не сливаться в кашу.
 * Базовая линия держит ровный пульс, поверх — мелодическая линия из
 * весёлого пентатонического набора (звучит бодро, не раздражает).
 */

const PENTATONIC = [0, 2, 4, 7, 9]; // до-мажорная пентатоника
const ROOT = 261.63; // C4

/** Достаём "настроение" из темы, чтобы музыка соответствовала картинке. */
function buildVoices(theme) {
  const major = theme === 'light';
  return [
    // 5 голосов — по одному на каждый мультфильм в кадре.
    // Интервалы подобраны так, чтобы пять сильных нот не сливались.
    { semis: major ? -12 : -5,  gain: 0.16, wave: 'triangle', pan: -0.6 },
    { semis: major ? 0 : 7,     gain: 0.14, wave: 'sine',     pan: -0.3 },
    { semis: 4,                 gain: 0.13, wave: 'triangle', pan: 0 },
    { semis: 9,                 gain: 0.12, wave: 'sine',     pan: 0.3 },
    { semis: major ? 12 : 16,   gain: 0.11, wave: 'triangle', pan: 0.6 },
  ];
}

export default function useMelody() {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const timerRef = useRef(null);
  const stepRef = useRef(0);

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (masterRef.current && ctxRef.current) {
      try {
        masterRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
        masterRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.12);
      } catch {}
    }
    setPlaying(false);
  };

  const start = () => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { setSupported(false); return; }
    if (playing) return;

    let ctx = ctxRef.current;
    if (!ctx) {
      ctx = new AC();
      ctxRef.current = ctx;
      const master = ctx.createGain();
      master.gain.value = 0;
      // мягкий лимитер, чтобы пять голосов не давали клиппинг
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 8;
      master.connect(comp);
      comp.connect(ctx.destination);
      masterRef.current = master;
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    const voices = buildVoices(
      document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
    );
    const master = masterRef.current;
    const now = ctx.currentTime;

    // Плавный вход, чтобы не было щелчка на старте
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.5, now + 0.9);

    const beat = 0.26; // ~115 BPM, бодрый, но не суетливый
    const barLen = 16; // шагов в такте

    const playStep = () => {
      const t = ctx.currentTime + 0.02;
      const s = stepRef.current % barLen;

      // Ритм: ровная пульсация баса, акценты на 1 и 3 доли
      const beatIndex = s % 4;
      if (beatIndex === 0 || beatIndex === 2) {
        voices.forEach((v, vi) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
          osc.type = v.wave;
          const semis = v.semis + (beatIndex === 0 ? 0 : beatIndex === 2 ? 5 : 0);
          osc.frequency.value = ROOT * Math.pow(2, semis / 12);
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(v.gain * (beatIndex === 0 ? 1 : 0.62), t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t + beat * 1.8);
          if (panner) { panner.pan.value = v.pan; osc.connect(g); g.connect(panner); panner.connect(master); }
          else { osc.connect(g); g.connect(master); }
          osc.start(t);
          osc.stop(t + beat * 2);
        });
      }

      // Мелодическая линия поверх: избранные шаги, пентатоника
      if (s % 2 === 0 || s === 3 || s === 11) {
        const deg = PENTATONIC[(s + (s % 3)) % PENTATONIC.length];
        const oct = 12;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = ROOT * Math.pow(2, (oct + deg) / 12);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.10, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + beat * 1.4);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + beat * 1.6);
      }

      stepRef.current += 1;
    };

    playStep();
    timerRef.current = setInterval(playStep, beat * 1000);
    setPlaying(true);
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (ctxRef.current) { try { ctxRef.current.close(); } catch {} }
  }, []);

  return { playing, supported, toggle: () => (playing ? stop() : start()), start, stop };
}
