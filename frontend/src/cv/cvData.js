

/** Present = September 2026. Current role counted through this month. */
export const NOW = { year: 2026, month: 9 };

export const profile = {
  name: {
    en: "Vladislav Chaplyhin",
    uk: "Владислав Чаплигін",
  },
  headline: {
    en: "Senior 2D Spine Animator",
    uk: "Senior 2D Spine Animator",
  },
  footerTitle: "SENIOR 2D SPINE ANIMATOR",
  birthLabel: {
    en: "28 years / October 1, 1997",
    uk: "28 років / 1 жовтня 1997",
  },
  location: {
    en: "Kyiv, Ukraine",
    uk: "Kyiv, UKRAINE",
  },
  email: "vladyslavchaplyhin@gmail.com",
  phone: "+38 093 078 10 88",
  phoneHref: "tel:+380930781088",
  telegram: "vladleopold",
  telegramUrl: "https://t.me/vladleopold",
  linkedin: "linkedin.com/in/vladyslavchaplygin",
  linkedinUrl: "https://www.linkedin.com/in/vladyslavchaplygin/",
  portfolio: "spinefolio.vercel.app",
  portfolioUrl: "https://spinefolio.vercel.app/",
  yearsExp: "8",
  yearsSpine: "7",
  english: {
    en: "English · A2 Pre-Intermediate",
    uk: "англійська · A2 Pre-Intermediate",
  },
};

export const skillList = [
  "SPINE",
  "After Effects",
  "Adobe Flash",
  "Adobe Animate",
  "Photoshop",
  "Illustrator",
  "Blender",
  "3DSMax",
  "Maya",
  "UNITY",
  "unreal engine",
  "Cocos 2DX",
  "VSO",
  "shaders",
];

/** Five company blocks. Voki is one role: First 2D Animator, Apr 2018 — Mar 2021. */
export const jobs = [
  {
    id: "retro",
    company: "Retro Style Games",
    roles: [
      {
        title: { en: "Spine 2D Animator", uk: "SPINE 2D ANIMATOR" },
        start: "2023-07",
        end: null,
        tools: "After Effects & Particular RC, SPINE, Flash, Animate, Photoshop",
        bullets: {
          en: [
            "Character rigging and animation.",
            "Animation of effects, game objects, backgrounds, interfaces.",
            "Technical development of programmatic animation.",
          ],
          uk: [
            "ріггінг та анімація персонажів.",
            "анімація ефектів, ігрових об’єктів, фонів, інтерфейсів.",
            "технічна розробка програмної анімації.",
          ],
        },
      },
    ],
  },
  {
    id: "friends",
    company: "4friends",
    roles: [
      {
        title: { en: "2D Animator", uk: "2D ANIMATOR" },
        start: "2021-03",
        end: "2022-08",
        tools: "SPINE, Flash, Animate, Unity Animation, VSO Animation, Effects Editor, Pixi.js Particles, Photoshop",
        bullets: {
          en: [
            "Slot animation.",
            "Animation of characters, effects and game objects.",
          ],
          uk: [
            "анімація слотів.",
            "анімація персонажів, ефектів та ігрових об’єктів.",
          ],
        },
      },
    ],
  },
  {
    id: "voki",
    company: "Voki Games",
    roles: [
      {
        title: {
          en: "First 2D Animator",
          uk: "ПЕРШИЙ 2D АНІМАТОР",
        },
        start: "2018-04",
        end: "2021-03",
        tools: "SPINE, Photoshop, Flash, Animate, After Effects, Unity Animation, VSO Animation, Effects Editor, Pixi.js Particles",
        bullets: {
          en: [
            "Improving Garden Scapes animation.",
            "Effects, game objects, backgrounds and interfaces.",
            "Work on the company’s new projects.",
            "Shader animation.",
            "Interface animation of pop-ups and dialogues.",
            "Flash animation for MysteryMatters.",
            "VSO animation.",
          ],
          uk: [
            "вдосконалення анімації Garden Scapes.",
            "ефекти, ігрові об’єкти, фони та інтерфейси.",
            "робота з новими проектами компанії.",
            "анімація шейдерів.",
            "інтерфейсна анімація попапів та розмов.",
            "flash анімації MysteryMatters.",
            "VSO анімації.",
          ],
        },
      },
    ],
  },
  {
    id: "evoplay",
    company: "Evoplay",
    roles: [
      {
        title: { en: "Technical Artist", uk: "TECHNICAL ARTIST" },
        start: "2016-09",
        end: "2017-10",
        tools: "SPINE, Flash, Animate, Unity Animation, UE Animation, VR animation, Photoshop",
        bullets: {
          en: [
            "Animation of full applications.",
            "Sound effects and AssetBundle generation.",
            "Cross-platform automated Unity UI systems.",
          ],
          uk: [
            "анімація цілих застосунків.",
            "розробка звукових ефектів та генерації AssetBundle.",
            "кросплатформені автоматизовані системи UI Unity.",
          ],
        },
      },
    ],
  },
  {
    id: "lucky",
    company: "Lucky Labs",
    roles: [
      {
        title: {
          en: "2D Animator, Technical Artist",
          uk: "2D ANIMATOR, TECHNICAL ARTIST",
        },
        start: "2014-09",
        end: "2016-01",
        tools: "After Effects & Particular, Flash, Animate, Pixi.js Particles, Photoshop, SPINE",
        bullets: {
          en: [
            "VFX, game objects, backgrounds, interfaces animation.",
            "Worked as one unit with art and dev.",
            "Programmatic animation (particle systems).",
            "Post-production materials for exhibitions.",
          ],
          uk: [
            "анімація VFX, ігрових об’єктів, фонів, інтерфейсів.",
            "сукупна робота з арт та дев відділами.",
            "програмні анімації (particle systems).",
            "створення пост-продакшн матеріалів для виставок.",
          ],
        },
      },
    ],
  },
];

