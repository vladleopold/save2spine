import {
  education,
  formatDateRange,
  formatDuration,
  jobs,
  profile,
  skillList,
} from "../cv/cvData.js";

export function AtsDocument({ lang }) {
  const uk = lang === "uk";
  return (
    <div className="ats-document" lang={uk ? "uk" : "en"}>
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
        <h2>{uk ? "ДОСВІД" : "EXPERIENCE"}</h2>
        {jobs.map((job) => (
          <article key={job.id} className="ats-job">
            {job.roles.map((role) => (
              <div key={`${job.id}-${role.start}`} className="ats-role">
                <h3>{role.title[lang]}</h3>
                <p className="ats-company">{job.company}</p>
                <p className="ats-meta">
                  {formatDateRange(role.start, role.end, lang)}{" "}
                  {formatDuration(role.start, role.end, lang)}
                  {" · "}
                  {role.tools}
                </p>
                <ul>
                  {role.bullets[lang].map((b) => (
                    <li key={b}>- {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </article>
        ))}
      </section>

      <section>
        <h2>{uk ? "НАВИЧКИ" : "SKILLS"}</h2>
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
