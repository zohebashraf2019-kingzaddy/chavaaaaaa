/* ==========================================================
   Chava Márquez · site script
   ----------------------------------------------------------
   SETUP: fill these in before going live.
   - formEndpoint: a Formspree (or similar) URL, e.g.
       "https://formspree.io/f/abcdwxyz"
     Booking + contact forms POST here and land in Chava's inbox.
   - email: Chava's booking email. Used as a mailto fallback
     when no formEndpoint is set.
   If both are empty, requests are copied to the clipboard and
   the client is sent to Chava's Instagram DMs.
   ========================================================== */
const CONFIG = {
  formEndpoint: "",
  email: "",
  instagram: "chavaaaaaa__",
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Preloader ---------- */
window.addEventListener("load", () => {
  const loader = $(".loader");
  setTimeout(() => {
    loader.classList.add("is-done");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    setTimeout(() => loader.remove(), 1400);
  }, reduced ? 0 : 1700);
});
// safety net if load is slow
setTimeout(() => { document.body.classList.remove("is-loading"); document.body.classList.add("is-ready"); $(".loader")?.classList.add("is-done"); }, 5000);

$("#yr").textContent = new Date().getFullYear();

/* ---------- Nav: scrolled state, hide on scroll down ---------- */
const nav = $(".nav");
let lastY = 0;
const fab = $(".fab");
addEventListener("scroll", () => {
  const y = scrollY;
  nav.classList.toggle("is-scrolled", y > 40);
  nav.classList.toggle("is-hidden", y > 500 && y > lastY && !document.body.classList.contains("menu-open"));
  lastY = y;
  const book = $("#book").getBoundingClientRect();
  fab.classList.toggle("is-show", y > innerHeight * .8 && !(book.top < innerHeight && book.bottom > 0));
}, { passive: true });

/* ---------- Mobile menu ---------- */
const toggle = $(".nav__toggle");
const setMenu = (open) => {
  document.body.classList.toggle("menu-open", open);
  toggle.setAttribute("aria-expanded", open);
  $(".menu").setAttribute("aria-hidden", !open);
  document.body.style.overflow = open ? "hidden" : "";
};
toggle.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
$$(".menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));

/* ---------- Hero slideshow ---------- */
const slides = $$(".arch img");
const places = ["Mountain Sunset", "Ranch Session", "City Hall", "Under the Veil"];
let si = 0;
if (!reduced) setInterval(() => {
  slides[si].classList.remove("is-active");
  si = (si + 1) % slides.length;
  slides[si].classList.add("is-active");
  $(".hero__count").textContent = String(si + 1).padStart(2, "0");
  $(".hero__place").textContent = places[si];
}, 4800);

/* ---------- Scroll reveals ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
}, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
$$(".reveal, .tile").forEach(el => io.observe(el));

/* ---------- Word-by-word statement ---------- */
const stmt = $(".split-words");
stmt.innerHTML = stmt.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span> `).join("");
const words = $$(".w", stmt);
const lightWords = () => {
  const r = stmt.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .35)));
  const n = Math.round(p * words.length);
  words.forEach((w, i) => w.classList.toggle("on", i < n));
};
if (reduced) words.forEach(w => w.classList.add("on"));
else { addEventListener("scroll", lightWords, { passive: true }); lightWords(); }

/* ---------- Parallax ---------- */
const para = $$("[data-parallax] img, [data-parallax-soft] img");
const parallax = () => {
  para.forEach(img => {
    const r = img.parentElement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const soft = img.parentElement.hasAttribute("data-parallax-soft");
    const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
    img.style.transform = `translate3d(0, ${p * (soft ? -60 : -120)}px, 0)`;
  });
};
if (!reduced) { addEventListener("scroll", () => requestAnimationFrame(parallax), { passive: true }); parallax(); }

/* ---------- Custom cursor + magnetic buttons ---------- */
if (finePointer && !reduced) {
  const cur = $(".cursor");
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener("mousemove", e => { x = e.clientX; y = e.clientY; cur.style.opacity = 1; });
  document.addEventListener("mouseleave", () => cur.style.opacity = 0);
  (function loop() { cx += (x - cx) * .2; cy += (y - cy) * .2; cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; requestAnimationFrame(loop); })();
  $$(".tile").forEach(t => { t.addEventListener("mouseenter", () => cur.classList.add("is-view")); t.addEventListener("mouseleave", () => cur.classList.remove("is-view")); });
  $$("a, button, .chip").forEach(t => { if (t.closest(".tile")) return; t.addEventListener("mouseenter", () => cur.classList.add("is-link")); t.addEventListener("mouseleave", () => cur.classList.remove("is-link")); });

  $$(".magnetic").forEach(b => {
    b.addEventListener("mousemove", e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    b.addEventListener("mouseleave", () => b.style.transform = "");
  });
}

/* ---------- Portfolio filters ---------- */
const tiles = $$(".tile");
$$(".filters button").forEach(btn => btn.addEventListener("click", () => {
  $$(".filters button").forEach(b => b.classList.toggle("is-active", b === btn));
  const f = btn.dataset.filter;
  tiles.forEach(t => {
    const show = f === "all" || t.dataset.cat === f;
    t.classList.toggle("is-hidden", !show);
    if (show) { t.classList.remove("is-in"); requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add("is-in"))); }
  });
}));

/* ---------- Lightbox ---------- */
const lb = $(".lightbox"), lbImg = $("img", lb), lbCap = $("figcaption", lb);
let li = 0;
const visible = () => tiles.filter(t => !t.classList.contains("is-hidden"));
const show = (i) => {
  const list = visible(); li = (i + list.length) % list.length;
  const t = list[li], img = $("img", t), cap = $("figcaption", t);
  lbImg.classList.remove("is-loaded");
  lbImg.onload = () => lbImg.classList.add("is-loaded");
  lbImg.src = img.src; lbImg.alt = img.alt;
  if (lbImg.complete) lbImg.classList.add("is-loaded");
  lbCap.innerHTML = `<em>${$("span", cap).textContent}</em>${cap.lastChild.textContent}`;
};
const openLb = (t) => { show(visible().indexOf(t)); lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; $(".lightbox__close").focus(); };
const closeLb = () => { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
tiles.forEach(t => { t.tabIndex = 0; t.addEventListener("click", () => openLb(t)); t.addEventListener("keydown", e => { if (e.key === "Enter") openLb(t); }); });
$(".lightbox__close").addEventListener("click", closeLb);
$(".lightbox__prev").addEventListener("click", () => show(li - 1));
$(".lightbox__next").addEventListener("click", () => show(li + 1));
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
addEventListener("keydown", e => {
  if (!lb.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowRight") show(li + 1);
  if (e.key === "ArrowLeft") show(li - 1);
});
let tx = 0;
lb.addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
lb.addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(li + (d < 0 ? 1 : -1)); });

/* ---------- Services hover preview ---------- */
const pv = $(".svc-preview img");
$$(".svc").forEach(s => s.addEventListener("mouseenter", () => {
  if (pv.getAttribute("src") === s.dataset.img) return;
  pv.classList.add("is-swap");
  setTimeout(() => { pv.src = s.dataset.img; pv.onload = () => pv.classList.remove("is-swap"); }, 250);
}));

/* ---------- Stat counters ---------- */
const cio = new IntersectionObserver((entries) => entries.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1800;
  const tick = (t) => { const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3))); el.textContent = v.toLocaleString(); if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick); cio.unobserve(el);
}), { threshold: .6 });
$$(".stat").forEach(s => cio.observe(s));

/* ---------- Studio video ---------- */
const vid = $("#studio-video"), vwrap = $(".studio__video");
$(".play").addEventListener("click", () => { vid.controls = true; vid.play(); vwrap.classList.add("is-playing"); });
vid.addEventListener("ended", () => { vwrap.classList.remove("is-playing"); vid.controls = false; });

/* ---------- Sending helper ---------- */
async function send(subject, data) {
  const text = `${subject}\n\n` + Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
  if (CONFIG.formEndpoint) {
    const res = await fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ _subject: subject, ...data }) });
    if (!res.ok) throw new Error("Form service error");
    return { via: "form", text };
  }
  if (CONFIG.email) {
    location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    return { via: "email", text };
  }
  try { await navigator.clipboard.writeText(text); } catch (_) {}
  return { via: "dm", text };
}
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ---------- Express booking ---------- */
const booker = $("#booker");
const steps = $$(".step", booker);
const dots = $$(".booker__steps li", booker);
const bar = $(".booker__progress span", booker);
let cur = 1;
$("#b-date").min = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().split("T")[0];

const go = (n) => {
  cur = n;
  steps.forEach(s => s.classList.toggle("is-active", s.dataset.step == n));
  dots.forEach((d, i) => d.classList.toggle("is-on", n === "done" || i < n));
  bar.style.width = n === "done" ? "100%" : `${(n / 3) * 100}%`;
  if (n === 3) renderSummary();
  const top = booker.getBoundingClientRect().top;
  if (top < 60) scrollTo({ top: scrollY + top - 100, behavior: "smooth" });
};
const val = (name) => (booker.elements[name]?.value ?? (booker.querySelector(`[name="${name}"]:checked`)?.value || "")).trim();
const radio = (name) => booker.querySelector(`[name="${name}"]:checked`)?.value || "";
const err = (msg) => { const e = $(".step.is-active .step__error", booker); if (e) e.textContent = msg || ""; };

function check(n) {
  $$(".is-bad", booker).forEach(x => x.classList.remove("is-bad"));
  if (n === 1 && !radio("session")) return err("Choose a session type to continue."), false;
  if (n === 2 && !booker.elements.date.value) return booker.elements.date.classList.add("is-bad"), err("Pick a preferred date (it can change later)."), false;
  if (n === 3) {
    const name = booker.elements.name, email = booker.elements.email;
    if (!name.value.trim()) return name.classList.add("is-bad"), err("Please add your name."), false;
    if (!validEmail(email.value.trim())) return email.classList.add("is-bad"), err("Please add a valid email so Chava can reply."), false;
  }
  err(""); return true;
}

function renderSummary() {
  const d = booker.elements.date.value ? new Date(booker.elements.date.value + "T12:00").toLocaleDateString(undefined, { weekday: "short", month: "long", day: "numeric", year: "numeric" }) : "";
  $(".summary", booker).innerHTML = `<span><b>Session</b>${radio("session")}</span><span><b>Coverage</b>${radio("coverage")}</span><span><b>Date</b>${d}</span><span><b>Light</b>${radio("time")}</span>`;
}

$$("[data-next]", booker).forEach(b => b.addEventListener("click", () => { if (check(cur)) go(cur + 1); }));
$$("[data-prev]", booker).forEach(b => b.addEventListener("click", () => go(cur - 1)));
$$('[name="session"]', booker).forEach(r => r.addEventListener("change", () => setTimeout(() => { if (cur === 1) err(""); }, 0)));

// "Book →" links in Services preselect the session
$$("[data-session]").forEach(a => a.addEventListener("click", () => {
  const r = booker.querySelector(`[name="session"][value="${a.dataset.session}"]`);
  if (r) { r.checked = true; go(1); }
}));

booker.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!check(3)) return;
  const btn = $('button[type="submit"]', booker); btn.disabled = true; btn.textContent = "Sending…";
  const data = {
    Session: radio("session"), Coverage: radio("coverage"), Date: booker.elements.date.value, Light: radio("time"),
    Location: val("location"), Name: val("name"), Email: val("email"), Phone: val("phone"), Instagram: val("instagram"), Notes: val("notes"),
  };
  try {
    const r = await send(`Booking request: ${data.Session} on ${data.Date}`, data);
    const msg = $(".done__msg", booker), hint = $("#dm-hint");
    if (r.via === "dm") {
      $(".step--done h3", booker).textContent = "Almost done.";
      msg.textContent = "Your request is ready! Tap below to send it to Chava on Instagram.";
      hint.textContent = "Your booking details were copied, so just paste them into the DM.";
      $("#dm-link").textContent = "Send on Instagram →";
    } else {
      msg.textContent = `Thank you, ${data.Name.split(" ")[0]}! Chava will reach out shortly with availability and rates.`;
      hint.textContent = ""; $(".step--done h3", booker).textContent = "Request received.";
    }
    $("#dm-link").href = `https://ig.me/m/${CONFIG.instagram}`;
    go("done");
  } catch (_) {
    err("Something went wrong. Please try again or DM @" + CONFIG.instagram + " on Instagram.");
  } finally { btn.disabled = false; btn.textContent = "Request my date ✦"; }
});
$("#book-again").addEventListener("click", () => { booker.reset(); go(1); });

