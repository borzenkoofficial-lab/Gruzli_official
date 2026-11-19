const deviceData={
 ios:{
  eyebrow:"IPHONE / PWA",
  title:"Добавьте Gruzli<br>на экран iPhone.",
  intro:"На iPhone Gruzli работает как веб-приложение. Устанавливать его из App Store не нужно.",
  steps:[
   ["Откройте Safari","Перейдите на сайт Gruzli по кнопке ниже.","Откройте Gruzli в Safari","Нажмите кнопку «Открыть Gruzli в Safari» слева."],
   ["Нажмите «Поделиться»","Значок квадрата со стрелкой вверх в Safari.","Найдите кнопку «Поделиться»","Она находится в нижней панели Safari."],
   ["Выберите «На экран Домой»","Если пункта нет, прокрутите список действий вниз.","Добавьте на экран Домой","В меню действий найдите пункт «На экран Домой»."],
   ["Нажмите «Добавить»","Иконка Gruzli появится среди приложений.","Готово — Gruzli на экране","Открывайте Gruzli как обычное приложение с иконки."]
  ],
  disclaimer:"Gruzli на iPhone — это PWA: веб-приложение, которое открывается с отдельной иконки и работает через интернет. Это не приложение из App Store.",
  action:'<a class="primary-button" href="https://gruzli-b99e57fd.vercel.app/" target="_blank" rel="noreferrer">Открыть Gruzli в Safari <span>↗</span></a><span class="action-note">Важно: для установки используйте Safari, не встроенный браузер мессенджера.</span>',
  image:"/images/gruzli-new-feed.webp",alt:"Реальный экран ленты заявок Gruzli"
 },
 android:{
  eyebrow:"ANDROID / WEB",
  title:"Откройте Gruzli<br>на Android.",
  intro:"Проверенный Android APK ещё не опубликован. Сейчас можно открыть веб-версию Gruzli в браузере телефона.",
  steps:[
   ["Откройте браузер","Используйте Chrome или другой актуальный браузер Android.","Перейдите на Gruzli","Откройте веб-версию по кнопке ниже."],
   ["Войдите в аккаунт","Используйте свои данные для входа в Gruzli.","Авторизуйтесь","После входа откроется интерфейс вашей роли."],
   ["Добавьте ярлык при желании","В меню браузера найдите пункт установки или добавления на главный экран, если он доступен.","Добавьте на главный экран","Название пункта зависит от браузера и версии Android."],
   ["Начните работу","Откройте ленту или рабочий кабинет.","Готово — Gruzli открыт","Отдельный APK для этого способа не требуется."]
  ],
  disclaimer:"Проверенный APK в репозитории и GitHub Releases не опубликован. Не устанавливайте файлы из сторонних источников. Используйте веб-версию Gruzli.",
  action:'<a class="primary-button" href="https://gruzli-b99e57fd.vercel.app/" target="_blank" rel="noreferrer">Открыть веб-версию <span>↗</span></a><span class="action-note">Ярлык на главный экран можно добавить средствами браузера, если эта функция доступна.</span>',
  image:"/images/gruzli-new-profile.webp",alt:"Профиль исполнителя в Gruzli"
 },
 desktop:{
  eyebrow:"WINDOWS / MACOS / WEB",
  title:"Работайте в Gruzli<br>на большом экране.",
  intro:"Отдельную программу устанавливать не нужно. Откройте веб-версию в браузере компьютера и войдите в свой аккаунт.",
  steps:[
   ["Откройте браузер","Подойдут актуальные версии Chrome, Edge, Safari или Firefox.","Перейдите на Gruzli","Нажмите кнопку «Открыть веб-версию» ниже."],
   ["Войдите в аккаунт","Используйте свои данные для входа в Gruzli.","Авторизуйтесь","После входа откроется ваше рабочее пространство."],
   ["Выберите раздел","Переходите между заказами, сообщениями и картотекой.","Откройте нужный раздел","Основные разделы расположены в боковом меню."],
   ["Работайте в одном окне","Список заказов и детали удобно смотреть на большом экране.","Готово — можно работать","Добавьте страницу в закладки браузера для быстрого доступа."]
  ],
  disclaimer:"Это веб-версия приложения, а не отдельная Windows-программа. Интерфейс автоматически адаптируется к экрану компьютера.",
  action:'<a class="primary-button" href="https://gruzli-b99e57fd.vercel.app/" target="_blank" rel="noreferrer">Открыть веб-версию <span>↗</span></a><span class="action-note">Можно добавить страницу в закладки браузера.</span>',
  image:"/images/gruzli-new-feed.webp",alt:"Экран приложения Gruzli"
 }
};
const tabs=[...document.querySelectorAll(".device-tab")];
const dots=[...document.querySelectorAll(".step-dots button")];
const fields={overlay:document.querySelector("#phone-guide-overlay"),eyebrow:document.querySelector("#panel-eyebrow"),title:document.querySelector("#panel-title"),intro:document.querySelector("#panel-intro"),steps:document.querySelector("#step-list"),actions:document.querySelector("#guide-actions"),disclaimer:document.querySelector("#guide-disclaimer"),image:document.querySelector("#phone-screen-image"),callout:document.querySelector("#instruction-callout"),visualLabel:document.querySelector("#visual-label"),phone:document.querySelector("#phone-mockup"),desktop:document.querySelector("#desktop-mockup"),prev:document.querySelector("#prev-step"),next:document.querySelector("#next-step"),dots:document.querySelector("#step-dots")};
let currentDevice="ios",currentStep=0;
function renderStep(){
 const data=deviceData[currentDevice],step=data.steps[currentStep];
 const overlays={
  1:'<div class="phone-guide-sheet"><h4>Поделиться</h4><div class="share-apps"><span>AirDrop</span><span>Сообщения</span><span>Почта</span></div><p>Копировать</p><p>Добавить в закладки</p><p class="active">На экран Домой <small>Добавить Gruzli на главный экран</small></p><p>Найти на странице</p></div>',
  2:'<div class="phone-guide-sheet"><h4>Добавить на экран «Домой»</h4><div class="home-icon">G</div><p><b>Gruzli</b><small>gruzli-b99e57fd.vercel.app</small></p><p class="active">Добавить <small>Иконка появится на экране iPhone</small></p></div>',
  3:'<div class="phone-guide-sheet"><h4>Готово!</h4><div class="home-icon">G</div><p class="active">Gruzli добавлен на экран Домой<small>Найдите иконку на главном экране телефона</small></p></div>'
 };
 if(currentDevice==="ios"&&currentStep>0){fields.overlay.innerHTML=overlays[currentStep];fields.overlay.hidden=false;document.querySelector(".share-control")?.classList.toggle("is-highlighted",currentStep===1)}else{fields.overlay.hidden=true;fields.overlay.innerHTML="";document.querySelector(".share-control")?.classList.remove("is-highlighted")}
 fields.visualLabel.textContent="ШАГ "+String(currentStep+1).padStart(2,"0")+" / 04";
 fields.callout.querySelector("b").textContent=step[2];
 fields.callout.querySelector("p").textContent=step[3];
 fields.steps.querySelectorAll(".guide-step").forEach((button,index)=>{button.classList.toggle("is-active",index===currentStep);button.querySelector(".step-number").textContent=index+1;button.setAttribute("aria-current",index===currentStep?"step":"false")});
 dots.forEach((dot,index)=>dot.classList.toggle("is-active",index===currentStep));
 fields.prev.disabled=currentStep===0;fields.next.disabled=currentStep===3;
}
function selectDevice(device){
 if(!deviceData[device])return;
 currentDevice=device;currentStep=0;
 const data=deviceData[device];
 tabs.forEach(tab=>{const active=tab.dataset.device===device;tab.classList.toggle("is-active",active);tab.setAttribute("aria-selected",String(active));tab.tabIndex=active?0:-1});
 fields.eyebrow.textContent=data.eyebrow;
 fields.title.innerHTML=data.title;
 fields.intro.textContent=data.intro;
 fields.disclaimer.textContent=data.disclaimer;
 fields.actions.innerHTML=data.action;
 fields.image.src=data.image;fields.image.alt=data.alt;
 const desktop=device==="desktop";
 fields.phone.hidden=desktop;fields.desktop.hidden=!desktop;
 fields.callout.hidden=desktop;
 fields.dots.hidden=desktop;
 fields.prev.hidden=desktop;fields.next.hidden=desktop;
 fields.visualLabel.textContent=desktop?"WEB / DESKTOP":"ШАГ 01 / 04";
 fields.steps.replaceChildren(...data.steps.map((step,index)=>{
  const button=document.createElement("button");button.type="button";button.className="guide-step"+(index===0?" is-active":"");button.dataset.step=index;
  const num=document.createElement("span");num.className="step-number";num.textContent=index+1;
  const copy=document.createElement("span");const title=document.createElement("b");title.textContent=step[0];const desc=document.createElement("small");desc.textContent=step[1];copy.append(title,desc);
  const arrow=document.createElement("i");arrow.textContent=index===3?"✓":"↗";button.append(num,copy,arrow);button.addEventListener("click",()=>{currentStep=index;renderStep()});return button;
 }));
 renderStep();
 document.querySelector("#device-panel").focus({preventScroll:true});
}
tabs.forEach((tab,index)=>{tab.addEventListener("click",()=>selectDevice(tab.dataset.device));tab.addEventListener("keydown",event=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();let next=index;if(event.key==="ArrowRight")next=(index+1)%tabs.length;if(event.key==="ArrowLeft")next=(index-1+tabs.length)%tabs.length;if(event.key==="Home")next=0;if(event.key==="End")next=tabs.length-1;tabs[next].focus();selectDevice(tabs[next].dataset.device)})});
fields.prev.addEventListener("click",()=>{currentStep=Math.max(0,currentStep-1);renderStep()});
fields.next.addEventListener("click",()=>{currentStep=Math.min(3,currentStep+1);renderStep()});
dots.forEach((dot,index)=>dot.addEventListener("click",()=>{currentStep=index;renderStep()}));
document.querySelectorAll(".guide-step").forEach(button=>button.addEventListener("click",()=>{currentStep=Number(button.dataset.step);renderStep()}));
document.querySelectorAll(".header-nav a[href^='#']").forEach(link=>link.addEventListener("click",()=>document.querySelector(link.getAttribute("href"))?.scrollIntoView({behavior:"smooth"})));
document.querySelectorAll(".guide-step").forEach(button=>button.addEventListener("click",()=>{currentStep=Number(button.dataset.step);renderStep()}));
