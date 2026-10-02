/* ===================== ENGINE ===================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const range = (v, a, b) => clamp((v - a) / (b - a));
const eOut = t => 1 - Math.pow(1 - t, 3);
const eIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const pad = n => String(n).padStart(2, '0');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const html = document.documentElement;
if (fine) html.classList.add('fine');
if (reduce) html.classList.add('rm');
const I = n => 'img/' + n;
const ARR = '<svg viewBox="0 0 16 16" aria-hidden="true"><use href="#arr"/></svg>';
const btn = (label, href, cls = 'b-em') => `<a class="btn ${cls}" href="${href}" data-link><span>${label}</span><span class="ic">${ARR}</span></a>`;
const scrollBtn = (label, target, cls = 'b-ghost') => `<a class="btn ${cls}" href="#${target}" data-scroll="${target}"><span>${label}</span></a>`;

/* ---------- state ---------- */
const S = { y: 0, vy: 0, lastY: 0, mx: innerWidth / 2, my: innerHeight / 2, nx: 0, ny: 0, t0: performance.now(), route: null, scenes: [], ticks: [], lenis: null, busy: false };

/* ---------- text split ---------- */
function splitWords(el) {
  if (!el || el.dataset.sp) return; el.dataset.sp = 1;
  let i = 0;
  const walk = node => [...node.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(w => {
        if (!w) return;
        if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(w)); return; }
        const o = document.createElement('span'); o.className = 'w';
        const s = document.createElement('span'); s.textContent = w; s.style.setProperty('--i', i++);
        o.appendChild(s); f.appendChild(o);
      });
      c.replaceWith(f);
    } else if (c.nodeType === 1 && c.tagName !== 'BR' && !c.classList.contains('seed')) walk(c);
  });
  walk(el);
}

