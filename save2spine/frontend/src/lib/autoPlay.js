/**
 * ЕДИНЫЙ МЕНЕДЖЕР АВТОПЛЕЯ ДЛЯ ВСЕХ ВИДЕО САЙТА.
 *
 * Правило одно: ролик играет, если он в кадре, и стоит, если его в кадре нет.
 * Лимита на количество одновременно играющих роликов нет намеренно — раньше он
 * стоял, и из-за него видимые видео замирали. Раньше вытеснялся «самый дальний
 * от центра экрана», а не самый невидимый, поэтому под нож попадали видео,
 * которые пользователь видел полностью.
 *
 * Технически:
 *   • один IntersectionObserver на страницу вместо наблюдателя на каждую карточку;
 *   • решение принимается по пересечению с областью просмотра, а не по центру;
 *   • запас по вертикали: ролик начинает качаться до того, как полностью влезет,
 *     поэтому к моменту показа он уже готов и не замирает на старте;
 *   • группы: попап открыт — галерея на фоне замолкает, видео внутри попапа
 *     продолжают играть;
 *   • autoplay до первого действия пользователя может быть отклонён — неудачные
 *     попытки запоминаются и повторяются после первого взаимодействия.
 */

// Насколько заранее начинать качать ролик сверху и снизу от краёв экрана.
const ROOT_MARGIN = '30% 0px 30% 0px';
// Хотя бы такая доля ролика в кадре считается «видно».
const VISIBLE = 0.01;
// Порог для зоны предзагрузки: как только карточка близко к экрану,
// качаем все её ролики, иначе очередь упирается в неготовый файл.
const NEAR = '60% 0px 60% 0px';

const GESTURES = ['pointerdown', 'touchstart', 'keydown', 'wheel', 'click', 'scroll'];

const items = new Map();      // video -> { group, onShow, onHide }
const groups = new Map();     // group  -> { enabled, videos:Set<video> }
let videoObserver = null;
let zoneObserver = null;
let gestureWatched = false;
let gestureSeen = false;

function groupOf(name) {
  let g = groups.get(name);
  if (!g) { g = { enabled: true, videos: new Set() }; groups.set(name, g); }
  return g;
}

// Ролик в кадре. Запускать его или нет — решает владелец (onShow):
// в карточке-карусели играет только активный кадр, остальные лежат в ленте.
function show(el) {
  const rec = items.get(el);
  if (!rec) return;
  // Группа выключена — например, галерея под открытым попапом.
  if (!groupOf(rec.group).enabled) return;
  if (rec.onShow) {
    if (rec.onShow(el) === false) return;
  } else {
    play(el);
  }
}

function hide(el) {
  const rec = items.get(el);
  if (rec && rec.onHide) rec.onHide(el);
  stop(el);
}

function ensureVideoObserver() {
  if (videoObserver || typeof IntersectionObserver === 'undefined') return videoObserver;
  // Без запаса: «в кадре» = действительно пересекает окно. Запас (NEAR) нужен
  // только чтобы качать заранее, а играть вне экрана нельзя.
  videoObserver = new IntersectionObserver(
    (list) => {
      for (const entry of list) {
        const el = entry.target;
        if (!items.has(el)) continue;
        if (entry.isIntersecting && entry.intersectionRatio >= VISIBLE) show(el);
        else hide(el);
      }
    },
    { threshold: [0, VISIBLE, 0.25, 0.5, 0.75, 1] }
  );
  return videoObserver;
}

// Зона «близко к экрану»: нужна, чтобы начать качать ролик заранее.
// Проигрывает ли ролик — решает отдельный наблюдатель (см. ensureVideoObserver),
// который смотрит на настоящее пересечение с экраном, без запаса.
function ensureZoneObserver() {
  if (zoneObserver || typeof IntersectionObserver === 'undefined') return zoneObserver;
  zoneObserver = new IntersectionObserver(
    (list) => {
      for (const entry of list) {
        const cb = entry.target.__autoplayZone;
        if (cb) cb(entry.isIntersecting);
      }
    },
    { rootMargin: NEAR, threshold: 0 }
  );
  return zoneObserver;
}

