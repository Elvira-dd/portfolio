/* =========================================================
   НАСТРОЙКИ — всё, что нужно менять, находится здесь
   ========================================================= */

/* 1. Ссылки. Замени "#" на свои адреса. */
const LINKS = {
  cv:        "#",   // ссылка на CV (PDF в репозитории, например "cv.pdf", или Google Drive)
  telegram:  "#",   // например "https://t.me/username"
  email:     "#",   // например "mailto:name@example.com"
  behance:   "#",   // ссылка на Behance
  linkedin:  "#",   // ссылка на LinkedIn

  // кнопки «кейс →» — страницы или ссылки на подробные кейсы
  "case-process": "case-protsessy-komandy.html",
  "case-sites":   "case-sajty-dlya-zastrojshhikov.html",
  "case-ab":      "#",
  "case-myolimp": "#",
};

/* 2. Картинки. Положи файл в папку images/ с таким именем.
      Подойдёт любое расширение: .jpg, .jpeg, .png, .webp
      Пока файла нет, на его месте остаётся серый плейсхолдер. */
const IMAGES = {
  "hero":            "images/hero",            // фото на первом экране (горизонтальное, широкое)
  "case-process":    "images/case-process",    // обложка кейса «Процессы команды» (от 1100×930)
  "case-sites":      "images/case-sites",      // обложка «Сайты для застройщиков»
  "case-ab":         "images/case-ab",         // обложка «A/B-тесты и продукт»
  "case-myolimp":    "images/case-myolimp",    // обложка «MyOlimp: дизайн с нуля»
  "logo-idalite":    "images/logo-idalite",    // логотипы в «Опыте работы» (квадрат, от 180×180)
  "logo-xploration": "images/logo-xploration",
  "logo-myolimp":    "images/logo-myolimp",
  "logo-freelance":  "images/logo-freelance",
};
const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

/* 3. Навыки. case — id кейса, превью которого всплывает при наведении.
      Если превью не нужно, поставь case: null. */
const SKILLS = [
  { name: "Team Leadership",                case: "case-process" },
  { name: "Design Ops",                     case: "case-process" },
  { name: "Mentorship",                     case: "case-process" },
  { name: "Дизайн-ревью",                   case: "case-ab" },
  { name: "Cross-functional Collaboration", case: "case-ab" },
  { name: "Brand Identity & Strategy",      case: "case-sites" },
  { name: "Visual Design",                  case: "case-sites" },
  { name: "Web & App UI",                   case: "case-sites" },
  { name: "Design Systems",                 case: "case-myolimp" },
  { name: "UX-исследования",                case: null },
  { name: "A/B-тестирование",               case: "case-ab" },
  { name: "AI-ассистированный дизайн",      case: null },
  { name: "Figma",                          case: null },
  { name: "Adobe Creative Suite",           case: null },
  { name: "Frontend Development",           case: null },
  { name: "Tilda",                          case: null },
  { name: "Miro",                           case: null },
  { name: "Notion",                         case: null },
];

/* =========================================================
   Дальше — логика, трогать не нужно
   ========================================================= */

// --- ссылки
document.querySelectorAll("[data-link]").forEach((a) => {
  const url = LINKS[a.dataset.link];
  if (url && url !== "#") a.href = url;
});

// --- поиск картинки: перебираем расширения, пока какое-нибудь не загрузится
const imageCache = {};
function findImage(base) {
  if (!imageCache[base]) {
    imageCache[base] = new Promise((resolve) => {
      let i = 0;
      const tryNext = () => {
        if (i >= EXTENSIONS.length) return resolve(null);
        const src = `${base}.${EXTENSIONS[i++]}`;
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = tryNext;
        img.src = src;
      };
      tryNext();
    });
  }
  return imageCache[base];
}

function fillSlot(el, slot, alt) {
  const base = IMAGES[slot];
  if (!base) return;
  el.querySelectorAll("img, .media__hint").forEach((n) => n.remove());
  el.classList.remove("has-image");

  findImage(base).then((src) => {
    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt || "";
      img.loading = "lazy";
      el.appendChild(img);
      el.classList.add("has-image");
    } else if (el.offsetWidth >= 120) {
      // подсказка, какой файл положить (только в крупных плейсхолдерах)
      const hint = document.createElement("div");
      hint.className = "media__hint";
      hint.innerHTML = `${el.dataset.label || ""}<b>${base.split("/").pop()}.jpg / .png</b>`;
      el.appendChild(hint);
    }
  });
}

document.querySelectorAll("[data-slot]").forEach((el) => {
  fillSlot(el, el.dataset.slot, el.dataset.label);
});

