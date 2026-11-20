import { initChapterAtmosphere } from "./ui/chapter-atmosphere.js";
import { initGooeyUI } from "./ui/gooey-nav.js";
import { gsap } from "./motion/core.js";

initGooeyUI();
initChapterAtmosphere();

const roleContent = {
  worker: {
    eyebrow: "ДЛЯ ТЕХ, КТО ГОТОВ ВЫЙТИ НА СМЕНУ",
    title: "Работа рядом. Условия видны до отклика.",
    accent: "Выбирайте подходящие смены сами.",
    description: "Смотрите ленту заявок, сравнивайте ставку, длительность и адрес, откликайтесь и следите за своими заказами в приложении.",
    points: ["Находить заявки по задачам и месту", "Видеть ставку и длительность смены", "Общаться с диспетчером и вести свои заказы"],
    note: "Понятные условия и история работы в личном профиле",
    cta: "Найти заказы",
    visual: "worker"
  },
  dispatcher: {
    eyebrow: "ДЛЯ ТЕХ, КТО СОБИРАЕТ КОМАНДЫ",
    title: "Больше контроля над заказами. Меньше ручной координации.",
    accent: "Ведите работу в одном пространстве.",
    description: "Публикуйте заявки, обрабатывайте входящие запросы, подбирайте исполнителей и управляйте ходом заказа. Рабочие контакты и коммуникация остаются рядом.",
    points: ["Публиковать и обновлять заявки", "Работать с откликами и базой грузчиков", "Вести активные и завершённые заказы"],
    note: "Заявки, исполнители, сообщения и итог заказа связаны между собой",
    cta: "Работать в Gruzli",
    visual: "dispatcher"
  },
};

const roleTabs = Array.from(document.querySelectorAll(".role-tab"));
const roleVisual = document.querySelector("#role-visual");
const roleFields = {
  eyebrow: document.querySelector("#role-eyebrow"),
  title: document.querySelector("#role-title"),
  accent: document.querySelector("#role-accent"),
  description: document.querySelector("#role-description"),
  points: document.querySelector("#role-points"),
  note: document.querySelector("#role-note"),
  cta: document.querySelector("#role-cta")
};

const visualMarkup = {
  worker: '<div class="worker-showcase"><div class="showcase-phone"><span class="showcase-island"></span><img src="/images/gruzli-new-feed.webp" alt="Лента заказов для грузчика" loading="lazy"></div><div class="showcase-toast"><span>↗</span><div><b>Новая заявка</b><small>Условия до отклика</small></div><i></i></div><div class="showcase-rate"><b>900 ₽ / час</b><small>Пример ставки в карточке</small></div><div class="visual-caption">РАБОЧАЯ ЛЕНТА / 01</div></div>',
  dispatcher: '<div class="role-scenario dispatcher-scenario"><div class="scenario-top"><span>02 / DISPATCH DESK</span><b><i></i> РАБОЧЕЕ ПРОСТРАНСТВО</b></div><div class="scenario-title"><small>УПРАВЛЕНИЕ ЗАКАЗАМИ</small><strong>Заявки <em>и команда</em></strong><span>Единый обзор текущей работы</span></div><div class="dispatch-board"><div class="dispatch-board-head"><b>АКТИВНЫЕ ЭТАПЫ</b><span>01—03</span></div><div class="dispatch-row"><i class="dispatch-mark">01</i><span><b>Новая заявка</b><small>Проверить условия и детали</small></span><em>НОВАЯ</em></div><div class="dispatch-row"><i class="dispatch-mark">02</i><span><b>Подбор исполнителей</b><small>Отклики и состав команды</small></span><em class="is-warm">В РАБОТЕ</em></div><div class="dispatch-row"><i class="dispatch-mark">03</i><span><b>Выполнение заказа</b><small>Статус и коммуникация</small></span><em>КОНТРОЛЬ</em></div></div><div class="scenario-foot"><span>ЗАЯВКИ</span><i></i><span>ИСПОЛНИТЕЛИ</span><i></i><span>СТАТУСЫ</span></div><div class="scenario-orbit"></div></div>',
};

