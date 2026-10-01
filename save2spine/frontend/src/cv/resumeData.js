// ДАННЫЕ РЕЗЮМЕ (/resume).
//
// Источник всей информации — cvData.js: имя, контакты, компании, даты,
// набор инструментов и образование оттуда и не дублируются. Здесь только то,
// чего в CV нет: расширенный текст по каждому месту работы, профиль,
// ключевые достижения и дополнительные блоки.
//
// Текст написан отдельно для en и uk, а не переведён машинно: в английской
// версии предложения строятся в стандартном порядке «подлежащее + сказуемое»
// с настоящим временем и результатом, в украинской — с правильными відмінками
// («грав», «робив», «відповідав»), щоб ATS не сприймав текст за сміття.

import { NOW } from "./cvData.js";

/**
 * Короткое резюме в одному абзаце — те, кто читает по диагонали.
 */
export const summary = {
  en: "Senior 2D Spine Animator with eight years of professional experience in "
    + "animation and game development, and more than six years working directly in "
    + "Spine. I build character rigs, animate effects and UI, and set up the shader and "
    + "code work that lets animation react to the game instead of running on a fixed "
    + "loop. I have worked both hands-on and as the lead of a 2D animation team, and I "
    + "work in Ukrainian, Russian and English.",
  uk: "Senior 2D Spine Animator із восьмирічним професійним досвідом в анімації "
    + "та геймдеві й понад шістьма роками роботи безпосередньо у Spine. Ригую персонажів, "
    + "анімую ефекти та інтерфейс, налаштовую шейдери й код, щоб анімація реагувала на "
    + "гру, а не прокручувалася по колу. Працював і руками, і очолював команду 2D-анімації. "
    + "Працюю українською, російською та англійською.",
};

/**
 * Ключові досягнення — короткі рядки з конкретикою.
 * В ATS-версії вони стають окремим блоком, у visual — бічним.
 */
export const highlights = {
  en: [
    "Eight years of professional animation work across Playrix, Evoplay, Lucky Labs and Clonefish, from HTML5 and Flash through to Spine.",
    "Live support for Gardenscapes, one of the top-grossing mobile games, including shader animation driven by game state.",
    "Built and ran a 2D animation team for clients, covering estimation and client communication.",
    "Wrote arbitration and advertising integration with SDK and API automation in C# and Java.",
    "Created VFX, character animation and interface animation, and integrated animation directly into engine code.",
  ],
  uk: [
    "Восім років професійної анімації в Playrix, Evoplay, Lucky Labs та Clonefish — від HTML5 і Flash до Spine.",
    "Підтримка живого Gardenscapes, однієї з найприбутковіших мобільних ігор, зокрема анімація шейдерів, керована станом гри.",
    "Створив і очолював команду 2D-анімації для клієнтів, включно з оцінкою робіт і комунікацією.",
    "Писав системи арбітражу та інтеграції реклами з автоматизацією SDK і API на C# та Java.",
    "Створював VFX, анімацію персонажів та інтерфейсу й інтегрував анімацію напряму в код рушія.",
  ],
};

/**
 * Розширені описи робіт. Ключ jobId збігається з id у cvData.jobs,
 * тож дати й інструменти не дублюються — звідти береться тільки текст.
 *
 * intro — абзац про роль у компанії (його раніше не було взагалі).
 * bullets — повний перелік робіт у синтаксично правильній побудові.
 * tasks — окремий блок «що саме робив» для /resume.
 */