export const education = [
  {
    school: { en: 'Computer Academy "STEP"', uk: "КА «ШАГ»" },
    field: {
      en: "Faculty of Graphic Design",
      uk: "Графічний факультет дизайн",
    },
  },
  {
    school: {
      en: "National Aviation University",
      uk: "Національний авіаційний університет",
    },
    field: {
      en: "Automation of Computer Systems",
      uk: "Автоматизація комп’ютерних систем",
    },
  },
];

const MONTH_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTH_UK = [
  "січ",
  "лют",
  "бер",
  "кві",
  "тра",
  "чер",
  "лип",
  "сер",
  "вер",
  "жов",
  "лис",
  "гру",
];

export function parseYearMonth(value) {
  const [y, m] = value.split("-").map(Number);
  return { year: y, month: m };
}

export function formatMonthYear(value, lang) {
  const { year, month } = parseYearMonth(value);
  const label = lang === "uk" ? MONTH_UK[month - 1] : MONTH_EN[month - 1];
  return `${label} ${year}`;
}

export function monthCount(start, end) {
  const s = parseYearMonth(start);
  const e = end ? parseYearMonth(end) : { year: NOW.year, month: NOW.month };
  const diff = (e.year - s.year) * 12 + (e.month - s.month);
  return Math.max(0, end ? diff : diff + 1);
}

export function formatDuration(start, end, lang) {
  const total = Math.max(0, monthCount(start, end));
  const years = Math.floor(total / 12);
  const months = total % 12;
  if (lang === "uk") {
    const yPart =
      years === 0
        ? ""
        : years === 1
          ? "1 рік"
          : years >= 2 && years <= 4
            ? `${years} роки`
            : `${years} років`;
    const mPart =
      months === 0
        ? ""
        : months === 1
          ? "1 місяць"
          : months >= 2 && months <= 4
            ? `${months} місяці`
            : `${months} місяців`;
    return [yPart, mPart].filter(Boolean).join(" ");
  }
  const yPart = years === 0 ? "" : years === 1 ? "1 year" : `${years} years`;
  const mPart =
    months === 0 ? "" : months === 1 ? "1 month" : `${months} months`;
  return [yPart, mPart].filter(Boolean).join(" ");
}

export function formatDateRange(start, end, lang) {
  const from = formatMonthYear(start, lang);
  const to = end
    ? formatMonthYear(end, lang)
    : lang === "uk"
      ? "донині"
      : "Present";
  return `${from} — ${to}`;
}

export function pdfName(view, lang) {
  const kind = view === "ats" ? "ATS" : "Visual";
  const loc = lang === "uk" ? "UA" : "EN";
  return `Vladislav_Chaplyhin_CV_${kind}_${loc}.pdf`;
}