let roleSwitchTimeline;
function selectRole(role) {
  const item = roleContent[role];
  if (!item) return;
  roleTabs.forEach((tab) => {
    const active = tab.dataset.role === role;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.setAttribute("tabindex", active ? "0" : "-1");
  });

  const updateContent = () => {
    roleFields.eyebrow.textContent = item.eyebrow;
    roleFields.title.textContent = item.title;
    roleFields.accent.textContent = item.accent;
    roleFields.description.textContent = item.description;
    roleFields.note.textContent = item.note;
    roleFields.cta.innerHTML = item.cta + " <span>↗</span>";
    roleFields.points.replaceChildren(...item.points.map((text) => {
      const li = document.createElement("li");
      const icon = document.createElement("span");
      icon.textContent = "✓";
      li.append(icon, document.createTextNode(text));
      return li;
    }));
    roleVisual.classList.toggle("dispatcher-mode", role === "dispatcher");
    roleVisual.innerHTML = visualMarkup[item.visual];
  };

  const targets = [
    roleFields.eyebrow, roleFields.title, roleFields.accent,
    roleFields.description, roleFields.points, roleFields.note,
    roleFields.cta, roleVisual,
  ];
  roleSwitchTimeline?.kill();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    updateContent();
    gsap.set(targets, { autoAlpha: 1, y: 0, clearProps: "transform" });
    return;
  }

  roleSwitchTimeline = gsap.timeline();
  roleSwitchTimeline
    .to(targets, {
      autoAlpha: 0,
      y: 8,
      duration: 0.16,
      stagger: 0.014,
      ease: "power1.out",
      overwrite: "auto",
    })
    .add(updateContent)
    .fromTo(targets,
      { autoAlpha: 0, y: 9 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
        stagger: 0.024,
        ease: "power3.out",
        force3D: true,
        clearProps: "transform,opacity,visibility",
      },
      "-=0.02",
    );
}

roleTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectRole(tab.dataset.role));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % roleTabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + roleTabs.length) % roleTabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = roleTabs.length - 1;
    roleTabs[next].focus();
    selectRole(roleTabs[next].dataset.role);
  });
});

document.querySelectorAll(".faq-item > button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const shouldOpen = !item.classList.contains("is-open");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll(".faq-item").forEach((entry) => {
      const answer = entry.querySelector(".faq-answer p");
      const wasOpen = entry.classList.contains("is-open");
      entry.classList.remove("is-open");
      entry.querySelector("button").setAttribute("aria-expanded", "false");
      entry.querySelector("button i").textContent = "+";
      if (wasOpen && !reduce) {
        gsap.to(answer, { autoAlpha: 0, y: -4, duration: 0.12, ease: "power1.out", overwrite: true });
      } else if (reduce) {
        gsap.set(answer, { autoAlpha: 1, y: 0, clearProps: "transform" });
      }
    });

    if (shouldOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      button.querySelector("i").textContent = "−";
      const answer = item.querySelector(".faq-answer p");
      if (reduce) {
        gsap.set(answer, { autoAlpha: 1, y: 0, clearProps: "transform" });
      } else {
        gsap.fromTo(answer,
          { autoAlpha: 0, y: 7 },
          { autoAlpha: 1, y: 0, duration: 0.32, delay: 0.1, ease: "power3.out", clearProps: "transform,opacity,visibility" },
        );
      }
    }
  });
});

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  menuButton.setAttribute("aria-label", expanded ? "Открыть меню" : "Закрыть меню");
  nav.classList.toggle("is-open", !expanded);
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Открыть меню");
}));

document.querySelector("#year").textContent = String(new Date().getFullYear());

