import { useLayoutEffect, useRef, useState } from "react";
import { pdfName } from "./cvData.js";
import { CvDocument } from "./CvDocument.jsx";
import { AtsDocument } from "./AtsDocument.jsx";

/** A4 at 96dpi. */
const PAGE_W = 794;
const PAGE_H = 1123;

export function Studio() {
  const [lang, setLang] = useState("uk");
  const [resume, setResume] = useState(false); // false = ATS-документ, true = CV (кнопка RESUME->CV)
  const onPdf = (e) => {
    e.preventDefault();
    const a = document.createElement("a");
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [sheetH, setSheetH] = useState(PAGE_H);
  const wrapRef = useRef(null);
  const sheetRef = useRef(null);

  const view = resume ? "visual" : "ats";

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const sheet = sheetRef.current;
    if (!wrap || !sheet) return;

    const update = () => {
      const available = wrap.clientWidth;
      const s = Math.min(1, Math.max(0.08, (available - 2) / PAGE_W));
      const unscaledH = Math.max(sheet.scrollHeight, PAGE_H);
      const x = Math.max(0, (available - PAGE_W * s) / 2);
      setScale((prev) => (Math.abs(prev - s) < 0.0005 ? prev : s));
      setOffsetX((prev) => (Math.abs(prev - x) < 0.5 ? prev : x));
      const nextH = Math.ceil(unscaledH * s);
      setSheetH((prev) => (prev === nextH ? prev : nextH));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [view, lang]);

  const pdfHref = `/cv/${pdfName(view, lang)}`;

  const onPdf = (e) => {
    e.preventDefault();
    setPdfLabel("DOWNLOAD");
    const a = document.createElement("a");
    a.href = pdfHref;
    a.download = pdfHref.split("/").pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="studio">
      <header className="studio-bar">
        <div className="studio-actions">
          <a className="studio-back" href="/" aria-label="Галерея" title="Галерея">
            ←
          </a>
          <button
            type="button"
            className={lang === "uk" ? "on" : ""}
            aria-pressed={lang === "uk"}
            onClick={() => setLang("uk")}
          >
            UA
          </button>
          <button
            type="button"
            className={lang === "en" ? "on" : ""}
            aria-pressed={lang === "en"}
            onClick={() => setLang("en")}
          >
            EN
          </button>
          <button
            type="button"
            className={view === "ats" ? "on" : ""}
            aria-pressed={view === "ats"}
            onClick={() => setResume((r) => !r)}
          >
            {resume ? "RESUME" : "ATS"}
          </button>
          <a
            className="studio-pdf"
            href={pdfHref}
            download
            target="_blank"
            rel="noopener noreferrer"
            onClick={onPdf}
          >
            DOWNLOAD
          </a>
        </div>
      </header>

      <div className="studio-stage">
        <div
          ref={wrapRef}
          className="studio-sheet-wrap"
          style={{ height: `${sheetH}px` }}
        >
          <div
            ref={sheetRef}
            className="studio-sheet"
            style={{
              width: PAGE_W,
              transform: `translateX(${offsetX}px) scale(${scale})`,
            }}
          >
            {view === "visual" ? (
              <CvDocument lang={lang} />
            ) : (
              <AtsDocument lang={lang} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
