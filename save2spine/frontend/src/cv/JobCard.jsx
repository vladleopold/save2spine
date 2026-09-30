import { formatDateRange, formatDuration } from "../cv/cvData.js";
import { CompanyLogo } from "./Logos.jsx";

export function JobCard({ job, lang }) {
  const role = job.roles[0];
  const duration = formatDuration(role.start, role.end, lang);
  const tall = role.bullets.en.length > 5;
  return (
    <article className={tall ? "cv-card cv-card-tall" : "cv-card"}>
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
        <ul className="cv-bullets">
          {role.bullets[lang].map((b) => (
            <li key={b} data-mark="empty">
              {b}
            </li>
          ))}
        </ul>
        {role.tools ? <p className="cv-tools">{role.tools}</p> : null}
      </div>
    </article>
  );
}