/* ---------- counters ---------- */
function parseNum(t) {
  if (!t || t.includes('[')) return null;
  const m = t.trim().match(/^([+\-]?)(Rp)?([\d][\d,]*\.?\d*)(.*)$/);
  if (!m) return null;
  const raw = m[3], dec = (raw.split('.')[1] || '').length;
  return { pre: m[1] + (m[2] || ''), val: parseFloat(raw.replace(/,/g, '')), dec, comma: raw.includes(','), suf: m[4] };
}
function countUp(el) {
  if (el.dataset.done) return; el.dataset.done = 1;
  const n = parseNum(el.textContent); if (!n || !isFinite(n.val)) return;
  if (reduce) return;
  const t0 = performance.now(), d = 1600;
  const fmt = v => n.pre + (n.comma ? v.toLocaleString('en-US', { minimumFractionDigits: n.dec, maximumFractionDigits: n.dec }) : v.toFixed(n.dec)) + n.suf;
  const step = t => { const k = eOut(clamp((t - t0) / d)); el.textContent = fmt(n.val * k); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* ---------- observers ---------- */
let io = null;
function observe(root) {
  $$('.split', root).forEach(splitWords);
  if (!('IntersectionObserver' in window) || reduce) { $$('.rv,.split', root).forEach(e => e.classList.add('in')); $$('[data-count]:not([data-manual])', root).forEach(countUp); return; }
  if (!io) io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target;
    if (t.hasAttribute('data-count')) countUp(t); else t.classList.add('in');
    io.unobserve(t);
  }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
  $$('.rv,.split', root).forEach(e => { if (!e.closest('.fly-copy')) io.observe(e); });
  $$('[data-count]:not([data-manual])', root).forEach(e => io.observe(e));
}

/* ---------- scene engine ---------- */
function scene(el, fn) { if (!el) return null; const s = { el, fn, top: 0, h: 0 }; S.scenes.push(s); return s; }
function tick(fn) { S.ticks.push(fn); }
function measure() {
  const y = scrollY;
  S.scenes.forEach(s => { const r = s.el.getBoundingClientRect(); s.top = r.top + y; s.h = s.el.offsetHeight; });
}
function runScenes(t) {
  const y = S.y, vh = innerHeight;
  for (const s of S.scenes) {
    if (y + vh < s.top - vh * .25 || y > s.top + s.h + vh * .25) { s.vis = false; continue; }
    s.vis = true;
    const p = clamp((y - s.top) / Math.max(1, s.h - vh));
    const pv = clamp((y + vh - s.top) / (s.h + vh));
    s.fn(p, pv, t);
  }
}

/* ---------- canvas helper ---------- */
function fitCanvas(cv, maxDpr = 1.6) {
  const dpr = Math.min(devicePixelRatio || 1, maxDpr);
  const w = cv.clientWidth, h = cv.clientHeight;
  if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

/* ---------- loader ---------- */
function runLoader(done) {
  const L = $('#loader'), cv = $('#lcv'), num = $('#lNum'), bar = $('#lBar');
  let seen = null; try { seen = sessionStorage.getItem('oo-seen'); } catch (e) {}
  const DUR = reduce ? 500 : seen ? 1500 : 2900;
  document.body.classList.add('lock');
  // sample the logo shape into target points
  const pts = [];
  if (!reduce) {
    const oc = document.createElement('canvas'); oc.width = oc.height = 200; const o = oc.getContext('2d');
    o.lineCap = 'round'; o.lineWidth = 40; o.strokeStyle = '#fff'; o.stroke(new Path2D('M146 70 A58 58 0 1 0 114 162'));
    o.fillStyle = '#0f0'; o.fill(new Path2D('M134 130c14-9 35-4 37 13 3 14-11 27-26 24-14-2-23-16-21-26 1-5 5-8 10-11z'));
    const data = o.getImageData(0, 0, 200, 200).data;
    for (let y = 0; y < 200; y += 4) for (let x = 0; x < 200; x += 4) { const k = (y * 200 + x) * 4; if (data[k + 3] > 120) pts.push([x - 100, y - 100, data[k] < 60]); }
  }
  const P = [];
  const { w, h } = fitCanvas(cv);
  for (let i = 0; i < Math.min(900, pts.length * 2 || 0); i++) {
    const tg = pts[i % pts.length], a = Math.random() * Math.PI * 2, r = Math.max(w, h) * (.4 + Math.random() * .6);
    P.push({ sx: Math.cos(a) * r, sy: Math.sin(a) * r, tx: tg[0] * .75 + (Math.random() - .5) * 2, ty: tg[1] * .75 + (Math.random() - .5) * 2, g: tg[2], d: Math.random() * .35, s: .6 + Math.random() * 1.3 });
  }
  const t0 = performance.now(); let marked = false, finished = false;
  function frame(now) {
    if (finished) return;
    const k = clamp((now - t0) / DUR), e = (now - t0) / 1000;
    const { ctx, w, h } = fitCanvas(cv);
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, sc = Math.min(w, h) / 420;
    const fade = 1 - range(k, .58, .8);
    if (fade > 0) for (const p of P) {
      const q = eIO(range(k, p.d * .6, .55 + p.d * .2));
      const x = cx + lerp(p.sx, p.tx, q) + Math.sin(e * 3 + p.sx) * (1 - q) * 6;
      const y = cy + lerp(p.sy, p.ty, q) + Math.cos(e * 2.6 + p.sy) * (1 - q) * 6;
      ctx.globalAlpha = (.25 + q * .75) * fade;
      ctx.fillStyle = p.g ? '#1FAE5E' : (q > .9 ? '#ffffff' : '#96E1B9');
      ctx.fillRect(x, y, p.s, p.s);
    }
    ctx.globalAlpha = 1;
    if (!marked && k > .55) { marked = true; L.classList.add('mark'); }
    const pct = Math.round(eOut(k) * 100);
    num.textContent = String(pct).padStart(3, '0'); bar.style.width = pct + '%';
    if (k < 1) requestAnimationFrame(frame); else finish();
  }
  function finish() {
    if (finished) return; finished = true;
    try { sessionStorage.setItem('oo-seen', '1'); } catch (e) {}
    L.classList.add('mark', 'open');
    document.body.classList.remove('lock');
    done();
    setTimeout(() => L.remove(), 1400);
  }
  if (!L) { done(); return; }
  if (reduce) { L.classList.add('mark'); setTimeout(finish, DUR); }
  else requestAnimationFrame(frame);
  setTimeout(finish, DUR + 2500); // fail-safe
}

/* ---------- cursor ---------- */
const cur = $('#cur'), cring = $('#cring'), clab = $('#clab');
let rx = S.mx, ry = S.my;
addEventListener('pointermove', e => { S.mx = e.clientX; S.my = e.clientY; S.nx = e.clientX / innerWidth - .5; S.ny = e.clientY / innerHeight - .5; }, { passive: true });
document.addEventListener('pointerover', e => {
  if (!fine) return;
  const t = e.target.closest ? e.target : null; if (!t) return;
  const lab = t.closest('[data-cur]');
  if (lab) { cring.classList.add('big'); cring.classList.remove('hov'); clab.textContent = lab.dataset.cur; return; }
  cring.classList.remove('big');
  cring.classList.toggle('hov', !!t.closest('a,button,summary,input,textarea,[tabindex]'));
});
document.addEventListener('pointerleave', () => { cur.style.opacity = cring.style.opacity = 0; });
document.addEventListener('pointerenter', () => { cur.style.opacity = cring.style.opacity = 1; });


/* ---------- nav ---------- */
const nav = $('#nav'), menu = $('#menu'), mbtn = $('#mbtn');
function setMenu(open) {
  menu.classList.toggle('open', open); mbtn.setAttribute('aria-expanded', open);
  mbtn.lastChild.textContent = open ? 'Close' : 'Menu';
  if (S.lenis) open ? S.lenis.stop() : S.lenis.start();
  document.body.classList.toggle('lock', open);
}
mbtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });

