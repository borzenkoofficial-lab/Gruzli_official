const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initChapterAtmosphere() {
  if (reduceMotion) return () => {};
  const chapters = [...document.querySelectorAll(".cinematic-chapter")];
  if (!chapters.length || !("IntersectionObserver" in window)) return () => {};

  chapters.forEach((chapter, chapterIndex) => {
    if (chapter.querySelector(".chapter-sparkfield")) return;
    const field = document.createElement("div");
    field.className = "chapter-sparkfield";
    field.setAttribute("aria-hidden", "true");
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 12; i += 1) {
      const spark = document.createElement("i");
      spark.className = "chapter-spark";
      spark.style.setProperty("--sx", `${(i * 29 + chapterIndex * 13) % 100}%`);
      spark.style.setProperty("--sy", `${(i * 47 + 17) % 100}%`);
      spark.style.setProperty("--sd", `${(i % 6) * -0.31}s`);
      spark.style.setProperty("--ss", `${1 + (i % 3)}px`);
      fragment.appendChild(spark);
    }
    field.appendChild(fragment);
    chapter.prepend(field);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("chapter-is-active", entry.isIntersecting);
    });
  }, { rootMargin: "8% 0px 8% 0px", threshold: 0.08 });
  chapters.forEach((chapter) => observer.observe(chapter));
  return () => observer.disconnect();
}
