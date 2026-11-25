// Interações leves da página inicial.
// O script de autenticação do Supabase pode continuar separado na página de login.
const menuButton = document.querySelector(".menu-toggle");
const headerMenu = document.querySelector(".header-nav");
const headerRight = document.querySelector(".header-right");

if (menuButton && headerMenu) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
    headerMenu.classList.remove("is-open");
  };

  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    menuButton.setAttribute("aria-label", expanded ? "Abrir menu" : "Fechar menu");
    headerMenu.classList.toggle("is-open", !expanded);
  });

  headerMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!headerRight || !headerRight.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}
