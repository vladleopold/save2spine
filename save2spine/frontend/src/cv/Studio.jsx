import { useLayoutEffect, useRef, useState } from "react";
import { pdfName } from "./cvData.js";
import { CvDocument } from "./CvDocument.jsx";
import { AtsDocument } from "./AtsDocument.jsx";
import { ResumeDocument } from "./ResumeDocument.jsx";
import { ResumeAts } from "./ResumeAts.jsx";

/** A4 at 96dpi. */
const PAGE_W = 794;
const PAGE_H = 1123;

/**
 * kind="cv" — /cv: визуальное CV и его ATS-версия.
 * kind="resume" — /resume: расширенное резюме с полными описаниями работ.
 * Обе страницы устроены одинаково, отличаются только набором документов.
 */
export function Studio({ kind = "cv" }) {
  const [lang, setLang] = useState("uk");
  const [resume, setResume] = useState(false); // false = визуальный, true = ATS
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [sheetH, setSheetH] = useState(PAGE_H);
  const wrapRef = useRef(null);
  const sheetRef = useRef(null);

  const isResume = kind === "resume";
  const view = resume ? "ats" : "visual";

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

  const pdfHref = isResume
    ? `/resume/${pdfName("resume_" + view, lang)}`
    : `/cv/${pdfName(view, lang)}`;

  const onPdf = (e) => {
    e.preventDefault();
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
          <a
            className="studio-back"
            href={isResume ? "/cv" : "/"}
            aria-label={isResume ? "CV" : "Галерея"}
            title={isResume ? "CV" : "Галерея"}
          >
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
            className={`studio-resume${view === "ats" ? " on" : ""}`}
            aria-pressed={view === "ats"}
            onClick={() => setResume((r) => !r)}
          >
            {resume ? (isResume ? "RESUME" : "CV") : (isResume ? "ATS" : "RESUME")}
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
            {view === "visual"
              ? isResume
                ? <ResumeDocument lang={lang} />
                : <CvDocument lang={lang} />
              : isResume
                ? <ResumeAts lang={lang} />
                : <AtsDocument lang={lang} />}
          </div>
        </div>
      </div>
    </div>
  );
}
