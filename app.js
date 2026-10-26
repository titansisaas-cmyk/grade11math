(function () {
  const app = document.getElementById("app");
  const mem = {};
  const store = {
    get(k, d) { return k in mem ? mem[k] : d; },
    set(k, v) { mem[k] = v; },
  };

  const math = (el) => {
    if (window.renderMathInElement) {
      renderMathInElement(el, { delimiters: [{ left: "\\(", right: "\\)", display: false }], throwOnError: false });
    }
  };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const praise = ["Correct.", "Yes, that's it.", "Nice work.", "Correct. Well done.", "That's right."];


  // ---------- Progress tracking (sent to the server; never blocks the game) ----------
  MISSIONS.forEach((m) => m.items.forEach((it, i) => { it._key = m.id + "#" + i; it._mission = m.id; }));
  const API = (() => {
    const raw = window.__API_BASE__ || "";
    if (!raw.startsWith("__PORT_")) return raw.replace(/\/$/, "");
    return /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? "http://localhost:8000" : null;
  })();
  const queue = [];
  let flushing = false;
  function track(ev) { if (!API) return; queue.push(ev); flush(); }
  function flush(keepalive) {
    if (!API || flushing || !queue.length) return;
    flushing = true;
    const batch = queue.splice(0, queue.length);
    fetch(API + "/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ events: batch }), keepalive: !!keepalive })
      .then((r) => { if (!r.ok) throw new Error(r.status); })
      .catch(() => { queue.unshift(...batch); })
      .finally(() => { flushing = false; if (queue.length) setTimeout(() => flush(), 1500); });
  }
  setInterval(() => flush(), 10000);
  addEventListener("pagehide", () => flush(true));
  const newSid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

  // ---------- Graph SVG ----------
  function graphSVG(kind) {
    const W = 200, H = 170, pad = 18;
    const xs = (x) => pad + ((x + 3) / 6) * (W - 2 * pad);
    const ys = (y) => H - pad - (y / 10) * (H - 2 * pad);
    let f;
    if (kind === "2") f = (x) => Math.pow(2, x);
    else if (kind === "0.5") f = (x) => Math.pow(0.5, x);
    else if (kind === "1.5") f = (x) => Math.pow(1.5, x);
    else if (kind === "1.5d") f = (x) => Math.pow(1 / 1.5, x);
    else f = (x) => x + 3; // straight line
    let d = "";
    for (let i = 0; i <= 120; i++) {
      const x = -3 + (6 * i) / 120;
      let y = f(x); if (y > 10.5) y = 10.5; if (y < -0.5) y = -0.5;
      d += (i ? "L" : "M") + xs(x).toFixed(1) + " " + ys(y).toFixed(1);
    }
    let grid = "";
    for (let x = -3; x <= 3; x++) grid += `<line x1="${xs(x)}" y1="${pad}" x2="${xs(x)}" y2="${H - pad}" stroke="#E2DED4"/>` + `<text x="${xs(x)}" y="${H - 4}" font-size="9" text-anchor="middle" fill="#6b6f76">${x}</text>`;
    for (let y = 0; y <= 8; y += 2) grid += `<line x1="${pad}" y1="${ys(y)}" x2="${W - pad}" y2="${ys(y)}" stroke="#E2DED4"/>` + (y ? `<text x="${xs(0) - 4}" y="${ys(y) + 3}" font-size="9" text-anchor="end" fill="#6b6f76">${y}</text>` : "");
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="graph"><rect width="${W}" height="${H}" fill="#fff"/>${grid}
      <line x1="${pad}" y1="${ys(0)}" x2="${W - pad}" y2="${ys(0)}" stroke="#23282F" stroke-width="1.2"/>
      <line x1="${xs(0)}" y1="${pad}" x2="${xs(0)}" y2="${H - pad}" stroke="#23282F" stroke-width="1.2"/>
      <path d="${d}" fill="none" stroke="#2F6680" stroke-width="3" stroke-linecap="round"/></svg>`;
  }
  const choiceHTML = (c) => (c.startsWith("g:") ? graphSVG(c.slice(2)) : c);

  // ---------- Home ----------
  function home() {
    S = null;
    const prog = store.get("eq-progress", {});
    const ms = MISSIONS.map((m, i) => {
      const p = prog[m.id];
      const qn = m.items.filter((x) => x.type !== "lesson").length;
      return `<button class="mission ${p ? "done" : ""}" data-m="${i}">
        <span class="m-num">${p ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>' : (m.badge || i)}</span>
        <span><span class="m-title">${m.title}: ${m.sub}</span><br><span class="m-sub">${qn} questions · about ${m.minutes}</span></span>
        <span class="m-meta">${p ? `<b>Done</b>${p.first}/${p.total} first try` : "Start"}</span>
      </button>`;
    }).join("");
    app.innerHTML = `<section class="fade">
      <div class="welcome">
        <h1>MBF3C test review</h1>
        <p class="muted">MBF3C · Grade 11 · Exponents, algebra, rates and geometry · Made from your review sheets</p>
        <ul class="calm-list">
          <li>There is no timer. Take as long as you need.</li>
          <li>Wrong answers are fine. You get a hint and can try again.</li>
          <li><span>Stuck? Press <b>Show me how</b> to see every step.</span></li>
          <li><span>The <b>Rules sheet</b> button at the top is always there.</span></li>
          <li>Watch the video lesson first, then do the missions that go with it.</li>
          <li>Do the missions in order. One mission at a time is enough.</li>
        </ul>
      </div>
      <p class="section-label">Video lessons: watch first</p>
      <div class="videos">${VIDEOS.map((v, i) => `<details class="vid"><summary><span class="m-num">▶</span><span><span class="m-title">${v.t}</span><br><span class="m-sub">${v.len} · goes with ${v.go}</span></span></summary>
        <video controls playsinline preload="none" poster="videos/poster${i + 1}.jpg" src="videos/video${i + 1}.mp4"></video></details>`).join("")}</div>
      <p class="section-label">Missions</p>
      <div class="missions">${ms}</div>
      <p class="section-label">When you feel ready</p>
      <div class="missions">
        <button class="mission ${prog.test ? "done" : ""}" data-m="test">
          <span class="m-num">T</span>
          <span><span class="m-title">Practice test</span><br><span class="m-sub">15 mixed questions from all missions · no hints shown first</span></span>
          <span class="m-meta">${prog.test ? `<b>Best</b>${prog.test.first}/${prog.test.total}` : "Start"}</span>
        </button>
      </div>
      <p class="muted" style="margin-top:22px;font-size:.85em">Progress is kept while this page stays open. <button class="pill" id="resetBtn">Reset progress</button></p>
    </section>`;
    app.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.m;
      if (k === "test") startTest(); else start(MISSIONS[+k].id, MISSIONS[+k].items, MISSIONS[+k].title + ": " + MISSIONS[+k].sub);
    }));
    document.getElementById("resetBtn").addEventListener("click", () => { if (confirm("Reset all progress?")) { store.set("eq-progress", {}); home(); } });
    window.scrollTo(0, 0);
  }

  // ---------- Session ----------
  let S = null;
  function start(id, items, title, isTest) {
    S = { id, title, items, i: 0, first: 0, total: items.filter((x) => x.type !== "lesson").length, missed: [], isTest: !!isTest };
    S.sid = newSid();
    track({ t: "start", sid: S.sid, mission: id, kind: isTest ? "test" : id.startsWith("retry") ? "retry" : "mission" });
    render();
  }
  function startTest() {
    const pool = [];
    MISSIONS.forEach((m) => m.items.forEach((it) => { if (it.type !== "lesson" && (/Review|Word problem/.test(it.q + (it.ctx || "")))) pool.push(it); }));
    start("test", shuffle(pool).slice(0, 15), "Practice test", true);
  }

  function render() {
    const it = S.items[S.i];
    if (!it) return finish();
    const qNum = S.items.slice(0, S.i + 1).filter((x) => x.type !== "lesson").length;
    const pct = Math.round((S.i / S.items.length) * 100);
    const top = `<div class="topline"><span>${S.title}</span><span>${it.type === "lesson" ? "Learn" : `Question ${qNum} of ${S.total}`}</span></div>
      <div class="progress" aria-hidden="true"><span style="width:${pct}%"></span></div>`;

    if (it.type === "lesson") {
      app.innerHTML = `${top}<section class="card fade"><div class="lesson-tag">Quick lesson</div><h2>${it.title}</h2>${it.body}
        <div class="next-row"><button class="btn primary" id="next">Got it, next</button></div></section>`;
      math(app);
      const n = document.getElementById("next"); n.addEventListener("click", advance); n.focus({ preventScroll: true });
      window.scrollTo(0, 0);
      return;
    }

    const order = shuffle(it.choices.map((c, idx) => ({ c, idx })));
    let hintN = 0, tried = false, solved = false, showedSteps = false;
    let attemptNo = 0;
    const tk = (t, extra) => track(Object.assign({ t, sid: S.sid, mission: it._mission, item: it._key }, extra || {}));
    app.innerHTML = `${top}<section class="card fade">
      ${it.ctx ? `<div class="ctx">${it.ctx}</div>` : ""}
      ${it.easy ? `<span class="step-label easy">Easy one</span>` : ""}${it.stepLabel ? `<span class="step-label">${it.stepLabel}</span>` : ""}
      <p class="q">${it.q}</p>
      <div class="choices ${it.graphChoices ? "graphs" : ""}">${order.map((o, k) => `<button class="choice" data-idx="${o.idx}"><span class="key">${k + 1}</span><span class="c-body">${choiceHTML(o.c)}</span></button>`).join("")}</div>
      <div class="tools">
        <button class="btn" id="hintBtn">Hint</button>
        <button class="btn quiet" id="stepsBtn">Show me how</button>
      </div>
      <div id="out"></div>
      <div class="next-row" id="nextRow" hidden><button class="btn primary" id="next">Next</button></div>
    </section>`;
    math(app);
    window.scrollTo(0, 0);
    const out = document.getElementById("out");
    const hintBtn = document.getElementById("hintBtn");
    const stepsBtn = document.getElementById("stepsBtn");
    if (!it.hints || !it.hints.length) hintBtn.hidden = true;

    function addPanel(cls, title, html) {
      const d = document.createElement("div");
      d.className = "panel fade " + cls;
      const meth = (it.methods && cls !== "notyet" && !out.querySelector(".method")) ? `<p class="method">On your cheat sheet: ${it.methods.map((m) => `<b>${m[0]}</b> → ${m[1]}`).join("<br>")}</p>` : "";
      d.innerHTML = `<h3>${title}</h3>${meth}${html}`;
      out.appendChild(d); math(d); return d;
    }
    function showHint(pre) {
      if (hintN >= it.hints.length) return;
      const t = it.hints.length > 1 ? `Hint ${hintN + 1} of ${it.hints.length}` : "Hint";
      const t2 = it.hints.length > 1 ? `hint ${hintN + 1} of ${it.hints.length}` : "a hint";
      addPanel("hint", pre ? pre + " " + t2 + ":" : t, `<p>${it.hints[hintN]}</p>`);
      hintN++; tried = true; tk("hint");
      if (hintN >= it.hints.length) hintBtn.disabled = true;
    }
    function showSteps() {
      if (showedSteps) return; showedSteps = true; tried = true; stepsBtn.disabled = true; if (!solved) tk("steps");
      addPanel("steps", "How to do it", `<ol>${it.steps.map((s) => `<li>${s}</li>`).join("")}</ol>${solved ? "" : '<p style="margin-top:10px">Now pick the answer that matches.</p>'}`);
    }
    hintBtn.addEventListener("click", () => showHint());
    stepsBtn.addEventListener("click", showSteps);

    app.querySelectorAll(".choice").forEach((b) => b.addEventListener("click", () => {
      if (solved || b.disabled) return;
      attemptNo++;
      tk("answer", { choice: +b.dataset.idx, correct: +b.dataset.idx === 0, attempt: attemptNo });
      if (+b.dataset.idx === 0) {
        solved = true;
        b.classList.add("right");
        app.querySelectorAll(".choice").forEach((x) => (x.disabled = true));
        hintBtn.disabled = true;
        if (!tried) S.first++; else S.missed.push(it);
        addPanel("good", praise[Math.floor(Math.random() * praise.length)], `<p>${it.why || ""}</p>`);
        if (!showedSteps) stepsBtn.textContent = "See all the steps", stepsBtn.disabled = false;
        const nr = document.getElementById("nextRow"); nr.hidden = false;
        const n = document.getElementById("next"); n.focus({ preventScroll: true });
        nr.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      } else {
        b.classList.add("wrong"); b.disabled = true;
        const first = !tried; tried = true;
        const pre = first ? "Not yet, that's okay. Try another one. Here is" : "Still not it, that's okay. Here is";
        if (hintN < (it.hints || []).length) showHint(pre); else if (!showedSteps) showSteps();
        else if (first) addPanel("notyet", "Not yet, that's okay.", "<p>Try another one.</p>");
      }
    }));
    document.getElementById("next").addEventListener("click", advance);
  }

  function advance() { S.i++; render(); }

  function finish() {
    S.done = true;
    track({ t: "finish", sid: S.sid, first: S.first, total: S.total });
    const prog = store.get("eq-progress", {});
    const prev = prog[S.id];
    if (!prev || S.first >= prev.first) prog[S.id] = { first: S.first, total: S.total };
    if (!S.id.startsWith("retry")) store.set("eq-progress", prog);
    const withHelp = S.total - S.first;
    const nextIdx = MISSIONS.findIndex((m) => m.id === S.id) + 1;
    const nextM = nextIdx > 0 && nextIdx < MISSIONS.length ? MISSIONS[nextIdx] : null;
    app.innerHTML = `<section class="card done-card fade">
      <div class="check-mark"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></div>
      <h1>${S.isTest ? "Practice test finished" : "Mission complete"}</h1>
      <p class="muted">You answered every question. That is real practice.</p>
      <div class="stat-row">
        <div class="stat"><b>${S.first}</b>right on first try</div>
        <div class="stat"><b>${withHelp}</b>right with help</div>
      </div>
      ${withHelp ? `<p>Doing the ones you needed help with again is the fastest way to learn them.</p>` : `<p>Every one on the first try. Excellent.</p>`}
      <div class="done-actions">
        ${S.missed.length ? `<button class="btn primary" id="retry">Redo the ${S.missed.length} I needed help with</button>` : ""}
        ${nextM && !S.missed.length ? `<button class="btn primary" id="nextM">Next: ${nextM.title}</button>` : ""}
        <button class="btn" id="back">Back to missions</button>
      </div>
      <p class="muted" style="margin-top:18px;font-size:.88em">Feeling tired? Take a break. Leave this page open and come back when you are ready.</p>
    </section>`;
    window.scrollTo(0, 0);
    const r = document.getElementById("retry");
    if (r) r.addEventListener("click", () => { const m = S.missed; start("retry-" + S.id, m, "Redo: " + S.title.replace(/^Redo: /, "")); });
    const nm = document.getElementById("nextM");
    if (nm) nm.addEventListener("click", () => start(nextM.id, nextM.items, nextM.title + ": " + nextM.sub));
    document.getElementById("back").addEventListener("click", home);
  }

  // ---------- Keyboard ----------
  document.addEventListener("keydown", (e) => {
    if (document.getElementById("rulesDlg").open) return;
    if (/^[1-4]$/.test(e.key)) { const b = app.querySelectorAll(".choice")[+e.key - 1]; if (b && !b.disabled) b.click(); }
    if (e.key === "Enter" && document.activeElement === document.body) { const n = document.getElementById("next"); if (n && !n.closest("[hidden]")) n.click(); }
  });

  // ---------- Rules + size ----------
  const dlg = document.getElementById("rulesDlg");
  document.getElementById("rulesList").innerHTML = RULES.map((r) => `<div class="rule"><h3>${r.name}</h3><div class="r-math">${r.rule}</div><p>${r.plain}</p></div>`).join("");
  document.getElementById("rulesBtn").addEventListener("click", () => { dlg.showModal(); math(dlg); });
  document.getElementById("rulesClose").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  const sizeBtn = document.getElementById("sizeBtn");
  const setSize = (on) => { document.documentElement.classList.toggle("big", on); sizeBtn.setAttribute("aria-pressed", on); store.set("eq-big", on); };
  sizeBtn.addEventListener("click", () => setSize(!document.documentElement.classList.contains("big")));
  setSize(store.get("eq-big", false));
  document.getElementById("homeBtn").addEventListener("click", () => { if (!S || S.done || confirm("Go back to missions? Progress in this mission will be lost.")) { home(); } });

  window.addEventListener("load", home);
})();
