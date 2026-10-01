import {
  education,
  formatDateRange,
  formatDuration,
  jobs,
  profile,
} from "./cvData.js";
import {
  extras,
  highlights,
  roleDetails,
  skillGroups,
  summary,
} from "./resumeData.js";
import { CompanyLogo } from "./Logos.jsx";

/**
 * Визуальная версия резюме — двухколоночный лист, как у CV,
 * но с расширенным текстом: профиль, ключевые достижения, полное
 * описание ролей и дополнительные разделы.
 */
export function ResumeDocument({ lang }) {
  const uk = lang === "uk";

  return (
    <div className="cv-document rs-document" lang={uk ? "uk" : "en"}>
      <section className="cv-page rs-page">
        <header className="cv-header">
          <div className="cv-photo-wrap">
            <img
              src="/photo-badge.jpg"
              alt={profile.name[lang]}
              width={320}
              height={320}
              className="cv-photo"
              decoding="sync"
            />
          </div>
          <div className="cv-header-copy">
            <p className="cv-name">{profile.name[lang]}</p>
            <div className="cv-header-row">
              <span className="cv-portfolio-label">
                {uk ? "портфоліо" : "portfolio"}
              </span>
              <a
                className="cv-portfolio"
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.portfolio}
              </a>
            </div>
            <div className="cv-header-meta">
              <span className="cv-stat">
                <span className="cv-stat-k">{uk ? "ДОСВІД" : "EXP"}</span>
                <span className="cv-stat-v">
                  {uk ? `${profile.yearsExp} років` : `${profile.yearsExp} years`}
                </span>
              </span>
              <span className="cv-stat">
                <span className="cv-stat-k">SPINE</span>
                <span className="cv-stat-v">
                  {uk ? `${profile.yearsSpine} років` : `${profile.yearsSpine} years`}
                </span>
              </span>
            </div>
          </div>
        </header>

        <div className="cv-body">
          <aside className="cv-sidebar">
            <address className="cv-contact">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span className="cv-rule" />
              <a href={profile.phoneHref}>{profile.phone}</a>
              <span className="cv-rule" />
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                {profile.linkedin}
              </a>
              <span className="cv-rule" />
              <a href={profile.telegramUrl} target="_blank" rel="noopener noreferrer">
                t.me/{profile.telegram}
              </a>
              <span className="cv-rule" />
              <p>{profile.location[lang]}</p>
              <span className="cv-rule" />
              <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                {profile.portfolio}
              </a>
            </address>

            <section className="rs-block">
              <h3 className="rs-side-title">{uk ? "Ключове" : "Highlights"}</h3>
              <ul className="rs-highlights">
                {highlights[lang].map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>

            <section className="rs-block">
              <h3 className="rs-side-title">{uk ? "Навички" : "Skills"}</h3>
              {skillGroups.map((g) => (
                <div key={g.id} className="rs-skill-group">
                  <p className="rs-skill-label">{g.label[lang]}</p>
                  <p className="rs-skill-items">{g.items[lang].join(", ")}</p>
                </div>
              ))}
            </section>

            <div className="cv-edu-side">
              {education.map((ed) => (
                <div key={ed.school.en} className="cv-edu-item">
                  <p className="cv-edu-school">{ed.school[lang]}</p>
                  <p className="cv-edu-field">{ed.field[lang]}</p>
                </div>
              ))}
              <span className="cv-rule" />
              <p className="cv-edu-school">{profile.english[lang]}</p>
            </div>
          </aside>

          <div className="cv-main">
            <section className="rs-summary">
              <h2 className="rs-main-title">{uk ? "Про себе" : "Profile"}</h2>
              <p>{summary[lang]}</p>
            </section>

            <h2 className="rs-main-title">{uk ? "Досвід" : "Experience"}</h2>
            {jobs.map((job) => {
              const role = job.roles[0];
              const details = roleDetails[job.id];
              const duration = formatDuration(role.start, role.end, lang);
              const tall = details.bullets[lang].length > 4;
              return (
                <article
                  key={job.id}
                  className={tall ? "cv-card cv-card-tall rs-card" : "cv-card rs-card"}
                >
                  <div className="cv-role">
                    <header className="cv-card-head">
                      <div className="cv-card-titles">
                        <h3 className="cv-job-title">{role.title[lang]}</h3>
                        <p className="cv-job-company">{job.company}</p>
                        <p className="cv-job-dates">
                          {formatDateRange(role.start, role.end, lang)}
                          {duration ? ` ${duration}` : ""}
                        </p>
                      </div>
                      <CompanyLogo job={job} />
                    </header>

                    <p className="rs-intro">{details.intro[lang]}</p>

                    <ul className="cv-bullets">
                      {details.bullets[lang].map((b) => (
                        <li key={b} data-mark="empty">
                          {b}
                        </li>
                      ))}
                    </ul>

                    <p className="rs-tasks-label">{uk ? "Що робив" : "Responsibilities"}</p>
                    <ul className="rs-tasks">
                      {details.tasks[lang].map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>

                    {role.tools ? <p className="cv-tools">{role.tools}</p> : null}
                  </div>
                </article>
              );
            })}

            {extras.map((ex) => (
              <section key={ex.id} className="rs-extra">
                <h2 className="rs-main-title">{ex.label[lang]}</h2>
                {ex.paragraphs[lang].map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </section>
            ))}
          </div>
        </div>

        <footer className="cv-footer">
          <p>{profile.footerTitle}</p>
        </footer>
      </section>
    </div>
  );
}
