function runtime() {
  const canvas = document.getElementById("canvas"),
    stage = document.getElementById("stage"),
    controls = document.getElementById("controls");
  const selector = document.getElementById("screen-select"),
    stateButtons = document.getElementById("state-buttons");
  const prevButton = document.getElementById("previous-screen"),
    nextButton = document.getElementById("next-screen");
  const playButton = document.getElementById("play-animation"),
    resetButton = document.getElementById("reset-screen");
  const status = document.getElementById("current-status");
  let index = 0,
    state = 0,
    previous = 0,
    animation = null,
    animated = false,
    progress = 1,
    phase = "대기",
    shooting = new URLSearchParams(location.search).get("shoot") === "1";
  const current = () => DATA.pages[index];
  const stateKey = () => String.fromCharCode(97 + state);
  const canAnimate = () =>
    Boolean(current().duration) &&
    (!current().animatedStates || current().animatedStates.includes(state));
  const escape = (t) =>
    String(t).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  function fit() {
    const p = renderScreen(current(), state, animated, progress, previous);
    const w = p.phone ? 1080 : 1920,
      h = p.phone ? 1920 : 1080;
    const availableHeight = Math.max(
      1,
      innerHeight - (shooting ? 0 : controls.getBoundingClientRect().height),
    );
    stage.style.height = availableHeight + "px";
    const scale = Math.min(innerWidth / w, availableHeight / h);
    Object.assign(canvas.style, {
      width: w + "px",
      height: h + "px",
      transform: `scale(${scale})`,
      left: (innerWidth - w * scale) / 2 + "px",
      top: (availableHeight - h * scale) / 2 + "px",
    });
  }
  function updateControls() {
    selector.value = DATA.episode + ":" + current().id;
    stateButtons.innerHTML = current()
      .states.map(
        (name, i) =>
          `<button type="button" data-state="${i}" aria-pressed="${state === i}">${String.fromCharCode(97 + i)} · ${escape(name)}</button>`,
      )
      .join("");
    prevButton.disabled = index === 0;
    nextButton.disabled = index === DATA.pages.length - 1;
    playButton.disabled = !canAnimate();
    playButton.textContent =
      phase === "재생 중" ? "처음부터 재생" : "애니메이션 재생";
    status.textContent = `${current().id} · ${current().name} / ${stateKey()} · ${current().states[state]} / ${phase}`;
    canvas.dataset.phase = phase;
  }
  function draw() {
    const p = renderScreen(current(), state, animated, progress, previous);
    canvas.className = p.mode + (p.phone ? " phone" : "");
    canvas.innerHTML = p.html;
    canvas.dataset.page = current().id;
    canvas.dataset.state = stateKey();
    updateControls();
    fit();
  }
  function cancel() {
    if (animation !== null) cancelAnimationFrame(animation);
    animation = null;
  }
  function clean() {
    cancel();
    animated = false;
    progress = 1;
    phase = "대기";
  }
  function run(duration, drawFrames = true) {
    cancel();
    phase = "재생 중";
    const start = performance.now();
    updateControls();
    function tick(now) {
      progress = Math.min(1, (now - start) / duration);
      if (drawFrames) draw();
      else updateControls();
      if (progress < 1) animation = requestAnimationFrame(tick);
      else {
        animation = null;
        phase = "완료";
        updateControls();
      }
    }
    animation = requestAnimationFrame(tick);
  }
  function change(next) {
    clean();
    previous = state;
    state = Math.max(0, Math.min(current().states.length - 1, next));
    if (current().kind === "renewal" && state !== previous) {
      animated = true;
      progress = 0;
      draw();
      run(current().duration);
      return;
    }
    draw();
    if (current().kind === "dashboard" && state !== previous)
      run(current().duration, false);
  }
  function reset() {
    clean();
    state = 0;
    previous = 0;
    draw();
  }
  function go() {
    clean();
    state = 0;
    previous = 0;
    const found = DATA.pages.findIndex((p) => p.id === location.hash.slice(1));
    index = found < 0 ? 0 : found;
    draw();
  }
  function move(delta) {
    const next = Math.max(0, Math.min(DATA.pages.length - 1, index + delta));
    if (next !== index) location.hash = DATA.pages[next].id;
  }
  function play() {
    if (!canAnimate()) return;
    clean();
    if (current().kind === "dashboard") {
      previous = state;
      draw();
      canvas.querySelectorAll(".is-problem").forEach((el) => {
        el.classList.remove("op-flash");
        void el.offsetWidth;
        el.classList.add("op-flash");
      });
      run(current().duration, false);
      return;
    }
    animated = true;
    progress = 0;
    draw();
    run(current().kind === "voc" && state === 3 ? 41000 : current().duration);
  }
  function setShooting(value) {
    shooting = value;
    document.body.classList.toggle("shooting", value);
    document
      .getElementById("shoot-mode")
      .setAttribute("aria-pressed", String(value));
    fit();
  }
  selector.innerHTML = Object.entries(DATA.catalog)
    .map(
      ([episode, pages]) =>
        `<optgroup label="${episode}화">${pages.map((p) => `<option value="${episode}:${p.id}">${p.id} · ${escape(p.name)}</option>`).join("")}</optgroup>`,
    )
    .join("");
  selector.addEventListener("change", () => {
    const [episode, id] = selector.value.split(":");
    if (episode === String(DATA.episode)) {
      if (location.hash === "#" + id) go();
      else location.hash = id;
    } else
      location.href = `${episode}화.html${shooting ? "?shoot=1" : ""}#${id}`;
  });
  stateButtons.addEventListener("click", (e) => {
    const button = e.target.closest("[data-state]");
    if (button) {
      const value = Number(button.dataset.state);
      change(value);
      stateButtons.querySelector(`[data-state="${value}"]`)?.focus();
    }
  });
  prevButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  playButton.addEventListener("click", play);
  resetButton.addEventListener("click", reset);
  document
    .getElementById("shoot-mode")
    .addEventListener("click", () => setShooting(true));
  addEventListener("hashchange", go);
  addEventListener("resize", fit);
  new ResizeObserver(fit).observe(controls);
  addEventListener("keydown", (e) => {
    if (e.repeat) return;
    const key = e.key.toLowerCase();
    if (key === "`") {
      e.preventDefault();
      setShooting(!shooting);
      return;
    }
    if (
      e.target.matches("input,select,textarea,[contenteditable=true]") ||
      (e.target.closest("#controls") && [" ", "enter"].includes(key))
    )
      return;
    if (
      [" ", "arrowright", "arrowleft", "pagedown", "pageup", "r"].includes(
        key,
      ) ||
      /^[a-f]$/.test(key)
    )
      e.preventDefault();
    if (key === "r") {
      reset();
      return;
    }
    if (key === "pagedown") {
      move(1);
      return;
    }
    if (key === "pageup") {
      move(-1);
      return;
    }
    if (key === "arrowright") {
      change(state + 1);
      return;
    }
    if (key === "arrowleft") {
      change(state - 1);
      return;
    }
    if (/^[a-f]$/.test(key)) {
      const next = key.charCodeAt(0) - 97;
      if (next < current().states.length) change(next);
      return;
    }
    if (key === " ") {
      if (["dashboard", "renewal", "promo"].includes(current().kind))
        change(state + 1);
      else play();
    }
  });
  document.body.classList.toggle("shooting", shooting);
  go();
}
module.exports = { runtime };