// --- навыки
const skillsEl = document.getElementById("skills");
SKILLS.forEach((s, i) => {
  const span = document.createElement("span");
  span.className = "skill" + (s.case ? " skill--case" : "");
  span.textContent = s.name;
  if (s.case) {
    span.dataset.case = s.case;
    span.tabIndex = 0;
  }
  skillsEl.appendChild(span);
  if (i < SKILLS.length - 1) skillsEl.appendChild(document.createTextNode(", "));
});

// --- превью кейса при наведении на навык
const tip = document.getElementById("skill-tip");
const tipImg = document.getElementById("skill-tip-img");
const tipTitle = document.getElementById("skill-tip-title");

function showTip(span) {
  const caseId = span.dataset.case;
  const caseEl = document.getElementById(caseId);
  tipTitle.textContent = caseEl ? caseEl.querySelector(".case__title").textContent : "";
  fillSlot(tipImg, caseId, tipTitle.textContent);

  const r = span.getBoundingClientRect();
  const tipW = 306;
  let left = r.left + window.scrollX + r.width / 2 - tipW / 2;
  left = Math.max(16, Math.min(left, document.documentElement.clientWidth - tipW - 16));
  tip.style.left = `${left}px`;
  tip.style.top = `${r.bottom + window.scrollY + 8}px`;
  tip.classList.add("is-visible");
}
function hideTip() { tip.classList.remove("is-visible"); }

skillsEl.addEventListener("mouseover", (e) => {
  const s = e.target.closest(".skill--case");
  if (s) showTip(s);
});
skillsEl.addEventListener("mouseout", (e) => {
  if (e.target.closest(".skill--case")) hideTip();
});
skillsEl.addEventListener("focusin", (e) => {
  const s = e.target.closest(".skill--case");
  if (s) showTip(s);
});
skillsEl.addEventListener("focusout", hideTip);

// клик по навыку — прокрутка к кейсу
skillsEl.addEventListener("click", (e) => {
  const s = e.target.closest(".skill--case");
  if (!s) return;
  hideTip();
  document.getElementById(s.dataset.case)?.scrollIntoView({ behavior: "smooth", block: "start" });
});

// --- заголовок первого экрана растягивается ровно на всю ширину блока
const heroTitle = document.getElementById("hero-title");
function fitHeroTitle() {
  if (!heroTitle) return;
  const wrap = heroTitle.parentElement; // .hero-full__title-wrap — задаёт доступную ширину и отступы
  const cs = getComputedStyle(wrap);
  const available = wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  if (available <= 0) return;

  const probe = 100; // пробный размер в px, чтобы измерить пропорции текста
  heroTitle.style.fontSize = probe + "px";
  // меряем ширину самого текста, а не блока (иначе широкий блок «съедает» разницу)
  heroTitle.style.width = "max-content";
  const natural = heroTitle.getBoundingClientRect().width;
  heroTitle.style.width = "";
  if (!natural) return;

  const size = (available / natural) * probe;
  heroTitle.style.fontSize = size + "px";
}

let heroTitleResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(heroTitleResizeTimer);
  heroTitleResizeTimer = setTimeout(fitHeroTitle, 80);
});

fitHeroTitle();
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(fitHeroTitle);
}
window.addEventListener("load", fitHeroTitle);

// --- интро-анимация первого экрана: имя "допечатывается" цветом, потом открывается фото
(function runIntro() {
  const preloader = document.getElementById("preloader");
  const fill = document.getElementById("preloader-fill");
  const hero = document.getElementById("hero-full");
  if (!preloader || !hero) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let done = false;

  function finish() {
    if (done) return;
    done = true;
    preloader.remove();
    document.body.classList.remove("intro-locked");
    hero.classList.add("is-revealed");
  }

  if (reduced) { finish(); return; }

  document.body.classList.add("intro-locked");

  // 1) текст-прелоадер "закрашивается" слева направо
  requestAnimationFrame(() => {
    requestAnimationFrame(() => fill.classList.add("is-filled"));
  });

  // 2) прелоадер исчезает
  setTimeout(() => preloader.classList.add("is-hidden"), 1350);

  // 3) открывается первый экран: штора снизу вверх + фото проявляется
  setTimeout(() => {
    document.body.classList.remove("intro-locked");
    hero.classList.add("is-revealed");
  }, 1650);

  // 4) прелоадер убирается из DOM
  setTimeout(() => preloader.remove(), 2150);

  // страховка на случай ошибки — анимация точно не заблокирует сайт
  setTimeout(finish, 4000);
})();

