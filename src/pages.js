/* ===================== SHARED BLOCKS ===================== */
const chromeSvg = (cls = '', id = '') => `<svg class="${cls}" ${id ? `id="${id}"` : ''} viewBox="0 0 100 100" aria-hidden="true"><use href="#mkChrome" width="100" height="100"/></svg>`;
const imgTag = (src, light, cls = '') => `<img class="${light ? 'lt ' : ''}${cls}" src="${I(src)}" alt="" loading="lazy" decoding="async">`;

function clientsMarquee() {
  const row = CLIENTS.map(c => `<span class="cl" style="${c[1]}">${c[0]}</span><i class="sep"></i>`).join('');
  return `<section class="clients" aria-label="Clients"><div class="cap"><span>Trusted by growing brands &amp; institutions</span><span>Selected clients</span></div>
  <div class="mq" id="mq"><div class="grp">${row}</div><div class="grp" aria-hidden="true">${row}</div></div></section>`;
}
function teamBlock() {
  return `<section class="team" id="team"><div class="hd"><span class="lbl">The studio</span><h2 class="split" style="margin-top:16px">Meet the <em class="s">team</em></h2>
    <div class="ct"><span class="brk" id="tct">[01 / ${pad(TEAM.length)}]</span><span class="pill">↔ Drag</span></div></div>
    <div class="track-wrap" id="twrap" data-cur="Drag"><div class="ttrack" id="ttrack">${TEAM.map((m, i) => `<div class="tm${i === 0 ? ' on' : ''}" data-i="${i}"><div class="inner"><span class="fr"></span><div class="ph"><span class="rim"></span><span class="ini">${m[1]}</span></div></div></div>`).join('')}</div></div>
    <div class="tinfo"><h3 id="tname">${TEAM[0][0]}</h3><div class="tags" id="ttags">${TEAM[0][2].map(x => `<span class="brk">[${x}]</span>`).join('')}</div><p class="tnote">Portraits coming soon — names in [brackets] are placeholders.</p></div></section>`;
}
function noteCta() {
  return `<section class="note-cta" id="notecta"><div class="fog"></div><div class="hill"></div>
    <div class="hd"><span class="lbl">Start a project</span><h2 class="split" style="margin-top:16px">Plan your <em class="s">next move</em></h2></div>
    <div class="note" id="note"><span class="pin"></span><p>Tell us what you're building.<br>We'll shape the <em>plan</em>.</p><div style="text-align:center">${btn('Start planning', '#contact', 'b-ink b-sm')}<small>Free 15-minute call</small></div></div></section>`;
}
function footer() {
  return `<footer class="foot">
    <div class="ask"><h2 class="split">Have an idea?<br>Let's <em class="s">grow</em> it.</h2>${btn('Start a project', '#contact')}</div>
    <div class="cols">
      <div><div class="brandline"><svg viewBox="0 0 200 200"><use href="#mkFlat"/></svg>organoo <span>studio</span></div><p>A digital agency from Jakarta designing brands, websites and campaigns that keep growing.</p></div>
      <div><h4>STUDIO</h4><a href="#about" data-link>About</a><a href="#work" data-link>Work</a><a href="#journal" data-link>Journal</a><a href="#contact" data-link>Contact</a></div>
      <div><h4>SERVICES</h4>${SERVICES.map(s => `<a href="#service-${s.slug}" data-link>${s.name}</a>`).join('')}</div>
      <div><h4>CONNECT</h4><a href="https://www.instagram.com/organoo.studio/" target="_blank" rel="noopener">Instagram ↗</a><a href="https://www.linkedin.com/company/organoo-studio" target="_blank" rel="noopener">LinkedIn ↗</a><a href="#contact" data-link>organoostudio@gmail.com</a></div>
    </div>
    <div class="wmk" id="wmk"><div class="base">organoo <em>studio</em></div><div class="lit" aria-hidden="true">organoo <em>studio</em></div></div>
    <div class="legal"><span>© 2026 Organoo Studio</span><span>Jakarta, Indonesia · <b id="clock">--:--</b> WIB</span><span>Move your cursor over the name ↑</span></div>
  </footer>`;
}
const caseCard = p => `<a class="wc rv" href="#work-${p.slug}" data-link data-f="${p.cat || p.svc}" data-cur="View"><div class="fr${p.light ? ' lt' : ''}${p.full ? ' full' : ''}${p.svc === 'graphic' && p.img ? ' gdc' : ''}"><div class="pv">${p.img ? imgTag(p.img, false) : `<div class="ph0">[Project cover]</div>`}</div><span class="tag">${p.service}</span></div><div class="ft"><div><b>${p.title}</b><small>${p.sub}</small></div><span class="ar">${ARR}</span></div></a>`;
const postCard = p => `<a class="post rv" href="#post-${p.slug}" data-link data-cur="Read" style="--glow:${p.glow}"><div class="art"><b>${p.word}</b></div><div class="meta"><div class="k"><span>${p.cat}</span><span>${p.time}</span></div><h3>${p.title}</h3></div></a>`;

/* service mini visual for cards / previews */
function miniVis(s) {
  if (s.kind === 'graphic') return `<div class="mini-gd">${['gd-kinetik-studio-post-1', 'gd-bowlful-post-2', 'gd-lumea-post-1', 'gd-kelana-post-1'].map(x => `<img src="${I(x + '.webp')}" alt="" loading="lazy">`).join('')}</div>`;
  if (s.kind === 'video') return `<div class="mini-video"><div class="scr"><i class="play"></i></div><div class="tl"><i style="flex:3"></i><i style="flex:2" class="g"></i><i style="flex:4"></i><i style="flex:1.5" class="g"></i></div></div>`;
  return imgTag(s.pic, s.light);
}