const header = document.querySelector(".site-header");
let scrollFrame = 0;
const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
  scrollFrame = 0;
};
window.addEventListener("scroll", () => {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateHeader);
}, { passive: true });
updateHeader();

document.querySelectorAll(".screen-card").forEach((card) => {
  const image = card.querySelector("img");
  if (!image) return;
  image.addEventListener("load", () => card.classList.add("is-loaded"), { once: true });
  if (image.complete) card.classList.add("is-loaded");
});

/* Scroll position, section context and image inspection. */
const progressRoot = document.createElement("div");
progressRoot.className = "scroll-progress";
progressRoot.setAttribute("aria-hidden", "true");
const progressFill = document.createElement("span");
progressRoot.append(progressFill);
document.body.prepend(progressRoot);

let progressFrame = 0;
const paintScrollProgress = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
  progressFill.style.width = (ratio * 100).toFixed(2) + "%";
  progressFrame = 0;
};
window.addEventListener("scroll", () => {
  if (!progressFrame) progressFrame = window.requestAnimationFrame(paintScrollProgress);
}, { passive: true });
window.addEventListener("resize", paintScrollProgress, { passive: true });
paintScrollProgress();

const sectionLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'))
  .filter((link) => document.querySelector(link.getAttribute("href")));
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        if (link.getAttribute("href") === "#" + entry.target.id) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-28% 0px -58% 0px", threshold: 0 });
  sectionLinks.forEach((link) => sectionObserver.observe(document.querySelector(link.getAttribute("href"))));
}

const lightbox = document.querySelector(".screen-lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
let lightboxTimeline;
const finishLightboxClose = () => {
  if (lightbox.open) lightbox.close();
  document.body.classList.remove("lightbox-open");
  lightboxImage.removeAttribute("src");
  gsap.set([lightbox, lightboxImage], { clearProps: "all" });
};
const closeLightbox = () => {
  if (!lightbox.open) return;
  lightboxTimeline?.kill();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finishLightboxClose();
    return;
  }
  lightboxTimeline = gsap.timeline({ onComplete: finishLightboxClose });
  lightboxTimeline
    .to(lightboxImage, { autoAlpha: 0, scale: 0.97, duration: 0.16, ease: "power2.in" })
    .to(lightbox, { autoAlpha: 0, duration: 0.16, ease: "power1.in" }, 0);
};
document.querySelectorAll(".screen-photo img").forEach((image) => {
  image.setAttribute("tabindex", "0");
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", "Увеличить: " + image.alt);
  const openImage = () => {
    lightboxTimeline?.kill();
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.alt;
    if (!lightbox.open) lightbox.showModal();
    document.body.classList.add("lightbox-open");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([lightbox, lightboxImage], { autoAlpha: 1, scale: 1, y: 0, clearProps: "transform" });
      return;
    }
    lightboxTimeline = gsap.timeline();
    lightboxTimeline
      .fromTo(lightbox,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.2, ease: "power2.out", overwrite: true },
      )
      .fromTo(lightboxImage,
        { autoAlpha: 0, scale: 0.96, y: 8 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.42, ease: "power3.out", force3D: true, clearProps: "transform,opacity,visibility" },
        "<",
      );
  };
  image.addEventListener("click", openImage);
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openImage();
    }
  });
});
lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeLightbox();
});
lightbox.addEventListener("close", () => document.body.classList.remove("lightbox-open"));