/* ---------- Contact form ---------- */
const cform = $("#cform");
cform.addEventListener("submit", async (e) => {
  e.preventDefault();
  const el = cform.elements, errEl = $(".step__error", cform), ok = $(".cform__ok", cform);
  $$(".is-bad", cform).forEach(x => x.classList.remove("is-bad"));
  ok.textContent = "";
  if (!el.name.value.trim()) return el.name.classList.add("is-bad"), errEl.textContent = "Please add your name.";
  if (!validEmail(el.email.value.trim())) return el.email.classList.add("is-bad"), errEl.textContent = "Please add a valid email.";
  if (!el.message.value.trim()) return el.message.classList.add("is-bad"), errEl.textContent = "Write a short message.";
  errEl.textContent = "";
  const btn = $('button[type="submit"]', cform); btn.disabled = true; btn.textContent = "Sending…";
  const data = { Name: el.name.value.trim(), Email: el.email.value.trim(), Phone: el.phone.value.trim(), Type: el.type.value, Message: el.message.value.trim() };
  try {
    const r = await send(`Website inquiry: ${data.Type}`, data);
    if (r.via === "dm") {
      ok.innerHTML = `Message copied! <a href="https://ig.me/m/${CONFIG.instagram}" target="_blank" rel="noopener">Paste it in a DM to @${CONFIG.instagram} →</a>`;
    } else {
      ok.textContent = "Thank you! Your message is on its way. Chava will reply soon.";
      cform.reset();
    }
  } catch (_) {
    errEl.textContent = "Something went wrong. Please DM @" + CONFIG.instagram + " on Instagram.";
  } finally { btn.disabled = false; btn.textContent = "Send message"; }
});
