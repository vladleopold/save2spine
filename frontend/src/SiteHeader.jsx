import useMelody from './lib/useMelody';

// Шапка: аватар слева (без круглой обрезки), SPINE по центру,
// кнопки справа — тема, музыка, резюме.
export default function SiteHeader({ theme, onToggleTheme }) {
  const melody = useMelody();

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
        <button
          onClick={onToggleTheme}
          className="theme-toggle"
          aria-label="Переключить тему"
          title="Тёмная / светлая тема"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {melody.supported && (
          <button
            onClick={melody.toggle}
            className={`theme-toggle music-toggle${melody.playing ? ' is-playing' : ''}`}
            aria-label={melody.playing ? 'Выключить музыку' : 'Включить музыку'}
            aria-pressed={melody.playing}
            title={melody.playing ? 'Выключить музыку' : 'Включить музыку'}
          >
            {melody.playing ? '🔊' : '🔇'}
          </button>
        )}

        <a href="/cv" className="resume-btn">resume</a>
      </div>
    </header>
  );
}