/** Запуск ролика. Muted всегда: иначе браузер требует жест пользователя. */
export function play(el) {
  if (!el) return;
  try { el.muted = true; } catch {}
  if (el.dataset.src && !el.getAttribute('src')) {
    el.setAttribute('src', el.dataset.src);
  }
  if (el.preload === 'none') {
    el.preload = 'auto';
    try { el.load(); } catch {}
  }
  if (el.paused === false) return;
  const p = el.play();
  if (p && typeof p.then === 'function') {
    p.then(() => { el.dataset.blocked = ''; })
     .catch(() => { el.dataset.blocked = '1'; });
  }
}

/**
 * Полная остановка: пауза, возврат на начало и отпуск буфера.
 *
 * Отпуск важен: роликов на странице 133, а весят они 110 МБ. Если оставить
 * загруженными все, что однажды попало в кадр, браузер держит в памяти
 * десятки мегабайт. Сброс src на прежнее значение и preload=none просят
 * браузер отпустить буфер; при возврате в кадр файл качается заново.
 */
export function stop(el) {
  if (!el) return;
  if (el.paused === false) { try { el.pause(); } catch {} }
  const url = el.dataset.src || el.getAttribute('src');
  try { el.currentTime = 0; } catch {}
  if (!url) return;
  if (el.dataset.src) return;              // уже отпущен — повторно не трогаем
  el.dataset.src = url;
  el.removeAttribute('src');
  el.preload = 'none';
  try { el.load(); } catch {}
}

function onFirstGesture() {
  gestureSeen = true;
  GESTURES.forEach((e) => window.removeEventListener(e, onFirstGesture));
  // Браузер мог отклонить автозапуск — пробуем ещё раз.
  items.forEach((_, el) => { if (el.dataset.blocked === '1') play(el); });
}

function watchGestures() {
  if (gestureWatched || typeof window === 'undefined') return;
  gestureWatched = true;
  GESTURES.forEach((e) => window.addEventListener(e, onFirstGesture, { passive: true, once: true }));
}

/**
 * Регистрирует ролик под общий наблюдатель.
 * onShow/onHide вызываются менеджером — компонент решает, что делать со своей
 * ротацией (например, запустить следующий кадр).
 */
export function registerVideo(el, { group = 'default', onShow, onHide } = {}) {
  if (!el) return () => {};
  items.set(el, { group, onShow, onHide });
  groupOf(group).videos.add(el);
  ensureVideoObserver()?.observe(el);
  watchGestures();

  // Первый расчёт IntersectionObserver асинхронный, а видео могло уже быть
  // в кадре к моменту монтирования — проверяем геометрию сразу.
  const r = el.getBoundingClientRect();
  if (r.bottom > 0 && r.top < window.innerHeight) show(el);

  return () => {
    items.delete(el);
    const g = groups.get(group);
    if (g) g.videos.delete(el);
    try { videoObserver?.unobserve(el); } catch {}
    stop(el);
  };
}

/**
 * Подписка на «зона близко к экрану». Используется, чтобы заранее качать все
 * ролики карточки: очередь не должна упираться в ещё не загруженный файл.
 */
export function observeZone(el, cb) {
  if (!el) return () => {};
  el.__autoplayZone = cb;
  ensureZoneObserver()?.observe(el);
  const r = el.getBoundingClientRect();
  if (r.bottom > 0 && r.top < window.innerHeight) cb(true);
  return () => {
    if (el.__autoplayZone === cb) delete el.__autoplayZone;
    try { zoneObserver?.unobserve(el); } catch {}
  };
}

/** Готовит все ролики элемента к показу: preload + обнуление, без запуска. */
export function warmUp(root) {
  if (!root || typeof root.querySelectorAll !== 'function') return;
  root.querySelectorAll('video').forEach((v) => {
    if (v.preload === 'none') {
      v.preload = 'auto';
      try { v.load(); } catch {}
    }
  });
}

/** Включена ли группа — карточка спрашивает это, прежде чем запустить кадр. */
export function groupEnabled(name) {
  return groupOf(name).enabled;
}

/** Ставит/снимает группу целиком:false — удобно для галереи под попапом. */
export function setGroupEnabled(name, enabled) {
  const g = groupOf(name);
  if (g.enabled === enabled) return;
  g.enabled = enabled;
  g.videos.forEach((el) => {
    if (!enabled) { stop(el); return; }
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) show(el);
  });
}

/** Видео этой группы (для отладки и проверок). */
export function groupVideos(name) {
  return groupOf(name).videos;
}