/* ===================== HOME ===================== */
function pageHome() {
  const fly = FLY.map(([k, s, x, y, z, v]) => {
    let inner = '';
    if (k === 'lap') inner = `<img class="lap" src="${I(s)}" alt="">`;
    else if (k === 'card') inner = `<div class="card${v ? ' ' + v : ''}"><img src="${I(s)}" alt=""></div>`;
    else if (k === 'shot') inner = `<div class="card shot"><img src="${I(s)}" alt=""></div>`;
    else if (k === 'wide') inner = `<div class="card wide"><img src="${I(s)}" alt=""></div>`;
    else if (k === 'chip') inner = `<div class="chip"><b>${s[0]}</b><div>${s[1]}<small>${s[2]}</small></div></div>`;
    else if (k === 'chrome') inner = chromeSvg('chrome');
    return `<div class="fo" data-x="${x}" data-y="${y}" data-z="${z}">${inner}</div>`;
  }).join('');
  const tvLayout = [[12, 22, 230, -120, 18, -4, 'img:demos/tandem-card.webp'], [31, 10, 170, -300, 10, 3, 'img:gd-lumea-cover.webp'], [71, 13, 200, -200, -14, 4, 'img:demos/forma-card.webp'], [89, 30, 240, -60, -22, -3, 'img:gd-kinetik-studio-cover.webp'], [7, 60, 210, -40, 24, 5, 'static'], [24, 82, 190, -260, 14, -6, 'img:pelni.webp|ct'], [50, 86, 160, -420, 0, 2, 'img:gd-bowlful-post-2.webp'], [77, 66, 230, -100, -18, -5, 'img:demos/aurelle-estates-card.webp'], [93, 84, 170, -320, -10, 6, 'img:google-charts.webp|ct'], [38, 46, 150, -600, 6, -2, 'img:gd-rimba-roastery-post-1.webp'], [63, 48, 150, -560, -6, 3, 'img:demos/stockroom-card.webp']];
  const tvs = tvLayout.map(([x, y, w, z, ry, rz, c]) => {
    let scr;
    if (c === 'bars') scr = '<div class="bars"></div>';
    else if (c === 'static') scr = '<div class="static"></div>';
    else { const [src, f] = c.slice(4).split('|'); scr = `<img class="${f || ''}" src="${I(src)}" alt="">`; }
    return `<div class="crt" style="--x:${x}%;--y:${y}%;--w:${w}px;--z:${z}px;--ry:${ry}deg;--rz:${rz}deg" data-z="${z}"><div class="body"><div class="scr">${scr}</div></div></div>`;
  }).join('');
  const polas = [['demos/lumetric-card.webp', 'Lumetric · concept'], ['gd-bowlful-post-2.webp|gd', 'Bowlful · identity'], ['pelni.webp|ct', 'PT Pelni — Docs'], ['w:PUPR', 'Kementerian PUPR', ''], ['gd-kinetik-studio-post-1.webp|gd', 'Kinetik Studio · identity'], ['demos/arbor-and-co-card.webp', 'Arbor & Co. · concept'], ['gd-lumea-post-1.webp|gd', 'Lumea · identity'], ['w:Dale<br>Carnegie', 'Dasindo Media', 'g'], ['banksampah.webp|ct', 'Bank Sampah'], ['gd-kelana-post-1.webp|gd', 'Kelana · identity'], ['google-charts.webp|ct', '11× ROAS'], ['w:Artiland', 'Batu Panorama', 'm'], ['gd-tabung-post-1.webp|gd', 'Tabung · identity'], ['demos/sangkarloka-card.webp', 'Sangkarloka']];
  const polaHtml = polas.map(([src, cap, col], i) => {
    let ph;
    if (src.startsWith('w:')) ph = `<div class="ph word ${col || ''}">${src.slice(2)}</div>`;
    else { const [s2, f] = src.split('|'); ph = `<div class="ph"><img class="${f || ''}" src="${I(s2)}" alt="" loading="lazy"></div>`; }
    return `<figure class="pc" data-i="${i}" style="margin:0">${i % 3 === 0 ? '<span class="tape"></span>' : ''}${ph}<figcaption class="cap">${cap}</figcaption></figure>`;
  }).join('');
  const half = Math.ceil(CLIENTS.length / 2);
  return `
  <section class="sc fly" id="fly" aria-label="Intro">
    <div class="stick">
      <div class="grain"></div>
      <canvas class="stars" id="stars"></canvas>
      <div class="bloom" id="bloom"></div>
      <div class="world"><div class="cam" id="cam">${fly}</div></div>
      <div class="fly-copy" id="flyCopy">
        <span class="lbl rv">Digital agency · Jakarta, Indonesia</span>
        <h1 class="split" id="flyH">Ideas that <em class="s">grow</em><span class="seed"></span><br>into digital brands.</h1>
        <p class="sub rv" style="--d:.5s">Organoo Studio designs and builds websites, runs ads on Meta, Google, Amazon and marketplaces, and creates graphics and video — one team, from idea to growth.</p>
        <div class="ctas rv" style="--d:.7s">${btn('Start a project', '#contact')}${btn('See our work', '#work', 'b-ghost')}</div>
      </div>
      <div class="fly-mid" id="flyMid"><div><h2>Step inside<br>the <em class="s">work</em>.</h2><p>${PROJECTS.length} cases · ${SERVICES.length} services · one studio</p></div></div>
      <div class="cue" id="cue"><i></i>Scroll</div>
    </div>
  </section>
  ${clientsMarquee()}
  <section class="sc sphere" id="sphere" aria-label="About the studio">
    <div class="stick">
      <canvas id="sph"></canvas>
      <div class="big b1" id="sb1">Ideas</div>
      <div class="big b2" id="sb2">that <em>grow.</em></div>
      <div class="spark"></div>
      <div class="nums" id="snums"><div><b data-count>11×</b><span>ROAS · Google Ads</span></div><div><b data-count>1,200+</b><span>Conversions · Meta Ads</span></div><div><b data-count>+97.8%</b><span>Website leads growth</span></div></div>
      <div class="about" id="sabout"><span class="lbl">About the studio</span><p style="margin-top:16px">We're not just a vendor. We're a <b>growth partner</b> working side by side with your team — blending strategy, design and data. Great design only matters when it moves the numbers.</p><a class="link" href="#about" data-link>More about us ${ARR}</a></div>
    </div>
  </section>
  <section class="sc ring paper" id="ring" aria-label="Services">
    <div class="stick">
      <div class="mq-big r1" id="rq1">${'Websites that work<span class="o"></span>Ads that convert<span class="o"></span>Brands people remember<span class="o"></span>'.repeat(2)}</div>
      <div class="mq-big r2" id="rq2">${'Interfaces people love<span class="o"></span>Videos people finish<span class="o"></span>'.repeat(3)}</div>
      <div class="head"><span class="lbl">What we do</span><h2>Five ways we help you <em class="s">grow</em></h2></div>
      <div class="stage"><div class="wheel" id="wheel">${SERVICES.map((s, i) => `<figure class="scard" data-i="${i}"><a class="in" href="#service-${s.slug}" data-link data-cur="Open"><div class="top"><span>${s.n}</span><span>/ 05</span></div><div class="vis">${miniVis(s)}</div><div><h3>${s.name}</h3><p>${s.short}</p></div></a></figure>`).join('')}</div></div>
      <div class="side" id="rside"></div>
      <div class="dots" id="rdots">${SERVICES.map((s, i) => `<i data-i="${i}"></i>`).join('')}</div>
    </div>
  </section>
  <section class="tvs" id="tvs" aria-label="Selected work">
    <div class="tvwall" id="tvwall">
      <div class="wall" id="wall">${tvs}</div>
      <div class="copy"><span class="lbl">Selected work</span><h2 class="split" style="margin-top:18px">We make brands<br><em>feel new</em></h2></div>
      <i class="plus"></i>
      <div class="bottom"><p>Identity, interfaces, websites and campaigns built to hold attention — tuned until the last pixel holds still.</p><div class="ctas">${btn('Start a project', '#contact', 'b-em b-sm')}${btn('See all work', '#work', 'b-ghost b-sm')}</div></div>
    </div>
    <div class="cases">
      <h2 class="split">Our cases</h2><div class="count brk" id="vcount">[01 / ${pad(SHOWCASE.length)}]</div>
      <div class="viewer" id="viewer" data-cur="Next">
        <div class="side-tv l"><div class="crt"><div class="body"><div class="scr"><img id="vl" alt=""></div></div></div></div>
        <div class="side-tv r"><div class="crt"><div class="body"><div class="scr"><img id="vr" alt=""></div></div></div></div>
        <div class="crt glow"><div class="body"><div class="scr" id="vscr"><img id="vimg" alt=""><canvas class="noise" id="vnoise"></canvas><span class="chan" id="vchan">CH 01</span></div><div class="knobs"><i></i><i></i></div></div></div>
      </div>
      <div class="vctl"><button type="button" id="vprev">← Previous</button><button type="button" id="vnext">Next →</button></div>
      <div class="vinfo"><h3 id="vtitle"></h3><div class="tags" id="vtags"></div><p class="sub" id="vsub"></p><div style="margin-top:26px" id="vlink"></div></div>
    </div>
  </section>
  <section class="slide" id="slide" aria-hidden="true">
    <div class="ln" id="sl1">Built to be looked at <em>twice</em>. Built to be looked at <em>twice</em>.</div>
    <div class="ln o" id="sl2">Designed in Jakarta — shipped everywhere — designed in Jakarta — shipped everywhere —</div>
  </section>
  <section class="sc xwin" id="xwin" aria-label="Results">
    <div class="stick">
      <div class="frame" id="xframe"><canvas id="topo"></canvas><div class="shade"></div></div>
      <span class="mini t" id="xm1">Real results</span>
      <div class="w1" id="xw1">From<br>idea</div>
      <div class="w2" id="xw2">to<br><em>impact.</em></div>
      <span class="mini b" id="xm2">01 — 03</span>
      <div class="res" id="xres"><span class="lbl">Real results, real clients</span><div class="g">
        <div><b data-count data-manual>11×</b><span>Return on ad spend<small>PT. Dasindo Media</small></span></div>
        <div><b data-count data-manual>1,200+</b><span>Conversions<small>Batu Panorama Residence</small></span></div>
        <div><b data-count data-manual>+97.8%</b><span>Website leads<small>after optimization</small></span></div>
      </div></div>
    </div>
  </section>
  ${processStrips()}
  <section class="sc pola" id="pola" aria-label="Clients">
    <div class="stick">
      <div class="pcenter" id="pcenter"><h2 class="title">Brands &amp; builds<br>that <em>grow</em></h2>
        <div class="clist" id="pl"><b>Clients</b>${CLIENTS.map(c => `<span>${c[0]}</span>`).join('')}</div>
      </div>
      ${polaHtml}
    </div>
  </section>
  ${teamBlock()}
  <section class="jr"><div class="hd"><div><span class="lbl">Journal</span><h2 class="split" style="margin-top:16px">Notes on <em class="s">growth</em></h2></div>${btn('All articles', '#journal', 'b-ghost b-sm')}</div>
    <div class="jgrid">${POSTS.slice(0, 3).map(postCard).join('')}</div></section>
  ${noteCta()}
  ${footer()}`;
}
function processStrips() {
  return `<section class="proc" id="proc"><div class="hd"><div><span class="lbl">How we work</span><h2 class="split" style="margin-top:16px">Five steps,<br>one <em class="s">team</em>.</h2></div><p>No hand-offs between agencies. Strategy, design, build and growth stay with the same people from day one.</p></div>
    <div class="strips" id="strips">${PROCESS.map((s, i) => `<div class="strip${i === 0 ? ' on' : ''}" data-i="${i}" tabindex="0" role="button" aria-label="${s[1]}"><div class="bgi">${imgTag(s[4], s[5])}</div><span class="vn">${s[0]}</span><span class="vt">${s[1]}</span><div class="body"><span class="num">STEP ${s[0]} / 05</span><h3>${s[1]}</h3><p>${s[2]}</p><div class="meta">${s[3].map(m => `<span>${m}</span>`).join('')}</div></div></div>`).join('')}</div></section>`;
}

