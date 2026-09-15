import React, { useState } from 'react';

const PDFS = {
  atsEn: '/cv/Vladislav_Chaplyhin_CV_ATS_EN.pdf',
  atsUa: '/cv/Vladislav_Chaplyhin_CV_ATS_UA.pdf',
  visualEn: '/cv/Vladislav_Chaplyhin_CV_Visual_EN.pdf',
  visualUa: '/cv/Vladislav_Chaplyhin_CV_Visual_UA.pdf',
};

const SKILLS = [
  'After Effects', 'Adobe Flash', 'Adobe Animate', 'Photoshop', 'Illustrator',
  'Blender', '3DSMax', 'Maya', 'UNITY', 'Unreal Engine', 'Cocos 2DX',
  'VSO', 'Shaders', 'English A2 Pre-Intermediate',
];

const JOBS = [
  { role: 'SPINE 2D ANIMATOR', place: 'Retro Style Games', years: '2023', stack: 'After Effects & Particular RC, SPINE, Flash, Animate, Photoshop' },
  { role: '2D ANIMATOR', place: '4friends', years: '2021 – 2022', stack: 'SPINE, Flash, Animate, Unity Animation, VSO Animation, Effects Editor, Pixi.js Particles, Photoshop' },
  { role: '2D ANIMATOR', place: 'Voki Games', years: '2018 – 2021', stack: 'Garden Scapes, Mystery Matters. SPINE, Photoshop, Flash, Animate, After Effects, Unity Animation, VSO Animation, Effects Editor, Pixi.js Particles' },
  { role: 'TECHNICAL ARTIST', place: 'Evoplay', years: '2016 – 2017', stack: 'AssetBundle, UI Unity. SPINE, Flash, Animate, Unity Animation, UE Animation, VR animation, Photoshop' },
  { role: '2D ANIMATOR, TECHNICAL ARTIST', place: 'Lucky Labs', years: '2014 – 2016', stack: 'VFX (particle systems). After Effects & Particular, Flash, Animate, Pixi.js Particles, Photoshop, SPINE' },
];

const link = { color: '#22c55e', fontWeight: 'bold' };

export default function CvPage() {
  const [resumeStep, setResumeStep] = useState('ATS'); // ATS -> RESUME -> CV -> ATS...
  const [pdfArmed, setPdfArmed] = useState(false); // PDF -> DOWNLOAD -> скачивает
  const [lang, setLang] = useState('EN');

  const download = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 16px 64px' }}>
      <a href="/" style={{ display: 'inline-block', marginBottom: 24, ...link }}>
        ← Галерея
      </a>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img
          src="/photo-square.jpg"
          alt="Vladislav Chaplyhin"
          style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', border: '8px solid #22c55e', margin: '0 auto 16px' }}
        />
        <h1 style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 4 }}>Vladislav Chaplyhin</h1>
        <p style={{ fontSize: 18, marginBottom: 8 }}>SENIOR 2D SPINE ANIMATOR</p>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>28 / 1997 · Kyiv, UKRAINE</p>
        <p style={{ fontSize: 14, marginBottom: 4 }}>
          <a href="mailto:vladyslavchaplyhin@gmail.com" style={link}>vladyslavchaplyhin@gmail.com</a>
          {' · '}
          <a href="tel:+380930781088" style={link}>+38 093 078 10 88</a>
        </p>
        <p style={{ fontSize: 14 }}>
          <a href="https://www.linkedin.com/in/vladyslavchaplygin/" target="_blank" rel="noreferrer" style={link}>LinkedIn</a>
          {' · '}
          <a href="https://t.me/vladleopold" target="_blank" rel="noreferrer" style={link}>Telegram</a>
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
        <button
          onClick={() => setResumeStep((s) => (s === 'ATS' ? 'RESUME' : s === 'RESUME' ? 'CV' : 'ATS'))}
          style={{ padding: '10px 32px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}
        >
          {resumeStep}
        </button>
        <button
          onClick={() => {
            if (pdfArmed) download(lang === 'EN' ? PDFS.atsEn : PDFS.atsUa);
            else setPdfArmed(true);
          }}
          style={{ padding: '10px 32px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}
        >
          {pdfArmed ? 'DOWNLOAD' : 'PDF'}
        </button>
        <button
          onClick={() => setLang((l) => (l === 'EN' ? 'UA' : 'EN'))}
          style={{ padding: '10px 20px', background: '#eee', color: '#111', border: 'none', borderRadius: 8, fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}
        >
          {lang}
        </button>
      </div>

      {resumeStep !== 'ATS' && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>CV — Навыки</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
            {SKILLS.map((s) => (
              <span key={s} style={{ padding: '6px 14px', border: '1px solid #22c55e', borderRadius: 20, fontSize: 14 }}>
                {s}
              </span>
            ))}
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>CV — Опыт</h2>
          <div style={{ display: 'grid', gap: 16, marginBottom: 28 }}>
            {JOBS.map((j) => (
              <div key={j.place} style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
                <div style={{ fontWeight: 'bold', fontSize: 17 }}>{j.role}</div>
                <div style={{ color: '#22c55e', fontWeight: 'bold' }}>{j.place} · {j.years}</div>
                <div style={{ fontSize: 14, color: '#888', marginTop: 6 }}>{j.stack}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>CV — Файлы</h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
            <li><a href={PDFS.atsEn} target="_blank" rel="noreferrer" style={link}>ATS EN (PDF)</a></li>
            <li><a href={PDFS.atsUa} target="_blank" rel="noreferrer" style={link}>ATS UA (PDF)</a></li>
            <li><a href={PDFS.visualEn} target="_blank" rel="noreferrer" style={link}>Visual EN (PDF)</a></li>
            <li><a href={PDFS.visualUa} target="_blank" rel="noreferrer" style={link}>Visual UA (PDF)</a></li>
          </ul>
        </div>
      )}
    </div>
  );
}