export const roleDetails = {
  friends: {
    intro: {
      en: "I joined 4friends as the first animation artist on the Gardenscapes team. "
        + "The project was already live and in the top charts, so the work was less "
        + "about building something new and more about keeping a huge, uneven catalogue "
        + "of animations consistent while new content shipped every week. I also worked "
        + "on new Playrix titles, where I set up VSO and Unity animation alongside Spine.",
      uk: "Прийшов до 4friends першим аніматором на команді Gardenscapes. Проєкт уже "
        + "був запущений і тримався в топі, тож робота була не про створення з нуля, а "
        + "про тримання величезного й нерівномірного каталогу анімацій в одному стилі, поки "
        + "щ тижня виходив новий контент. Паралельно працював над новими проєктами Playrix, "
        + "де налаштовував анімацію у VSO та Unity разом зі Spine.",
    },
    bullets: {
      en: [
        "Provided support for the live Gardenscapes project, one of the top-grossing mobile games.",
        "Created animation for special effects, game objects, backgrounds and UI elements.",
        "Worked on new Playrix projects, building animation to the same standards as the live titles.",
        "Used VSO and Unity Animation alongside Spine so effects matched the engine output.",
      ],
      uk: [
        "Підтримував живий проєкт Gardenscapes — одну з найприбутковіших мобільних ігор.",
        "Створював анімацію спецефектів, ігрових об’єктів, фонів та елементів інтерфейсу.",
        "Працював над новими проєктами Playrix, будуючи анімацію за тими самими стандартами, що й у живих ігор.",
        "Використовував VSO та Unity Animation разом зі Spine, щоб ефекти збігалися з рушієм.",
      ],
    },
    tasks: {
      en: [
        "Gardenscapes live support",
        "VFX, game objects, backgrounds and UI",
        "New Playrix projects",
        "VSO and Unity integration",
      ],
      uk: [
        "Підтримка живого Gardenscapes",
        "VFX, ігрові об’єкти, фони та інтерфейс",
        "Нові проєкти Playrix",
        "Інтеграція VSO та Unity",
      ],
    },
  },

  voki: {
    intro: {
      en: "At Voki Games I moved fully onto shader-driven animation and onto connecting "
        + "animation straight to game logic rather than to fixed timelines. The Playrix "
        + "work here was the most technically interesting of my career so far: animation "
        + "that had to react to the game state, in a live service that shipped new content "
        + "every few weeks.",
      uk: "У Voki Games я повністю перейшов на анімацію, керовану шейдерами, і на підключення "
        + "анімації напряму до ігрової логіки замість фіксованих таймлайнів. Робота над "
        + "проєктами Playrix була найтехнічні цікавою на цей момент: анімація мала реагувати "
        + "на стан гри в live-service, куди новий контент виходив кожні тижні.",
    },
    bullets: {
      en: [
        "Created shader animations that reacted to gameplay instead of playing on a fixed loop.",
        "Connected animation directly to the game, so state changes drove the visuals.",
        "Developed animation for Playrix games, including the top series about Austin's mansion and the Gardenscapes universe.",
      ],
      uk: [
        "Створював анімацію шейдерів, що реагувала на ігрову логіку, а не прокручувалася по колу.",
        "Підключав анімацію напряму до гри, щоб зміни стану керували картинкою.",
        "Розробляв анімацію для ігор Playrix, зокрема топової серії про маєток Остіна та всесвіту Gardenscapes.",
      ],
    },
    tasks: {
      en: [
        "Shader animation",
        "Gameplay-driven animation",
        "Playrix animation: Austin's mansion, Gardenscapes",
      ],
      uk: [
        "Анімація шейдерів",
        "Анімація, керована ігровою логікою",
        "Анімація Playrix: маєток Остіна, Gardenscapes",
      ],
    },
  },

  volmi: {
    intro: {
      en: "This role was half animation and half running a team. I built and managed a "
        + "2D animation group for clients who wanted a lot of work done on short notice, "
        + "which meant estimating subprojects properly, keeping artists informed and "
        + "keeping clients updated by phone. I also produced animation for Stacklogic, "
        + "LuckyFish, NetGaming and Huuuge Games.",
      uk: "Ця роль була наполовину анімацією, наполовину керівництвом командою. Я зібрав і "
        + "очолював групу 2D-анімації для клієнтів, яким потрібно було багато роботи "
        + "зробити швидко, тож довелось коректно оцінювати підпроєкти, тримати художників "
        + "в курсі та тримати клієнтів у відомості по телефону. Також робив анімацію для "
        + "Stacklogic, LuckyFish, NetGaming та Huuuge Games.",
    },
    bullets: {
      en: [
        "Maintained regular communication with clients by phone.",
        "Created and managed a 2D animation team for demanding clients.",
        "Estimated team subprojects and improved communication with artists.",
        "Worked with Stacklogic, LuckyFish, NetGaming and Huuuge Games.",
      ],
      uk: [
        "Підтримував регулярний зв’язок із клієнтами по телефону.",
        "Створив і очолював команду 2D-анімації для вимогливих клієнтів.",
        "Оцінював підпроєкти команди та покращував комунікацію з художниками.",
        "Працював з Stacklogic, LuckyFish, NetGaming та Huuuge Games.",
      ],
    },
    tasks: {
      en: [
        "2D animation team management",
        "Client communication and estimation",
        "Animation for Stacklogic, LuckyFish, NetGaming, Huuuge Games",
      ],
      uk: [
        "Керівництво командою 2D-анімації",
        "Комунікація з клієнтами та оцінка робіт",
        "Анімація для Stacklogic, LuckyFish, NetGaming, Huuuge Games",
      ],
    },
  },

  evoplay: {
    intro: {
      en: "Back at Evoplay the balance shifted from animation into engineering. I built "
        + "application UI and UI mechanics, made animation and VFX in Unity, shipped small "
        + "2D mini-games, and wrote the arbitration and advertising integration layer — SDK "
        + "and API automation in C# and Java. It was the most code-heavy role I have had, "
        + "and it is where I learned to own a feature from the mechanic to the build.",
      uk: "Повертаючись до Evoplay, баланс змістився від анімації до інженерії. Я робив UI "
        + "застосунку та UI-механіки, створював анімацію і VFX в Unity, випускав невеликі 2D "
        + "міні-ігри та писав шар арбітражу й інтеграції реклами — автоматизацію SDK і API "
        + "на C# та Java. Це найкодовіша роль у моїй кар’єрі, саме тут я навчився брати "
        + "фічу від механіки до білда.",
    },
    bullets: {
      en: [
        "Built application UI and developed various UI mechanics.",
        "Created animation and VFX in Unity.",
        "Developed 2D mini-games in Unity.",
        "Developed arbitration and advertising integration systems, including SDK and API control automation in C# and Java.",
      ],
      uk: [
        "Розробляв UI застосунку та різні UI-механіки.",
        "Створював анімацію та VFX в Unity.",
        "Розробляв 2D міні-ігри в Unity.",
        "Розробляв системи арбітражу та інтеграції реклами, зокрема автоматизацію керування SDK і API на C# та Java.",
      ],
    },
    tasks: {
      en: [
        "Application UI and UI mechanics",
        "Animation and VFX in Unity",
        "2D mini-games",
        "Arbitration and advertising SDK/API automation (C#, Java)",
      ],
      uk: [
        "UI застосунку та UI-механіки",
        "Анімація та VFX в Unity",
        "2D міні-ігри",
        "Автоматизація SDK/API для арбітражу та реклами (C#, Java)",
      ],
    },
  },

  lucky: {
    intro: {
      en: "The studio where I learned the trade, and the longest stretch of my career. "
        + "It was a full-service team, so I saw post-production through to delivery, and I "
        + "worked inside a small unit made up of artists, developers and me — which meant "
        + "learning to hand work over cleanly and to defend an animation decision when it "
        + "mattered. The video materials for exhibitions and conferences came out of this "
        + "period as well.",
      uk: "Студія, де я вчився ремеслу, і найдовший відрізок моєї кар’єри. Команда була "
        + "повного циклу, тож я бачив пост-продакшн до здачі, і працював у невеликій зв’язці "
        + "з художниками та розробниками — це навчило чітко передавати роботу й відстоювати "
        + "рішення щодо анімації, коли це мало значення. З цього періоду пішли й відеоматеріали "
        + "для виставок і конференцій.",
    },
    bullets: {
      en: [
        "Created animation VFX, game objects, backgrounds and interfaces.",
        "Integrated animations directly into code and prepared animation for production.",
        "Created software animations using particle systems.",
        "Created video materials for world exhibitions and conferences.",
      ],
      uk: [
        "Створював анімацію VFX, ігрових об’єктів, фонів та інтерфейсів.",
        "Інтегрував анімацію напряму в код і готував анімацію до продакшну.",
        "Створював програмні анімації з використанням систем часток.",
        "Створював відеоматеріали для світових виставок і конференцій.",
      ],
    },
    tasks: {
      en: [
        "VFX, game objects, backgrounds and interface animation",
        "Animation integrated into code",
        "Particle-based programmatic animation",
        "Video materials for exhibitions and conferences",
      ],
      uk: [
        "Анімація VFX, ігрових об’єктів, фонів та інтерфейсу",
        "Інтеграція анімації в код",
        "Програмна анімація на системах часток",
        "Відеоматеріали для виставок і конференцій",
      ],
    },
  },

  clonefish: {
    intro: {
      en: "Where I started. HTML5 and Flash animation for web: landing pages, banners, "
        + "casual social games, particle effects and character animation. It is where I "
        + "learned to build an effect from nothing, to keep the file size sane and to make "
        + "an animation readable in the first second it appears on screen.",
      uk: "Звідси я почав. HTML5- та Flash-анімація для вебу: лендінги, банери, казуальні "
        + "соціальні ігри, ефекти на системах часток і анімація персонажів. Тут я навчився "
        + "робити ефект з нуля, тримати розмір файлу розумним і робити анімацію зрозумілою "
        + "вже в першу секунду, коли вона з’являється на екрані.",
    },
    bullets: {
      en: [
        "Animated non-game elements, landing pages, banners and interfaces.",
        "Created animation effects using particle systems.",
        "Animated characters, special effects, backgrounds and game elements in HTML5.",
        "Created animations for casual social games.",
      ],
      uk: [
        "Анімував неігрові елементи, лендінги, банери та інтерфейси.",
        "Створював анімаційні ефекти з використанням систем часток.",
        "Анімував персонажів, спецефекти, фони та ігрові елементи у HTML5.",
        "Створював анімації для казуальних соціальних ігор.",
      ],
    },
    tasks: {
      en: [
        "Landing pages, banners and web interfaces",
        "Particle-based animation effects",
        "Character and VFX animation in HTML5",
        "Casual social games",
      ],
      uk: [
        "Лендінги, банери та веб-інтерфейси",
        "Анімаційні ефекти на системах часток",
        "Анімація персонажів і VFX у HTML5",
        "Казуальні соціальні ігри",
      ],
    },
  },
};

