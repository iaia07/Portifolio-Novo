// Partículas que orbitam o retrato na página "Sobre mim".
(() => {
  const stage = document.querySelector(".ab-photo-wrap");
  if (!stage) return;

  const canvas = document.createElement("canvas");
  canvas.className = "ab-particles";
  canvas.setAttribute("aria-hidden", "true");
  stage.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const colors = ["#b98288", "#dcb9b4", "#9aa58d", "#c9a97c"];
  const pointer = { x: -9999, y: -9999 };
  const random = (min, max) => min + Math.random() * (max - min);

  let width = 0;
  let height = 0;
  let particles = [];
  let frame = null;
  let running = false;

  function createParticle() {
    return {
      angle: random(0, Math.PI * 2),
      radius: random(.82, 1.25),
      speed: random(.0012, .0042) * (Math.random() < .5 ? -1 : 1),
      size: random(.8, 2.6),
      alpha: random(.25, .75),
      color: colors[Math.floor(Math.random() * colors.length)],
      bob: random(0, Math.PI * 2),
      bobSpeed: random(.006, .018),
    };
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const total = Math.min(80, Math.max(28, Math.round((width * height) / 7000)));
    particles = Array.from({ length: total }, createParticle);
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const rx = Math.min(width * .40, 235);
    const ry = Math.min(height * .40, 205);

    for (const p of particles) {
      p.angle += p.speed;
      p.bob += p.bobSpeed;

      let x = cx + Math.cos(p.angle) * rx * p.radius;
      let y = cy + Math.sin(p.angle) * ry * p.radius + Math.sin(p.bob) * 6;

      // Aproximar o mouse afasta suavemente as partículas.
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared < 8100 && distanceSquared > .01) {
        const distance = Math.sqrt(distanceSquared);
        const push = ((90 - distance) / 90) * 18;
        x += (dx / distance) * push;
        y += (dy / distance) * push;
      }

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * (.75 + .25 * Math.sin(p.bob * 2));
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function loop() {
    draw();
    frame = requestAnimationFrame(loop);
  }

  function start() {
    if (running || reducedMotion.matches || document.hidden) return;
    running = true;
    loop();
  }

  function stop() {
    running = false;
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  }

  stage.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches) return;
    const rect = stage.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  });

  stage.addEventListener("pointerleave", () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  reducedMotion.addEventListener?.("change", () => {
    stop();
    draw();
    start();
  });

  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(stage);
  } else {
    window.addEventListener("resize", resize);
  }

  resize();
  start();
})();