function initHome() {
  /* --- flythrough --- */
  const items = $$('.fo').map(el => ({ el, x: +el.dataset.x, y: +el.dataset.y, z: +el.dataset.z, r: (Math.random() - .5) * 16 }));
  const cam = $('#cam'), copy = $('#flyCopy'), mid = $('#flyMid'), bloom = $('#bloom'), cue = $('#cue'), stars = $('#stars');
  const SP = Array.from({ length: 280 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }));
  let tx = 0, ty = 0;
  scene($('#fly'), (p, pv, t) => {
    const vw = innerWidth, vh = innerHeight, depth = reduce ? 0 : eIO(p) * 3200;
    const midA = range(p, .38, .5) * (1 - range(p, .78, .88));
    tx = lerp(tx, S.nx * 6, .05); ty = lerp(ty, S.ny * 4, .05);
    cam.style.transform = `rotateY(${tx}deg) rotateX(${-ty}deg)`;
    for (const it of items) {
      const z = it.z + depth;
      let op = z > 260 ? clamp(1 - (z - 260) / 380) : clamp((z + 3100) / 600);
      const f = 1000 / (1000 - Math.min(z, 900)), sx = it.x * f, sy = it.y * f;
      if (Math.abs(sx) < 36 && Math.abs(sy) < 24) op *= lerp(.1, 1, range(p, .06, .2)) * (1 - midA * .7);
      it.el.style.opacity = op.toFixed(3);
      it.el.style.visibility = op <= 0.01 ? 'hidden' : 'visible';
      if (op > 0.01) it.el.style.transform = `translate3d(${it.x * vw / 100}px,${it.y * vh / 100}px,${z}px) rotateY(${-it.x * .35 + it.r}deg) rotateZ(${it.r * .3}deg)`;
    }
    const c = range(p, .03, .2);
    copy.style.opacity = 1 - c; copy.style.transform = `translateY(${-c * 60}px) scale(${1 - c * .08})`;
    copy.style.pointerEvents = c > .5 ? 'none' : '';
    const m = range(p, .42, .56) * (1 - range(p, .74, .86));
    mid.style.opacity = m; mid.style.transform = `scale(${.92 + m * .08})`;
    bloom.style.setProperty('--bs', (.55 + p * 1.6).toFixed(3)); bloom.style.setProperty('--ba', (.22 + range(p, .78, 1) * .55).toFixed(3));
    cue.style.opacity = 1 - range(p, 0, .05);
    // starfield
    const { ctx, w, h } = fitCanvas(stars, 1.5);
    ctx.clearRect(0, 0, w, h);
    const sp = .0012 + Math.min(Math.abs(S.vy), 60) * .00022 + (reduce ? 0 : .0008);
    for (const s of SP) {
      s.z -= sp; if (s.z <= .02) { s.z = 1; s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; }
      const px = w / 2 + s.x / s.z * w * .3, py = h / 2 + s.y / s.z * h * .3;
      if (px < 0 || px > w || py < 0 || py > h) continue;
      const a = (1 - s.z) * .9, sz = (1 - s.z) * 2.2;
      ctx.fillStyle = `rgba(${s.z < .3 ? '214,250,230' : '150,225,185'},${a})`;
      ctx.fillRect(px, py, sz, sz);
    }
  });
  if (S.loaded) setTimeout(() => { $$('.fly-copy .split,.fly-copy .seed,.fly-copy .rv').forEach(e => e.classList.add('in')); }, 250);

  /* --- particle sphere --- */
  const sph = $('#sph'), N = innerWidth < 700 ? 650 : 1100, PTS = [];
  for (let i = 0; i < N; i++) { const yv = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - yv * yv), th = Math.PI * (3 - Math.sqrt(5)) * i; PTS.push([Math.cos(th) * r, yv, Math.sin(th) * r, Math.random(), Math.random() < .05]); }
  const sb1 = $('#sb1'), sb2 = $('#sb2'), snums = $('#snums'), sabout = $('#sabout');
  scene($('#sphere'), (p, pv, t) => {
    const { ctx, w, h } = fitCanvas(sph, 1.5); ctx.clearRect(0, 0, w, h);
    const R = Math.min(w, h) * .3, cx = w / 2, cy = h / 2, a = t / 1000 * .22 + p * 2.4, b = .38 + S.ny * .3;
    const ex = range(p, .05, .5), fl = eIO(range(p, .5, .95));
    const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sbb = Math.sin(b);
    for (const q of PTS) {
      let [x, y, z, n, lime] = q;
      const k = 1 + ex * (.25 + n * .9) * (1 - fl * .6) + fl * .35;
      y *= 1 - fl * .9;
      let x1 = x * ca - z * sa, z1 = x * sa + z * ca;
      let y1 = y * cb - z1 * sbb, z2 = y * sbb + z1 * cb;
      const pr = 2.6 / (2.6 + z2);
      const px = cx + x1 * R * k * pr, py = cy + y1 * R * k * pr;
      const dpt = clamp((1 - z2) / 2);
      ctx.globalAlpha = .12 + dpt * .85;
      ctx.fillStyle = lime ? '#C0F408' : dpt > .7 ? '#d8fbe8' : dpt > .4 ? '#96E1B9' : '#1FAE5E';
      const sz = .7 + pr * pr * 1.3;
      ctx.fillRect(px, py, sz, sz);
    }
    ctx.globalAlpha = 1;
    sb1.style.transform = `translate(${-range(p, .1, 1) * 6}vw,${-p * 6}vh)`;
    sb2.style.transform = `translate(${range(p, .1, 1) * 6}vw,${p * 6}vh)`;
    snums.style.transform = `translateY(${(.5 - p) * 40}px)`;
    sabout.style.transform = `translateY(${(.5 - p) * 30}px)`;
  });

  /* --- services ring --- */
  const wheel = $('#wheel'), cards = $$('.scard'), side = $('#rside'), dots = $$('#rdots i'), rq1 = $('#rq1'), rq2 = $('#rq2');
  let active = -1;
  const setSide = i => {
    if (i === active) return; active = i; const s = SERVICES[i];
    side.innerHTML = `<span class="n">${s.n} / 05</span><h3>${s.name}</h3><p>${s.short}</p><div class="chips">${s.chips.map(c => `<span>${c}</span>`).join('')}</div>${btn('Explore service', '#service-' + s.slug, 'b-ink b-sm')}`;
    dots.forEach((d, j) => d.classList.toggle('on', j === i));
  };
  setSide(0);
  scene($('#ring'), (p) => {
    const cw = cards[0].offsetWidth || 280, R = cw * .95;
    const k = p * 4.4 - .2, idx = clamp(Math.floor(k), 0, 4), f = clamp(k - idx), f2 = idx >= 4 ? 0 : eIO(range(f, .3, .8));
    const ang = -(idx + f2) * 72;
    wheel.style.transform = `translateZ(${-R}px) rotateY(${ang}deg)`;
    cards.forEach((c, i) => {
      let rel = ((i * 72 + ang) % 360 + 540) % 360 - 180;
      c.style.transform = `rotateY(${i * 72}deg) translateZ(${R}px)`;
      c.style.visibility = Math.abs(rel) > 100 ? 'hidden' : 'visible';
      c.firstElementChild.style.opacity = (1 - Math.abs(rel) / 100 * .55).toFixed(3);
      c.style.pointerEvents = Math.abs(rel) < 30 ? 'auto' : 'none';
    });
    setSide(clamp(Math.round(idx + f2), 0, 4));
    rq1.style.transform = `translateX(${-p * 38}%)`;
    rq2.style.transform = `translateX(${-48 + p * 34}%)`;
  });
  dots.forEach(d => d.addEventListener('click', () => {
    const s = S.scenes.find(x => x.el.id === 'ring'); if (!s) return;
    const target = s.top + (+d.dataset.i + .45) / 4.4 * (s.h - innerHeight);
    S.lenis ? S.lenis.scrollTo(target) : scrollTo({ top: target, behavior: 'smooth' });
  }));

  /* --- TV wall parallax --- */
  const crts = $$('#wall .crt').map(el => ({ el, z: +el.dataset.z }));
  const wall = $('#wall');
  let wx = 0, wy = 0;
  scene($('#tvwall'), (p, pv) => {
    wx = lerp(wx, S.nx * 8, .06); wy = lerp(wy, S.ny * 5, .06);
    wall.style.transform = `rotateY(${wx}deg) rotateX(${-wy}deg)`;
    for (const c of crts) c.el.style.setProperty('--py', ((.5 - pv) * (700 + c.z) * .35).toFixed(1) + 'px');
  });
  initViewer();

  /* --- giant sliding type --- */
  const sl1 = $('#sl1'), sl2 = $('#sl2');
  scene($('#slide'), (p, pv) => { sl1.style.transform = `translateX(${-pv * 42}%)`; sl2.style.transform = `translateX(${-50 + pv * 42}%)`; });

  /* --- expanding window over topo canvas --- */
  const xframe = $('#xframe'), topo = $('#topo'), xw1 = $('#xw1'), xw2 = $('#xw2'), xres = $('#xres'), xm1 = $('#xm1'), xm2 = $('#xm2');
  let counted = false;
  scene($('#xwin'), (p, pv, t) => {
    const k = reduce ? 1 : eIO(range(p, .04, .66)), mob = innerWidth < 760;
    xframe.style.setProperty('--it', lerp(mob ? 33 : 30, 0, k) + '%');
    xframe.style.setProperty('--il', lerp(mob ? 16 : 36, 0, k) + '%');
    xframe.style.setProperty('--ir', lerp(18, 0, k) + 'px');
    const o = 1 - range(p, .5, .7);
    xw1.style.transform = `translate(${-k * 26}vw,-50%)`; xw2.style.transform = `translate(${k * 26}vw,-50%)`;
    xw1.style.opacity = xw2.style.opacity = o;
    xm1.style.opacity = xm2.style.opacity = 1 - k * 2;
    const r = range(p, .7, .82);
    xres.style.opacity = r; xres.style.transform = `translateY(${(1 - r) * 30}px)`;
    if (r > .5 && !counted) { counted = true; $$('#xres [data-count]').forEach(countUp); }
    drawTopo(topo, t, k);
  });

  /* --- polaroids --- */
  const pcs = $$('.pola .pc').map((el, i, arr) => {
    const n = arr.length, th = i / n * Math.PI * 2 + (i % 2 ? .18 : -.12);
    const rx = innerWidth < 760 ? 30 : 39, ry = innerWidth < 760 ? 40 : 37;
    const sd = Math.random() * Math.PI * 2;
    return { el, tx: Math.cos(th) * rx + (Math.random() - .5) * 6, ty: Math.sin(th) * ry + (Math.random() - .5) * 6, tr: (Math.random() - .5) * 26, sx: Math.cos(sd) * 95, sy: Math.sin(sd) * 95, sr: (Math.random() - .5) * 120, d: i / n * .32 };
  });
  const pl = $$('#pl span'), ptitle = $('#pcenter');
  scene($('#pola'), (p) => {
    for (const c of pcs) {
      const k = reduce ? 1 : eOut(range(p, c.d, c.d + .38));
      const lift = range(p, .86, 1);
      const x = lerp(c.sx, c.tx, k), y = lerp(c.sy, c.ty, k) - lift * 12;
      c.el.style.transform = `translate(-50%,-50%) translate(${x}vw,${y}vh) rotate(${lerp(c.sr, c.tr, k)}deg) scale(${.8 + k * .2})`;
      c.el.style.opacity = Math.min(1, k * 1.6);
    }
    const ai = clamp(Math.floor(p * pl.length), 0, pl.length - 1);
    pl.forEach((s, i) => s.classList.toggle('on', i === ai));
    ptitle.style.transform = `translate(-50%,-50%) scale(${.92 + range(p, .1, .5) * .08})`;
  });
  initStrips(); initTeam(); initMarquee(); initNote();
}