/** Професійні навички, згруповані для /resume (ATS-версія бере тільки назви). */
export const skillGroups = [
  {
    id: "spine",
    label: { en: "Animation", uk: "Анімація" },
    items: {
      en: ["Spine 2D", "Character rigging", "Animation of VFX and UI", "Shader animation", "VSO animation"],
      uk: ["Spine 2D", "Ригінг персонажів", "Анімація VFX та UI", "Анімація шейдерів", "Анімація у VSO"],
    },
  },
  {
    id: "tools",
    label: { en: "Production tools", uk: "Інструменти" },
    items: {
      en: ["After Effects & Particular", "Adobe Animate (Flash)", "Photoshop", "Illustrator", "Pixi.js"],
      uk: ["After Effects & Particular", "Adobe Animate (Flash)", "Photoshop", "Illustrator", "Pixi.js"],
    },
  },
  {
    id: "engines",
    label: { en: "Engines", uk: "Рушії" },
    items: {
      en: ["Unity Animation", "Unreal Engine", "Cocos 2DX"],
      uk: ["Unity Animation", "Unreal Engine", "Cocos 2DX"],
    },
  },
  {
    id: "dcc",
    label: { en: "3D & graphics", uk: "3D та графіка" },
    items: {
      en: ["Blender", "3ds Max", "Maya"],
      uk: ["Blender", "3ds Max", "Maya"],
    },
  },
];

