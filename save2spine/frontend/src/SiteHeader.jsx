// Шапка: круглый аватар с зелёной обводкой слева, SPINE по центру,
// кнопка справа. На зеркале save2spine вместо резюме — Telegram.
const MIRROR = typeof window !== 'undefined' && window.location.hostname.startsWith('save2spine');

const TG_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21.9 4.3 18.7 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.2-8.3c.4-.4-.1-.6-.6-.2L6.4 13.1 1.4 11.6c-1.1-.3-1.1-1.1.2-1.6l18.7-7.2c.9-.3 1.6.2 1.6 1.5Z" />
  </svg>
);

export default function SiteHeader() {
  return (
    <header className="site-head">
      <div className="site-head__side site-head__side--left">
        <img
          src="/photo-square.jpg"
          alt="spine animator"
          className="site-avatar"
          width={61}
          height={61}
        />
      </div>

      <div className="site-head__center">
        <span className="site-head__title">SPINE</span>
      </div>

      <div className="site-head__side site-head__side--right">
        {MIRROR ? (
          <a
            href="https://t.me/vladleopold"
            className="tg-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            {TG_ICON}
            <span>t.me/vladleopold</span>
          </a>
        ) : (
          <>
            <a href="/cv" className="resume-btn">cv</a>
            <a href="/resume" className="resume-btn">resume</a>
          </>
        )}
      </div>
    </header>
  );
}
