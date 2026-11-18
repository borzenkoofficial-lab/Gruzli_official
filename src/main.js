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
    description: "Публикуйте заявки, отвечайте клиентам, подбирайте исполнителей и управляйте ходом заказа. Рабочие контакты и коммуникация остаются рядом.",
    points: ["Публиковать и обновлять заявки", "Работать с откликами и базой грузчиков", "Вести активные и завершённые заказы"],
    note: "Заявки, исполнители, сообщения и итог заказа связаны между собой",
    cta: "Работать в Gruzli",
    visual: "dispatcher"
  },
  client: {
    eyebrow: "ДЛЯ ТЕХ, КОМУ НУЖНА КОМАНДА",
    title: "Задача начинается с вас. Команда находится в Gruzli.",
    accent: "Без долгих поисков и десятков звонков.",
    description: "Опишите работу, укажите адрес и нужное количество грузчиков. Диспетчеры смогут предложить условия и собрать людей под ваш заказ.",
    points: ["Создать заявку с деталями работы", "Получить предложения диспетчеров", "Выбрать подходящий вариант и следить за статусом"],
    note: "От запроса до согласованной команды — в одном процессе",
    cta: "Создать заявку",
    visual: "client"
  }
};

const roleTabs = Array.from(document.querySelectorAll(".role-tab"));
const rolePanel = document.querySelector(".role-panel");
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
  client: '<div class="role-scenario client-scenario"><div class="scenario-top"><span>03 / CLIENT REQUEST</span><b><i></i> СОЗДАНИЕ ЗАЯВКИ</b></div><div class="client-request-card"><div class="client-request-head"><span>НОВЫЙ ЗАПРОС</span><b>G<span>·</span></b></div><strong>Какая помощь<br>вам нужна?</strong><p>Опишите задачу — диспетчеры смогут предложить условия и команду.</p><div class="request-field"><small>ТИП РАБОТЫ</small><b>Погрузка / разгрузка</b><span>⌄</span></div><div class="request-fields"><div class="request-field"><small>АДРЕС</small><b>Укажите локацию</b></div><div class="request-field"><small>ЛЮДИ</small><b>Количество</b></div></div><div class="request-submit">Продолжить <span>↗</span></div><div class="request-note">СХЕМА СЦЕНАРИЯ · НЕ СКРИНШОТ ПРИЛОЖЕНИЯ</div></div><div class="scenario-orbit"></div></div>'
};

let roleSwitchTimer = 0;
function selectRole(role) {
  const item = roleContent[role];
  if (!item) return;
  roleTabs.forEach((tab) => {
    const active = tab.dataset.role === role;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.setAttribute("tabindex", active ? "0" : "-1");
  });
  window.clearTimeout(roleSwitchTimer);
  rolePanel.classList.add("is-switching");
  roleSwitchTimer = window.setTimeout(() => {
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
    roleVisual.classList.toggle("client-mode", role === "client");
    roleVisual.innerHTML = visualMarkup[item.visual];
    rolePanel.classList.remove("is-switching");
  }, 150);
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
    document.querySelectorAll(".faq-item").forEach((entry) => {
      entry.classList.remove("is-open");
      entry.querySelector("button").setAttribute("aria-expanded", "false");
      entry.querySelector("button i").textContent = "+";
    });
    if (shouldOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      button.querySelector("i").textContent = "−";
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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");
if (!reducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

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

const heroVisual = document.querySelector(".hero-visual");
if (!reducedMotion && window.matchMedia("(pointer:fine)").matches) {
  heroVisual.addEventListener("pointermove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
    heroVisual.style.setProperty("--pointer-x", x.toFixed(3));
    heroVisual.style.setProperty("--pointer-y", y.toFixed(3));
  }, { passive: true });
  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.setProperty("--pointer-x", "0");
    heroVisual.style.setProperty("--pointer-y", "0");
  }, { passive: true });
}

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

const workflowCards = Array.from(document.querySelectorAll(".workflow-card"));
if (!reducedMotion && "IntersectionObserver" in window) {
  const workflowObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-in-view");
      else entry.target.classList.remove("is-in-view");
    });
  }, { threshold: .58 });
  workflowCards.forEach((card) => workflowObserver.observe(card));
} else {
  workflowCards.forEach((card) => card.classList.add("is-in-view"));
}

if (!reducedMotion && window.matchMedia("(pointer:fine)").matches) {
  document.querySelectorAll(".workflow-card,.feature-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--card-x", (event.clientX - rect.left) + "px");
      card.style.setProperty("--card-y", (event.clientY - rect.top) + "px");
    }, { passive: true });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--card-x", "50%");
      card.style.setProperty("--card-y", "50%");
    }, { passive: true });
  });
}

const lightbox = document.querySelector(".screen-lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const closeLightbox = () => {
  if (lightbox.open) lightbox.close();
  document.body.classList.remove("lightbox-open");
  lightboxImage.removeAttribute("src");
};
document.querySelectorAll(".screen-photo img").forEach((image) => {
  image.setAttribute("tabindex", "0");
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", "Увеличить: " + image.alt);
  const openImage = () => {
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.alt;
    if (!lightbox.open) lightbox.showModal();
    document.body.classList.add("lightbox-open");
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
lightbox.addEventListener("close", () => document.body.classList.remove("lightbox-open"));