// --- появление элементов при прокрутке: снизу вверх
(function initReveal() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STEP = 80; // задержка между элементами, которые появляются вместе, мс

  // что анимируем (первый экран не трогаем — у него своя интро-анимация)
  const SELECTORS = [
    "main .label",
    ".case__title", ".case__desc", ".stat", ".case__foot", ".case__media",
    ".job", ".skills", ".edu",
    ".contacts__text", ".contacts__btns",
    ".footer > *",
  ];
  const items = document.querySelectorAll(SELECTORS.join(","));
  const aboutTexts = document.querySelectorAll(".about__text");

  if (reduced || !("IntersectionObserver" in window)) return;

  items.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
    visible.forEach((e, i) => {
      const el = e.target;
      io.unobserve(el);
      if (el.classList.contains("about__text")) return showAbout(el, i);
      el.style.transitionDelay = `${i * STEP}ms`;
      el.classList.add("is-in");
      el.addEventListener("transitionend", () => (el.style.transitionDelay = ""), { once: true });
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });

  items.forEach((el) => io.observe(el));

  // у самого низа страницы показываем всё, что ещё не появилось (например, футер)
  function revealRest() {
    if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 4) return;
    document.querySelectorAll(".reveal:not(.is-in)").forEach((el, i) => {
      io.unobserve(el);
      el.style.transitionDelay = `${i * STEP}ms`;
      el.classList.add("is-in");
    });
  }
  window.addEventListener("scroll", revealRest, { passive: true });

  // ----- «Кратко»: разбиваем текст на строки
  const originals = new Map();
  aboutTexts.forEach((p) => originals.set(p, p.innerHTML));

  function splitLines(p) {
    p.innerHTML = originals.get(p);
    // каждое слово — в свой span с тем же цветом, что и у родителя;
    // слова через дефис режем после дефиса, чтобы перенос остался как в обычном тексте
    const pieces = []; // { el, space } — space: был ли пробел перед кусочком
    p.querySelectorAll("span").forEach((part) => {
      const cls = part.className;
      part.textContent.trim().split(/\s+/).forEach((word) => {
        word.split(/(?<=-)(?=.)/).forEach((chunk, i) => {
          const el = document.createElement("span");
          el.className = cls;
          el.textContent = chunk;
          pieces.push({ el, space: i === 0 });
        });
      });
    });
    const build = (target, list) => {
      list.forEach((pc, i) => {
        if (i > 0 && pc.space) target.appendChild(document.createTextNode(" "));
        target.appendChild(pc.el);
      });
    };
    // 1) раскладываем кусочки в абзац, чтобы браузер сам расставил переносы
    p.innerHTML = "";
    build(p, pieces);
    // 2) группируем по вертикальной позиции
    const lines = [];
    let top = null;
    pieces.forEach((pc) => {
      const t = pc.el.offsetTop;
      if (top === null || Math.abs(t - top) > 2) { lines.push([]); top = t; }
      lines[lines.length - 1].push(pc);
    });
    // 3) каждая строка — отдельный блок с маской
    p.innerHTML = "";
    lines.forEach((list, li) => {
      const line = document.createElement("span");
      line.className = "about__line";
      const inner = document.createElement("span");
      inner.className = "about__line-in";
      build(inner, list);
      line.appendChild(inner);
      p.appendChild(line);
      // пробел между строками — чтобы текст корректно копировался
      if (li < lines.length - 1 && lines[li + 1][0].space) p.appendChild(document.createTextNode(" "));
    });
    p.classList.add("is-split");
  }

  function showAbout(p, order) {
    const base = order * STEP;
    p.querySelectorAll(".about__line-in").forEach((l, i) => {
      l.style.transitionDelay = `${base + i * 110}ms`;
    });
    p.classList.add("is-in");
  }

  function splitAll() { aboutTexts.forEach(splitLines); }

  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => {
    splitAll();
    aboutTexts.forEach((p) => io.observe(p));
  });

  // при смене ширины строки пересобираются заново (уже показанный текст остаётся видимым)
  let w = window.innerWidth, timer;
  window.addEventListener("resize", () => {
    if (window.innerWidth === w) return;
    w = window.innerWidth;
    clearTimeout(timer);
    timer = setTimeout(() => {
      aboutTexts.forEach((p) => {
        const shown = p.classList.contains("is-in");
        splitLines(p);
        if (shown) p.querySelectorAll(".about__line-in").forEach((l) => (l.style.transitionDelay = "0ms"));
      });
    }, 150);
  });
})();
