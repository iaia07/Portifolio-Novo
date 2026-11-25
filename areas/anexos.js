// Carrossel da página "Anexos": troca a imagem e o texto da legenda juntos.
(() => {
  const gallery = document.querySelector(".ax-gallery");
  if (!gallery) return;

  const track = gallery.querySelector(".ax-track");
  const slides = Array.from(gallery.querySelectorAll(".ax-slide"));
  const caption = gallery.querySelector(".ax-caption");
  const counter = gallery.querySelector(".ax-counter");
  const captionTitle = gallery.querySelector(".ax-caption-title");
  const captionText = gallery.querySelector(".ax-caption-text");
  const dotsBox = gallery.querySelector(".ax-dots");
  const thumbsBox = gallery.querySelector(".ax-thumbs");
  const prevButton = gallery.querySelector(".ax-prev");
  const nextButton = gallery.querySelector(".ax-next");

  if (!track || !slides.length || !caption || !counter || !captionTitle || !captionText) return;

  const total = slides.length;
  let index = 0;

  if (total === 1) gallery.classList.add("is-single");

  slides.forEach((slide, i) => {
    slide.setAttribute("aria-label", `${i + 1} de ${total}`);
    slide.setAttribute("aria-hidden", String(i !== 0));
  });

  const dots = slides.map((_, i) => {
    if (!dotsBox) return null;
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "ax-dot";
    dot.setAttribute("aria-label", `Ver foto ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsBox.appendChild(dot);
    return dot;
  });

  const thumbs = slides.map((slide, i) => {
    if (!thumbsBox) return null;
    const image = slide.querySelector("img");
    if (!image) return null;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "ax-thumb";
    button.setAttribute("aria-label", `Ver foto ${i + 1}`);

    const preview = document.createElement("img");
    preview.src = image.getAttribute("src");
    preview.alt = "";
    button.appendChild(preview);
    button.addEventListener("click", () => goTo(i));
    thumbsBox.appendChild(button);
    return button;
  });

  function goTo(nextIndex, animate = true) {
    index = (nextIndex + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
      slide.setAttribute("aria-hidden", String(i !== index));
    });

    dots.forEach((dot, i) => dot?.classList.toggle("is-active", i === index));
    thumbs.forEach((thumb, i) => thumb?.classList.toggle("is-active", i === index));

    const slide = slides[index];
    counter.textContent = `ANEXO ${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    captionTitle.textContent = slide.dataset.title || "";
    captionText.textContent = slide.dataset.text || "";

    if (animate) {
      caption.classList.remove("is-changing");
      void caption.offsetWidth; // reinicia a animação da legenda
      caption.classList.add("is-changing");
    }
  }

  prevButton?.addEventListener("click", () => goTo(index - 1));
  nextButton?.addEventListener("click", () => goTo(index + 1));

  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  });

  let startX = null;
  gallery.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    startX = event.clientX;
  });
  gallery.addEventListener("pointerup", (event) => {
    if (startX === null) return;
    const distance = event.clientX - startX;
    startX = null;
    if (Math.abs(distance) > 60) goTo(index + (distance < 0 ? 1 : -1));
  });
  gallery.addEventListener("pointercancel", () => { startX = null; });

  goTo(0, false);
})();
