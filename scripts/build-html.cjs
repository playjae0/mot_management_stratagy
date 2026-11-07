const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const brand = require("../data/brand.json"),
  regions = require("../data/regions.json");
const css = `*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000;cursor:none}body{font-family:Pretendard,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:#F8FAFC}#canvas{position:absolute;width:1920px;height:1080px;transform-origin:top left;background:#0F172A;padding:64px 70px}.header{display:flex;align-items:center;gap:28px;font-size:38px;margin-bottom:50px}.logo{color:#F8FAFC;background:#8B1E3F;padding:8px 22px;font-weight:850;font-size:50px;border-radius:8px}.date{margin-left:auto;color:#BBC7D7}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.region{position:relative;height:260px;padding:25px;border:3px solid #617086;border-radius:18px;background:#1E293B}.region h2{font-size:56px;margin:0 0 4px;font-weight:800}.numbers{display:flex;align-items:baseline;justify-content:space-between;font-size:46px;font-weight:750}.region p{font-size:36px;margin:8px 0 0;line-height:1.1;letter-spacing:-1px}.bad{background:#4A242F;border-color:#F2555A}.good{background:#113F38;border-color:#30A46C}.dot{position:absolute;top:25px;right:24px;width:16px;height:16px;border-radius:50%;background:#8B8D98}.bad .dot{background:#F2555A}.good .dot{background:#30A46C}.good .renew{color:#73E4AB;font-size:54px}.blink{animation:flash .5s ease-out}@keyframes flash{50%{filter:brightness(1.7)}}.event{background:#8B1E3F!important;padding:70px 90px!important}.event .logo{background:transparent;padding:0;font-size:60px}.event h1{font-size:120px;line-height:1.25;letter-spacing:-4px;margin:70px 0 40px;max-width:1740px}.event p{font-size:48px}.panel{background:#1E293B;padding:45px;border-radius:22px}.title{font-size:58px;margin:0 0 55px;line-height:1.35}.bar{height:82px;background:#304057;border-radius:10px;overflow:hidden}.bar>div{height:100%;background:#8B1E3F}.row{font-size:42px;margin:24px 0;line-height:1.5}.sub{color:#B6C3D6;font-size:38px}.reviews{display:grid;gap:24px}.review{font-size:44px;padding:34px;background:#1E293B;border-left:8px solid #8B1E3F;border-radius:8px}.stars{color:#FFC53D;margin-right:25px}.big{font-size:170px;font-weight:850;margin:35px 0}.phone .title{font-size:64px}.phone .panel{padding:40px}.phone .row{font-size:48px}.phone .header{display:block;line-height:1.5}.phone .logo{display:inline-block}.phone .review{font-size:50px;line-height:1.6;margin-top:35px}.sheet{background:#E5E7EB!important;color:#111827}.sheet table{border-collapse:collapse;width:100%;font-size:46px;background:#D8DDE5}.sheet td,.sheet th{padding:25px 36px;border:2px solid #A0AAB9;text-align:left}.sheet .total{background:#FFC53D;font-weight:850}#debug{position:fixed;top:0;left:0;background:#000e;color:white;font:20px monospace;padding:15px;z-index:10;display:none;cursor:auto}#debug a{color:white;display:block;margin:10px}.linechart{width:100%;height:600px}.freq{display:grid;grid-template-columns:170px 1fr 110px;gap:22px;align-items:center;font-size:44px;margin:24px 0}.freq .bar{height:55px}.freq b{text-align:right}.cost-label{font-size:38px}.ads .header{margin-bottom:30px}.ads .title{margin-bottom:20px}.ads .big{margin:20px 0;font-size:90px!important}.ads .panel{padding:22px 35px;margin-top:28px!important}.ads .row{margin:12px 0}.fade{animation:appear .5s both}@keyframes appear{from{opacity:0;translate:0 20px}to{opacity:1;translate:0 0}}`;
const h = (title) =>
  `<div class="header"><span class="logo">${brand.company}</span><span>${title}</span></div>`;
const panel = (content) => `<section class="panel">${content}</section>`;
const title = (text) => `<h1 class="title">${text}</h1>`;
const screens = require("../data/filming-screens.json");
const episode1 = require("../data/filming-episode1.json");
const { renderEpisode1 } = require("./filming/episode1.cjs");
const { runtime } = require("./filming/runtime.cjs");
const extraCss = ["controls.css", "episode1.css"]
  .map((file) => fs.readFileSync(path.join(__dirname, "filming", file), "utf8"))
  .join("\n");