/* topographic "growth terrain" */
function drawTopo(cv, t, k) {
  const { ctx, w, h } = fitCanvas(cv, 1.4);
  const T = t / 1000;
  const g = ctx.createRadialGradient(w * .5, h * .55, 0, w * .5, h * .55, Math.max(w, h) * .7);
  g.addColorStop(0, '#0f3322'); g.addColorStop(.5, '#08130d'); g.addColorStop(1, '#040605');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const L = 38, zoom = 1 + (1 - k) * .4;
  ctx.save(); ctx.translate(w / 2, h / 2); ctx.scale(zoom, zoom); ctx.translate(-w / 2, -h / 2);
  for (let j = 0; j < L; j++) {
    const base = h * (j / (L - 1)) * 1.1 - h * .05;
    const hi = j % 6 === 0;
    ctx.beginPath();
    for (let x = -20; x <= w + 20; x += 14) {
      const y = base + Math.sin(x * .0042 + T * .35 + j * .38) * 26 + Math.sin(x * .011 - T * .22 + j * .9) * 11 + Math.sin(x * .0019 + j * 1.3) * 46 - Math.exp(-Math.pow((x - w * .5) / (w * .22), 2)) * 70 * Math.sin(j * .17 + 1.2);
      x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = hi ? 'rgba(150,225,185,.7)' : `rgba(150,225,185,${.14 + (j % 3) * .06})`;
    ctx.lineWidth = hi ? 1.4 : 1;
    if (hi) { ctx.shadowColor = '#1FAE5E'; ctx.shadowBlur = 8; } else ctx.shadowBlur = 0;
    ctx.stroke();
    if (hi) {
      const px = ((T * 40 + j * 97) % (w + 40)) - 20;
      const py = base + Math.sin(px * .0042 + T * .35 + j * .38) * 26 + Math.sin(px * .011 - T * .22 + j * .9) * 11 + Math.sin(px * .0019 + j * 1.3) * 46 - Math.exp(-Math.pow((px - w * .5) / (w * .22), 2)) * 70 * Math.sin(j * .17 + 1.2);
      ctx.shadowBlur = 16; ctx.fillStyle = '#C0F408'; ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore(); ctx.shadowBlur = 0;
}

/* CRT case viewer */
function initViewer() {
  const v = $('#viewer'); if (!v) return;
  const img = $('#vimg'), scr = $('#vscr'), vl = $('#vl'), vr = $('#vr'), noise = $('#vnoise');
  let i = 0, timer = 0, hover = false, sw = 0;
  const set = (el, p) => { el.src = I(p.img); el.parentElement.style.background = p.light ? '#fff' : '#000'; };
  function show(n, instant) {
    i = (n + SHOWCASE.length) % SHOWCASE.length;
    const p = projBySlug[SHOWCASE[i]];
    const apply = () => {
      set(img, p);
      set(vl, projBySlug[SHOWCASE[(i - 1 + SHOWCASE.length) % SHOWCASE.length]]);
      set(vr, projBySlug[SHOWCASE[(i + 1) % SHOWCASE.length]]);
      $('#vtitle').textContent = p.title; $('#vsub').textContent = p.lead;
      $('#vtags').innerHTML = p.tags.map(t => `<span>[${t}]</span>`).join('');
      $('#vlink').innerHTML = btn('Explore case', '#work-' + p.slug, 'b-em b-sm');
      $('#vchan').textContent = 'CH ' + pad(i + 1); $('#vcount').textContent = `[${pad(i + 1)} / ${pad(SHOWCASE.length)}]`;
    };
    if (instant || reduce) { apply(); return; }
    v.classList.add('switch'); sw = performance.now();
    setTimeout(apply, 170);
    setTimeout(() => v.classList.remove('switch'), 380);
  }
  tick(now => {
    if (v.classList.contains('switch')) {
      const { ctx, w, h } = fitCanvas(noise, 1); const s = 4;
      for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) { const c = Math.random() * 255 | 0; ctx.fillStyle = `rgb(${c},${c},${c})`; ctx.fillRect(x, y, s, s); }
    }
    const r = v.getBoundingClientRect();
    if (!hover && r.top < innerHeight && r.bottom > 0 && now - timer > 6000) { timer = now; if (now - S.t0 > 7000) show(i + 1); }
  });
  v.addEventListener('mouseenter', () => hover = true); v.addEventListener('mouseleave', () => hover = false);
  v.addEventListener('click', () => { timer = performance.now(); show(i + 1); });
  $('#vprev').addEventListener('click', () => { timer = performance.now(); show(i - 1); });
  $('#vnext').addEventListener('click', () => { timer = performance.now(); show(i + 1); });
  show(0, true);
}

function initStrips() {
  const box = $('#strips'); if (!box) return;
  const ss = $$('.strip', box); let cur = 0, hov = false, last = performance.now();
  const set = i => { cur = i; ss.forEach((s, j) => s.classList.toggle('on', j === i)); };
  ss.forEach((s, i) => {
    s.addEventListener('mouseenter', () => { hov = true; set(i); });
    s.addEventListener('focus', () => set(i)); s.addEventListener('click', () => { set(i); last = performance.now(); });
    s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(i); } });
  });
  box.addEventListener('mouseleave', () => { hov = false; last = performance.now(); });
  tick(now => {
    if (hov || reduce) return;
    const r = box.getBoundingClientRect();
    if (r.top < innerHeight * .7 && r.bottom > innerHeight * .3 && now - last > 3800) { last = now; set((cur + 1) % ss.length); }
  });
}

function initTeam() {
  const wrap = $('#twrap'); if (!wrap) return;
  const track = $('#ttrack'), cards = $$('.tm', track);
  let x = 0, target = 0, idx = 0, down = false, sx = 0, bx = 0, lastX = 0, vel = 0, moved = 0;
  const center = i => { const c = cards[i]; return wrap.clientWidth / 2 - (c.offsetLeft + c.offsetWidth / 2); };
  const setIdx = i => {
    idx = clamp(i, 0, cards.length - 1); target = center(idx);
    cards.forEach((c, j) => c.classList.toggle('on', j === idx));
    const m = TEAM[idx];
    $('#tname').textContent = m[0]; $('#ttags').innerHTML = m[2].map(t => `<span class="brk">[${t}]</span>`).join('');
    $('#tct').textContent = `[${pad(idx + 1)} / ${pad(TEAM.length)}]`;
  };
  setIdx(0); x = target;
  wrap.addEventListener('pointerdown', e => { down = true; moved = 0; sx = e.clientX; bx = x; lastX = e.clientX; vel = 0; wrap.classList.add('drag'); wrap.setPointerCapture(e.pointerId); });
  wrap.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); x = target = bx + dx; vel = e.clientX - lastX; lastX = e.clientX; });
  const up = e => {
    if (!down) return; down = false; wrap.classList.remove('drag');
    if (moved < 6) { const c = e.target.closest && e.target.closest('.tm'); if (c) { setIdx(+c.dataset.i); return; } }
    const proj = x + vel * 12; let best = 0, bd = 1e9;
    cards.forEach((c, i) => { const d = Math.abs(center(i) - proj); if (d < bd) { bd = d; best = i; } });
    setIdx(best);
  };
  wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
  wrap.tabIndex = 0;
  wrap.addEventListener('keydown', e => { if (e.key === 'ArrowRight') setIdx(idx + 1); if (e.key === 'ArrowLeft') setIdx(idx - 1); });
  addEventListener('resize', () => { target = center(idx); });
  tick(() => { if (!down) x = lerp(x, target, .12); track.style.transform = `translateX(${x}px)`; });
}

function initMarquee() {
  const mq = $('#mq'); if (!mq) return;
  let x = 0, dir = -1;
  tick(() => {
    const g = mq.firstElementChild.offsetWidth; if (!g) return;
    if (S.vy > .5) dir = -1; else if (S.vy < -.5) dir = 1;
    x += dir * (reduce ? 0 : .7 + Math.min(Math.abs(S.vy), 40) * .35);
    if (x <= -g) x += g; if (x > 0) x -= g;
    mq.style.transform = `translateX(${x}px) skewX(${clamp(-S.vy * .25, -8, 8)}deg)`;
  });
}

function initNote() {
  const note = $('#note'), sec = $('#notecta'); if (!note) return;
  scene(sec, (p, pv, t) => {
    const drop = eOut(range(pv, .15, .45));
    const sway = reduce ? 0 : Math.sin(t / 1000 * 1.3) * 1.4 + S.nx * 5;
    note.style.transform = `translateY(${(1 - drop) * -30}vh) rotate(${(1 - drop) * -14 + sway}deg)`; note.style.opacity = clamp(drop * 1.6);
  });
}

