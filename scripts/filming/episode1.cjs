// Serialized into the standalone HTML. All visible source text comes from DATA.
function renderEpisode1(page, state, previous) {
  const { brand, regions, episode1 } = DATA;
  const esc = (t) =>
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
  if (page.kind === "dashboard") {
    const d = episode1.dashboard,
      active = d.activeByState[state],
      old = d.activeByState[previous ?? state];
    const rates = regions.map((r) => r.renewal).sort((a, b) => a - b);
    const anchors = [0, 0.25, 0.5, 0.75, 1].map((q) => {
      const i = (rates.length - 1) * q,
        lo = Math.floor(i),
        hi = Math.ceil(i);
      return rates[lo] + (rates[hi] - rates[lo]) * (i - lo);
    });
    const renewalColor = (value) => {
      let segment = anchors.findIndex(
        (v, i) => i < anchors.length - 1 && value <= anchors[i + 1],
      );
      if (segment < 0) segment = anchors.length - 2;
      const ratio = Math.max(
        0,
        Math.min(
          1,
          (value - anchors[segment]) /
            (anchors[segment + 1] - anchors[segment] || 1),
        ),
      );
      const colors = d.renewalGradient.colors;
      const rgb = (hex) =>
        [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      const a = rgb(colors[segment]),
        b = rgb(colors[segment + 1]);
      return `rgb(${a.map((c, i) => Math.round(c + (b[i] - c) * ratio)).join(",")})`;
    };
    const cards = regions
      .map((r) => {
        const bad = active.includes(r.name),
          good = state === 5 && r.name === d.successRegion;
        const changed = bad && !old.includes(r.name);
        const cause = bad
          ? esc(r.cause).replace(
              /(\d+(?:[,.]\d+)*\s*(?:건|분|%))/g,
              '<span class="atomic">$1</span>',
            )
          : "";
        return `<article class="op-card ${bad ? "is-problem" : good ? "is-success" : ""} ${changed ? "op-flash" : ""}" aria-label="${esc(r.name)}">
        <header class="op-card-top"><h2>${esc(r.name)}</h2><span class="op-status-dot" aria-label="${bad ? "문제" : good ? "정상" : "중립"}"></span></header>
        <dl class="op-metrics"><div><dt>${d.ordersLabel}</dt><dd><span>${r.orders}</span><small>건</small></dd></div><div class="op-renewal"><dt>${d.renewalLabel}</dt><dd style="color:${renewalColor(r.renewal)}" title="재구독률 분포 기준 상대 색상"><span>${r.renewal}</span><small>%</small></dd></div></dl>
        <div class="op-cause ${bad ? "" : "is-empty"}">${cause || "&nbsp;"}</div>
      </article>`;
      })
      .join("");
    return {
      mode: "operations",
      phone: false,
      html: `<div class="op-topbar"><div class="op-brand"><span class="op-mark" aria-hidden="true"><i></i><i></i><i></i></span><strong>${esc(brand.company)}</strong></div><div class="op-title">${d.title}</div><time>${d.dates[state]}</time></div><div class="op-grid">${cards}</div>`,
    };
  }
  const e = episode1.event;
  return {
    mode: "launch",
    phone: false,
    html: `<div class="launch-orbit orbit-one" aria-hidden="true"></div><div class="launch-orbit orbit-two" aria-hidden="true"></div><div class="launch-header"><div class="launch-brand"><span class="launch-symbol" aria-hidden="true"><i></i><i></i><i></i></span>${esc(brand.company)}</div><div class="launch-rule" aria-hidden="true"></div></div><section class="launch-content"><h1 aria-label="${esc(brand.event.title)}"><span class="launch-service">${esc(e.serviceLine)}</span><span class="launch-declaration">${esc(e.launchLead)} <em>${esc(e.launchEmphasis)}</em> ${esc(e.launchTail)}</span></h1><p>${esc(brand.event.subtitle)}</p></section><div class="launch-ground" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>`,
  };
}
module.exports = { renderEpisode1 };