/* Signature Experience — deterministic local demo, no production data or network calls. */
(() => {
  const root = document.querySelector("#signature");
  if (!root) return;
  const stages = [
    {dispatcher:["Откройте входящую заявку.","Проверьте параметры, сроки и условия заказа перед началом подбора.","Открыть заявку","Диспетчер изучает заявку","Параметры собраны в рабочем пространстве."],worker:["Изучите условия смены.","Посмотрите задачу, адрес, ставку и длительность до отправки отклика.","Посмотреть заявку","Грузчик изучает условия","Можно принять решение об отклике."]},
    {dispatcher:["Соберите команду.","Сравните отклики, опыт и рейтинг исполнителей, затем сформируйте состав команды.","Обработать отклики","Диспетчер подбирает команду","Отклики и участники связаны с заявкой."],worker:["Отправьте отклик.","Откликнитесь на подходящую заявку и продолжите общение с диспетчером в чате.","Откликнуться","Грузчик отправил отклик","Отклик и дальнейшая коммуникация связаны с заказом."]},
    {dispatcher:["Контролируйте ход работы.","Следите за статусами исполнителей, общайтесь по заказу и при необходимости организуйте замену.","Открыть активный заказ","Заказ в работе","Диспетчер видит ход выполнения и состав команды."],worker:["Отмечайте этапы работы.","Подтвердите готовность, прибытие, начало и завершение смены.","Обновить статус","Грузчик обновляет статус","Рабочие этапы фиксируются в заказе."]},
    {dispatcher:["Зафиксируйте результат.","Проверьте завершение, внесите расходы и доход, оставьте отзыв и сохраните историю.","Закрыть заказ","Заказ завершён","Итог и история остаются в рабочем кабинете."],worker:["Сохраните историю смены.","Завершённые заказы, заработок и отзывы остаются в вашем профиле.","Посмотреть профиль","Работа завершена","В профиле отражается история заказов и оценок."]}
  ];
  const roles = {dispatcher:["DISPATCH VIEW / 01","Диспетчер"],worker:["WORKER VIEW / 02","Грузчик"]};
  const roleButtons = [...root.querySelectorAll("[data-signature-role]")];
  const title = root.querySelector("#signature-perspective-title");
  const copy = root.querySelector("#signature-perspective-copy");
  const roleLabel = root.querySelector("#signature-role-label");
  const stageLabel = root.querySelector("#signature-stage-label");
  const action = root.querySelector("#signature-action-text");
  const icon = root.querySelector("#signature-action-icon");
  const eventTitle = root.querySelector("#signature-stage-event b");
  const eventCopy = root.querySelector("#signature-stage-event p");
  const eventIndex = root.querySelector("#signature-stage-event .event-index");
  const fill = root.querySelector("#signature-progress-fill");
  const progressLabels = [...root.querySelectorAll("[data-progress-label]")];
  const nodes = {dispatcher:root.querySelector(".node-dispatcher"),worker:root.querySelector(".node-worker")};
  const next = root.querySelector("#signature-next"), prev = root.querySelector("#signature-prev");
  const count = root.querySelector("#signature-step-count");
  let role = "dispatcher", stage = 0;
  const perspective = root.querySelector(".signature-perspective");
  const stageEvent = root.querySelector("#signature-stage-event");
  let transition;
  gsap.set(fill, { scaleX: 0.25, transformOrigin: "left center" });

  const updateContent = () => {
    const data = stages[stage][role];
    title.textContent = data[0];
    copy.textContent = data[1];
    action.textContent = data[2];
    roleLabel.textContent = roles[role][0];
    stageLabel.textContent = "ЭТАП 0" + (stage + 1);
    icon.textContent = role === "dispatcher" ? "⌘" : "✓";
    eventTitle.textContent = data[3];
    eventCopy.textContent = data[4];
    eventIndex.textContent = "0" + (stage + 1);
    count.textContent = "0" + (stage + 1) + " / 04";
    progressLabels.forEach((el, i) => el.classList.toggle("is-current", i === stage));
    progressLabels.forEach((el, i) => el.classList.toggle("is-done", i < stage));
    Object.entries(nodes).forEach(([key, node]) => node.classList.toggle("is-active", key === role));
    prev.disabled = stage === 0;
    next.innerHTML = stage === 3 ? "Повторить сценарий <span>↻</span>" : "Следующий этап <span>→</span>";
  };

  const render = () => {
    transition?.kill();
    const progress = (stage + 1) * 0.25;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      updateContent();
      gsap.set([perspective, stageEvent], { autoAlpha: 1, y: 0, clearProps: "transform" });
      gsap.set(fill, { scaleX: progress });
      return;
    }

    transition = gsap.timeline();
    transition
      .to([perspective, stageEvent], {
        autoAlpha: 0,
        y: -7,
        duration: 0.14,
        stagger: 0.025,
        ease: "power1.out",
        overwrite: "auto",
      })
      .add(updateContent)
      .fromTo([perspective, stageEvent],
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.36,
          stagger: 0.04,
          ease: "power3.out",
          force3D: true,
          clearProps: "transform,opacity,visibility",
        },
        "-=0.02",
      );

    gsap.to(fill, {
      scaleX: progress,
      duration: 0.52,
      ease: "power3.out",
      overwrite: "auto",
    });
  };
  roleButtons.forEach(button=>button.addEventListener("click",()=>{
    role=button.dataset.signatureRole;
    roleButtons.forEach(b=>{const active=b===button;b.classList.toggle("is-active",active);b.setAttribute("aria-selected",String(active));});
    render();
  }));
  next.addEventListener("click",()=>{stage=stage===3?0:Math.min(3,stage+1);render();});
  prev.addEventListener("click",()=>{stage=Math.max(0,stage-1);render();});
  render();
})();