/** Додаткові розділи, яких немає у CV. */
export const extras = [
  {
    id: "about",
    label: { en: "About me", uk: "Про мене" },
    paragraphs: {
      en: [
        "I am a 2D animator who moved into technical work early, because in game "
        + "production the animation that looks best is rarely the animation that is "
        + "cheapest to maintain. I care about rigs that a colleague can pick up, "
        + "effects that read on a phone screen, and systems that let a small team "
        + "ship a large amount of content.",
        "Outside of production I keep working with Spine and shaders, because that "
        + "is where my curiosity sits. I am comfortable writing the code a feature "
        + "needs when nobody else on the team wants to, and I am at my best on the "
        + "projects where animation and tooling have to be solved together.",
        "I am looking for a senior role in a studio where 2D animation is a core "
        + "discipline rather than a task passed around, and where the person doing "
        + "the animation has a real say in how the game feels.",
      ],
      uk: [
        "Я 2D-аніматор, який рано прийшов до технічної роботи, бо в геймдеві анімація, "
        + "яка виглядає найкраще, рідко є тією, яку найдешевше підтримувати. Мене "
        + "цікавлять риги, які колега зможе підхопити, ефекти, що читаються на "
        + "екрані телефона, і системи, з якими невелика команда випускає багато контенту.",
        "Поза виробництвом я продовжую працювати зі Spine та шейдерами — саме там у мене "
        + "живе цікавість. Мені комфортно писати код, потрібний фічці, коли ніхто "
        + "інший у команді не хоче цим займатися, і найкраще я працюю на проєктах, "
        + "де анімацію та інструменти треба розв’язувати разом.",
        "Шукаю senior-позицію в студії, де 2D-анімація — це базова дисципліна, а не "
        + "задача, яку кидають по черзі, і де людина, яка робить анімацію, справді "
        + "впливає на відчуття від гри.",
      ],
    },
  },
  {
    id: "education-extra",
    label: { en: "Additional training", uk: "Додаткове навчання" },
    paragraphs: {
      en: [
        "Self-directed study of Spine rigging workflow and shader authoring, mostly "
        + "by rebuilding effects I saw in shipped games and figuring out how they were "
        + "put together.",
        "Practical experience with version control and asset pipelines through "
        + "day-to-day work in studio repositories.",
      ],
      uk: [
        "Самостійне вивчення пайплайну ригінгу у Spine та написання шейдерів — переважно "
        + "шляхом відтворення ефектів із випущених ігор і розбору того, як вони зібрані.",
        "Практичний досвід роботи з системами контролю версій та асет-пайплайнами "
        + "у щоденній роботі в студійних репозиторіях.",
      ],
    },
  },
];

/** Скільки років наразі — рахується з тієї ж точки, що й CV. */
export const resumeNow = NOW;
