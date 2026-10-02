import {
  education,
  formatDateRange,
  formatDuration,
  jobs,
  profile,
  skillList,
} from "./cvData.js";
import {
  highlights,
  roleDetails,
  skillGroups,
  summary,
} from "./resumeData.js";

/**
 * ATS-версия резюме — одно-колоночный текст без таблиц и колонок.
 * Именно эту версию отдают системам автоматического отбора: у каждого блока
 * есть заголовок, у каждого места работы — должность, компания, даты,
 * длительность и список достижений обычными строками.
 */
export function ResumeAts({ lang }) {
  const uk = lang === "uk";

  return (
    <div className="ats-document rs-ats" lang={uk ? "uk" : "en"}>
      <header className="ats-header">
        <h1>{profile.name[lang]}</h1>
        <p className="ats-headline">{profile.headline[lang]}</p>
        <p className="ats-contact">
          {profile.location[lang]}
          <br />
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          {" · "}
          <a href={profile.phoneHref}>{profile.phone}</a>
          <br />
          <a href={profile.linkedinUrl}>{profile.linkedinUrl}</a>
          <br />
          <a href={profile.telegramUrl}>{profile.telegramUrl}</a>
          {" · "}
          {uk ? "Портфоліо" : "Portfolio"}:{" "}
          <a href={profile.portfolioUrl}>{profile.portfolioUrl}</a>
          <br />
          {profile.birthLabel[lang]}
          {" · "}
          {uk
            ? `ДОСВІД ${profile.yearsExp} років · SPINE ${profile.yearsSpine} років`
            : `EXP ${profile.yearsExp} years · SPINE ${profile.yearsSpine} years`}
        </p>
      </header>

      <section>
        <h2>{uk ? "ПРОФІЛЬ" : "PROFILE"}</h2>
        <p>{summary[lang]}</p>
      </section>

      <section>
        <h2>{uk ? "КЛЮЧОВІ ДОСЯГНЕННЯ" : "KEY HIGHLIGHTS"}</h2>
        <ul>
          {highlights[lang].map((h) => (
            <li key={h}>- {h}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{uk ? "ДОСВІД" : "EXPERIENCE"}</h2>
        {jobs.map((job) => {
          const role = job.roles[0];
          const details = roleDetails[job.id];
          return (
            <article key={job.id} className="ats-job">
              <h3>{role.title[lang]}</h3>
              <p className="ats-company">{job.company}</p>
              <p className="ats-meta">
                {formatDateRange(role.start, role.end, lang)}{" "}
                {formatDuration(role.start, role.end, lang, role.duration)}
                {" · "}
                {role.tools}
              </p>
              <p>{details.intro[lang]}</p>
              <ul>
                {details.bullets[lang].map((b) => (
                  <li key={b}>- {b}</li>
                ))}
              </ul>
              <p className="ats-company">
                {uk ? "Обов’язки:" : "Responsibilities:"}
              </p>
              <p>{details.tasks[lang].join("; ")}.</p>
            </article>
          );
        })}
      </section>

      <section>
        <h2>{uk ? "НАВИЧКИ" : "SKILLS"}</h2>
        {skillGroups.map((g) => (
          <p key={g.id}>
            <strong>{g.label[lang]}: </strong>
            {g.items[lang].join(", ")}.
          </p>
        ))}
        <p>{skillList.join(", ")}</p>
      </section>

      <section>
        <h2>{uk ? "ОСВІТА" : "EDUCATION"}</h2>
        {education.map((ed) => (
          <article key={ed.school.en} className="ats-job">
            <h3>{ed.school[lang]}</h3>
            <p className="ats-meta">{ed.field[lang]}</p>
          </article>
        ))}
      </section>

      <section>
        <h2>{uk ? "МОВИ" : "LANGUAGES"}</h2>
        <p>{profile.english[lang]}</p>
      </section>
    </div>
  );
}
