// Galeria das áreas de conhecimento: abre a atividade ampliada em um painel.
// Funciona para as miniaturas (.at-card) e para a atividade escolhida.
(function () {
  const triggers = Array.from(document.querySelectorAll('[data-atividade]'));
  if (!triggers.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'at-modal';
  dialog.setAttribute('aria-label', 'Atividade ampliada');
  dialog.innerHTML = `
    <div class="at-modal-inner">
      <button class="at-modal-close" type="button" aria-label="Fechar atividade ampliada">×</button>
      <div class="at-modal-top">
        <span class="at-modal-label"></span>
        <span class="at-modal-counter"></span>
      </div>
      <div class="at-modal-stage">
        <img class="at-modal-img" alt="">
      </div>
      <div class="at-modal-caption">
        <h2></h2>
        <p></p>
      </div>
      <button class="at-modal-nav at-modal-prev" type="button" aria-label="Atividade anterior">‹</button>
      <button class="at-modal-nav at-modal-next" type="button" aria-label="Próxima atividade">›</button>
    </div>
  `;
  document.body.appendChild(dialog);

  const label = dialog.querySelector('.at-modal-label');
  const counter = dialog.querySelector('.at-modal-counter');
  const image = dialog.querySelector('.at-modal-img');
  const title = dialog.querySelector('.at-modal-caption h2');
  const text = dialog.querySelector('.at-modal-caption p');
  const close = dialog.querySelector('.at-modal-close');
  const prev = dialog.querySelector('.at-modal-prev');
  const next = dialog.querySelector('.at-modal-next');

  let current = 0;

  function render(index) {
    current = (index + triggers.length) % triggers.length;
    const trigger = triggers[current];
    const thumb = trigger.querySelector('img');

    image.src = trigger.dataset.full || (thumb && thumb.src) || '';
    image.alt = trigger.dataset.alt || (thumb && thumb.alt) || 'Atividade ampliada';
    label.textContent = trigger.dataset.eixo || 'Atividade';
    title.textContent = trigger.dataset.title || 'Atividade';
    text.textContent = trigger.dataset.text || 'Use as setas para navegar entre as atividades.';
    counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(triggers.length).padStart(2, '0');
  }

  function open(index) {
    render(index);
    if (!dialog.open) dialog.showModal();
  }

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => open(index));
  });

  close.addEventListener('click', () => dialog.close());
  prev.addEventListener('click', () => render(current - 1));
  next.addEventListener('click', () => render(current + 1));

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      render(current - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      render(current + 1);
    }
  });
})();
