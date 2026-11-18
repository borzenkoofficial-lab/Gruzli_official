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
  dispatcher: '<div class="role-abstract"><span class="role-abstract-index">02 / COORDINATION</span><div class="role-abstract-mark">G<span>·</span></div><b>Заявка → Команда → Выполнение</b><small>Единый процесс координации заказов</small></div>',
  client: '<div class="role-abstract"><span class="role-abstract-index">03 / REQUEST</span><div class="role-abstract-mark">G<span>·</span></div><b>Опишите задачу</b><small>Gruzli помогает связать запрос с исполнителями</small></div>'
};

function selectRole(role) {
  const item = roleContent[role];
  if (!item) return;
  roleTabs.forEach((tab) => {
    const active = tab.dataset.role === role;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.setAttribute("tabindex", active ? "0" : "-1");
  });
  rolePanel.classList.add("is-switching");
  window.setTimeout(() => {
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
