import React, { useState } from 'react';

const PDFS = {
  atsEn: '/cv/Vladislav_Chaplyhin_CV_ATS_EN.pdf',
  atsUa: '/cv/Vladislav_Chaplyhin_CV_ATS_UA.pdf',
  visualEn: '/cv/Vladislav_Chaplyhin_CV_Visual_EN.pdf',
  visualUa: '/cv/Vladislav_Chaplyhin_CV_Visual_UA.pdf',
};

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
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
      <a href="/" style={{ display: 'inline-block', marginBottom: 24, color: '#22c55e', fontWeight: 'bold' }}>
        ← Галерея
      </a>
      <img
        src="/photo-square.jpg"
        alt="Vladislav Chaplyhin"
        style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', border: '8px solid #22c55e', margin: '0 auto 16px' }}
      />
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>Vladislav Chaplyhin</h1>
      <p style={{ fontSize: 16, color: '#888', marginBottom: 24 }}>Spine Animator / Unity Developer</p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
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
        <div style={{ textAlign: 'left', background: 'var(--card-bg, #fff)', border: '1px solid #e5e5e5', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>CV</h2>
          <p style={{ marginBottom: 8 }}><strong>Специализация:</strong> Spine-анимация (игровые персонажи, слоты, UI), Unity-интеграция.</p>
          <p style={{ marginBottom: 8 }}><strong>Опыт:</strong> слоты, персонажи, карты уровней, инфографика — примеры в галерее.</p>
          <p style={{ marginBottom: 16 }}><strong>Форматы резюме:</strong></p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
            <li><a href={PDFS.atsEn} target="_blank" rel="noreferrer" style={{ color: '#22c55e', fontWeight: 'bold' }}>ATS EN (PDF)</a></li>
            <li><a href={PDFS.atsUa} target="_blank" rel="noreferrer" style={{ color: '#22c55e', fontWeight: 'bold' }}>ATS UA (PDF)</a></li>
            <li><a href={PDFS.visualEn} target="_blank" rel="noreferrer" style={{ color: '#22c55e', fontWeight: 'bold' }}>Visual EN (PDF)</a></li>
            <li><a href={PDFS.visualUa} target="_blank" rel="noreferrer" style={{ color: '#22c55e', fontWeight: 'bold' }}>Visual UA (PDF)</a></li>
          </ul>
        </div>
      )}
    </div>
  );
}