/* ===================== COMMON (every page) ===================== */
function initCommon(root) {
  // footer wordmark spotlight
  const wmk = $('#wmk', root);
  if (wmk) {
    tick(now => {
      const r = wmk.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      const inside = fine && S.my > r.top - 120 && S.my < r.bottom + 60;
      const t = now / 1000;
      const x = inside ? S.mx - r.left : r.width * (.5 + Math.sin(t * .6) * .42), y = inside ? S.my - r.top : r.height * (.5 + Math.sin(t * 1.2) * .2);
      wmk.style.setProperty('--wx', x + 'px'); wmk.style.setProperty('--wy', y + 'px');
    });
  }
  const clock = $('#clock', root);
  if (clock) { const upd = () => { try { clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date()); } catch (e) {} }; upd(); }
  // hero glow follows pointer
  const glow = $('.ph-hero .glow', root);
  if (glow) { let gx = 0, gy = 0; tick(() => { gx = lerp(gx, S.nx * 120, .04); gy = lerp(gy, S.ny * 80 + S.y * .25, .06); glow.style.transform = `translate(${gx}px,${gy}px)`; }); }
  // parallax inside work cards
  $$('.wc .pv', root).forEach(pv => scene(pv.closest('.wc'), (p, v) => { pv.style.transform = `translateY(${(.5 - v) * 9}%)`; }));
  // steps line
  $$('.steps', root).forEach(st => { const ss = $$('.step', st); scene(st, (p, v) => { const k = range(v, .25, .62); st.style.setProperty('--sp', k); ss.forEach((s, i) => s.classList.toggle('on', k >= i / ss.length + .02)); }); });
  // story line
  $$('.story', root).forEach(st => scene(st, (p, v) => st.style.setProperty('--sp', range(v, .15, .75))));
  // hero visual parallax
  $$('[data-px]', root).forEach(el => { const k = +el.dataset.px; let mx = 0; tick(() => { mx = lerp(mx, S.nx * k * .6, .06); el.style.transform = `translate(${mx}px,${S.y * k * -.004 * 10}px)`; }); });
}

/* ===================== ABOUT ===================== */
function pageAbout() {
  const stmt = "We're not just a vendor. We're a growth partner working side by side with your team, blending strategy, design and data. Great design only matters when it moves the numbers: more leads, lower cost per result and a brand people remember.";
  const keys = ['growth', 'partner', 'strategy,', 'design', 'data.', 'moves', 'numbers:', 'remember.'];
  const words = stmt.split(' ').map(w => `<span class="wd${keys.includes(w) ? ' k' : ''}">${w}</span>`).join(' ');
  return `
  <section class="ph-hero"><div class="glow"></div><div class="crumbs"><a href="#home" data-link>Home</a><span>/</span><span>About</span></div>
    <h1 class="split">A studio built<br>to <em class="s">grow</em> brands.</h1>
    <p class="lead rv">Organoo Studio is a digital agency from Jakarta. We design brands, build websites and run campaigns — one team from first idea to measurable growth.</p></section>
  <section class="sc stmt" id="stmt"><div class="stick"><p id="stmtP">${words}</p></div></section>
  <section class="sc chromeband" id="chromeband"><div class="stick">
    ${chromeSvg('cm', 'cm')}
    <div class="orbit" id="orbit">${['Strategy', 'Design', 'Build', 'Grow'].map((t, i) => `<div class="ot" data-i="${i}"><b>${t}</b>${['the first question', 'every pixel', 'clean & fast', 'measured monthly'][i]}</div>`).join('')}</div>
    <p class="caption">One mark. One team. Strategy, design, build and growth — under one roof.</p></div></section>
  <section class="sec"><div class="shd"><h2 class="split">What we <em class="s">believe</em></h2><p>Three principles behind every brief we take on.</p></div>
    <div class="vals" id="vals">
      <div class="val rv" data-sp="-40"><span class="ico"><i></i></span><div><h3>Clarity first</h3><p>We find the one thing your customer needs to understand — then design everything around it.</p></div></div>
      <div class="val rv" data-sp="10" style="--d:.1s"><span class="ico"><i></i></span><div><h3>Craft that holds up</h3><p>Details are the difference between looked-at and remembered. We sweat them, on every screen.</p></div></div>
      <div class="val rv" data-sp="60" style="--d:.2s"><span class="ico"><i></i></span><div><h3>Growth you can measure</h3><p>Every project ships with the tracking to prove it worked — and a clear idea of what to do next.</p></div></div>
    </div></section>
  <section class="sec tight"><div class="statband">
    <div class="rv"><b data-count>11×</b><span>ROAS · PT. Dasindo Media</span></div>
    <div class="rv"><b data-count>1,200+</b><span>Conversions · Batu Panorama</span></div>
    <div class="rv"><b data-count>+97.8%</b><span>Growth in website leads</span></div>
    <div class="rv"><b data-count>${PROJECTS.length}</b><span>Featured case studies</span></div>
  </div></section>
  ${teamBlock()}
  ${clientsMarquee()}
  ${noteCta()}
  ${footer()}`;
}
function initAbout() {
  const ws = $$('#stmtP .wd');
  scene($('#stmt'), p => { const n = Math.floor(range(p, .05, .9) * ws.length); ws.forEach((w, i) => w.classList.toggle('on', i <= n)); });
  const cm = $('#cm'), ots = $$('#orbit .ot');
  scene($('#chromeband'), (p, pv, t) => {
    cm.style.transform = `rotateY(${p * 360 + S.nx * 20}deg) rotateX(${S.ny * -14}deg) scale(${.8 + range(p, 0, .4) * .3})`;
    const R = Math.min(innerWidth, innerHeight) * (innerWidth < 760 ? .36 : .34);
    ots.forEach((o, i) => {
      const a = i / ots.length * Math.PI * 2 + p * Math.PI * 1.2 - Math.PI / 2;
      o.style.left = `calc(50% + ${Math.cos(a) * R * 1.25}px)`; o.style.top = `calc(50% + ${Math.sin(a) * R}px)`;
      o.style.transform = 'translate(-50%,-50%)';
      o.style.opacity = .35 + (Math.sin(a) + 1) / 2 * .65;
    });
  });
  $$('#vals .val').forEach(v => { const k = +v.dataset.sp; scene(v, (p, pv) => { v.style.translate = `0 ${(.5 - pv) * k}px`; }); });
  initTeam(); initMarquee(); initNote();
}

/* ===================== SERVICES ===================== */
function pageServices() {
  return `
  <section class="ph-hero"><div class="glow"></div><div class="crumbs"><a href="#home" data-link>Home</a><span>/</span><span>Services</span></div>
    <h1 class="split">Five ways we<br>help you <em class="s">grow</em>.</h1>
    <p class="lead rv">Pick one or stack them. Strategy, design, build and growth — under one roof, with the same team from brief to results.</p></section>
  <section class="sec" style="padding-top:4vh"><div class="slist" id="slist">${SERVICES.map(s => `<a class="srow rv" href="#service-${s.slug}" data-link data-svc="${s.slug}" data-cur="Open"><span class="n">${s.n}</span><span class="t">${s.name}</span><span class="d">${s.short}</span><span class="ar">${ARR}</span></a>`).join('')}</div></section>
  ${processStrips()}
  <section class="sc ring paper" id="ring2" style="height:auto"><div class="sec" style="text-align:center">
    <span class="lbl">Not sure where to start?</span><h2 class="split" style="font-size:clamp(34px,5vw,80px);margin:18px auto 22px;max-width:16ch">Book a free <em class="s">15-minute</em> call.</h2>
    <p style="color:var(--pmuted);max-width:480px;margin:0 auto 30px">We'll look at your goals and tell you honestly which service — or combination — will move the needle first.</p>${btn('Book a 15-min call', '#contact', 'b-ink')}</div></section>
  ${footer()}`;
}
function initServices() {
  const hp = $('#hovprev'); if (!hp) return;
  let hx = 0, hy = 0, lastX = 0, on = false;
  $$('#slist .srow').forEach(r => {
    r.addEventListener('mouseenter', () => {
      const s = svcBySlug[r.dataset.svc];
      hp.innerHTML = s.pic ? `<img class="${s.light ? 'ct' : ''}" src="${I(s.pic)}" alt="">` : `<div style="width:100%;height:100%;display:grid;place-items:center;background:var(--panel2)">${miniVis(s)}</div>`;
      on = true; hp.classList.add('on');
    });
    r.addEventListener('mouseleave', () => { on = false; hp.classList.remove('on'); });
  });
  tick(() => { hx = lerp(hx, S.mx, .16); hy = lerp(hy, S.my, .16); const v = clamp((S.mx - lastX) * .6, -14, 14); lastX = S.mx; hp.style.left = hx + 'px'; hp.style.top = hy + 'px'; hp.style.setProperty('--hr', v + 'deg'); });
  initStrips();
}

