const LOGOS = {
  retro: { src: "/logos/rsg.png", alt: "Retro Style Games", kind: "banner" },
  friends: { src: "/logos/friends.png", alt: "4friends", kind: "wide" },
  voki: { src: "/logos/voki.png", alt: "Voki Games", kind: "mark" },
  evoplay: { src: "/logos/evoplay.svg", alt: "Evoplay", kind: "wide" },
  lucky: { src: "/logos/lucky.png", alt: "Lucky Labs", kind: "wide" },
};

export function CompanyLogo({ job }) {
  const logo = LOGOS[job.id];
  if (!logo) return null;
  return (
    <div className={`cv-logo-wrap cv-logo-wrap-${job.id}`}>
      <img
        src={logo.src}
        alt={logo.alt}
        className={`cv-logo cv-logo-${logo.kind}`}
        decoding="sync"
      />
    </div>
  );
}
