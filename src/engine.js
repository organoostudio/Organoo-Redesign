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
const I = n => '/img/' + n;
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
    o.fillStyle = '#fff'; o.fill(new Path2D('M97.56 50.24C96.84 50.29 96.13 50.41 95.42 50.51C94.71 50.61 94.00 50.72 93.30 50.85C92.59 50.97 91.89 51.11 91.18 51.26C90.48 51.40 89.78 51.55 89.08 51.72C88.38 51.88 87.68 52.04 86.99 52.22C86.29 52.41 85.60 52.60 84.92 52.82C84.23 53.03 83.56 53.28 82.88 53.53C82.21 53.78 81.54 54.04 80.88 54.32C80.22 54.59 79.56 54.88 78.91 55.17C78.26 55.47 77.60 55.78 76.97 56.11C76.33 56.44 75.72 56.82 75.10 57.18C74.48 57.54 73.86 57.90 73.25 58.28C72.65 58.67 72.06 59.08 71.47 59.50C70.89 59.91 70.30 60.32 69.73 60.76C69.16 61.19 68.60 61.64 68.05 62.10C67.50 62.56 66.95 63.02 66.42 63.51C65.89 63.99 65.38 64.50 64.87 65.01C64.37 65.52 63.88 66.05 63.41 66.58C62.93 67.12 62.46 67.67 62.01 68.22C61.56 68.78 61.12 69.35 60.69 69.93C60.27 70.50 59.85 71.09 59.43 71.67C59.02 72.26 58.60 72.84 58.21 73.44C57.82 74.05 57.46 74.67 57.10 75.29C56.75 75.91 56.39 76.54 56.06 77.18C55.74 77.81 55.43 78.47 55.13 79.11C54.82 79.76 54.51 80.41 54.23 81.07C53.96 81.74 53.71 82.41 53.46 83.08C53.22 83.76 52.98 84.44 52.77 85.12C52.55 85.81 52.36 86.50 52.18 87.19C52.00 87.88 51.83 88.58 51.68 89.29C51.54 89.99 51.43 90.70 51.29 91.40C51.16 92.11 51.02 92.81 50.89 93.52C50.77 94.22 50.64 94.93 50.54 95.64C50.45 96.35 50.39 97.07 50.33 97.78C50.27 98.50 50.20 99.21 50.20 99.93C50.19 100.65 50.24 101.37 50.29 102.08C50.35 102.79 50.42 103.51 50.52 104.22C50.62 104.93 50.75 105.64 50.87 106.34C51.00 107.05 51.13 107.76 51.27 108.46C51.41 109.16 51.56 109.87 51.71 110.57C51.86 111.27 52.00 111.98 52.18 112.67C52.35 113.36 52.56 114.05 52.78 114.73C52.99 115.42 53.23 116.10 53.47 116.77C53.72 117.45 53.98 118.12 54.25 118.78C54.53 119.44 54.82 120.10 55.12 120.75C55.43 121.40 55.74 122.04 56.07 122.68C56.40 123.32 56.73 123.95 57.09 124.58C57.45 125.20 57.83 125.81 58.21 126.41C58.60 127.02 59.00 127.61 59.41 128.20C59.83 128.79 60.25 129.37 60.68 129.94C61.12 130.51 61.57 131.07 62.03 131.62C62.49 132.17 62.97 132.70 63.46 133.23C63.94 133.76 64.44 134.27 64.95 134.78C65.46 135.28 65.99 135.77 66.52 136.25C67.05 136.73 67.60 137.20 68.15 137.66C68.70 138.12 69.26 138.57 69.82 139.01C70.39 139.46 70.95 139.90 71.53 140.32C72.11 140.74 72.71 141.15 73.31 141.53C73.92 141.91 74.54 142.27 75.17 142.63C75.79 142.98 76.42 143.32 77.06 143.66C77.69 143.99 78.32 144.33 78.97 144.64C79.62 144.95 80.27 145.24 80.94 145.51C81.60 145.78 82.28 146.04 82.96 146.26C83.64 146.48 84.33 146.71 85.03 146.86C85.73 147.01 86.44 147.13 87.15 147.16C87.87 147.20 88.60 147.17 89.30 147.05C90.00 146.94 90.71 146.74 91.37 146.48C92.03 146.22 92.68 145.88 93.28 145.49C93.88 145.11 94.46 144.67 94.99 144.19C95.52 143.71 96.01 143.17 96.45 142.61C96.88 142.04 97.26 141.42 97.60 140.79C97.94 140.16 98.24 139.50 98.48 138.83C98.72 138.16 98.90 137.45 99.06 136.76C99.22 136.06 99.35 135.35 99.43 134.64C99.50 133.93 99.53 133.20 99.51 132.49C99.49 131.77 99.42 131.05 99.30 130.35C99.19 129.64 99.02 128.93 98.80 128.25C98.58 127.57 98.28 126.92 97.97 126.27C97.66 125.62 97.33 124.98 96.94 124.38C96.56 123.78 96.11 123.21 95.65 122.66C95.20 122.10 94.71 121.57 94.21 121.06C93.72 120.54 93.19 120.05 92.66 119.57C92.14 119.08 91.60 118.61 91.05 118.15C90.50 117.69 89.91 117.27 89.36 116.81C88.81 116.35 88.27 115.87 87.74 115.40C87.20 114.92 86.64 114.47 86.14 113.95C85.64 113.44 85.17 112.89 84.72 112.33C84.28 111.77 83.86 111.18 83.47 110.58C83.09 109.98 82.73 109.35 82.41 108.71C82.09 108.07 81.80 107.41 81.53 106.74C81.27 106.08 81.01 105.40 80.81 104.71C80.62 104.03 80.48 103.32 80.36 102.61C80.24 101.90 80.13 101.19 80.10 100.47C80.07 99.76 80.10 99.04 80.16 98.33C80.23 97.61 80.32 96.90 80.47 96.20C80.62 95.50 80.83 94.81 81.07 94.13C81.30 93.45 81.57 92.79 81.87 92.13C82.17 91.48 82.51 90.85 82.86 90.22C83.22 89.60 83.59 88.98 84.01 88.40C84.42 87.82 84.88 87.26 85.36 86.73C85.84 86.20 86.36 85.69 86.90 85.22C87.44 84.75 88.01 84.31 88.60 83.90C89.19 83.49 89.79 83.10 90.42 82.75C91.05 82.41 91.69 82.09 92.35 81.81C93.01 81.53 93.69 81.29 94.38 81.07C95.06 80.86 95.75 80.66 96.45 80.51C97.15 80.36 97.86 80.23 98.57 80.18C99.29 80.12 100.01 80.14 100.72 80.17C101.44 80.21 102.15 80.27 102.86 80.39C103.56 80.52 104.26 80.70 104.95 80.91C105.63 81.11 106.31 81.38 106.97 81.64C107.63 81.91 108.30 82.19 108.93 82.52C109.57 82.85 110.19 83.22 110.79 83.61C111.39 84.00 111.98 84.42 112.53 84.87C113.09 85.32 113.63 85.80 114.13 86.31C114.64 86.82 115.10 87.38 115.57 87.92C116.04 88.46 116.50 89.00 116.96 89.56C117.42 90.11 117.84 90.69 118.30 91.24C118.76 91.79 119.23 92.33 119.72 92.86C120.20 93.39 120.69 93.92 121.21 94.41C121.73 94.91 122.26 95.39 122.83 95.84C123.39 96.28 123.98 96.70 124.59 97.07C125.20 97.45 125.84 97.79 126.49 98.08C127.14 98.38 127.81 98.65 128.49 98.86C129.17 99.07 129.88 99.23 130.59 99.34C131.29 99.45 132.02 99.50 132.73 99.51C133.45 99.52 134.17 99.50 134.88 99.42C135.59 99.33 136.30 99.19 136.99 99.02C137.69 98.85 138.38 98.65 139.05 98.39C139.72 98.14 140.38 97.83 141.00 97.48C141.62 97.13 142.24 96.74 142.80 96.30C143.36 95.86 143.89 95.36 144.37 94.83C144.85 94.30 145.28 93.72 145.65 93.10C146.02 92.49 146.34 91.84 146.58 91.17C146.83 90.50 147.05 89.80 147.14 89.09C147.24 88.39 147.22 87.65 147.16 86.94C147.11 86.23 146.99 85.51 146.83 84.82C146.66 84.12 146.42 83.44 146.18 82.77C145.95 82.09 145.69 81.42 145.43 80.75C145.16 80.09 144.89 79.42 144.59 78.77C144.29 78.12 143.97 77.48 143.63 76.84C143.30 76.21 142.95 75.58 142.58 74.96C142.21 74.35 141.83 73.74 141.43 73.14C141.04 72.54 140.62 71.95 140.20 71.37C139.78 70.80 139.34 70.23 138.89 69.66C138.45 69.10 138.00 68.54 137.54 67.99C137.07 67.45 136.59 66.91 136.11 66.38C135.63 65.85 135.14 65.32 134.64 64.81C134.13 64.30 133.60 63.82 133.07 63.33C132.54 62.85 132.01 62.37 131.46 61.91C130.91 61.45 130.34 61.01 129.76 60.58C129.19 60.15 128.61 59.72 128.02 59.31C127.43 58.91 126.83 58.51 126.23 58.12C125.62 57.74 125.01 57.37 124.38 57.01C123.76 56.66 123.12 56.32 122.49 55.99C121.85 55.67 121.20 55.35 120.55 55.05C119.90 54.75 119.24 54.46 118.58 54.19C117.91 53.92 117.24 53.66 116.57 53.41C115.89 53.17 115.21 52.94 114.53 52.73C113.84 52.51 113.16 52.29 112.46 52.12C111.77 51.94 111.06 51.82 110.36 51.67C109.65 51.52 108.95 51.37 108.25 51.24C107.54 51.11 106.83 51.01 106.12 50.90C105.41 50.78 104.71 50.66 104.00 50.56C103.29 50.46 102.57 50.36 101.86 50.30C101.14 50.24 100.43 50.21 99.71 50.20C98.99 50.19 98.27 50.19 97.56 50.24Z'));
    o.fillStyle = '#0f0'; o.fill(new Path2D('M134.57 116.74C133.84 116.79 133.11 116.86 132.39 116.97C131.67 117.07 130.94 117.20 130.24 117.38C129.53 117.56 128.83 117.78 128.15 118.04C127.47 118.30 126.80 118.61 126.15 118.94C125.51 119.28 124.87 119.66 124.27 120.07C123.67 120.48 123.09 120.94 122.55 121.43C122.01 121.92 121.51 122.46 121.04 123.01C120.57 123.57 120.11 124.15 119.71 124.76C119.31 125.37 118.95 126.01 118.63 126.67C118.32 127.32 118.05 128.01 117.81 128.70C117.58 129.39 117.39 130.10 117.23 130.81C117.08 131.52 116.97 132.25 116.89 132.97C116.80 133.70 116.75 134.43 116.72 135.16C116.69 135.89 116.68 136.62 116.70 137.35C116.72 138.08 116.75 138.81 116.82 139.54C116.89 140.26 116.96 141.00 117.11 141.71C117.27 142.42 117.47 143.14 117.76 143.80C118.04 144.47 118.41 145.12 118.84 145.71C119.26 146.29 119.77 146.84 120.33 147.30C120.89 147.76 121.53 148.17 122.19 148.44C122.85 148.72 123.60 148.89 124.31 148.96C125.03 149.02 125.78 148.97 126.48 148.81C127.18 148.64 127.87 148.33 128.50 147.97C129.12 147.61 129.72 147.14 130.22 146.62C130.72 146.11 131.16 145.49 131.52 144.86C131.88 144.23 132.16 143.54 132.39 142.86C132.62 142.17 132.76 141.44 132.90 140.72C133.04 140.01 133.10 139.27 133.25 138.56C133.40 137.85 133.50 137.09 133.81 136.44C134.11 135.79 134.54 135.14 135.07 134.67C135.59 134.20 136.30 133.89 136.97 133.63C137.65 133.38 138.39 133.28 139.11 133.14C139.82 133.00 140.56 132.94 141.27 132.78C141.98 132.63 142.71 132.48 143.39 132.22C144.06 131.95 144.73 131.62 145.33 131.22C145.94 130.82 146.53 130.35 147.02 129.82C147.51 129.29 147.94 128.67 148.26 128.02C148.57 127.37 148.81 126.64 148.91 125.93C149.02 125.22 149.01 124.46 148.89 123.75C148.76 123.05 148.50 122.33 148.17 121.69C147.84 121.05 147.41 120.43 146.92 119.90C146.43 119.37 145.83 118.91 145.22 118.52C144.60 118.13 143.94 117.80 143.25 117.56C142.57 117.31 141.84 117.16 141.13 117.04C140.41 116.91 139.68 116.85 138.95 116.79C138.22 116.74 137.49 116.71 136.76 116.70C136.03 116.69 135.30 116.70 134.57 116.74Z'));
    const data = o.getImageData(0, 0, 200, 200).data;
    for (let y = 0; y < 200; y += 3) for (let x = 0; x < 200; x += 3) { const k = (y * 200 + x) * 4; if (data[k + 3] > 120) pts.push([(x - 99.6) * 1.6, (y - 99.6) * 1.6, data[k] < 60]); }
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

