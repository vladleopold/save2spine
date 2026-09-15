import { education, jobs, profile, skillList } from "../cv/cvData.js";
import { JobCard } from "./JobCard.jsx";

function ContactBlock({ lang }) {
  return (
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
      <p>{profile.birthLabel[lang]}</p>
      <span className="cv-rule" />
      <p>{profile.location[lang]}</p>
      <span className="cv-rule" />
      <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
        {profile.portfolio}
      </a>
    </address>
  );
}

function SkillsBlock() {
  return (
    <ul className="cv-skills">
      {skillList.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

function PageChrome({ lang, children, sidebar }) {
  const uk = lang === "uk";
  return (
    <section className="cv-page">
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
        <aside className="cv-sidebar">{sidebar}</aside>
        <div className="cv-main">{children}</div>
      </div>
      <footer className="cv-footer">
        <p>{profile.footerTitle}</p>
      </footer>
    </section>
  );
}

export function CvDocument({ lang }) {
  return (
    <div className="cv-document" lang={lang === "uk" ? "uk" : "en"}>
      <PageChrome
        lang={lang}
        sidebar={
          <>
            <ContactBlock lang={lang} />
            <SkillsBlock />
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
          </>
        }
      >
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} lang={lang} />
        ))}
      </PageChrome>
    </div>
  );
}
