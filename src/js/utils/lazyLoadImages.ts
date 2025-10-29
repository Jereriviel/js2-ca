export function initLazyLoadImages() {
  console.log("initLazyLoadImages called");
  const lazyImages = document.querySelectorAll<HTMLImageElement>(".lazy-load");
  console.log(`Found ${lazyImages.length} lazy images`);

  if (lazyImages.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px 200px 0px",
    threshold: 0,
  };

  const onIntersection: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const realSrc = img.dataset.src;

        if (realSrc) {
          img.src = realSrc;
          img.removeAttribute("data-src");
        }
        img.classList.remove("lazy-load");
        observer.unobserve(img);
      }
    });
  };

  const observer = new IntersectionObserver(onIntersection, observerOptions);

  lazyImages.forEach((img) => observer.observe(img));
}