function svis(s) {
  if (s.kind === 'uiux') return `<div class="svis"><div class="card" style="width:58%;left:2%;top:4%" data-px="-30"><img src="${I('pelni.webp')}" alt=""></div><div class="card" style="width:60%;right:0;bottom:8%" data-px="40"><img src="${I('banksampah.webp')}" alt=""></div><div class="kpi" style="left:6%;bottom:6%" data-px="18"><b>4</b><span>core flows · Pelni Docs</span></div></div>`;
  if (s.kind === 'web') return `<div class="svis"><div class="card" style="width:66%;left:0;top:2%" data-px="-30"><img src="${I('demos/lumetric-card.webp')}" alt=""></div><div class="card" style="width:62%;right:0;bottom:6%" data-px="40"><img src="${I('demos/arbor-and-co-card.webp')}" alt=""></div><div class="kpi" style="right:2%;top:6%" data-px="16"><b>9</b><span>live concept demos</span></div></div>`;
  if (s.kind === 'ads') return `<div class="svis"><div class="card" style="width:86%;left:6%;top:22%;padding:8px" data-px="-24"><img src="${I('google-charts.webp')}" alt=""></div><div class="card" style="width:78%;right:0;bottom:12%;padding:8px" data-px="34"><img src="${I('meta-table.webp')}" alt=""></div><div class="kpi" style="left:0;top:2%" data-px="14"><b>11×</b><span>ROAS · Dasindo Media</span></div><div class="kpi" style="right:4%;bottom:0" data-px="22"><b>1,200+</b><span>conversions · Batu Panorama</span></div></div>`;
  if (s.kind === 'graphic') return `<div class="svis"><div class="card gd" style="width:62%;left:0;top:12%" data-px="-30"><img src="${I('gd-kinetik-studio-cover.webp')}" alt="Kinetik Studio identity"></div><div class="card gd" style="width:58%;right:0;bottom:6%" data-px="40"><img src="${I('gd-tabung-cover.webp')}" alt="Tabung identity"></div><div class="card gd" style="width:28%;left:8%;bottom:4%" data-px="22"><img src="${I('gd-bowlful-post-2.webp')}" alt="Bowlful post"></div><div class="kpi" style="right:0;top:0" data-px="16"><b>10</b><span>brand identities · concepts</span></div></div>`;
  return `<div class="svis"><div class="vframe" style="left:0;top:4%;width:74%" data-px="-26"><div class="scr"><i class="play"></i><span class="rec">00:00:14:08</span></div><div class="tl"><i style="flex:3"></i><i style="flex:2" class="g"></i><i style="flex:4"></i><i style="flex:1.5" class="g"></i><i style="flex:2.5"></i></div></div><div class="vphone" style="right:2%;bottom:2%" data-px="38"><div class="scr"><i class="play"></i><span class="cap">Captions that<br>read on mute</span></div></div><div class="kpi" style="left:4%;bottom:6%" data-px="18"><b>9:16</b><span>1:1 · 16:9 · every platform</span></div></div>`;
}
function pageService(slug) {
  const s = svcBySlug[slug], projs = s.projects.map(x => projBySlug[x]).filter(Boolean);
  return `
  <section class="ph-hero" style="min-height:100vh"><div class="glow"></div>
    <div class="crumbs"><a href="#services" data-link>Services</a><span>/</span><span>${s.n}</span></div>
    <h1 class="split" style="max-width:9.5ch;font-size:clamp(50px,8vw,140px)">${s.h1}</h1>
    <p class="lead rv">${s.lead}</p>
    <div class="row rv">${btn(s.cta, '#contact')}${scrollBtn('See pricing', 'plans')}</div>
    ${svis(s)}
  </section>
  <section class="sec"><div class="shd"><h2 class="split">${s.delivTitle}</h2><p>${s.delivNote}</p></div>
    <div class="deliv">${s.deliv.map((d, i) => `<div class="rv" style="--d:${i * .06}s"><span class="n">${pad(i + 1)}</span><h3>${d[0]}</h3><p>${d[1]}</p></div>`).join('')}</div></section>
  <section class="sec"><div class="shd"><h2 class="split">How it <em class="s">works</em></h2><p>Four clear stages, reviewed with you at every step.</p></div>
    <div class="steps"><div class="bar"><i></i></div>${s.steps.map((st, i) => `<div class="step"><span class="n">${pad(i + 1)}</span><h3>${st[0]}</h3><p>${st[1]}</p></div>`).join('')}</div></section>
  <section class="sec"><div class="shd"><h2 class="split">${s.projTitle}</h2>${btn('All work', '#work', 'b-ghost b-sm')}</div>
    <div class="wgrid">${projs.map(caseCard).join('')}</div></section>
  <section class="sec paper" id="plans"><div class="shd"><h2 class="split">Simple <em class="s">pricing</em></h2><p>${s.priceNote}</p></div>
    <div class="plans">${s.plans.map(([n, d, pr, list, hot]) => `<div class="plan rv${hot ? ' hot' : ''}">${hot ? '<span class="tg">MOST POPULAR</span>' : ''}<h3>${n}</h3><p class="ds">${d}</p><div class="pr">${pr}<small>${pr === 'Custom' ? '' : s.per}</small></div><ul>${list.map(l => `<li>${l}</li>`).join('')}</ul>${btn('Choose ' + n, '#contact', hot ? 'b-em b-sm' : 'b-ink b-sm')}</div>`).join('')}</div>
    <p class="pricenote">Prices in [brackets] are placeholders until final pricing is confirmed.</p></section>
  <section class="sec"><div class="faq"><h2 class="split">Questions,<br><em class="s">answered</em></h2><div>${s.faqs.map(([q, a], i) => `<details class="q"${i === 0 ? ' open' : ''}><summary>${q}<i>+</i></summary><p>${a}</p></details>`).join('')}</div></div></section>
  <section class="bigcta"><h2 class="split">${s.ctaWords[0]}<br>${s.ctaWords[1]}<br><span class="l3">${s.ctaWords[2]}</span></h2><p>Tell us about your goals. We'll come back with a clear, free plan built to grow your business.</p>${btn('Book a 15-min call', '#contact')}</section>
  ${footer()}`;
}

/* ===================== WORK ===================== */
function pageWork() {
  const cats = [['all', 'All'], ['web', 'Website'], ['uiux', 'UI/UX'], ['ads', 'Ads'], ['graphic', 'Graphic'], ['video', 'Video']];
  return `
  <section class="ph-hero" style="min-height:76vh"><div class="glow"></div><div class="crumbs"><a href="#home" data-link>Home</a><span>/</span><span>Work</span></div>
    <h1 class="split">Selected <em class="s">work</em></h1>
    <p class="lead rv">Websites, product design, ad campaigns and brand work. Every case is presented the way its service lives — live sites, device flows, ad dashboards and brand boards.</p>
    <div class="filters rv" id="wf">${cats.map(([k, l], i) => `<button type="button" data-f="${k}" class="${i === 0 ? 'on' : ''}">${l}<sup>${k === 'all' ? PROJECTS.length : PROJECTS.filter(p => (p.cat || p.svc) === k).length}</sup></button>`).join('')}</div></section>
  <section class="sec" style="padding-top:6vh"><div class="wgrid" id="wgrid">${PROJECTS.map(caseCard).join('')}</div></section>
  ${noteCta()}
  ${footer()}`;
}
function initWork() {
  $$('#wf button').forEach(b => b.addEventListener('click', () => {
    $$('#wf button').forEach(x => x.classList.toggle('on', x === b));
    const f = b.dataset.f;
    $$('#wgrid .wc').forEach(c => { const show = f === 'all' || c.dataset.f === f; c.classList.toggle('gone', !show); if (show) { c.classList.remove('in'); void c.offsetWidth; requestAnimationFrame(() => c.classList.add('in')); } });
    requestAnimationFrame(measure);
  }));
  initNote();
}

