// Шапка: круглый аватар с зелёной обводкой слева, SPINE по центру,
// кнопка резюме справа.
export default function SiteHeader() {
  return (
    <header className="site-head">
      <div className="site-head__side site-head__side--left">
        <img
          src="/photo-square.jpg"
          alt="spine animator"
          className="site-avatar"
          width={48}
          height={48}
        />
      </div>

      <div className="site-head__center">
        <span className="site-head__title">SPINE</span>
      </div>

      <div className="site-head__side site-head__side--right">
        <a href="/cv" className="resume-btn">resume</a>
      </div>
    </header>
  );
}