/* ---------- router (real URLs; build.mjs pre-renders every route to /<path>/index.html) ---------- */
const PAGE_NAMES = { home: 'Home', work: 'Work', case: 'Case study', services: 'Services', service: 'Service', about: 'About', contact: 'Contact' };
const SITE_DESC = 'Organoo Studio is a digital agency from Jakarta for UI/UX & web design, website development, performance marketing on Meta, Google, Amazon and marketplaces, graphic design and video editing.';
const txt = h => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
function parseRoute(path) {
  const [a, b, c] = (path || '/').replace(/^\/+|\/+$/g, '').split('/');
  if (!a || c) return { page: a ? 'missing' : 'home' };
  if (a === 'work' && b) return projBySlug[b] ? { page: 'case', arg: b } : { page: 'missing' };
  if (a === 'services' && b) return svcBySlug[b] ? { page: 'service', arg: b } : { page: 'missing' };
  if (!b && ['work', 'services', 'about', 'contact'].includes(a)) return { page: a };
  return { page: 'missing' };
}
// links from the old hash-routed site (#work-x, #service-x, #contact, #journal …) -> their real URLs
function legacyPath(h) {
  h = (h || '').replace(/^#\/?/, '');
  if (!h) return null;
  if (h.startsWith('work-') && projBySlug[h.slice(5)]) return `/work/${h.slice(5)}/`;
  if (h.startsWith('service-') && svcBySlug[h.slice(8)]) return `/services/${h.slice(8)}/`;
  if (h === 'journal' || h.startsWith('post-')) return '/blog/';
  if (['work', 'services', 'about', 'contact'].includes(h)) return `/${h}/`;
  if (h === 'home' || h === 'top') return '/';
  return null;
}
const routePath = r => r.page === 'home' ? '/' : r.page === 'case' ? `/work/${r.arg}/` : r.page === 'service' ? `/services/${r.arg}/` : `/${r.page}/`;
function routeMeta(r) {
  const s = r.page === 'service' && svcBySlug[r.arg], p = r.page === 'case' && projBySlug[r.arg];
  const m = {
    home: ['Organoo Studio — Digital agency in Jakarta', SITE_DESC],
    work: ['Work — Websites, UI/UX, Ads & Branding Projects | Organoo Studio', 'Selected work by Organoo Studio: UI/UX design, websites, performance ad campaigns, brand identities and live concept demos.'],
    services: ['Services — Web Design, Development, Ads, Design & Video | Organoo Studio', 'UI/UX and web design, website development, performance marketing, graphic design and video editing: one Jakarta team from first idea to measurable growth.'],
    about: ['About Organoo Studio — Digital Agency in Jakarta', 'Meet Organoo Studio, a digital agency from Jakarta designing brands, websites and campaigns that keep growing.'],
    contact: ['Contact Organoo Studio — Start a Project', 'Tell Organoo Studio about your project and get a free 15-minute call and a clear plan for your website, ads, design or video.'],
    missing: ['Page not found — Organoo Studio', SITE_DESC],
    service: s && [`${s.name} in Jakarta | Organoo Studio`, txt(s.lead)],
    case: p && [`${p.title} — ${p.service} Case Study | Organoo Studio`, txt(p.lead)]
  }[r.page];
  return { title: m[0], description: m[1], path: routePath(r) };
}
function setMeta(r) {
  const m = routeMeta(r), url = 'https://organoostudio.com' + m.path;
  document.title = m.title;
  const set = (sel, attr, v) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, v); };
  set('meta[name="description"]', 'content', m.description); set('link[rel="canonical"]', 'href', url);
  set('meta[property="og:title"]', 'content', m.title); set('meta[property="og:description"]', 'content', m.description); set('meta[property="og:url"]', 'content', url);
}
function render(route) {
  S.scenes = []; S.ticks = [];
  const app = $('#app');
  app.innerHTML = PAGES[route.page](route.arg);
  S.route = route;
  setMeta(route);
  $$('.nav .it').forEach(a => a.classList.toggle('on', a.dataset.nav === route.page || (a.dataset.nav === 'work' && route.page === 'case') || (a.dataset.nav === 'services' && route.page === 'service')));
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
  return PAGE_NAMES[r.page] || 'Organoo';
}
const ptr = $('#ptr'), ptName = $('#ptName');
function go(path, x = innerWidth / 2, y = innerHeight / 2) {
  const route = parseRoute(path);
  if (menu.classList.contains('open')) setMenu(false);
  if (S.busy) return;
  if (S.route && route.page === S.route.page && route.arg === S.route.arg) { S.lenis ? S.lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' }); return; }
  if (reduce) { history.pushState(null, '', routePath(route)); render(route); return; }
  S.busy = true;
  ptr.style.setProperty('--tx', x + 'px'); ptr.style.setProperty('--ty', y + 'px');
  ptName.textContent = pageTitle(route);
  ptr.classList.remove('leave'); void ptr.offsetWidth; ptr.classList.add('cover');
  setTimeout(() => {
    history.pushState(null, '', routePath(route));
    render(route);
    ptr.classList.add('leave');
    setTimeout(() => { ptr.classList.remove('cover', 'leave'); S.busy = false; }, 850);
  }, 760);
}
addEventListener('popstate', () => render(parseRoute(location.pathname)));
document.addEventListener('click', e => {
  const sc = e.target.closest('[data-scroll]');
  if (sc) {
    e.preventDefault(); const el = document.getElementById(sc.dataset.scroll); if (!el) return;
    S.lenis ? S.lenis.scrollTo(el, { offset: -20 }) : el.scrollIntoView({ behavior: 'smooth' }); return;
  }
  const a = e.target.closest('a[data-link]');
  if (a && a.getAttribute('href').startsWith('/') && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); go(a.getAttribute('href'), e.clientX || innerWidth / 2, e.clientY || innerHeight / 2); }
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
  const legacy = legacyPath(location.hash);
  if (legacy === '/blog/') { location.replace(legacy); return; }
  if (legacy) history.replaceState(null, '', legacy);
  render(parseRoute(location.pathname));
  requestAnimationFrame(loop);
  runLoader(() => {
    S.loaded = true;
    $$('.fly-copy .split').forEach(e => e.classList.add('in'));
    $$('.fly-copy .seed').forEach(e => e.classList.add('in'));
    setTimeout(() => $$('.fly-copy .rv').forEach(e => e.classList.add('in')), 300);
    measure();
  });
}