/* ===================== CASE ===================== */
function block(b, p) {
  switch (b.type) {
    case 'overview': return `<section class="sec" style="padding-top:0"><div class="ov3">${b.items.map(([h, t], i) => `<div class="rv" style="--d:${i * .08}s"><h4>${h}</h4><p>${t}</p></div>`).join('')}</div></section>`;
    case 'live': { const url = (p.meta.find(m => m[0] === 'Live site') || [])[1] || '[website.com]';
      return `<section class="sec"><div class="shd"><h2 class="split">Live <em class="s">demo</em></h2><p>The site as it runs today. Full-page captures and the live link are coming soon.</p></div>
      <div class="browser rv"><div class="bar"><i></i><i></i><i></i><div class="url"><span>https://${url}</span><span class="live">Live</span></div></div><div class="vp"><img src="${I(p.img)}" alt="${p.title} website"><div class="ov"><span class="btn b-ghost b-sm" aria-disabled="true">Live link: ${url}</span></div></div></div></section>`; }
    case 'scope': return `<section class="sec"><div class="shd"><h2 class="split">What we <em class="s">built</em></h2><p>Pages and features delivered for launch.</p></div>
      <div class="sitemap rv" style="text-align:center"><div class="root">${p.title.split(' — ')[0]}</div><div class="kids">${b.pages.map(x => `<span>${x}</span>`).join('')}</div></div>
      <div class="feat">${b.features.map(([h, t], i) => `<div class="rv" style="--d:${i * .06}s"><b>${h}</b><p>${t}</p></div>`).join('')}</div>${b.tech ? `<p class="brk" style="margin-top:28px">Built with — ${b.tech}</p>` : ''}</section>`;
    case 'gdimg': return `<section class="sec gd-sec"><div class="shd"><h2 class="split">${b.title}</h2>${b.desc ? `<p>${b.desc}</p>` : ''}</div><div class="gd-wide rv"><img src="${I(b.src)}" alt="${b.alt || ''}" loading="lazy" decoding="async"></div>${b.note ? `<p class="gd-note">${b.note}</p>` : ''}</section>`;
    case 'gdgrid': return `<section class="sec gd-sec"><div class="shd"><h2 class="split">${b.title}</h2>${b.desc ? `<p>${b.desc}</p>` : ''}</div><div class="gd-grid${b.p6 ? ' p6' : ''}">${b.items.map(([src, cap], i) => `<figure class="rv" style="--d:${i * .05}s"><img src="${I(src)}" alt="${cap}" loading="lazy" decoding="async">${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`).join('')}</div></section>`;
    case 'gallery': return `<section class="sec"><div class="shd"><h2 class="split">Gallery</h2><p>Screens and details — final captures coming soon.</p></div><div class="gal">${b.lead ? `<div class="g img span2 rv"><img src="${I(b.lead)}" alt=""></div>` : ''}${b.items.map(t => `<div class="g rv">${t}</div>`).join('')}</div></section>`;
    case 'metrics': return `<section class="sec"><div class="shd"><h2 class="split">The <em class="s">numbers</em></h2></div><div class="mets">${b.items.map(([l, v, hi]) => `<div class="rv${hi ? ' hi' : ''}"><b data-count>${v}</b><span>${l}</span></div>`).join('')}</div></section>`;
    case 'strip': return `<section class="sec" style="padding-top:0"><div class="kstrip">${b.items.map(([v, l], i) => `<div class="rv" style="--d:${i * .06}s"><b data-count>${v}</b><span>${l}</span></div>`).join('')}</div></section>`;
    case 'dashboard': return `<section class="sec"><div class="shd"><h2 class="split">${b.title}</h2><p>Straight from the ad platform — no screenshots of vanity metrics.</p></div><div class="dash rv"><img src="${I(b.img)}" alt="${b.title}"><div class="nt"><span>${b.note}</span><span>Organoo Studio</span></div></div></section>`;
    case 'story': return `<section class="sec"><div class="shd"><h2 class="split">The <em class="s">story</em></h2></div><div class="story"><div class="ln"><i></i></div>${b.items.map(([h, t]) => `<div class="it rv"><h4>${h}</h4>${Array.isArray(t) ? `<ul>${t.map(x => `<li>${x}</li>`).join('')}</ul>` : `<p>${t}</p>`}</div>`).join('')}</div></section>`;
    case 'devices': return `<section class="sec" style="padding-top:0"><div class="devices rv"${b.desk ? ' style="padding:6vh 6vw"' : ''}><img src="${I(b.img)}" alt="${p.title} screens"${b.desk ? ' style="border-radius:12px;max-height:none;width:100%"' : ''}></div></section>`;
    case 'flow': return `<section class="sec"><div class="shd"><h2 class="split">${b.title}</h2><p>${b.desc || 'The path users take, step by step.'}</p></div><div class="flow">${b.items.map(([h, t], i) => `<div class="rv" style="--d:${i * .08}s"><span class="n">${pad(i + 1)}</span><h3>${h}</h3><p>${t}</p></div>`).join('')}</div></section>`;
    case 'brand': return `<section class="sec"><div class="shd"><h2 class="split">Brand <em class="s">board</em></h2><p>Logo, palette and type — final assets coming soon.</p></div>
      <div class="board"><div class="logo rv">[Logo lockup]</div><div class="pal rv">${[['#0B0D0C', '[Primary]', '#fff'], ['#1FAE5E', '[Accent]', '#03150B'], ['#96E1B9', '[Soft]', '#03150B'], ['#F4F7F5', '[Paper]', '#03150B']].map(([c, l, t]) => `<i style="background:${c};color:${t}">${l}</i>`).join('')}</div><div class="typ rv"><b>Aa</b><span>[Typeface name]</span></div><div class="mock rv">[Business card mockup]</div><div class="mock rv">[Packaging mockup]</div></div></section>`;
    case 'social': return `<section class="sec"><div class="shd"><h2 class="split">The <em class="s">feed</em></h2><p>A consistent visual system and content pillars — real posts coming soon.</p></div><div class="feedwrap"><div class="bigphone rv"><div class="scrn"><div class="ig"><i></i><div><b>[brandname]</b><small>[XX] posts · [X]K followers</small></div></div><div class="grid">${Array.from({ length: 12 }, (_, i) => `<i style="background:${['#1FAE5E', '#0B0D0C', '#96E1B9', '#F4F7F5', '#C0F408', '#13442a'][i % 6]};color:${[1, 5].includes(i % 6) ? 'rgba(255,255,255,.4)' : ''}">[post]</i>`).join('')}</div></div></div>
      <div class="pillars">${[['Educate', 'Tips and how-tos that make your audience better at what they care about.'], ['Show the product', 'Clear, attractive posts that answer “what is it and why should I care?”'], ['Behind the scenes', 'The people and process that make the brand feel human.'], ['Community', 'Customer stories, replies and moments worth sharing.']].map(([h, t], i) => `<div class="rv" style="--d:${i * .07}s"><span class="n">${pad(i + 1)}</span><div><b>${h}</b><p>${t}</p></div></div>`).join('')}</div></div></section>`;
    case 'shots': {
      const views = [['hero', 'Cover'], ['collage', 'All screens'], ['desktop', 'Responsive'], ['page', 'Inner page']];
      return `<section class="sec dshow"><div class="shd"><h2 class="split">See it <em class="s">live</em></h2><p>Device mockups next to the real homepage, running live — scroll through it or open the full demo.</p></div>
      <div class="dsh">
        <div class="dsh-l rv"><div class="dsh-main">${views.map(([k, l], i) => `<img class="${i ? '' : 'on'}" src="${I('demos/' + b.slug + '-' + k + '.webp')}" alt="${b.title} — ${l}" loading="${i ? 'lazy' : 'eager'}" decoding="async">`).join('')}</div>
          <div class="dsh-th" role="tablist">${views.map(([k, l], i) => `<button type="button" class="${i ? '' : 'on'}" data-i="${i}" aria-label="${l}"><img src="${I('demos/' + b.slug + '-' + k + '.webp')}" alt="" loading="lazy"><span>${l}</span></button>`).join('')}</div></div>
        <div class="dsh-r rv" style="--d:.1s"><div class="dsh-br"><div class="bar"><i></i><i></i><i></i><span>organoostudio.com/demos/${b.slug}</span></div>
            <div class="vp" data-src="/demos/${b.slug}/"><img class="poster" src="${I('demos/' + b.slug + '-hero.webp')}" alt=""><div class="prog"><i></i></div><span class="hint">Hover to pause · drag the bar to explore</span></div></div>
          <a class="dsh-cta" href="/demos/${b.slug}/" target="_blank" rel="noopener" data-cur="Open"><div><b>Explore the full site</b><small>Fully working demo · desktop &amp; mobile</small></div><span class="btn b-em"><span>Open live demo</span><span class="ic">${ARR}</span></span></a></div>
      </div></section>`;
    }
    case 'video': return `<section class="sec"><div class="shd"><h2 class="split">The <em class="s">edits</em></h2><p>Final videos in every format — real clips coming soon.</p></div><div class="vgal"><div class="vframe rv"><div class="scr"><i class="play"></i><span class="rec">16:9 · [Brand video]</span></div><div class="tl"><i style="flex:3"></i><i style="flex:2" class="g"></i><i style="flex:4"></i><i style="flex:1.5" class="g"></i><i style="flex:2.5"></i></div></div>${['[Reel 01]', '[Reel 02]', '[Ad cut]'].map(t => `<div class="vphone rv"><div class="scr"><i class="play"></i><span class="cap">${t}</span></div></div>`).join('')}</div></section>`;
    case 'quote': return `<section class="quote"><blockquote class="rv">[Client testimonial — a short quote about working with Organoo Studio.]</blockquote><cite>— [Name], [Role] · ${p.meta[0][1]}</cite></section>`;
  }
  return '';
}
function pageCase(slug) {
  const p = projBySlug[slug], idx = PROJECTS.indexOf(p), n = PROJECTS[(idx + 1) % PROJECTS.length];
  const cover = p.img ? `<img src="${I(p.img)}" alt="${p.title}"${p.wide ? ' style="width:88%"' : ''}>` : `<div class="ph0">[Project cover]</div>`;
  return `
  <section class="ph-hero case-hero"><div class="glow"></div>
    <div class="crumbs"><a href="#work" data-link>Work</a><span>/</span><a href="#service-${p.svc}" data-link>${p.service}</a></div>
    <h1 class="split">${p.h1}</h1><p class="lead rv">${p.demo ? p.lead : p.sub}</p>
    ${p.demo ? `<div class="row rv"><a class="btn b-em" href="${p.demo}" target="_blank" rel="noopener"><span>Open live demo</span><span class="ic">${ARR}</span></a><span class="pill" style="align-self:center">Concept project</span></div>` : ''}
    <div class="cmeta rv">${p.meta.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div></section>
  ${p.demo ? '' : `<section class="sc cover" id="cover"><div class="stick"><div class="cv${p.light ? ' lt' : ''}" id="cv">${cover}</div></div></section>
  <section class="sec"><p class="clead split">${p.lead}</p></section>`}
  ${p.blocks.map(b => block(b, p)).join('')}
  <a class="next" href="#work-${n.slug}" data-link data-cur="Next"><span class="k">Next case · ${n.service}</span><h2>${n.title}</h2>${n.img ? `<div class="im"><img src="${I(n.img)}" alt=""></div>` : ''}</a>
  ${footer()}`;
}
function initDemoShow() {
  const root = $('.dsh'); if (!root) return;
  /* mockup switcher */
  const imgs = $$('.dsh-main img', root), th = $$('.dsh-th button', root);
  let cur = 0, auto = setInterval(() => show((cur + 1) % imgs.length), 4200);
  function show(n) { cur = n; imgs.forEach((im, i) => im.classList.toggle('on', i === n)); th.forEach((t, i) => t.classList.toggle('on', i === n)); }
  th.forEach((t, i) => t.addEventListener('click', () => { clearInterval(auto); show(i); }));
  /* live homepage preview: real demo in a scaled iframe that scrolls itself */
  const vp = $('.dsh-br .vp', root), bar = $('.prog', vp), barI = $('.prog i', vp);
  let fr = null, sc = 1, pos = 0, dir = 1, wait = 60, hover = false, drag = false;
  const fit = () => { if (!fr) return; sc = vp.clientWidth / 1440; fr.style.transform = `scale(${sc})`; fr.style.height = (vp.clientHeight / sc) + 'px'; };
  const load = () => {
    if (fr) return; fr = document.createElement('iframe'); fr.src = vp.dataset.src; fr.title = 'Live demo preview'; fr.tabIndex = -1; fr.setAttribute('scrolling', 'no');
    fr.addEventListener('load', () => { vp.classList.add('ready'); fit(); });
    vp.prepend(fr); fit();
  };
  const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { load(); io.disconnect(); } }, { rootMargin: '400px' });
  io.observe(vp); addEventListener('resize', fit);
  vp.addEventListener('mouseenter', () => hover = true); vp.addEventListener('mouseleave', () => hover = false);
  const seek = e => { const r = bar.getBoundingClientRect(); const k = clamp((e.clientY - r.top) / r.height, 0, 1); try { const w = fr.contentWindow, d = w.document.documentElement; pos = k * (d.scrollHeight - w.innerHeight); w.scrollTo(0, pos); } catch (_) {} };
  bar.addEventListener('pointerdown', e => { drag = true; bar.setPointerCapture(e.pointerId); seek(e); });
  bar.addEventListener('pointermove', e => drag && seek(e)); bar.addEventListener('pointerup', () => drag = false);
  const vis = () => { const r = vp.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
  tick(() => {
    if (!fr || !vp.classList.contains('ready')) return;
    let w, max; try { w = fr.contentWindow; max = w.document.documentElement.scrollHeight - w.innerHeight; } catch (_) { return; }
    if (max <= 0) return;
    if (!hover && !drag && !reduce && vis()) {
      if (wait > 0) wait--; else { pos += dir * 2.2; if (pos >= max) { pos = max; dir = -1; wait = 90; } else if (pos <= 0) { pos = 0; dir = 1; wait = 90; } w.scrollTo(0, pos); }
    } else pos = w.scrollY;
    barI.style.transform = `scaleY(${pos / max})`;
  });
}
function initCase() {
  initDemoShow();
  const cv = $('#cv'); if (!cv) return;
  scene($('#cover'), p => { const k = eIO(range(p, 0, .7)); cv.style.setProperty('--cw', lerp(innerWidth < 760 ? 88 : 62, 94, k) + 'vw'); cv.style.setProperty('--cr', lerp(26, 12, k) + 'px'); });
}