// Render function is serialized into each standalone file. It must have no build-time closure dependencies.
function renderScreen(page, state, animated, progress, previous) {
  if (["dashboard", "event"].includes(page.kind))
    return renderEpisode1(page, state, previous);
  const B = DATA.brand,
    R = DATA.regions;
  const header = (t) =>
    `<div class="header"><span class="logo">${B.company}</span><span>${t}</span></div>`;
  const title = (t) => `<h1 class="title">${t}</h1>`;
  const row = (t) => `<div class="row">${t}</div>`;
  const bar = (value, color = "#8B1E3F", height = 82) =>
    `<div class="bar" style="height:${height}px"><div style="width:${value}%;background:${color}"></div></div>`;
  const reveal = (i) =>
    !animated ? 1 : Math.max(0, Math.min(1, progress * 2.5 - i * 0.3));
  let html = "",
    mode = "",
    phone = false;
  switch (page.kind) {
    case "resource":
      html =
        header("AI 점심 구독") +
        title("AI 점심 구독 — 개발 리소스 배분 (안)") +
        `<div style="display:flex;height:220px;margin-top:100px;overflow:hidden;border-radius:15px"><div style="width:${80 * progress}%;background:#8B1E3F;padding:50px 30px;font-size:54px;white-space:nowrap">예측 모델 80%</div><div style="flex:1;background:#617086;padding:50px 25px;font-size:45px">배송 20%</div></div>` +
        row("배송 20% (기사 300명 충원)") +
        row("배차 시스템 — 기존 유지 · 배송 AI — 2단계");
      break;
    case "reviews": {
      const reviews =
        state === 0
          ? [
              ["★★☆☆☆", "제육 귀신같이 맞추는데 12시 40분"],
              ["★★☆☆☆", "메뉴는 정확, 배송은 지각"],
              ["★☆☆☆☆", "맞추면 뭐 하나 늦는데"],
            ]
          : [
              ["★★★☆☆", "AI 추천은 똑같은데 결국 가지러 가야 함"],
              ["★★★☆☆", "편의점은 배달이 없네"],
            ];
      html =
        header(
          state === 0 ? "AI 점심 구독 리뷰" : "○○편의점 AI 추천 도시락 리뷰",
        ) +
        `<div class="reviews">` +
        reviews
          .map(
            ([stars, text], i) =>
              `<div class="review" style="opacity:${reveal(i)}"><span class="stars">${stars}</span>${text}</div>`,
          )
          .join("") +
        "</div>";
      break;
    }
    case "tuning":
      html =
        header("AI 점심 구독") +
        title("취향 예측 모델 · 실험 #47") +
        `<div class="big">${(94 + 1.1 * (animated ? progress : 0)).toFixed(1)}<span style="font-size:90px">%</span></div><div class="panel">` +
        ["v2.1　93.2%", "v2.2　94.0%", "v2.3　95.1%"].map(row).join("") +
        "</div>";
      break;
    case "queue":
      if (state === 1) {
        html =
          header("AI 점심 구독") +
          [
            "기존 배달 — 지금 주문 → 가까운 기사 1건",
            "도시락 — 12시 정각 → 한 빌딩 수십 건",
            "같은 시스템으로",
          ]
            .map(
              (t, i) =>
                `<div class="review" style="margin:35px 0;opacity:${reveal(i)};font-size:${i === 2 ? 70 : 46}px">${t}</div>`,
            )
            .join("");
      } else {
        const values = [
          10, 12, 16, 13, 18, 12, 15, 20, 17, 20, 300, 220, 160, 110, 75, 45,
          25, 15, 10,
        ];
        html =
          header("AI 점심 구독") +
          title("실시간 배차 대기열 · 예약 주문 · 최고 300건 (11:50)") +
          `<svg viewBox="0 0 1780 650" width="1780" height="650"><path d="M65 30V550H1740" stroke="#66758B" fill="none" stroke-width="3"/>${[0, 100, 200, 300].map((v) => `<text x="0" y="${550 - v * 1.5}" font-size="36" fill="#B6C3D6">${v}</text>`).join("")}${values
            .map((v, i) => {
              const p = animated
                ? Math.max(0, Math.min(1, progress * values.length - i))
                : 1;
              const time = 660 + i * 5;
              return `<rect x="${80 + i * 86}" y="${550 - v * 1.5 * p}" width="55" height="${v * 1.5 * p}" rx="5" fill="${i === 10 ? "#F2555A" : "#617086"}"/>${i % 2 === 0 ? `<text x="${70 + i * 86}" y="600" font-size="36" fill="#B6C3D6">${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}</text>` : ""}`;
            })
            .join("")}</svg>`;
      }
      break;
    case "rider":
      phone = true;
      html =
        header("라이더 · 오늘 배차") +
        ["나", "다른 기사", "다른 기사"]
          .map(
            (w) =>
              `<div class="review"><b style="color:#FFC53D">○○타워</b><br>12:00 · 1건<br>배정: ${w}</div>`,
          )
          .join("") +
        row("같은 건물 주문 7건 · 기사 3명에게 따로 배정");
      break;
    case "news":
      if (state === 0) {
        phone = true;
        html = `<div style="margin-top:140px;font-size:120px;text-align:center">12:00</div><div class="review" style="margin-top:160px;opacity:${animated ? progress : 1};translate:0 ${(1 - progress) * -100}px">[속보] 편의점 체인 ○○, 'AI 추천 도시락' 출시</div>`;
      } else
        html =
          `<div class="header">○○경제</div>` +
          title(
            "편의점 체인 ○○, 'AI 추천 도시락' 출시 — 전국 1만 점포에서 예약 픽업",
          ) +
          `<div class="sub">김○○</div><div class="panel" style="margin-top:40px;background:#526074;text-align:center;font-size:40px;padding:55px">편의점 AI 도시락 진열대</div>` +
          [
            "○○편의점이 고객 구매 데이터를 바탕으로 도시락을 추천하는 서비스를 내놨다.",
            "앱으로 예약하면 점심시간에 가까운 점포에서 찾아갈 수 있다.",
            "배달은 하지 않는다.",
          ]
            .map(row)
            .join("");
      break;
    case "cost":
      mode = "sheet";
      html =
        `<div class="sub" style="color:#475569">가격산정_v3</div>` +
        title("AI 점심 구독 가격 산정 (안)") +
        `<table><tr><th></th><th>A</th><th>B</th></tr>${[
          ["AI 개발비 회수", "2,500"],
          ["키친 원가", "9,000"],
          ["배송", "3,000"],
          ["마진", "3,500"],
          ["판매가", "18,000"],
        ]
          .map(
            ([a, b], i) =>
              `<tr class="${i === 4 ? "total" : ""}"><td>${i + 1}</td><td>${a}</td><td>${b}</td></tr>`,
          )
          .join("")}</table>` +
        row("포지셔닝 — 프리미엄");
      break;
    case "renewal": {
      const last = [2, 4, 5][state];
      html =
        header("AI 점심 구독") +
        title("재구독률 (주차별)") +
        `<div style="position:absolute;right:100px;top:160px;font-size:100px;color:#FFC53D;font-weight:800">12%</div><svg viewBox="0 0 1750 670" class="linechart"><path d="M100 40V550H1670" stroke="#8290A7" stroke-width="3" fill="none"/>${[0, 10, 20, 30, 40, 50].map((v) => `<text x="15" y="${558 - v * 10}" font-size="36" fill="#BBC7D7">${v}%</text>`).join("")}${[1, 2, 3, 4, 5, 6].map((v) => `<text x="${100 + (v - 1) * 300}" y="615" font-size="38" fill="#BBC7D7">${v}주</text>`).join("")}<path d="M400 430H${400 + Math.max(0, last - 2) * 300 * progress}" stroke="#FFC53D" stroke-width="10" fill="none"/><circle cx="400" cy="430" r="12" fill="#FFC53D"/>${state >= 1 ? '<path d="M700 220V550" stroke="#B6C3D6" stroke-width="3" stroke-dasharray="10"/><text x="510" y="180" fill="#F8FAFC" font-size="40">1만 5천 원으로 인하</text>' : ""}${state === 2 ? '<path d="M1300 330V550" stroke="#B6C3D6" stroke-width="3" stroke-dasharray="10"/><text x="1200" y="295" fill="#F8FAFC" font-size="40">첫 주 무료</text>' : ""}</svg>`;
      break;
    }
    case "promo":
      phone = true;
      html =
        header("AI 점심 구독") +
        `<div style="background:#8B1E3F;border-radius:24px;padding:60px 45px;margin-top:80px"><h1 style="font-size:100px;margin:0 0 50px">${state === 0 ? "AI 점심 구독<br>1만 5천 원" : "첫 주 무료"}</h1><div style="font-size:60px">${state === 0 ? "3천 원 내렸어요" : "지금 구독하면 5일 무료"}</div></div>`;
      break;
    case "ads":
      mode = "ads";
      html =
        header("AI 점심 구독") +
        title("전국 광고 집행 현황 · 4주 차") +
        `<div class="big" style="font-size:110px">집행률 50% <span style="font-size:42px;color:#B6C3D6">(예산 대비)</span></div>` +
        bar(50) +
        `<div class="panel" style="margin-top:50px">` +
        [
          ["TV", 55],
          ["디지털", 48],
          ["옥외", 41],
        ]
          .map(([t, v]) => row(`${t} ${v}%`) + bar(v, "#617086", 30))
          .join("") +
        "</div>";
      break;
    case "voc":
      if (state === 0) {
        html =
          header("고객의 소리") +
          title("해지 설문 자유응답 (1,240건)") +
          [
            "12시에 와야 의미가 있어요",
            "점심시간 끝나고 왔어요",
            "메뉴는 괜찮은데 늦어요",
            "편의점보다 비싸요",
            "12시 40분 도착, 해지합니다",
          ]
            .map(
              (t) =>
                `<div class="review" style="margin:15px 0;padding:23px 30px">${t}</div>`,
            )
            .join("");
      } else if (state === 1) {
        html =
          header("고객의 소리") +
          title("상담 녹음 (380건)") +
          [
            "#0217 · 해지 문의 · 0:38 · 배송 지연",
            "#0342 · 해지 문의 · 0:41 · 가격",
            "#0388 · 배송 문의 · 1:02 · 배송 지연",
          ]
            .map((t) => `<div class="review" style="margin:30px 0">${t}</div>`)
            .join("");
      } else {
        const index = state === 2 ? "0217" : "0342";
        html =
          header("고객의 소리") +
          title(`재생 #${index}`) +
          `<svg width="1780" height="300" viewBox="0 0 1780 300">${Array.from(
            { length: 70 },
            (_, i) => {
              const amp = animated
                ? 30 + 100 * Math.abs(Math.sin(i * 1.7 + progress * 30))
                : 30 + 80 * Math.abs(Math.sin(i * 1.7));
              return `<rect x="${i * 25}" y="${150 - amp}" width="10" height="${amp * 2}" rx="4" fill="#AABBD5"/>`;
            },
          ).join("")}</svg>` +
          bar(animated ? progress * 100 : 0, "#8B1E3F", 18) +
          `<div class="review" style="font-size:54px;margin-top:70px">${state === 2 ? "메뉴는 아무거나 괜찮아요. 12시에만 정확히 와 주면 돼요." : "편의점보다 비싼 건 괜찮은데, 만 이천 원 넘으면 좀…"}</div>`;
      }
      break;
    case "frequency":
      html =
        header("고객의 소리") +
        title("해지 사유 자유응답 · 단어 빈도 (1,240건)") +
        [
          ["12시", 412],
          ["늦음", 287],
          ["지각", 166],
          ["가격", 151],
          ["만 원", 98],
          ["메뉴", 23],
          ["AI 추천", 11],
        ]
          .map(
            ([t, v], i) =>
              `<div class="freq"><span>${t}</span>${bar((v / 412) * 100 * (animated ? Math.max(0, Math.min(1, progress * 2 - i * 0.15)) : 1), i === 0 ? "#FFC53D" : "#617086", 55)}<b>${v}</b></div>`,
          )
          .join("");
      break;
  }
  return { html, mode, phone };
}
fs.mkdirSync(path.join(root, "촬영HTML"), { recursive: true });
for (const [episode, pages] of Object.entries(screens)) {
  const data = { brand, regions, pages, episode, episode1, catalog: screens };
  const html = `<!doctype html>\n<!-- ${episode}화. ${pages.map((p) => p.id).join(", ")}. PageDown/PageUp 페이지, a~f 상태, Space 실행/다음, 좌우 상태, R 초기화, 백틱 조작부 토글. 조작부는 기본 표시, 촬영 모드에서 숨김. 자동재생 없음. 제작 선택: 가상 리뷰 닉네임/기사 날짜 등 원본에 없는 사실은 생략. -->\n<html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${brand.company} · ${episode}화 촬영 화면</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable.css"><style>${css}\n${extraCss}</style></head><body><div id="stage"><main id="canvas"></main></div><aside id="controls" aria-label="촬영 화면 조작부"><div class="control-main"><label for="screen-select">화면<select id="screen-select" aria-label="화면 번호·이름"></select></label><button type="button" id="previous-screen">이전 화면</button><button type="button" id="next-screen">다음 화면</button><button type="button" id="shoot-mode" class="shoot-button" aria-pressed="false">촬영 모드 · 숨기기</button></div><div class="control-bottom"><div id="state-buttons" aria-label="상태 선택"></div><button type="button" id="play-animation">애니메이션 재생</button><button type="button" id="reset-screen">초기화</button><output id="current-status" aria-live="polite"></output></div><div id="control-help">백틱: 조작부 숨기기/표시 · PageUp/Down: 화면 · a–f / ← →: 상태 · Space: 재생/다음 · R: 초기화 · F11: 전체 화면</div></aside><script>const DATA=${JSON.stringify(data)};${renderEpisode1.toString()};${renderScreen.toString()};(${runtime.toString()})();</script></body></html>`;
  fs.writeFileSync(path.join(root, "촬영HTML", `${episode}화.html`), html);
}
console.log("Built 5 standalone HTML files, 14 pages.");
