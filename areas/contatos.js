// Troca simples entre as duas imagens do cartão pessoal.
(() => {
  const button = document.querySelector(".ct-flip");
  const images = Array.from(document.querySelectorAll(".ct-card-image"));
  if (!button || images.length < 2) return;

  let current = 0;

  button.addEventListener("click", () => {
    current = current === 0 ? 1 : 0;

    images.forEach((image, index) => {
      image.hidden = index !== current;
    });

    button.textContent = current === 0 ? "Ver o outro lado →" : "← Voltar à primeira imagem";
    button.setAttribute("aria-pressed", String(current === 1));
  });
})();
