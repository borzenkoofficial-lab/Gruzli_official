/* GRUZLI / controlled scroll choreography */
(() => {
 const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const hero=document.querySelector(".hero");
 const heroInner=document.querySelector(".hero-inner");
 const heroVisual=document.querySelector(".hero-visual");
 const scenes=[...document.querySelectorAll("main > section")];
 if(reduce){scenes.forEach(section=>section.classList.add("motion-scene-active"));return;}
 if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add("motion-scene-active");
    observer.unobserve(entry.target);
   });
  },{threshold:.18,rootMargin:"0px 0px -10% 0px"});
  scenes.forEach(section=>observer.observe(section));
 }
 let frame=0;
 const update=()=>{
  frame=0;
  if(!hero)return;
  const height=Math.max(1,hero.offsetHeight);
  const progress=Math.min(1,Math.max(0,window.scrollY/height));
  document.documentElement.style.setProperty("--gruzli-scroll-progress",progress.toFixed(4));
  if(heroInner){
   heroInner.style.opacity=String(Math.max(.18,1-progress*1.15));
   heroInner.style.transform="translate3d(0,"+(progress*-34)+"px,0)";
  }
  if(heroVisual){
   heroVisual.style.transform="translate3d(0,"+(progress*42)+"px,0) scale("+(1-progress*.045)+")";
   heroVisual.style.filter="blur("+(progress*3.5)+"px)";
  }
 };
 const onScroll=()=>{if(!frame)frame=window.requestAnimationFrame(update);};
 window.addEventListener("scroll",onScroll,{passive:true});
 window.addEventListener("resize",onScroll,{passive:true});
 update();
})();