/* ===================== JOURNAL ===================== */
function pageJournal() {
  return `
  <section class="ph-hero" style="min-height:70vh"><div class="glow"></div><div class="crumbs"><a href="#home" data-link>Home</a><span>/</span><span>Journal</span></div>
    <h1 class="split">Notes on <em class="s">growth</em></h1><p class="lead rv">Practical guides on websites, ads, design and video — written for business owners, not designers.</p></section>
  <section class="sec" style="padding-top:4vh"><div class="jgrid">${POSTS.map(postCard).join('')}</div></section>
  ${footer()}`;
}
function pagePost(slug) {
  const p = postBySlug[slug], more = POSTS.filter(x => x !== p).slice(0, 3);
  return `
  <section class="ph-hero post-hero" style="min-height:90vh;justify-content:center;--glow:${p.glow}"><div class="glow"></div>
    <div class="crumbs"><a href="#journal" data-link>Journal</a><span>/</span><span>${p.cat}</span><span>·</span><span>${p.time}</span></div>
    <h1 class="split word" style="font-size:clamp(70px,14vw,240px)">${p.word}</h1>
    <p class="lead rv" style="font-size:clamp(20px,2.2vw,30px);font-weight:700;letter-spacing:-.03em;color:#fff;max-width:28ch">${p.title}</p></section>
  <section class="sec"><div class="prose rv"><p>${p.excerpt}</p><p class="ph1">[Full article coming soon — this page shows the article template.]</p></div></section>
  <section class="jr"><div class="hd"><h2 class="split">Keep <em class="s">reading</em></h2>${btn('All articles', '#journal', 'b-ghost b-sm')}</div><div class="jgrid">${more.map(postCard).join('')}</div></section>
  ${footer()}`;
}

/* ===================== CONTACT ===================== */
function pageContact() {
  return `
  <section class="ph-hero" style="min-height:74vh"><div class="glow"></div><div class="crumbs"><a href="#home" data-link>Home</a><span>/</span><span>Contact</span></div>
    <h1 class="split">Let's build<br>what's <em class="s">next</em>.</h1><p class="lead rv">Tell us about your goals. We'll come back with a clear, free plan built to grow your business.</p></section>
  <section class="sec" style="padding-top:4vh"><div class="cform">
    <form id="cf" novalidate>
      <div class="fld"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" placeholder="Jane Doe" required></div>
      <div class="fld"><label for="f-mail">Email or WhatsApp</label><input id="f-mail" name="contact" autocomplete="email" placeholder="you@company.com" required></div>
      <div class="fld"><label for="f-co">Company</label><input id="f-co" name="company" autocomplete="organization" placeholder="Company name"></div>
      <div class="fld"><label>What do you need?</label><div class="chipsel" id="f-svc">${SERVICES.map(s => `<button type="button">${s.name}</button>`).join('')}</div></div>
      <div class="fld"><label>Budget</label><div class="chipsel" id="f-bud" data-single>${['Under Rp 10 jt', 'Rp 10–25 jt', 'Rp 25–50 jt', 'Above Rp 50 jt', 'Not sure yet'].map(b => `<button type="button">${b}</button>`).join('')}</div></div>
      <div class="fld"><label for="f-msg">Tell us more</label><textarea id="f-msg" name="message" placeholder="Goals, timeline, links…"></textarea></div>
      <p id="ferr" class="brk" style="color:#ff8a8a;min-height:1.4em" role="alert"></p>
      <button class="btn b-em" type="submit"><span>Prepare my brief</span><span class="ic">${ARR}</span></button>
    </form>
    <div class="cinfo">
      <div class="blk"><h4>Email</h4><span class="cp"><a href="mailto:organoostudio@gmail.com">organoostudio@gmail.com</a><button type="button" data-copy="organoostudio@gmail.com">Copy</button></span></div>
      <div class="blk"><h4>Instagram</h4><a href="https://www.instagram.com/organoo.studio/" target="_blank" rel="noopener">@organoo.studio ↗</a></div>
      <div class="blk"><h4>Studio</h4><p>Jakarta, Indonesia</p></div>
      <div class="blk"><h4>Prefer to talk?</h4><p>Book a free 15-minute call — mention it in your brief.</p></div>
    </div></div></section>
  ${footer()}`;
}
function initContact() {
  $$('.chipsel').forEach(g => g.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (g.hasAttribute('data-single')) $$('button', g).forEach(x => x.classList.toggle('on', x === b)); else b.classList.toggle('on'); }));
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => { const v = b.dataset.copy; const ok = () => { b.textContent = 'Copied'; setTimeout(() => b.textContent = 'Copy', 1500); }; navigator.clipboard ? navigator.clipboard.writeText(v).then(ok, ok) : ok(); }));
  const f = $('#cf');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#f-name').value.trim(), contact = $('#f-mail').value.trim();
    if (!name || !contact) { $('#ferr').textContent = 'Please add your name and an email or WhatsApp number so we can reply.'; return; }
    const svc = $$('#f-svc .on').map(b => b.textContent).join(', ') || '—', bud = ($('#f-bud .on') || {}).textContent || '—';
    const brief = `Name: ${name}\nContact: ${contact}\nCompany: ${$('#f-co').value.trim() || '—'}\nServices: ${svc}\nBudget: ${bud}\n\n${$('#f-msg').value.trim()}`;
    f.outerHTML = `<div class="sent"><h3>Thanks, ${name.replace(/[<>&]/g, '')} — your brief is ready.</h3><p>This prototype doesn't send messages yet. Copy your brief and email it to <b>organoostudio@gmail.com</b>.</p><pre style="white-space:pre-wrap;font-family:var(--mono);font-size:13px;color:var(--soft);background:rgba(0,0,0,.25);border-radius:12px;padding:16px;margin:20px 0" id="briefTxt"></pre><button class="btn b-em b-sm" type="button" id="copyBrief"><span>Copy brief</span><span class="ic">${ARR}</span></button></div>`;
    $('#briefTxt').textContent = brief;
    $('#copyBrief').addEventListener('click', ev => { const b = ev.currentTarget; const ok = () => { b.firstChild.textContent = 'Copied'; }; navigator.clipboard ? navigator.clipboard.writeText(brief).then(ok, () => { const r = document.createRange(); r.selectNodeContents($('#briefTxt')); getSelection().removeAllRanges(); getSelection().addRange(r); }) : ok(); });
    measure();
  });
}

const PAGES = { home: pageHome, about: pageAbout, services: pageServices, service: pageService, work: pageWork, case: pageCase, journal: pageJournal, post: pagePost, contact: pageContact };
const INIT = { home: initHome, about: initAbout, services: initServices, service: () => {}, work: initWork, case: initCase, journal: () => {}, post: () => {}, contact: initContact };