/* ---------- router ---------- */
const PAGE_NAMES = { home: 'Home', work: 'Work', case: 'Case study', services: 'Services', service: 'Service', about: 'About', journal: 'Journal', post: 'Article', contact: 'Contact' };
function parseRoute(h) {
  h = (h || '').replace(/^#\/?/, '');
  if (!h || h === 'home' || h === 'top') return { page: 'home' };
  if (h.startsWith('work-') && projBySlug[h.slice(5)]) return { page: 'case', arg: h.slice(5) };
  if (h.startsWith('service-') && svcBySlug[h.slice(8)]) return { page: 'service', arg: h.slice(8) };
  if (h.startsWith('post-') && postBySlug[h.slice(5)]) return { page: 'post', arg: h.slice(5) };
  if (['work', 'services', 'about', 'journal', 'contact'].includes(h)) return { page: h };
  return { page: 'home' };
}
function render(route) {
  S.scenes = []; S.ticks = [];
  const app = $('#app');
  app.innerHTML = PAGES[route.page](route.arg);
  S.route = route;
  document.title = (route.page === 'home' ? 'Organoo Studio — Digital agency in Jakarta' : `${pageTitle(route)} — Organoo Studio`);
  $$('.nav .it').forEach(a => a.classList.toggle('on', a.dataset.nav === route.page || (a.dataset.nav === 'work' && route.page === 'case') || (a.dataset.nav === 'services' && route.page === 'service') || (a.dataset.nav === 'journal' && route.page === 'post')));
  window.scrollTo(0, 0); if (S.lenis) S.lenis.scrollTo(0, { immediate: true });
  INIT[route.page] && INIT[route.page](route.arg);
  initCommon(app);
  observe(app);
  requestAnimationFrame(() => { measure(); if (S.lenis) S.lenis.resize(); });
  setTimeout(measure, 400); setTimeout(measure, 1500);
}
function pageTitle(r) {
  if (r.page === 'case') return projBySlug[r.arg].title;
  if (r.page === 'service') return svcBySlug[r.arg].name;
  if (r.page === 'post') return postBySlug[r.arg].title;
  return PAGE_NAMES[r.page];
}
const ptr = $('#ptr'), ptName = $('#ptName');
let ignoreHash = false;
function go(hash, x = innerWidth / 2, y = innerHeight / 2) {
  const route = parseRoute(hash);
  if (menu.classList.contains('open')) setMenu(false);
  if (S.busy) return;
  if (S.route && route.page === S.route.page && route.arg === S.route.arg) { S.lenis ? S.lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' }); return; }
  if (reduce) { ignoreHash = true; location.hash = hash; render(route); return; }
  S.busy = true;
  ptr.style.setProperty('--tx', x + 'px'); ptr.style.setProperty('--ty', y + 'px');
  ptName.textContent = pageTitle(route);
  ptr.classList.remove('leave'); void ptr.offsetWidth; ptr.classList.add('cover');
  setTimeout(() => {
    ignoreHash = true; location.hash = hash;
    render(route);
    ptr.classList.add('leave');
    setTimeout(() => { ptr.classList.remove('cover', 'leave'); S.busy = false; }, 850);
  }, 760);
}
addEventListener('hashchange', () => { if (ignoreHash) { ignoreHash = false; return; } render(parseRoute(location.hash)); });
document.addEventListener('click', e => {
  const sc = e.target.closest('[data-scroll]');
  if (sc) {
    e.preventDefault(); const el = document.getElementById(sc.dataset.scroll); if (!el) return;
    S.lenis ? S.lenis.scrollTo(el, { offset: -20 }) : el.scrollIntoView({ behavior: 'smooth' }); return;
  }
  const a = e.target.closest('a[data-link]');
  if (a && a.getAttribute('href').startsWith('#')) { e.preventDefault(); go(a.getAttribute('href'), e.clientX || innerWidth / 2, e.clientY || innerHeight / 2); }
});

/* ---------- main loop ---------- */
function loop(now) {
  if (S.lenis) S.lenis.raf(now);
  const y = scrollY;
  S.vy = lerp(S.vy, y - S.lastY, .2); S.lastY = y; S.y = y;
  // nav hide on scroll down
  if (y > 180 && S.vy > 2) nav.classList.add('hide'); else if (S.vy < -2 || y < 180) nav.classList.remove('hide');
  // cursor
  if (fine) {
    rx = lerp(rx, S.mx, .18); ry = lerp(ry, S.my, .18);
    cur.style.transform = `translate(${S.mx}px,${S.my}px)`;
    cring.style.transform = `translate(${rx}px,${ry}px)`;
  }
  // chrome light sweep
  const lp = document.getElementById('lp');
  if (lp && !reduce) { const t = now / 1000; lp.setAttribute('x', 100 + Math.cos(t * .7) * 95); lp.setAttribute('y', 60 + Math.sin(t * .9) * 70); }
  runScenes(now);
  for (const f of S.ticks) f(now);
  requestAnimationFrame(loop);
}
addEventListener('resize', () => { measure(); });

/* ---------- boot ---------- */
function boot() {
  if (!reduce && window.Lenis) {
    S.lenis = new Lenis({ lerp: .1, wheelMultiplier: 1, smoothWheel: true });
    html.classList.add('lenis');
  }
  render(parseRoute(location.hash));
  requestAnimationFrame(loop);
  runLoader(() => {
    S.loaded = true;
    $$('.fly-copy .split').forEach(e => e.classList.add('in'));
    $$('.fly-copy .seed').forEach(e => e.classList.add('in'));
    setTimeout(() => $$('.fly-copy .rv').forEach(e => e.classList.add('in')), 300);
    measure();
  });
}
