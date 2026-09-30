import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Настоящий masonry: колонки заполняются независимо, каждая карточка
// кладётся в самую короткую колонку. Поэтому полотно плотное, а строки
// не выравниваются по общей высоте, как в обычной сетке.
//
// Отступ не «схлопывается»: gap задаётся один раз здесь, и вся геометрия
// считается от него, поэтому он всегда одинаковый — и по вертикали между
// карточками, и по горизонтали между колонками.
const BREAKPOINTS = [
  { min: 2200, cols: 6 },
  { min: 1800, cols: 5 },
  { min: 1400, cols: 4 },
  { min: 1000, cols: 3 },
  { min: 640,  cols: 2 },
  { min: 0,    cols: 1 },
];

function colsForWidth(w) {
  for (const bp of BREAKPOINTS) if (w >= bp.min) return bp.cols;
  return 1;
}

export default function Masonry({
  items,
  renderItem,
  gap = 12,
  className = '',
  ariaLabel,
}) {
  const wrapRef = useRef(null);
  const [cols, setCols] = useState(() =>
    typeof window === 'undefined' ? 4 : colsForWidth(window.innerWidth)
  );
  const [width, setWidth] = useState(0);

  // Число колонок и ширина — от реального контейнера. Портретная ориентация
  // меняет число колонок, поэтому слушаем и resize, и смену ориентации.
  useLayoutEffect(() => {
    const update = () => {
      const el = wrapRef.current;
      if (!el) return;
      const w = el.clientWidth || window.innerWidth;
      setWidth(w);
      setCols(colsForWidth(w));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    const ro = typeof ResizeObserver !== 'undefined' && wrapRef.current
      ? new ResizeObserver(update)
      : null;
    if (ro) ro.observe(wrapRef.current);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      if (ro) ro.disconnect();
    };
  }, []);

  // Ширина колонки: (ширина контейнера - горизонтальные зазоры) / колонок.
  const colWidth = width > 0 ? (width - gap * (cols - 1)) / cols : 0;

  // Раскладка считается из пропорций карточки (aspect), а не из фактической
  // высоты DOM — она известна с первого рендера и не меняется, когда видео
  // отдаёт метаданные. Поэтому полотно не пересобирается и не «прыгает».
  const buckets = React.useMemo(() => {
    const out = Array.from({ length: cols }, () => ({ h: 0, items: [] }));
    if (colWidth <= 0) return out;
    for (const item of items) {
      let best = 0;
      for (let i = 1; i < out.length; i++) {
        if (out[i].h < out[best].h - 0.5) best = i; // при равенстве — левая
      }
      out[best].items.push(item);
      const span = item.aspect > 0 ? 1 / item.aspect : 1;
      out[best].h += span * colWidth + gap;
    }
    return out;
  }, [items, cols, gap, colWidth]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        columnGap: gap,
        alignItems: 'start',
      }}
      aria-label={ariaLabel}
    >
      {buckets.map((bucket, ci) => (
        <div
          key={ci}
          className="masonry-col"
          style={{ display: 'flex', flexDirection: 'column', gap, minWidth: 0 }}
        >
          {bucket.items.map((item) => (
            <div key={item.key} className="masonry-cell" style={{ minWidth: 0 }}>
              {renderItem(item, colWidth)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