/* Role-based comparison: illustrative workflow contrast, not a performance claim. */
(() => {
  const root = document.querySelector("#contrast");
  if (!root) return;
  const content = {
    worker: {
      beforeTitle: "Поиск смены в потоке сообщений.",
      before: ["Просматривать несколько чатов и каналов", "Отдельно уточнять ставку, адрес и длительность", "Самостоятельно хранить историю договорённостей"],
      afterTitle: "Заявки собраны в рабочей ленте.",
      after: ["Смотреть карточки заявок и основные условия", "Откликаться на подходящую смену", "Возвращаться к своим заказам и их статусам"]
    },
    dispatcher: {
      beforeTitle: "Команда собирается вручную.",
      before: ["Публиковать одну заявку в разных местах", "Сводить отклики и контакты из переписок", "Отдельно отмечать, кто подтвердил выход и где находится"],
      afterTitle: "Работа ведётся вокруг заявки.",
      after: ["Публиковать заказ и работать с откликами", "Подбирать исполнителей через рабочий интерфейс", "Использовать статусы и историю заказа при координации"]
    },
  };
  const buttons = [...root.querySelectorAll("[data-compare-role]")];
  const beforeTitle = root.querySelector("#contrast-before-title");
  const beforeList = root.querySelector("#contrast-before-list");
  const afterTitle = root.querySelector("#contrast-after-title");
  const afterList = root.querySelector("#contrast-after-list");
  const renderList = (target, items) => {
    target.replaceChildren(...items.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }));
  };
  const select = (role, focus = false) => {
    const item = content[role];
    if (!item) return;
    buttons.forEach((button) => {
      const active = button.dataset.compareRole === role;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus();
    });
    beforeTitle.textContent = item.beforeTitle;
    afterTitle.textContent = item.afterTitle;
    renderList(beforeList, item.before);
    renderList(afterList, item.after);
  };
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => select(button.dataset.compareRole));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
      if (event.key === "ArrowLeft") next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      select(buttons[next].dataset.compareRole, true);
    });
  });
})();


/* GRUZLI SMART NAVIGATION — reading progress, section compass and command palette */
(() => {
  const sectionMeta = [
    ["platform","Платформа","Как устроен GRUZLI"],["about","История","Почему появилась платформа"],
    ["contrast","Сравнение","Чаты и единый процесс"],["roles","Две роли","Диспетчер · Грузчик"],
    ["workflow","Рабочий процесс","Как движется заказ"],["signature","Интерактивный сценарий","Пройдите путь заказа"],
    ["screens","Интерфейс","Экраны приложения"],["download","Приложение","iPhone · Android · ПК"],
    ["faq","Вопросы","Ответы о GRUZLI"]
  ];
  const sections=sectionMeta.map(([id,title,description])=>{const element=document.getElementById(id);return element?{id,element,title,description}:null;}).filter(Boolean);
  if(!sections.length)return;

  const progress=document.createElement("div");
  progress.className="gruzli-reading-progress";
  progress.setAttribute("aria-hidden","true");
  progress.innerHTML="<span></span>";
  document.body.append(progress);

  const compass=document.createElement("aside");
  compass.className="gruzli-compass";
  compass.setAttribute("aria-label","Навигация по странице");
  compass.innerHTML='<span class="gruzli-compass-index">01 <i>/ '+String(sections.length).padStart(2,"0")+'</i></span><span class="gruzli-compass-copy"><b>Платформа</b><small>Как устроен GRUZLI</small></span><button type="button" class="gruzli-compass-map" aria-label="Открыть карту разделов" title="Карта разделов · Ctrl K">⌘K</button><button type="button" class="gruzli-compass-up" aria-label="Предыдущий раздел" title="Предыдущий раздел">↑</button><button type="button" class="gruzli-compass-down" aria-label="Следующий раздел" title="Следующий раздел">↓</button>';
  document.body.append(compass);

  const overlay=document.createElement("div");
  overlay.className="gruzli-command-overlay";
  overlay.hidden=true;
  overlay.innerHTML='<section class="gruzli-command" role="dialog" aria-modal="true" aria-labelledby="gruzli-command-title"><div class="gruzli-command-head"><div><span>GRUZLI / НАВИГАЦИЯ</span><h2 id="gruzli-command-title">Куда перейдём?</h2></div><kbd>ESC</kbd></div><label class="gruzli-command-search"><span>⌕</span><input type="search" autocomplete="off" placeholder="Найти раздел или тему…" aria-label="Поиск по разделам"><kbd>↵</kbd></label><div class="gruzli-command-results" role="listbox" aria-label="Разделы сайта"></div><div class="gruzli-command-foot"><span><kbd>↑</kbd><kbd>↓</kbd> выбрать</span><span><kbd>ENTER</kbd> открыть</span><span>9 РАЗДЕЛОВ</span></div></section>';
  document.body.append(overlay);

  const progressFill=progress.firstElementChild;
  const indexLabel=compass.querySelector(".gruzli-compass-index");
  const titleLabel=compass.querySelector(".gruzli-compass-copy b");
  const descriptionLabel=compass.querySelector(".gruzli-compass-copy small");
  const upButton=compass.querySelector(".gruzli-compass-up");
  const downButton=compass.querySelector(".gruzli-compass-down");
  const mapButton=compass.querySelector(".gruzli-compass-map");
  const searchInput=overlay.querySelector("input");
  const results=overlay.querySelector(".gruzli-command-results");
  let activeIndex=0,selectedIndex=0,filtered=sections.slice(),scrollTick=false;

  const goTo=index=>{
    const safeIndex=Math.max(0,Math.min(sections.length-1,index));
    sections[safeIndex].element.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
    closePalette();
  };
  const setActive=index=>{
    activeIndex=Math.max(0,Math.min(sections.length-1,index));
    const section=sections[activeIndex];
    indexLabel.innerHTML=String(activeIndex+1).padStart(2,"0")+' <i>/ '+String(sections.length).padStart(2,"0")+'</i>';
    titleLabel.textContent=section.title;
    descriptionLabel.textContent=section.description;
    upButton.disabled=activeIndex===0;
    downButton.disabled=activeIndex===sections.length-1;
  };
  const updateScroll=()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    const ratio=max>0?Math.min(1,Math.max(0,window.scrollY/max)):0;
    progressFill.style.transform="scaleX("+ratio+")";
    scrollTick=false;
  };
  window.addEventListener("scroll",()=>{if(!scrollTick){window.requestAnimationFrame(updateScroll);scrollTick=true;}},{passive:true});
  updateScroll();

  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
      if(!visible.length)return;
      const index=sections.findIndex(section=>section.element===visible[0].target);
      if(index>=0)setActive(index);
    },{rootMargin:"-18% 0px -58% 0px",threshold:[0,.15,.35,.6]});
    sections.forEach(section=>observer.observe(section.element));
  }else{
    window.addEventListener("scroll",()=>{
      const index=sections.reduce((best,section,i)=>section.element.getBoundingClientRect().top<window.innerHeight*.45?i:best,0);
      setActive(index);
    },{passive:true});
  }
  setActive(0);

  const renderResults=()=>{
    const query=searchInput.value.trim().toLocaleLowerCase("ru");
    filtered=sections.filter(section=>(section.title+" "+section.description).toLocaleLowerCase("ru").includes(query));
    if(!filtered.length){results.innerHTML='<p class="gruzli-command-empty">Ничего не найдено. Попробуйте другое слово.</p>';selectedIndex=0;return;}
    selectedIndex=Math.min(selectedIndex,filtered.length-1);
    results.replaceChildren(...filtered.map((section,index)=>{
      const originalIndex=sections.indexOf(section),button=document.createElement("button");
      button.type="button";button.className="gruzli-command-item";button.setAttribute("role","option");button.setAttribute("aria-selected",String(index===selectedIndex));
      button.innerHTML='<span class="gruzli-command-number">'+String(originalIndex+1).padStart(2,"0")+'</span><span><b></b><small></small></span><i>↗</i>';
      button.querySelector("b").textContent=section.title;
      button.querySelector("small").textContent=section.description;
      button.addEventListener("click",()=>goTo(originalIndex));
      return button;
    }));
  };
  const paintSelection=()=>{
    [...results.querySelectorAll(".gruzli-command-item")].forEach((item,index)=>item.setAttribute("aria-selected",String(index===selectedIndex)));
    results.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"});
  };
  const openPalette=()=>{
    overlay.hidden=false;document.body.classList.add("gruzli-command-open");
    searchInput.value="";selectedIndex=0;renderResults();window.requestAnimationFrame(()=>searchInput.focus());
  };
  function closePalette(){
    if(overlay.hidden)return;
    overlay.hidden=true;document.body.classList.remove("gruzli-command-open");mapButton.focus();
  }
  mapButton.addEventListener("click",openPalette);
  upButton.addEventListener("click",()=>goTo(activeIndex-1));
  downButton.addEventListener("click",()=>goTo(activeIndex+1));
  searchInput.addEventListener("input",()=>{selectedIndex=0;renderResults();});
  searchInput.addEventListener("keydown",event=>{
    if(event.key==="ArrowDown"){event.preventDefault();selectedIndex=Math.min(filtered.length-1,selectedIndex+1);paintSelection();}
    if(event.key==="ArrowUp"){event.preventDefault();selectedIndex=Math.max(0,selectedIndex-1);paintSelection();}
    if(event.key==="Enter"&&filtered[selectedIndex])goTo(sections.indexOf(filtered[selectedIndex]));
  });
  overlay.addEventListener("click",event=>{if(event.target===overlay)closePalette();});
  document.addEventListener("keydown",event=>{
    const target=event.target,typing=target instanceof HTMLElement&&(target.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(target.tagName));
    if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();if(overlay.hidden)openPalette();else closePalette();}
    else if(event.key==="Escape"&&!overlay.hidden)closePalette();
    else if(!typing&&overlay.hidden&&event.altKey&&event.key==="ArrowDown"){event.preventDefault();goTo(activeIndex+1);}
    else if(!typing&&overlay.hidden&&event.altKey&&event.key==="ArrowUp"){event.preventDefault();goTo(activeIndex-1);}
  });
})();
