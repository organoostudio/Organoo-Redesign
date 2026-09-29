/* ============================================================
   Strata Atelier: app (router, pages, motion, 3D wiring)
   ============================================================ */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),lerp=(a,b,t)=>a+(b-a)*t;
const ss=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const TOUCH=matchMedia('(hover:none),(pointer:coarse)').matches;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ls=(k,v)=>{try{if(v===undefined)return JSON.parse(localStorage.getItem('strata:'+k));localStorage.setItem('strata:'+k,JSON.stringify(v))}catch(e){return null}};
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const ph=(k,alt='',pos='')=>`<div class="ph"><img src="photos/${k}.jpg" alt="${esc(alt)}" loading="lazy" decoding="async" ${pos?`style="object-position:${pos}"`:''} onerror="this.remove()"></div>`;
const IC={ne:'<path d="M7 17 17 7M8 7h9v9"/>',ar:'<path d="M5 12h14M13 6l6 6-6 6"/>',left:'<path d="M19 12H5M11 18l-6-6 6-6"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',menu:'<path d="M4 8h16M4 16h16"/>',
 drag:'<path d="M8 9 4 12l4 3M16 9l4 3-4 3M4 12h16"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 cube:'<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12 4 7.5M12 12l8-4.5M12 12v9"/>',eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 top:'<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 12h16M12 4v16"/>',air:'<path d="M3 20 12 4l9 16z"/><path d="M8 14h8"/>',axo:'<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/>',
 full:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',cam:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',check:'<path d="m5 12 5 5L20 7"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/>',send:'<path d="M4 12 20 4l-6 16-3-7z"/>'};
const ic=(n,st='')=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" ${st?`style="${st}"`:''}>${IC[n]||''}</svg>`;
const split=(t,tag='h1',cls='')=>`<${tag} class="split ${cls}" aria-label="${esc(t)}">${t.split(' ').map((w,i)=>`<span class="w" aria-hidden="true"><span style="--i:${i}">${esc(w)}</span></span>`).join(' ')}</${tag}>`;

/* ---------- data ---------- */
const P=[
 {s:'flinders-cliff-house',n:'Flinders Cliff House',loc:'Mornington Peninsula, AU',city:'Melbourne',year:2025,type:'Residential',model:'cliff',status:'Completed',area:'420 m²',img:['x3','x1','i6','i9','i8','x5'],pos:['50% 60%'],
  lead:'A concrete base anchored to the rock, and a timber bar that cantilevers five metres toward Bass Strait.',
  body:['The site falls 38 metres to the water in a series of sandstone shelves. Rather than level it, we cast a board-formed concrete base directly into the top shelf and let the living spaces open onto a single long terrace.','Above it sits a bar of bedrooms wrapped in spotted-gum slats. It turns slightly to catch the view along the coast and cantilevers five metres over the lap pool, shading the glass below in summer while letting the low winter sun reach the concrete floor.'],
  facts:[['420 m²','Floor area'],['5 m','Cantilever'],['7.2 kWp','Rooftop solar'],['18 mo','On site']],
  mats:[['Board-formed concrete','#BDB8AF'],['Spotted gum','#8A5B38'],['Bronze frames','#5A4632'],['Limestone','#D8CDB8']],team:['jonah','anders','elena']},
 {s:'hardanger-fjord-cabins',n:'Hardanger Fjord Cabins',loc:'Hardanger, NO',city:'Copenhagen',year:2024,type:'Hospitality',model:'cabins',status:'Completed',area:'3 × 38 m²',img:['c1','c3','c4','c2','c5'],
  lead:'Three small cabins on the rocks above the fjord, each turned toward its own view.',
  body:['The owners wanted guests to feel alone with the landscape. We split the brief into three cabins instead of one lodge, each rotated a few degrees so that no window looks into another.','The cabins were prefabricated in charred larch and zinc in nine weeks, craned onto steel screw piles and finished on site in eleven days. No trees were felled; the boardwalk steps around the rocks.'],
  facts:[['3','Cabins'],['38 m²','Each'],['9 wks','Prefabrication'],['0','Trees felled']],
  mats:[['Charred larch','#2E2A25'],['Zinc','#5C6560'],['Oiled oak','#B08D62'],['Wool felt','#D7CFC0']],team:['mara','kwame']},
 {s:'norrebro-lofts',n:'Nørrebro Lofts',loc:'Copenhagen, DK',city:'Copenhagen',year:2026,type:'Multi-residential',model:'tower',status:'Under construction',area:'4,900 m²',img:['r1','r2','r4','r3','r5'],
  lead:'Forty-two homes around a shared roof garden, with deep winter balconies you can still use in October.',
  body:['Every flat is dual-aspect and has a balcony deep enough for a table for six. The balconies alternate floor by floor, so each one gets sky above it and none shades the flat below.','The structure is a hybrid of cross-laminated timber floors on a concrete core, wrapped in recycled brick piers salvaged from a demolished warehouse two streets away.'],
  facts:[['42','Homes'],['7','Floors'],['180 m²','Roof garden'],['2026','Completion']],
  mats:[['Recycled brick','#9A5840'],['Pale concrete','#D3CFC7'],['Anodised aluminium','#8E9194'],['Larch','#B98A5A']],team:['mara','tomas','sofia']},
 {s:'fitzroy-courtyard-house',n:'Fitzroy Courtyard House',loc:'Melbourne, AU',city:'Melbourne',year:2023,type:'Residential',model:'courtyard',status:'Completed',area:'265 m²',img:['x9','i1','i4','x10','i2','i3'],
  lead:'A brick house that turns its back on the street and opens entirely to a single tree.',
  body:['On a narrow inner-city lot, the house wraps three sides of a courtyard planted with one mature ornamental pear. Every room looks at it; none looks at the neighbours.','Reclaimed brick outside, lime render and blackbutt inside. The upper studio floats over the courtyard wall so that in the evening its window becomes a lantern for the lane.'],
  facts:[['265 m²','Floor area'],['1','Tree'],['11,400','Reclaimed bricks'],['3','Bedrooms']],
  mats:[['Reclaimed brick','#9A5840'],['Lime render','#EEEBE5'],['Blackbutt','#A27B55'],['Terrazzo','#CFC6B8']],team:['jonah','priya']},
 {s:'kiln-cafe',n:'Kiln Café',loc:'Vesterbro, Copenhagen',city:'Copenhagen',year:2024,type:'Interiors',model:'pavilion',status:'Completed',area:'310 m²',img:['f4','f1','f3','f5','f2'],
  lead:'A glass pavilion café with a terrazzo bar, oak tables and hand-blown pendants.',
  body:['The client roasts on site, so the bar is the stage: eleven metres of terrazzo cast with shards of the roastery\'s broken cups. Seating steps down toward the glass so everyone faces the park.','We designed the tables, stools and pendant lamps with local makers. A skylight of oak fins runs above the bar and throws moving stripes of light across the counter through the day.'],
  facts:[['310 m²','Interior'],['11 m','Terrazzo bar'],['64','Seats'],['7','Local makers']],
  mats:[['Terrazzo','#D5CEC2'],['White oak','#C9A676'],['Blackened steel','#26262A'],['Linen','#D9CFBF']],team:['priya','sofia']},
 {s:'byron-hill-terraces',n:'Byron Hill Terraces',loc:'Byron Bay, AU',city:'Melbourne',year:2027,type:'Multi-residential',model:'terrace',status:'In design',area:'3 × 190 m²',img:['x4','x5','x12','i5','i7'],
  lead:'Three homes stepping down a hillside, each with a planted roof that becomes the garden of the one above.',
  body:['The hill is steep and the council wanted it to stay green. We cut three long, low homes into the slope and covered each roof with native grasses, so from the ridge the development reads as terraced meadow.','A stone stair spine links the three levels. Each home has a full-width deck on the roof of the one below, and cross-ventilation that means none of them needs air conditioning.'],
  facts:[['3','Homes'],['570 m²','Green roof'],['0','Air-conditioners'],['2027','Target']],
  mats:[['Lime render','#EEEBE5'],['Native meadow','#8C9A67'],['Sandstone','#B7AE9F'],['Hoop pine','#C9A676']],team:['jonah','elena','tomas']}];
const pj=s=>P.find(p=>p.s===s);
const TEAM=[
 {id:'jonah',n:'Jonah Reyes',r:'Founding Director · Melbourne',img:'g1',b:'Jonah trained as a carpenter before architecture school and still draws every project\'s key details by hand.'},
 {id:'mara',n:'Mara Lindqvist',r:'Founding Director · Copenhagen',img:'g2',b:'Mara leads the Copenhagen studio and our timber research. She has taught design studios in Aarhus for ten years.'},
 {id:'anders',n:'Anders Holm',r:'Associate Architect',img:'g3',b:'Anders runs documentation and site delivery. If it has a tolerance, he has checked it twice.'},
 {id:'priya',n:'Priya Nandakumar',r:'Interiors Lead',img:'g4',b:'Priya leads interiors and furniture, working with makers in both cities on bespoke pieces.'},
 {id:'kwame',n:'Kwame Asante',r:'3D Visualisation Lead',img:'g5',b:'Kwame builds the live models our clients walk through, and the sun studies behind every facade.'},
 {id:'elena',n:'Elena Moretti',r:'Landscape Architect',img:'g6',b:'Elena designs the ground around our buildings: planting, water and the paths between.'},
 {id:'tomas',n:'Tomás Ibarra',r:'Project Architect',img:'g7',b:'Tomás works across both studios on multi-residential projects and coordinates with engineers.'},
 {id:'sofia',n:'Sofia Haddad',r:'Studio Manager',img:'g8',b:'Sofia keeps two studios, eleven time zones of consultants and every client meeting running on time.'}];
const tm=id=>TEAM.find(t=>t.id===id);
const J=[
 {s:'sun-first',t:'Designing with the sun first',d:'Aug 2026',c:'Process',img:'x7',ex:'Before we draw a wall, we model a year of sunlight on the site. Here is why, and how it changes the plan.',
  body:['Every project in the studio begins with a sun study. Before a single wall exists, we build the site in 3D (contours, trees, neighbours) and run the sun across it hour by hour, for the solstices and the equinoxes.','The result is not a pretty animation. It is a map of where the living room must be, where a bedroom will overheat and where the garden will stay damp in winter.','### What the model shows','On the Flinders Cliff House, the study showed that the obvious view (south, over the water) would leave the main room in shadow from May to August. So the house turned twelve degrees and the bedrooms went upstairs in a bar that shades the glass below.','> We design the light first and the building second.','### Why we show clients the live model','Drawings ask clients to imagine. A live model lets them drag the sun to 7 pm in June and see the terrace glow. Decisions that used to take weeks of meetings now take one afternoon.']},
 {s:'physical-models',t:'Why we still build physical models',d:'Jun 2026',c:'Studio',img:'m1',ex:'Our screens can render anything. We still cut card and basswood every week. Three reasons.',
  body:['It surprises clients that a studio known for 3D visualisation keeps a model workshop. We use both, for different jobs.','### Scale you can hold','A 1:200 model on the table lets six people point at the same thing at once. Nobody is driving the mouse; everybody is looking.','### Honest mistakes','Card does not lie. If a roof does not close, you find out in ten minutes instead of on site.','> The screen is for light. The table is for arguments.','### Speed','We can cut three massing options in a morning. The best one goes into the digital model; the other two stay on the shelf as a record of the conversation.']},
 {s:'timber-ages',t:'Timber that ages well',d:'Apr 2026',c:'Materials',img:'i10',ex:'Charred larch, spotted gum, oiled oak: how we choose timber that looks better at twenty years than at two.',
  body:['Timber is the material clients ask about most, and the one they worry about most. Will it go grey? Will it rot? Will it need oiling every summer?','### Choose for the weather, not the sample','A beautiful sample board in the office tells you nothing. We look at twenty-year-old buildings in the same climate and pick the species that aged well there.','### Detail for water','Almost every timber failure is a detail failure. Slats that shed water, ventilated cavities and end grain kept off the ground matter more than the species.','> If you design for grey, grey is not a problem.','### Let it change','On the Hardanger cabins we charred the larch. It will silver slowly over a decade, and that is the plan.']}];
const CH=[
 {a:.07,b:.24,n:'01',t:'Site',d:'We start on the land: contours, rock, sun path and the view to the water, modelled before any wall is drawn.',st:[['38 m','Fall to water'],['NNE','Best aspect']]},
 {a:.24,b:.42,n:'02',t:'Structure',d:'A board-formed concrete base is cast into the rock shelf and carries a single steel-and-timber bar.',st:[['420 m²','Floor area'],['5 m','Cantilever']]},
 {a:.42,b:.58,n:'03',t:'Envelope',d:'Spotted-gum slats wrap the upper bar, filtering western light and giving privacy from the road.',st:[['2,840','Timber slats'],['0','Tropical hardwood']]},
 {a:.58,b:.76,n:'04',t:'Light',d:'We model every hour of the day. At dusk the house becomes a lantern on the cliff.',st:[['13:00 → 20:15','Sun study'],['7.2 kWp','Solar array']]},
 {a:.76,b:.93,n:'05',t:'Landscape',d:'Native planting, a 10 m lap pool and a deck stepping down to the lawn complete the site.',st:[['64','Native trees'],['10 m','Lap pool']]}];
const PROC=[['01','Brief','We listen first: a site walk, your budget, how you live and what the land wants.','s2'],['02','Concept','Sketches and physical models test three or four ideas side by side.','m3'],['03','Design','Plans, sections and a live 3D model you can walk through with us.','m4'],['04','Documentation','Materials, details and specs, coordinated with engineers and makers.','s7'],['05','Build','We stay on site through construction, every fortnight, until the last detail.','s10'],['06','Handover','Keys, a maintenance manual and a dusk photo shoot for the family album.','x7']];
const DISC=[['01','Architecture','New houses, multi-residential and small public buildings, from first sketch to handover.','x2'],['02','Interiors','Interiors, joinery and bespoke furniture, designed with local makers.','i10'],['03','Landscape','Planting, water and outdoor rooms that make the building part of its site.','x4'],['04','3D Visualisation','Live models, sun studies and cinematic renders for our projects and for other studios.','m5']];

/* ---------- state ---------- */
const S={page:'',wf:ls('wf')||'all',wv:ls('wv')||'grid',room:'cabins',lab:Object.assign({floors:2,cant:5,facade:'timber',glaze:.7,roofGarden:false,pool:true,time:17.5,real:1},ls('lab')||{}),cur:ls('cur')||'AUD',demoOff:ls('demoOff'),first:true};

/* ---------- 3D bootstrap ---------- */
let E=null,E_state='loading';const E_wait=[];
const need3D=cb=>{if(E)return cb(E);if(E_state==='fail')return;E_wait.push(cb)};
(async()=>{try{const c=document.createElement('canvas');if(!(c.getContext('webgl2')||c.getContext('webgl')))throw new Error('no webgl');
  const [T,R]=await Promise.all([import('three'),import('three/addons/environments/RoomEnvironment.js')]);
  E=createEngine(T,R.RoomEnvironment);E_state='ok';E_wait.splice(0).forEach(f=>{try{f(E)}catch(e){console.error(e)}});
 }catch(e){E_state='fail';document.documentElement.classList.add('no3d');E_wait.length=0}})();
const V={pk:''};
function use3D(host,key,params={},cfg={}){E.S.onFrame=null;E.mount(host);const pk=key+JSON.stringify(params);if(V.pk!==pk||cfg.reload){E.load(key,params);V.pk=pk}
 Object.assign(E.S,{real:1,stageReal:null,show:{site:1,structure:1,envelope:1,glass:1,landscape:1},draw:1,edges:.1,cut:null,explode:0,contour:0,glowOn:null,spin:0,time:13},cfg.state||{});
 E.S.cam.auto=cfg.auto??!RM;if(cfg.path)E.S.cam.mode='path';else{E.orbit();if(cfg.preset!==false)E.preset(cfg.preset||'default')}E.apply();return E}

/* ---------- shell ---------- */
const logo=`<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="1" y="1" width="30" height="30" fill="var(--signal)"/><path d="M7 22h18M7 17h13M7 12h8" stroke="#121212" stroke-width="2.4"/></svg>`;
function nav(cur){const A=(h,t)=>`<a href="#${h}" ${cur===h?'aria-current="page"':''}><span data-t="${t}">${t}</span></a>`;
 return `<header class="nav" id="nav"><a class="logo" href="#home" aria-label="Strata Atelier home">${logo}<span>Strata</span></a>
 <nav class="nav-l" aria-label="Main">${A('work','Work')}${A('lab','Lab')}${A('studio','Studio')}${A('journal','Journal')}${A('contact','Contact')}</nav>
 <div class="nav-r"><div class="clock" aria-label="Studio local times"><span>MEL <b class="num" data-tz="Australia/Melbourne"></b></span><span>CPH <b class="num" data-tz="Europe/Copenhagen"></b></span></div><button class="burger" id="burger" aria-label="Open menu" aria-expanded="false">${ic('menu')}</button></div></header>
 <nav class="mm" id="mm" aria-label="Mobile">${[['work','Work'],['lab','Massing Lab'],['studio','Studio'],['journal','Journal'],['contact','Start a project']].map((l,i)=>`<a href="#${l[0]}"><small>0${i+1}</small>${l[1]}</a>`).join('')}<div class="mono" style="color:#8F8A82">Melbourne · Copenhagen<br>hello@strata-atelier.example</div></nav>`}
function footer(){return `<footer class="foot" data-nav-inv><div class="foot-g">
 <div><h4>Newsletter</h4><p style="color:#C9C6C0;max-width:34ch">Four letters a year: new work, one material we love, one building we visited.</p><form class="nl" id="nlf" novalidate><label class="sr" for="nle">Email</label><input id="nle" type="email" placeholder="you@email.com" autocomplete="email"><button class="btn sg sm" type="submit">Join</button></form><p class="err-t" id="nlerr" hidden style="margin-top:8px"></p></div>
 <div><h4>Studio</h4><a href="#work">Work</a><a href="#lab">Massing Lab</a><a href="#studio">Studio</a><a href="#journal">Journal</a><a href="#contact">Start a project</a></div>
 <div><h4>Follow</h4><a href="#journal">Journal</a><a href="#contact">Careers</a><a href="mailto:hello@strata-atelier.example">Email</a></div>
 <div class="ofc" style="display:grid;gap:18px"><div><h4>Offices</h4><b>Melbourne</b><span>Level 2, 18 Gertrude St, Fitzroy · <b class="num" style="display:inline;font-size:12px;font-family:var(--f-m)" data-tz="Australia/Melbourne"></b></span></div><div><b>Copenhagen</b><span>Halmtorvet 9, Vesterbro · <b class="num" style="display:inline;font-size:12px;font-family:var(--f-m)" data-tz="Europe/Copenhagen"></b></span></div></div></div>
 <div class="fwm" aria-hidden="true">${[...'STRATA'].map((c,i)=>`<span style="--i:${i}">${c}</span>`).join('')}</div>
 <div class="fbase"><span>© 2026 Strata Atelier (fictional). Projects, people and figures are demo content.</span><span>Website by Organoo Studio</span></div></footer>`}
function mount(cur,body,opt={}){const root=$('#root');root.innerHTML=nav(cur)+`<main id="main">${body}</main>`+(opt.noFoot?'':footer())+`<div class="preview" id="pv" aria-hidden="true"></div>`+(S.demoOff?'':`<div class="demo" id="demo">Demo<span class="x3">&nbsp;· Organoo Studio</span><button type="button" aria-label="Hide demo label">${ic('x','width:11px;height:11px')}</button></div>`);
 $('#burger').onclick=()=>{const m=$('#mm'),o=!m.classList.contains('open');m.classList.toggle('open',o);$('#burger').setAttribute('aria-expanded',o);document.body.classList.toggle('lock',o)};
 $('#demo button')?.addEventListener('click',()=>{S.demoOff=1;ls('demoOff',1);$('#demo').remove()});
 const nf=$('#nlf');if(nf)nf.onsubmit=e=>{e.preventDefault();const v=$('#nle').value.trim(),er=$('#nlerr');if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){er.hidden=false;er.textContent='Please enter a valid email.';return}er.hidden=true;nf.innerHTML=`<p style="color:var(--signal)">${ic('check')} Thanks. The next letter goes to ${esc(v)}.</p>`};
 clocks()}
function clocks(){$$('[data-tz]').forEach(el=>{try{el.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:el.dataset.tz}).format(new Date())}catch(e){}})}
setInterval(clocks,20000);
function toast(t){$('.toast')?.remove();const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.innerHTML=ic('check')+esc(t);document.body.appendChild(d);setTimeout(()=>d.remove(),2800)}
function modal(html){closeModal();const m=document.createElement('div');m.className='mdl';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.innerHTML=`<div class="bx"><button class="circ x" aria-label="Close">${ic('x')}</button>${html}</div>`;document.body.appendChild(m);document.body.classList.add('lock');
 m.onclick=e=>{if(e.target===m||e.target.closest('.x'))closeModal()};setTimeout(()=>$('input,button:not(.x),a',m)?.focus(),50);return m}
function closeModal(){$$('.mdl,.lbx').forEach(m=>m.remove());if(!$('#mm.open'))document.body.classList.remove('lock')}
addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

/* ---------- HOME ---------- */
function pageHome(){return `
<section class="cine" id="cine" data-nav-cine><div class="stage" id="stage">
 <div class="gl-host" id="cineHost"></div>
 <div class="fallback">${ph('x3','Flinders Cliff House','50% 60%')}</div>
 <i class="lb t"></i><i class="lb b"></i>
 <div class="hud" id="hud">
  <div class="hero-w" id="heroW"><div class="big" aria-hidden="true"><span>${[...'Strata'].map((c,i)=>`<i style="--i:${i}">${c}</i>`).join('')}</span><span class="r">${[...'Atelier'].map((c,i)=>`<i style="--i:${i+6}">${c}</i>`).join('')}</span></div>
   <h1 class="sr">Strata Atelier, architecture, interiors and 3D visualisation</h1><div></div>
   <div class="row"><p>An architecture, interiors and 3D visualisation studio in Melbourne and Copenhagen. We model the light before we draw the walls.</p><div class="cue">Scroll to build the house <i></i></div></div></div>
  <div class="chap" id="chap" aria-label="Chapters">${CH.map((c,i)=>`<button type="button" data-ch="${i}"><small>${c.n}</small><span>${c.t}</span></button>`).join('')}</div>
  <div class="chap-card" id="chapCard" aria-live="polite"></div>
  <div class="tc" id="tc"><span class="rec">SC 01</span><span class="num" id="tcT">00:00:00</span><span class="track"><i id="tcBar"></i></span><span class="num hide-m" id="tcSun">SUN 13:00</span><span class="hide-m">Flinders Cliff House</span></div>
  <div class="final" id="final"><div><span class="lab">Flinders Cliff House · 2025</span><h2>Built from light.</h2><a class="btn wh" href="#p-flinders-cliff-house" data-cursor="Open">Enter the project <span class="ar">${ic('ne','width:14px;height:14px')}</span></a></div></div>
  <div id="cineHot"></div>
 </div></div></section>
<section class="sec wrap"><div class="st-grid"><p class="statement" id="stmt">${'We design buildings the way a film is shot: frame by frame, light first. Every project lives as a model you can walk through long before the first pour.'.split(' ').map(w=>`<span class="wf">${w}</span>`).join(' ')}</p>
 <div style="display:grid;gap:34px"><span class="lab">Studio in numbers</span><div class="stats">${[['2014','Founded'],['64','Built projects'],['2','Studios']].map(s=>`<div><b class="num" data-count="${s[0]}">0</b><span>${s[1]}</span></div>`).join('')}</div><a class="btn lt" href="#studio" style="justify-self:start">About the studio <span class="ar">${ic('ne','width:14px;height:14px')}</span></a></div></div></section>
<section class="sec wrap" style="padding-top:0"><div class="sec-h"><div style="display:grid;gap:16px"><span class="lab">Selected work · ${P.length} projects</span>${split('Selected work','h2')}</div><p>Houses, homes, cabins and a café. Every project has a live 3D model on its page.</p></div>
 <div class="idx" id="homeIdx">${P.map((p,i)=>idxRow(p,i)).join('')}</div>
 <div style="margin-top:34px"><a class="btn" href="#work">All projects <span class="ar">${ic('ne','width:14px;height:14px')}</span></a></div></section>
<section class="sec room" id="room" data-nav-inv><div class="wrap"><div class="sec-h"><div style="display:grid;gap:16px"><span class="lab" style="color:#A9A6A0">The model room</span>${split('Walk around it','h2')}</div><p>Drag to orbit, scroll the sun through the day, cut a section or pull the floors apart. The same models we use with clients.</p></div>
 <div class="room-tabs" role="group" aria-label="Choose a model">${P.map(p=>`<button class="chip" type="button" data-room="${p.model}" aria-pressed="${S.room===p.model}">${esc(p.n)}</button>`).join('')}</div>
 ${viewerHTML('room',pjByModel(S.room))}</div></section>
<section class="sec wrap"><div class="sec-h"><div style="display:grid;gap:16px"><span class="lab">What we do</span>${split('Four disciplines, one table','h2')}</div></div>
 <div class="disc">${DISC.map(d=>`<div class="disc-row rv"><span class="mono">${d[0]}</span><h3>${d[1]}</h3><p>${d[2]}</p><div class="im">${ph(d[3],d[1])}</div></div>`).join('')}</div></section>
${procHTML()}
<section class="sec wrap"><div class="sec-h"><div style="display:grid;gap:16px"><span class="lab">The studio</span>${split('Eight people, two cities','h2')}</div><a class="btn lt" href="#studio">Meet everyone <span class="ar">${ic('ne','width:14px;height:14px')}</span></a></div>
 <div class="team">${TEAM.slice(0,4).map((t,i)=>teamCard(t,i)).join('')}</div></section>
<section class="sec wrap" style="padding-top:0"><div class="sec-h"><div style="display:grid;gap:16px"><span class="lab">Journal</span>${split('Notes from the studio','h2')}</div><a class="btn lt" href="#journal">All notes <span class="ar">${ic('ne','width:14px;height:14px')}</span></a></div>
 <div class="jg">${J.map((j,i)=>jCard(j,i)).join('')}</div></section>
${ctaHTML()}`}
const pjByModel=m=>P.find(p=>p.model===m);
function idxRow(p,i){return `<a class="row-w" href="#p-${p.s}" data-prev="${p.img[0]}" data-cursor="View"><span class="mono">${String(i+1).padStart(2,'0')}</span><h3>${esc(p.n)}</h3><span class="mono hm">${esc(p.loc)}</span><span class="mono hm">${p.type} <span class="t3">${ic('cube','width:11px;height:11px')}3D</span></span><span class="mono hm num">${p.year}</span><span class="ar">${ic('ne','width:16px;height:16px')}</span></a>`}
function teamCard(t,i){return `<div class="tm rv" style="--dl:${i*.06}s" data-cursor="Read">${ph(t.img,t.n+', stock model')}<b>${esc(t.n)}</b><span>${esc(t.r)}</span><button type="button" class="cover" data-tm="${t.id}" aria-label="About ${esc(t.n)}"></button></div>`}
function jCard(j,i){return `<a class="jc rv" style="--dl:${i*.08}s" href="#j-${j.s}" data-cursor="Read">${ph(j.img,j.t)}<span class="lab">${j.c} · ${j.d}</span><h3>${esc(j.t)}</h3><p class="muted">${esc(j.ex)}</p></a>`}
function procHTML(){return `<section class="proc" id="proc" data-nav-inv><div class="pin"><i class="proc-bar" id="procBar"></i>
 <div class="proc-img" id="procImg">${PROC.map((s,i)=>`<img src="photos/${s[3]}.jpg" alt="${s[1]}" class="${i===0?'on':''}" loading="lazy" onerror="this.remove()">`).join('')}</div>
 <div class="proc-list" id="procList">${PROC.map((s,i)=>`<div class="${i===0?'on':''}"><small>${s[0]}</small>${s[1]}</div>`).join('')}</div>
 <div class="proc-cap"><span class="lab">How we work · six steps</span><p id="procTxt">${PROC[0][2]}</p></div></div></section>`}
function ctaHTML(){return `<div class="mq" aria-hidden="true"><div class="mq-t">${Array(2).fill(`<span>Start a project</span><span>Architecture</span><span>Interiors</span><span>3D visualisation</span>`).join('')}</div></div>
<section class="cta wrap"><span class="lab">Available for 2027 projects</span><h2 style="margin-top:22px">Let's build<br><em>something</em> quiet.</h2><a class="mag" href="#contact" id="mag" data-cursor="Go">Start a project</a></section>`}

/* ---------- viewer (shared) ---------- */
function viewerHTML(id,p,opts={}){return `<div class="room-v" id="${id}V" data-zoom="1" data-cursor="Drag" data-vw="${id}">
 <div class="fallback">${ph(p.img[0],p.n)}<p class="vtag" style="position:absolute;left:14px;bottom:14px">3D view needs WebGL · showing a photo</p></div>
 <div class="vtop"><span class="vtag" id="${id}Tag"><b>3D</b><span>${esc(p.n)}</span></span><div class="vbtns">${[['aerial','air','Aerial view'],['eye','eye','Eye level'],['axo','axo','Axonometric'],['top','top','Plan view']].map(b=>`<button class="circ" type="button" data-pre="${b[0]}" aria-label="${b[2]}" title="${b[2]}">${ic(b[1],'width:16px;height:16px')}</button>`).join('')}<button class="circ" type="button" data-full aria-label="Fullscreen" title="Fullscreen">${ic('full','width:16px;height:16px')}</button><button class="circ" type="button" data-still aria-label="Save a still image" title="Save still (PNG)">${ic('cam','width:16px;height:16px')}</button></div></div>
 <div class="v-drag" id="${id}Drag">${ic('drag','width:16px;height:16px')}Drag to orbit</div>
 <div data-hots></div>
 <div class="vbar"><div class="grp"><div class="seg" role="group" aria-label="Look"><button type="button" data-look="1" aria-pressed="true">Render</button><button type="button" data-look="0" aria-pressed="false">Model</button></div></div>
  <div class="grp"><label for="${id}T">Sun</label><input class="rg" type="range" id="${id}T" min="6" max="21" step=".25" value="${opts.time??13}"><output class="num" id="${id}To">13:00</output></div>
  <div class="grp hm"><label for="${id}C">Section</label><input class="rg" type="range" id="${id}C" min="0" max="100" step="1" value="100" style="width:110px"></div>
  <div class="grp hm"><label for="${id}X">Explode</label><input class="rg" type="range" id="${id}X" min="0" max="100" step="1" value="0" style="width:110px"></div>
  <div class="grp hm" style="margin-left:auto"><label for="${id}H">Notes</label><div class="seg"><button type="button" data-hot="1" aria-pressed="true">On</button><button type="button" data-hot="0" aria-pressed="false">Off</button></div></div></div></div>`}
const fmtT=h=>`${String(Math.floor(h)).padStart(2,'0')}:${String(Math.round((h%1)*60)).padStart(2,'0')}`;
function rangeFill(r){const p=(r.value-r.min)/(r.max-r.min)*100;r.style.setProperty('--p',p+'%')}
function bindViewer(id,key,params={},cfg={}){const el=$('#'+id+'V');if(!el)return;
 const st={look:1,hot:true,time:+$('#'+id+'T').value,cut:100,ex:0};
 const upd=()=>{if(!E)return;E.S.real=st.look;E.S.edges=st.look?.1:.85;E.S.time=st.time;const m=E.meta();E.S.cut=st.cut>=100?null:lerp(m.bottom+.4,m.top+.2,st.cut/100);E.S.explode=st.ex/100;E.apply()};
 $$('[data-look]',el).forEach(b=>b.onclick=()=>{st.look=+b.dataset.look;$$('[data-look]',el).forEach(x=>x.setAttribute('aria-pressed',x===b));upd()});
 $$('[data-hot]',el).forEach(b=>b.onclick=()=>{st.hot=b.dataset.hot==='1';$$('[data-hot]',el).forEach(x=>x.setAttribute('aria-pressed',x===b))});
 const tr=$('#'+id+'T'),cr=$('#'+id+'C'),xr=$('#'+id+'X');[tr,cr,xr].forEach(rangeFill);$('#'+id+'To').textContent=fmtT(st.time);
 tr.oninput=()=>{st.time=+tr.value;$('#'+id+'To').textContent=fmtT(st.time);rangeFill(tr);upd()};
 cr.oninput=()=>{st.cut=+cr.value;rangeFill(cr);upd()};xr.oninput=()=>{st.ex=+xr.value;rangeFill(xr);upd()};
 $$('[data-pre]',el).forEach(b=>b.onclick=()=>{if(!E)return;E.S.cam.auto=false;E.preset(b.dataset.pre);$('#'+id+'Drag')?.classList.add('off')});
 $('[data-full]',el).onclick=()=>{const f=document.fullscreenElement;if(f)document.exitFullscreen?.();else el.requestFullscreen?.().catch(()=>toast('Fullscreen is not available here'))};
 $('[data-still]',el).onclick=()=>saveStill((E?.meta()?.name||'strata').toLowerCase().replace(/ø/g,'o').replace(/æ/g,'ae').normalize('NFKD').replace(/[^a-z0-9]+/g,'-'));
 el.addEventListener('pointerdown',()=>$('#'+id+'Drag')?.classList.add('off'),{once:true});
 need3D(E=>{use3D(el,key,params,Object.assign({preset:'default',state:{time:st.time}},cfg));st.look=1;upd();hots(el,()=>st.hot)})}
function hots(el,on){const box=$('[data-hots]',el);if(!box||!E)return;const H=E.hot();box.innerHTML=H.map(h=>`<div class="hot"><i>${h.n}</i><span>${esc(h.t)}</span></div>`).join('');const nodes=$$('.hot',box);
 E.S.onFrame=()=>{const show=on()&&E.S.explode<.05&&E.S.cut==null;nodes.forEach((n,i)=>{const p=E.project(H[i].p);n.classList.toggle('on',show&&p.vis);n.classList.toggle('l',p.x>E.S.w-n.offsetWidth-12);n.style.transform=`translate(${p.x-9}px,${p.y-9}px)`})}}
async function saveStill(name){if(!E){toast('3D is not available here');return}
 const url=E.still();const blob=await (await fetch(url)).blob();const fn=`${name}-strata-still.png`;
 try{const d=window.claude?.use?await window.claude.use('downloads'):null;if(d){await d.save({filename:fn,data:blob});toast('Still saved');return}}catch(e){if(e&&e.code==='declined')return;}
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fn;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Still saved')}

/* ---------- CINE engine ---------- */
const K=[[0,[34,21,40],[1,2.4,1],30],[.12,[8,50,30],[2,0,2],32],[.3,[-30,8,22],[-1,3,0],30],[.5,[27,7.5,15],[5,4.5,1],28],[.68,[21,4.2,30],[3,3.6,2],30],[.86,[33,2.6,25],[4,3,3],28],[1,[44,11,46],[2,3,2],30]];
function crv(pts,t){const n=pts.length-1;const f=t*n;let i=Math.min(n-1,Math.floor(f));const u=f-i;const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(n,i+2)];const r=[];for(let k=0;k<3;k++){const a=p0[k],b=p1[k],c=p2[k],d=p3[k];r.push(.5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u*u+(-a+3*b-3*c+d)*u*u*u))}return r}
function camAt(p){let i=0;while(i<K.length-2&&p>K[i+1][0])i++;const a=K[i],b=K[i+1];const t=ss(0,1,clamp((p-a[0])/(b[0]-a[0]),0,1));const u=(i+t)/(K.length-1);return{pos:crv(K.map(k=>k[1]),u),tgt:crv(K.map(k=>k[2]),u),fov:lerp(a[3],b[3],t)}}
const cine={p:0,ch:-1,intro:0,t0:0,on:false,hot:null};
function cineInit(){const host=$('#cineHost');if(!host)return;cine.ch=-1;cine.p=-1;
 need3D(E=>{if(S.page!=='home')return;use3D(host,'cliff',{},{path:true,auto:false,state:{draw:0,edges:.95,real:0,time:13,show:{site:0,structure:0,envelope:0,glass:0,landscape:0},stageReal:{site:0,structure:0,envelope:0,glass:0,landscape:0}}});
  cine.t0=performance.now();cine.intro=RM||cine.seen?1:0;cine.seen=true;cine.on=true;cineUpdate(cineP(),true);
  const H=E.hot();$('#cineHot').innerHTML=H.map(h=>`<div class="hot"><i>${h.n}</i><span>${esc(h.t)}</span></div>`).join('');cine.hot=$$('#cineHot .hot');
  E.S.onFrame=cineFrame})}
function cineP(){const c=$('#cine');if(!c)return 0;const r=c.getBoundingClientRect();return clamp(-r.top/(r.height-innerHeight),0,1)}
function cineUpdate(p,force){if(!E||!cine.on)return;if(!force&&Math.abs(p-cine.p)<1e-4&&cine.intro>=1)return;cine.p=p;const S3=E.S;
 const R=RM?1:0;
 S3.draw=Math.min(1,cine.intro);
 S3.show={site:Math.max(R,ss(.08,.2,p)),structure:Math.max(R,ss(.25,.39,p)),envelope:Math.max(R,ss(.42,.55,p)),glass:Math.max(R,ss(.56,.64,p)),landscape:Math.max(R,ss(.76,.88,p))};
 S3.stageReal={site:Math.max(R,ss(.12,.24,p)),structure:Math.max(R,ss(.3,.42,p)),envelope:Math.max(R,ss(.46,.58,p)),glass:Math.max(R,ss(.58,.66,p)),landscape:Math.max(R,ss(.78,.9,p))};
 S3.real=S3.stageReal.glass;S3.contour=ss(.06,.13,p)*(1-ss(.3,.42,p))*.45;S3.edges=lerp(.95,.1,ss(.3,.72,p));S3.time=RM?19.5:lerp(13,20.25,ss(.6,.8,p));
 E.apply();
 const cn=$('#cine');const film=p>.065&&p<.935;cn.classList.toggle('film',film);const dusk=S3.time>18.7;cn.classList.toggle('dusk',dusk);
 $('#heroW').style.opacity=1-ss(.01,.06,p);$('#heroW').style.transform=`translateY(${-ss(0,.07,p)*60}px)`;
 $('#final').classList.toggle('on',p>.94);
 let ch=-1;CH.forEach((c,i)=>{if(p>=c.a&&p<c.b)ch=i});if(p>=.93)ch=4;
 if(ch!==cine.ch){cine.ch=ch;$$('#chap button').forEach((b,i)=>b.classList.toggle('on',i===ch));const c=CH[ch];if(c)$('#chapCard').innerHTML=`<span class="n">${c.n}</span><h3>${c.t}</h3><p>${c.d}</p><div class="stat">${c.st.map(s=>`<div><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>`;$('#tc .rec').textContent='SC '+(c?c.n:'00')}
 const secs=p*96;$('#tcT').textContent=`00:${String(Math.floor(secs/60)).padStart(2,'0')}:${String(Math.floor(secs%60)).padStart(2,'0')}:${String(Math.floor((secs%1)*24)).padStart(2,'0')}`;$('#tcBar').style.width=(p*100)+'%';$('#tcSun').textContent='SUN '+fmtT(S3.time)}
function cineFrame(dt){if(!E)return;const now=performance.now();
 if(!document.documentElement.classList.contains('ready')){cine.t0=now}
 if(cine.intro<1){cine.intro=Math.min(1,(now-cine.t0)/2600);cineUpdate(cine.p,true)}
 const p=cine.p<0?0:cine.p;const k=camAt(p);const T=E.THREE;
 const hb=1-ss(0,.08,p);const a=.72+(now-cine.t0)/1000*.05;
 const hero=[1+Math.sin(a)*52,21,1+Math.cos(a)*52];
 const pos=k.pos.map((v,i)=>lerp(v,hero[i],hb));
 const par=E.S.par;par.x+=((M.x/innerWidth-.5)-par.x)*.05;par.y+=((M.y/innerHeight-.5)-par.y)*.05;
 pos[0]+=par.x*2.2;pos[1]-=par.y*1.4;
 const asp=innerWidth/innerHeight;const fov=k.fov*(asp<.8?1.5:asp<1.2?1.2:1);
 E.setPath(new T.Vector3(...pos),new T.Vector3(...k.tgt),fov);
 if(cine.hot){const H=E.hot();const show=p>.8&&p<.935;cine.hot.forEach((n,i)=>{const pr=E.project(H[i].p);n.classList.toggle('on',show&&pr.vis);n.classList.toggle('l',pr.x>E.S.w-n.offsetWidth-12);n.style.transform=`translate(${pr.x-9}px,${pr.y-9}px)`})}}

/* ---------- WORK ---------- */
const TYPES=['Residential','Multi-residential','Interiors','Hospitality'];
function pageWork(){return `<section class="wrap ph-h">${split('Work','h1')}<div class="row"><p class="rv">Six projects across two continents. Open any of them to walk around its live 3D model.</p>
 <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><div class="chips" role="group" aria-label="Filter by type"><button class="chip" type="button" data-wf="all" aria-pressed="${S.wf==='all'}">All <sup>${P.length}</sup></button>${TYPES.map(t=>`<button class="chip" type="button" data-wf="${t}" aria-pressed="${S.wf===t}">${t} <sup>${P.filter(p=>p.type===t).length}</sup></button>`).join('')}</div>
 <div class="seg lt" role="group" aria-label="View" style="background:rgba(18,18,18,.06)"><button type="button" data-wv="grid" aria-pressed="${S.wv==='grid'}">Grid</button><button type="button" data-wv="index" aria-pressed="${S.wv==='index'}">Index</button></div></div></div></section>
 <section class="wrap" style="padding-bottom:clamp(90px,10vw,160px)" id="wl"></section>${ctaHTML()}`}
function drawWork(){const l=P.filter(p=>S.wf==='all'||p.type===S.wf);const el=$('#wl');if(!el)return;
 if(!l.length){el.innerHTML='<p class="empty">No projects in this category yet.</p>';return}
 el.innerHTML=S.wv==='index'?`<div class="idx">${l.map((p,i)=>idxRow(p,P.indexOf(p))).join('')}</div>`:`<div class="wgrid">${l.map((p,i)=>`<a class="wc rv" href="#p-${p.s}" data-cursor="View">${ph(p.img[0],p.n,p.pos?.[0]||'').replace('</div>','<span class="t3">Live 3D</span></div>')}<div class="mt"><h3>${esc(p.n)}</h3><span class="mono num">${p.year}</span></div><span class="mono muted">${esc(p.loc)} · ${p.type}</span></a>`).join('')}</div>`;
 initReveal();bindPreview()}

/* ---------- PROJECT ---------- */
function pageProject(p){const i=P.indexOf(p),nx=P[(i+1)%P.length];return `
<section class="pj-hero" data-nav-inv>${ph(p.img[0],p.n,p.pos?.[0]||'')}<div class="inner"><span class="lab" style="color:#fff">${String(i+1).padStart(2,'0')} / ${String(P.length).padStart(2,'0')} · ${p.type}</span>${split(p.n,'h1')}
 <div class="pj-meta">${[['Location',p.loc],['Year',p.year],['Type',p.type],['Area',p.area],['Status',p.status]].map(m=>`<div><b>${m[0]}</b><span>${esc(m[1])}</span></div>`).join('')}</div></div></section>
<section class="sec wrap"><div class="pj-intro"><div style="display:grid;gap:20px;align-content:start"><span class="lab">The project</span></div><div style="display:grid;gap:40px"><p class="lead rv">${esc(p.lead)}</p><div class="body rv">${p.body.map(b=>`<p>${esc(b)}</p>`).join('')}</div>
 <div class="facts rv">${p.facts.map(f=>`<div><b>${f[0]}</b><span>${f[1]}</span></div>`).join('')}</div></div></div></section>
<section class="sec pv" data-nav-inv><div class="wrap"><div class="sec-h"><div style="display:grid;gap:16px"><span class="lab" style="color:#A9A6A0">Live model</span>${split('Explore in 3D','h2')}</div><p style="color:#B9B6B0">Drag to orbit. Move the sun, cut a section through the floors or pull the building apart to see how it is made.</p></div>
 ${viewerHTML('pv',p)}<div class="hotlist" id="pvHot"></div></div></section>
<section class="sec wrap"><div class="sec-h"><div style="display:grid;gap:16px"><span class="lab">Photography</span>${split('On site','h2')}</div><p>Photos show the character we are after; they are stock images used for this demo.</p></div>
 <div class="gal">${p.img.slice(1).map((k,j)=>`<button type="button" data-gi="${j+1}" class="rv" data-cursor="Zoom"><img src="photos/${k}.jpg" alt="${esc(p.n)} photo ${j+1}" loading="lazy" onerror="this.remove()"></button>`).join('')}</div></section>
<section class="sec wrap" style="padding-top:0"><div class="sec-h"><div style="display:grid;gap:16px"><span class="lab">Material palette</span>${split('Four materials','h2')}</div></div>
 <div class="mats">${p.mats.map((m,j)=>`<div class="mat rv" style="--dl:${j*.07}s"><i style="background:${m[1]}"></i><b>${esc(m[0])}</b><span class="mono muted">${m[1]}</span></div>`).join('')}</div>
 <div style="margin-top:70px;display:grid;gap:20px"><span class="lab">Project team</span><div class="team">${p.team.map((id,j)=>teamCard(tm(id),j)).join('')}</div></div></section>
<a class="next" href="#p-${nx.s}" data-cursor="Next">${ph(nx.img[0],nx.n)}<div class="inner"><span class="lab" style="color:#fff">Next project</span><h2>${esc(nx.n)}</h2><span class="mono">${esc(nx.loc)}</span></div></a>`}
function bindProject(p){bindViewer('pv',p.model,{},{});
 need3D(E=>{const H=E.hot();$('#pvHot').innerHTML=H.map(h=>`<button type="button" data-hp="${h.n}"><i>${h.n}</i>${esc(h.t)}</button>`).join('');$$('#pvHot [data-hp]').forEach((b,i)=>b.onclick=()=>{const q=H[i].p,c=E.S.cam;c.auto=false;const T=E.THREE;const dx=q[0]-c.tgt.x,dz=q[2]-c.tgt.z;const th=Math.atan2(dx,dz)||c.theta;E.preset('default');setTimeout(()=>{c.theta=th;E.dirty()},0);$('#pvV').scrollIntoView({behavior:'smooth',block:'center'})})});
 $$('[data-gi]').forEach(b=>b.onclick=()=>lightbox(p.img.slice(1),+b.dataset.gi-1))}
function lightbox(list,i){closeModal();const m=document.createElement('div');m.className='lbx';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');document.body.appendChild(m);document.body.classList.add('lock');
 const draw=()=>{m.innerHTML=`<img src="photos/${list[i]}.jpg" alt="Photo ${i+1} of ${list.length}"><button class="circ x" aria-label="Close">${ic('x')}</button><button class="circ pv2" aria-label="Previous">${ic('left')}</button><button class="circ nx" aria-label="Next">${ic('ar')}</button><span class="cnt">${i+1} / ${list.length}</span>`;
  $('.x',m).onclick=closeModal;$('.pv2',m).onclick=()=>{i=(i-1+list.length)%list.length;draw()};$('.nx',m).onclick=()=>{i=(i+1)%list.length;draw()};$('.nx',m).focus()};draw();
 m.onclick=e=>{if(e.target===m)closeModal()};m.onkeydown=e=>{if(e.key==='ArrowRight'){i=(i+1)%list.length;draw()}if(e.key==='ArrowLeft'){i=(i-1+list.length)%list.length;draw()}}}

/* ---------- LAB ---------- */
const RATE={timber:6200,concrete:6800,brick:5900,render:5400},CARB={timber:330,concrete:520,brick:470,render:430};
const FX={AUD:1,EUR:.61,USD:.66},SYM={AUD:'A$',EUR:'€',USD:'US$'};
const money=(v,cur)=>SYM[cur]+(v>=1e6?(v/1e6).toFixed(2)+'M':Math.round(v/1e3)+'k');
function labCalc(L){const g=14*6.4;let area=g,top=g;for(let f=1;f<L.floors;f++){const a=f%2?(12+L.cant)*4.8:10*6;area+=a;top=a}
 const cost=area*RATE[L.facade]*(1+(L.glaze-.5)*.18)+(L.pool?140000:0)+(L.roofGarden?60000:0);const carb=area*CARB[L.facade]/1000+(L.pool?8:0);const kwp=Math.round(top*(L.roofGarden?.08:.2)*10)/10;
 return{area:Math.round(area),cost,carb:Math.round(carb),kwp}}
function pageLab(){const L=S.lab;return `<section class="lab-w"><div class="lab-v" id="labV" data-zoom="1" data-cursor="Drag"><div class="fallback">${ph('x3','Massing')}<p class="vtag" style="position:absolute;left:14px;bottom:14px">The Lab needs WebGL. Try a recent Chrome, Safari or Firefox.</p></div>
 <div class="vtop"><span class="vtag"><b>LAB</b><span>Parametric house · live</span></span><div class="vbtns">${[['aerial','air','Aerial view'],['eye','eye','Eye level'],['axo','axo','Axonometric'],['top','top','Plan view']].map(b=>`<button class="circ" type="button" data-pre="${b[0]}" aria-label="${b[2]}" title="${b[2]}">${ic(b[1],'width:16px;height:16px')}</button>`).join('')}<button class="circ" type="button" id="labStill" aria-label="Save a still image" title="Save still (PNG)">${ic('cam','width:16px;height:16px')}</button></div></div>
 <div class="v-drag" id="labDrag">${ic('drag','width:16px;height:16px')}Drag to orbit</div><div data-hots></div></div>
 <aside class="lab-p lt" aria-label="Massing controls"><span class="lab">Massing Lab</span><h1>Shape a house.</h1><p class="small">A simplified version of the tool we use in first meetings. Change the massing and the model rebuilds instantly. Figures are indicative only.</p>
 <div class="ctl"><div class="hd"><label for="lF">Upper floors</label><output id="lFo">${L.floors-1}</output></div><input class="rg" type="range" id="lF" min="1" max="3" step="1" value="${L.floors}"></div>
 <div class="ctl"><div class="hd"><label for="lC">Cantilever</label><output id="lCo">${L.cant.toFixed(1)} m</output></div><input class="rg" type="range" id="lC" min="0" max="8" step=".5" value="${L.cant}"></div>
 <div class="ctl"><div class="hd"><label for="lG">Ground-floor glazing</label><output id="lGo">${Math.round(L.glaze*100)}%</output></div><input class="rg" type="range" id="lG" min=".3" max="1" step=".05" value="${L.glaze}"></div>
 <div class="ctl"><div class="hd"><span>Upper facade</span><output id="lMo">${L.facade}</output></div><div class="sw" role="group" aria-label="Upper facade">${[['timber','Timber','#8A5B38'],['concrete','Concrete','#8F8B84'],['brick','Brick','#9A5840'],['render','Render','#EEEBE5']].map(m=>`<button type="button" data-fac="${m[0]}" aria-pressed="${L.facade===m[0]}"><i style="background:${m[2]}"></i><span>${m[1]}</span></button>`).join('')}</div></div>
 <div><div class="tog"><span>Lap pool</span><button type="button" id="lP" aria-pressed="${L.pool}" aria-label="Lap pool"></button></div><div class="tog"><span>Roof garden</span><button type="button" id="lR" aria-pressed="${L.roofGarden}" aria-label="Roof garden"></button></div></div>
 <div class="ctl"><div class="hd"><label for="lT">Time of day</label><output id="lTo">${fmtT(L.time)}</output></div><input class="rg" type="range" id="lT" min="6" max="21" step=".25" value="${L.time}"></div>
 <div class="ctl"><div class="hd"><span>Look</span></div><div class="seg" role="group" aria-label="Look"><button type="button" data-llook="1" aria-pressed="${L.real===1}">Render</button><button type="button" data-llook="0" aria-pressed="${L.real===0}">Model</button></div></div>
 <div class="ctl"><div class="hd"><span>Readout</span><div class="seg" role="group" aria-label="Currency">${['AUD','EUR','USD'].map(c=>`<button type="button" data-cur="${c}" aria-pressed="${S.cur===c}">${c}</button>`).join('')}</div></div><div class="readout" id="lOut"></div><p class="small">Cost and carbon are rough demo estimates, not a quote.</p></div>
 <div style="display:grid;gap:10px"><button class="btn" type="button" id="lSend">Send this massing to the studio <span class="ar">${ic('ne','width:14px;height:14px')}</span></button><button class="btn lt" type="button" id="lReset">Reset</button></div></aside></section>`}
function bindLab(){const L=S.lab,el=$('#labV');
 const out=()=>{const r=labCalc(L);$('#lOut').innerHTML=[[r.area+' m²','Floor area'],[money(r.cost*FX[S.cur],S.cur),'Build cost (est.)'],[r.carb+' t','Embodied CO₂e'],[r.kwp+' kWp','Roof solar']].map(x=>`<div><b class="num">${x[0]}</b><span>${x[1]}</span></div>`).join('')};
 const save=()=>ls('lab',L);
 const rebuild=()=>{save();out();if(!E)return;const c=E.S.cam,keep={t:c.theta,p:c.phi,r:c.r};use3D(el,'cliff',{floors:L.floors,cant:L.cant,facade:L.facade,glaze:L.glaze,roofGarden:L.roofGarden,pool:L.pool},{preset:false,auto:false,state:{time:L.time,real:L.real,edges:L.real?.1:.85}});Object.assign(c,{theta:keep.t,phi:keep.p,r:keep.r});hots(el,()=>true)};
 const R=(id,key,fmt,num=true)=>{const r=$('#'+id);rangeFill(r);r.oninput=()=>{L[key]=num?+r.value:r.value;$('#'+id+'o').textContent=fmt(L[key]);rangeFill(r);if(key==='time'){save();if(E){E.S.time=L.time;E.apply()}}else rebuild()}};
 R('lF','floors',v=>v-1);R('lC','cant',v=>v.toFixed(1)+' m');R('lG','glaze',v=>Math.round(v*100)+'%');R('lT','time',fmtT);
 $$('[data-fac]').forEach(b=>b.onclick=()=>{L.facade=b.dataset.fac;$$('[data-fac]').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#lMo').textContent=L.facade;rebuild()});
 [['lP','pool'],['lR','roofGarden']].forEach(([id,k])=>$('#'+id).onclick=()=>{L[k]=!L[k];$('#'+id).setAttribute('aria-pressed',L[k]);rebuild()});
 $$('[data-llook]').forEach(b=>b.onclick=()=>{L.real=+b.dataset.llook;$$('[data-llook]').forEach(x=>x.setAttribute('aria-pressed',x===b));save();if(E){E.S.real=L.real;E.S.edges=L.real?.1:.85;E.apply()}});
 $$('[data-cur]').forEach(b=>b.onclick=()=>{S.cur=b.dataset.cur;ls('cur',S.cur);$$('[data-cur]').forEach(x=>x.setAttribute('aria-pressed',x===b));out()});
 $$('[data-pre]',el).forEach(b=>b.onclick=()=>{if(E){E.S.cam.auto=false;E.preset(b.dataset.pre)}$('#labDrag').classList.add('off')});
 el.addEventListener('pointerdown',()=>$('#labDrag').classList.add('off'),{once:true});
 $('#labStill').onclick=()=>saveStill('massing-lab');
 $('#lReset').onclick=()=>{S.lab={floors:2,cant:5,facade:'timber',glaze:.7,roofGarden:false,pool:true,time:17.5,real:1};ls('lab',S.lab);render('lab',true)};
 $('#lSend').onclick=()=>{const r=labCalc(L);ls('brief',{type:'Residential',msg:`Massing Lab idea: ${L.floors} storeys, ${L.cant} m cantilever, ${L.facade} upper facade, ${Math.round(L.glaze*100)}% glazing${L.pool?', lap pool':''}${L.roofGarden?', roof garden':''}. About ${r.area} m².`});location.hash='contact'};
 out();need3D(E=>{use3D(el,'cliff',{floors:L.floors,cant:L.cant,facade:L.facade,glaze:L.glaze,roofGarden:L.roofGarden,pool:L.pool},{preset:'axo',state:{time:L.time,real:L.real,edges:L.real?.1:.85}});hots(el,()=>true)})}

/* ---------- STUDIO ---------- */
const AW=[['2025','Coastal Houses Review','Flinders Cliff House · House of the year, shortlist'],['2024','Nordic Timber Prize','Hardanger Fjord Cabins · Winner, small buildings'],['2024','Interior Matters','Kiln Café · Hospitality interior, commendation'],['2023','Urban Living Awards','Fitzroy Courtyard House · New house, winner']];
function pageStudio(){return `<section class="wrap ph-h">${split('Studio','h1')}<div class="row"><p class="rv">Strata Atelier was founded in 2014 by Jonah Reyes and Mara Lindqvist, one in Melbourne and one in Copenhagen, sharing a single model on two screens.</p></div></section>
<section class="wrap"><div class="ph clipr" style="aspect-ratio:21/9"><img src="photos/s4.jpg" alt="The studio" loading="lazy" onerror="this.remove()"></div></section>
<section class="sec wrap"><div class="st-grid"><p class="statement" id="stmt">${'Two studios, one table. We work across eleven time zones so a project never sleeps, and every client walks through their building in 3D before it is built.'.split(' ').map(w=>`<span class="wf">${w}</span>`).join(' ')}</p>
 <div class="stats">${[['64','Built'],['11','Awards'],['8','People']].map(s=>`<div><b class="num" data-count="${s[0]}">0</b><span>${s[1]}</span></div>`).join('')}</div></div></section>
<section class="sec wrap" style="padding-top:0"><div class="sec-h"><div style="display:grid;gap:16px"><span class="lab">Disciplines</span>${split('What we do','h2')}</div></div><div class="disc">${DISC.map(d=>`<div class="disc-row rv"><span class="mono">${d[0]}</span><h3>${d[1]}</h3><p>${d[2]}</p><div class="im">${ph(d[3],d[1])}</div></div>`).join('')}</div></section>
${procHTML()}
<section class="sec wrap"><div class="sec-h"><div style="display:grid;gap:16px"><span class="lab">People · stock models, fictional names</span>${split('The team','h2')}</div><p>Click anyone to read more.</p></div><div class="team">${TEAM.map((t,i)=>teamCard(t,i)).join('')}</div></section>
<section class="sec wrap" style="padding-top:0"><div class="sec-h"><div style="display:grid;gap:16px"><span class="lab">Recognition (fictional)</span>${split('Awards & press','h2')}</div></div><div class="idx">${AW.map((a,i)=>`<div class="row-w" style="grid-template-columns:90px 1fr 1.4fr;cursor:default"><span class="mono num">${a[0]}</span><h3 style="font-size:clamp(22px,2.6vw,40px)">${a[1]}</h3><span class="mono hm">${a[2]}</span></div>`).join('')}</div></section>
<section class="sec wrap" style="padding-top:0"><div class="sec-h"><div style="display:grid;gap:16px"><span class="lab">Careers</span>${split('Join us','h2')}</div><p>We hire slowly and keep people for a long time. Send a portfolio of up to 10 pages.</p></div>
 <div class="idx">${[['Project Architect','Melbourne · Full-time','5+ years residential experience, registered or near registration.'],['3D Visualisation Artist','Copenhagen · Full-time','Real-time engines, lighting and a good eye for materials.']].map(r=>`<a class="row-w" style="grid-template-columns:1.3fr 1fr 1.4fr 40px" href="mailto:careers@strata-atelier.example?subject=${encodeURIComponent('Application: '+r[0])}" data-cursor="Apply"><h3 style="font-size:clamp(24px,2.8vw,44px)">${r[0]}</h3><span class="mono hm">${r[1]}</span><span class="hm" style="font-size:14.5px">${r[2]}</span><span class="ar">${ic('ne','width:16px;height:16px')}</span></a>`).join('')}</div></section>
${ctaHTML()}`}
function tmModal(id){const t=tm(id);const pr=P.filter(p=>p.team.includes(id));modal(`<div style="display:grid;grid-template-columns:140px 1fr;gap:22px;align-items:start"><div class="ph" style="aspect-ratio:3/4">${`<img src="photos/${t.img}.jpg" alt="${esc(t.n)}, stock model" onerror="this.remove()">`}</div><div style="display:grid;gap:10px"><span class="lab">${esc(t.r)}</span><h3 style="font-size:34px">${esc(t.n)}</h3><p class="muted">${esc(t.b)}</p></div></div>
 ${pr.length?`<div style="margin-top:22px;display:grid;gap:8px"><span class="lab">Projects</span>${pr.map(p=>`<a href="#p-${p.s}" style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid var(--line);text-decoration:none;font-weight:600">${esc(p.n)}<span class="mono muted">${p.year}</span></a>`).join('')}</div>`:''}<p class="small" style="margin-top:14px">Photo: stock model. Name and bio are fictional.</p>`)}

/* ---------- JOURNAL ---------- */
function pageJournal(){return `<section class="wrap ph-h">${split('Journal','h1')}<div class="row"><p class="rv">Short notes on light, materials and how we work.</p></div></section><section class="wrap" style="padding-bottom:clamp(90px,10vw,160px)"><div class="jg">${J.map((j,i)=>jCard(j,i)).join('')}</div></section>${ctaHTML()}`}
function pageArticle(j){const i=J.indexOf(j),nx=J[(i+1)%J.length];return `<i class="prog" id="prog"></i><section class="wrap ph-h art" style="max-width:1000px"><span class="lab">${j.c} · ${j.d} · ${Math.max(2,Math.round(j.body.join(' ').split(' ').length/200))} min read</span>${split(j.t,'h1')}</section>
 <section class="wrap"><div class="ph clipr" style="aspect-ratio:21/9;max-width:1400px;margin-inline:auto"><img src="photos/${j.img}.jpg" alt="${esc(j.t)}" onerror="this.remove()"></div></section>
 <section class="sec wrap"><article class="art"><div class="body">${j.body.map(b=>b.startsWith('### ')?`<h3>${esc(b.slice(4))}</h3>`:b.startsWith('> ')?`<blockquote>${esc(b.slice(2))}</blockquote>`:`<p>${esc(b)}</p>`).join('')}</div>
 <div style="display:flex;gap:10px;margin-top:40px;flex-wrap:wrap"><button class="btn lt sm" type="button" id="cpy">Copy link</button><a class="btn sm" href="#journal">All notes</a></div></article></section>
 <a class="next" href="#j-${nx.s}" data-cursor="Read" style="height:52vh">${ph(nx.img,nx.t)}<div class="inner"><span class="lab" style="color:#fff">Next note</span><h2 style="font-size:clamp(36px,6vw,96px)">${esc(nx.t)}</h2></div></a>`}

/* ---------- CONTACT ---------- */
const PTYPES=['Residential','Multi-residential','Interiors','Hospitality','Landscape','3D visualisation only'];
function pageContact(){const b=ls('brief')||{};const mine=ls('enq')||[];return `<section class="wrap ph-h">${split('Start a project','h1')}<div class="row"><p class="rv">Tell us about the site and what you have in mind. We reply within two working days, from whichever studio is awake.</p></div></section>
<section class="wrap" style="padding-bottom:clamp(90px,10vw,160px)"><div class="ct-g"><div style="display:grid;gap:30px;align-content:start">
 <div class="card lt" style="display:grid;gap:14px"><span class="lab">Studios</span>${[['Melbourne','Level 2, 18 Gertrude St, Fitzroy VIC','Australia/Melbourne'],['Copenhagen','Halmtorvet 9, 1700 København V','Europe/Copenhagen']].map(o=>`<div style="display:flex;justify-content:space-between;gap:12px;border-top:1px solid var(--line);padding-top:12px"><div><b style="font-family:var(--f-d);font-size:22px">${o[0]}</b><p class="muted" style="font-size:14px">${o[1]}</p></div><span class="mono num" data-tz="${o[2]}"></span></div>`).join('')}
  <a class="link" href="mailto:hello@strata-atelier.example">hello@strata-atelier.example</a></div>
 <div class="card lt" style="display:grid;gap:14px"><span class="lab">Visit the studio</span><p class="muted" style="font-size:14.5px">See the model workshop and walk through a live model with us. 45 minutes.</p><button class="btn lt" type="button" id="visitB">${ic('cal')}Book a studio visit</button></div>
 <div id="enqList">${mine.length?enqList(mine):''}</div></div>
 <form class="form" id="bf" novalidate>
  <div class="fld"><span class="fl">Project type</span><div class="chips" role="group" aria-label="Project type">${PTYPES.map(t=>`<button class="chip" type="button" data-pt="${t}" aria-pressed="${b.type===t}">${t}</button>`).join('')}</div></div>
  <div class="two"><div class="fld"><label for="bn">Your name</label><input class="inp" id="bn" autocomplete="name"></div><div class="fld"><label for="be">Email</label><input class="inp" id="be" type="email" autocomplete="email"></div></div>
  <div class="two"><div class="fld"><label for="bl">Site location</label><input class="inp" id="bl" placeholder="City or region"></div><div class="fld"><label for="bt">Timeline</label><select class="inp" id="bt"><option value="">Choose…</option>${['Start as soon as possible','Within 6 months','6 to 12 months','Just exploring'].map(t=>`<option>${t}</option>`).join('')}</select></div></div>
  <div class="fld lt"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><label for="bb" class="fl" style="font-family:var(--f-m);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)">Construction budget</label><div class="seg" role="group" aria-label="Currency">${['AUD','EUR','USD'].map(c=>`<button type="button" data-bcur="${c}" aria-pressed="${S.cur===c}">${c}</button>`).join('')}</div></div>
   <input class="rg" type="range" id="bb" min="0" max="9" step="1" value="3" style="width:100%"><output id="bbo" style="font-family:var(--f-d);font-size:32px;letter-spacing:-.03em"></output></div>
  <div class="fld"><label for="bm">Tell us about it</label><textarea class="inp" id="bm" placeholder="The site, the people who will use it, what you love and what worries you.">${esc(b.msg||'')}</textarea></div>
  <p class="err-t" id="berr" hidden></p>
  <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><button class="btn sg" type="submit">Send the brief <span class="ar">${ic('send','width:13px;height:13px')}</span></button><span class="small">Demo form: nothing is sent; it is kept in this browser.</span></div></form></div></section>`}
const BUD=[.3,.5,.8,1.2,1.8,2.5,3.5,5,7.5,10];
const budTxt=(i,cur)=>{const a=BUD[i]*FX[cur],b=(BUD[i+1]||BUD[i]*1.5)*FX[cur];return i>=9?`${SYM[cur]}${(a).toFixed(1)}M +`:`${SYM[cur]}${a<1?Math.round(a*1000)+'k':a.toFixed(1)+'M'} – ${b<1?Math.round(b*1000)+'k':b.toFixed(1)+'M'}`};
function enqList(l){return `<div class="card lt" style="display:grid;gap:10px"><span class="lab">Your briefs (this browser)</span>${l.map(e=>`<div style="display:flex;justify-content:space-between;gap:10px;border-top:1px solid var(--line);padding-top:10px"><div><b>${esc(e.type)}</b><p class="small">${esc(e.ref)} · ${new Date(e.t).toLocaleDateString('en-AU',{day:'numeric',month:'short'})}${e.visit?` · Visit ${esc(e.visit)}`:''}</p></div><button class="link" type="button" data-rmenq="${e.ref}">Remove</button></div>`).join('')}</div>`}
function bindContact(){const b=ls('brief')||{};let type=b.type||'';
 const bb=$('#bb');const bo=()=>{$('#bbo').textContent=budTxt(+bb.value,S.cur);rangeFill(bb)};bb.oninput=bo;bo();
 $$('[data-bcur]').forEach(x=>x.onclick=()=>{S.cur=x.dataset.bcur;ls('cur',S.cur);$$('[data-bcur]').forEach(y=>y.setAttribute('aria-pressed',y===x));bo()});
 $$('[data-pt]').forEach(x=>x.onclick=()=>{type=x.dataset.pt;$$('[data-pt]').forEach(y=>y.setAttribute('aria-pressed',y===x))});
 $('#visitB').onclick=()=>visitModal();
 const rm=()=>{};$('#enqList').onclick=e=>{const x=e.target.closest('[data-rmenq]');if(!x)return;const l=(ls('enq')||[]).filter(r=>r.ref!==x.dataset.rmenq);ls('enq',l);$('#enqList').innerHTML=l.length?enqList(l):''};
 $('#bf').onsubmit=e=>{e.preventDefault();const v=id=>$('#'+id).value.trim();const bad=[];if(v('bn').length<2)bad.push('bn');if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('be')))bad.push('be');if(v('bm').length<10)bad.push('bm');
  ['bn','be','bm'].forEach(i=>$('#'+i).classList.toggle('err',bad.includes(i)));const er=$('#berr');
  if(!type){er.hidden=false;er.textContent='Please choose a project type.';return}
  if(bad.length){er.hidden=false;er.textContent=bad.includes('be')?'Please enter a valid email.':bad.includes('bn')?'Please enter your name.':'Please tell us a little more (at least 10 characters).';$('#'+bad[0]).focus();return}er.hidden=true;
  const ref='SA-'+String(hash(v('be')+Date.now())%9000+1000);const rec={ref,type,name:v('bn'),email:v('be'),loc:v('bl'),time:v('bt'),budget:budTxt(+bb.value,S.cur),msg:v('bm'),t:Date.now()};
  const l=ls('enq')||[];l.unshift(rec);ls('enq',l);ls('brief',null);
  const body=`Project type: ${rec.type}\nLocation: ${rec.loc||'-'}\nTimeline: ${rec.time||'-'}\nBudget: ${rec.budget}\n\n${rec.msg}\n\n${rec.name}`;
  modal(`<span class="lab">Brief ${ref}</span><h3 style="font-size:40px;margin:10px 0 12px">Thank you, ${esc(rec.name.split(' ')[0])}.</h3><p class="muted">In the real studio, ${rec.loc&&/europe|denmark|norway|sweden|copenhagen|london|berlin|oslo/i.test(rec.loc)?'Mara in Copenhagen':'Jonah in Melbourne'} would reply within two working days. This demo keeps your brief in this browser only.</p>
   <div class="sum" style="margin:20px 0">${[['Type',rec.type],['Location',rec.loc||'-'],['Timeline',rec.time||'-'],['Budget',rec.budget]].map(r=>`<div><span>${r[0]}</span><span>${esc(r[1])}</span></div>`).join('')}</div>
   <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn" href="mailto:hello@strata-atelier.example?subject=${encodeURIComponent('Project brief '+ref)}&body=${encodeURIComponent(body)}">${ic('mail')}Open in email</a><button class="btn lt" type="button" id="bv2">${ic('cal')}Book a studio visit</button></div>`);
  $('#bv2').onclick=()=>visitModal(ref);$('#bf').reset();type='';$$('[data-pt]').forEach(y=>y.setAttribute('aria-pressed','false'));bo();$('#enqList').innerHTML=enqList(l);rm()}}
const dkey=x=>`${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`,dparse=k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)};
function visitModal(ref){const days=[];const d=new Date();d.setHours(0,0,0,0);while(days.length<8){d.setDate(d.getDate()+1);if(d.getDay()%6)days.push(new Date(d))}
 const st={o:'Melbourne',d:dkey(days[0]),t:null};const slots=['10:00','11:30','14:00','16:00'];const taken=(o,dd,t)=>hash(o+dd+t)%3===0||(ls('visits')||[]).some(v=>v.o===o&&v.d===dd&&v.t===t);
 const m=modal(`<span class="lab">Studio visit · 45 min</span><h3 style="font-size:36px;margin:10px 0 18px">Come and see the models.</h3><div id="vis"></div>`);
 const draw=()=>{$('#vis',m).innerHTML=`<div class="fld lt" style="margin-bottom:16px"><span class="fl">Studio</span><div class="seg">${['Melbourne','Copenhagen'].map(o=>`<button type="button" data-vo="${o}" aria-pressed="${st.o===o}">${o}</button>`).join('')}</div></div>
  <div class="fld" style="margin-bottom:16px"><span class="fl">Day</span><div class="slots">${days.map(x=>{const k=dkey(x);return `<button type="button" data-vd="${k}" aria-pressed="${st.d===k}">${x.toLocaleDateString('en-AU',{weekday:'short',day:'numeric',month:'short'})}</button>`}).join('')}</div></div>
  <div class="fld" style="margin-bottom:20px"><span class="fl">Time (${st.o} time)</span><div class="slots">${slots.map(t=>`<button type="button" data-vt="${t}" aria-pressed="${st.t===t}" ${taken(st.o,st.d,t)?'disabled aria-label="'+t+' taken"':''}>${t}</button>`).join('')}</div></div>
  <p class="err-t" id="verr" hidden></p><button class="btn sg" type="button" id="vok">Confirm visit</button>`;
  $$('[data-vo]',m).forEach(b=>b.onclick=()=>{st.o=b.dataset.vo;st.t=null;draw()});$$('[data-vd]',m).forEach(b=>b.onclick=()=>{st.d=b.dataset.vd;st.t=null;draw()});$$('[data-vt]',m).forEach(b=>b.onclick=()=>{st.t=b.dataset.vt;draw()});
  $('#vok',m).onclick=()=>{if(!st.t){$('#verr',m).hidden=false;$('#verr',m).textContent='Please choose a time.';return}const l=ls('visits')||[];l.push({o:st.o,d:st.d,t:st.t});ls('visits',l);
   const label=`${dparse(st.d).toLocaleDateString('en-AU',{weekday:'short',day:'numeric',month:'short'})} ${st.t} ${st.o}`;if(ref){const e=ls('enq')||[];const x=e.find(y=>y.ref===ref);if(x){x.visit=label;ls('enq',e);$('#enqList')&&($('#enqList').innerHTML=enqList(e))}}
   const dt=st.d.replace(/-/g,'')+'T'+st.t.replace(':','')+'00';const [hh,mm]=st.t.split(':').map(Number);const e2=new Date(2000,0,1,hh,mm+45);const end=st.d.replace(/-/g,'')+'T'+String(e2.getHours()).padStart(2,'0')+String(e2.getMinutes()).padStart(2,'0')+'00';
   const tz=st.o==='Melbourne'?'Australia/Melbourne':'Europe/Copenhagen';const g=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Strata Atelier studio visit')}&dates=${dt}/${end}&ctz=${tz}&location=${encodeURIComponent(st.o==='Melbourne'?'18 Gertrude St, Fitzroy VIC':'Halmtorvet 9, Copenhagen')}`;
   $('#vis',m).innerHTML=`<p style="font-size:18px">${ic('check')} Booked: <b>${esc(label)}</b>.</p><p class="muted" style="margin:8px 0 18px">Demo booking, saved in this browser.</p><a class="btn" href="${g}" target="_blank" rel="noopener">${ic('cal')}Add to Google Calendar</a>`}};draw()}

/* ---------- motion ---------- */
let io;function initReveal(){io?.disconnect();io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;t.classList.add('in');io.unobserve(t);$$('[data-count]',t).forEach(countUp)}),{threshold:.15,rootMargin:'0px 0px -8% 0px'});
 $$('.rv,.split,.clipr,.stats').forEach(el=>{if(el.classList.contains('in'))return;RM?(el.classList.add('in'),$$('[data-count]',el).forEach(x=>countUp(x,1))):io.observe(el)})}
function countUp(el,now){if(el.dataset.done)return;el.dataset.done=1;const to=+el.dataset.count;if(now||RM){el.textContent=to;return}const t0=performance.now();const s=t=>{const k=Math.min(1,(t-t0)/1600);el.textContent=Math.round(to*(1-Math.pow(1-k,4)));if(k<1)requestAnimationFrame(s)};requestAnimationFrame(s)}
let lastY=0,tick=false;
function frame(){tick=false;const y=scrollY,vh=innerHeight;
 const nv=$('#nav');if(nv){nv.classList.toggle('hide',y>lastY+4&&y>240&&!$('#mm.open'));if(y<lastY-4||y<240)nv.classList.remove('hide');
  let inv=false;$$('[data-nav-inv]').forEach(el=>{const r=el.getBoundingClientRect();if(r.top<=40&&r.bottom>=40)inv=true});const cn=$('#cine');if(cn&&cn.classList.contains('dusk')){const r=cn.getBoundingClientRect();if(r.top<=40&&r.bottom>=40)inv=true}nv.classList.toggle('inv',inv)}
 lastY=y;
 if($('#cine'))cineUpdate(cineP());
 const st=$('#stmt');if(st){const r=st.getBoundingClientRect();const k=clamp((vh*.85-r.top)/(r.height+vh*.35),0,1);const w=$$('.wf',st);const n=Math.round(k*w.length);w.forEach((x,i)=>x.classList.toggle('on',i<n))}
 const pr=$('#proc');if(pr){const r=pr.getBoundingClientRect();const k=clamp(-r.top/(r.height-vh),0,1);const i=Math.min(PROC.length-1,Math.floor(k*PROC.length*.999));const sub=k*PROC.length-i;
  $('#procBar').style.width=k*100+'%';const L=$('#procList');if(L.dataset.i!=i){L.dataset.i=i;$$('div',L).forEach((d,j)=>d.classList.toggle('on',j===i));$$('#procImg img').forEach((m,j)=>m.classList.toggle('on',j===i));$('#procTxt').textContent=PROC[i][2]}
  L.style.transform=`translateY(${(PROC.length/2-.5-i-sub+.5)*1.02*parseFloat(getComputedStyle($('div',L)).fontSize)}px)`;
  const im=$('#procImg');im.style.setProperty('--rz',`${lerp(-7,7,sub)}deg`);im.style.setProperty('--ry',`${lerp(-18,18,sub)}deg`);im.style.setProperty('--rx',`${lerp(6,-6,sub)}deg`)}
 const ph0=$('.pj-hero .ph img');if(ph0&&y<vh*1.2)ph0.style.transform=`scale(1.08) translateY(${y*.25}px)`;
 const fw=$('.fwm');if(fw){const r=fw.getBoundingClientRect();const k=clamp((vh-r.top)/(r.height*1.1),0,1);$$('span',fw).forEach((s,i)=>s.style.setProperty('--y',`${(1-k)*(40+i*22)}%`))}
 const pg=$('#prog');if(pg){const h=document.documentElement.scrollHeight-vh;pg.style.width=(h>0?y/h*100:0)+'%'}}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});
addEventListener('resize',()=>{if(!tick){tick=true;requestAnimationFrame(frame)}});

/* cursor + preview + magnet */
const cur=document.createElement('div');cur.className='cur';cur.innerHTML='<i class="dot"></i><i class="ring"></i>';document.body.appendChild(cur);
const M={x:innerWidth/2,y:innerHeight/2,cx:innerWidth/2,cy:innerHeight/2,px:0,py:0};
addEventListener('pointermove',e=>{M.x=e.clientX;M.y=e.clientY;if(e.pointerType==='mouse')cur.classList.add('moved');const t=e.target.closest?.('[data-cursor]');cur.classList.toggle('on',!!t);if(t)$('.ring',cur).textContent=t.dataset.cursor;
 const mg=$('#mag');if(mg){const r=mg.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;const d=Math.hypot(M.x-cx,M.y-cy);mg.style.transform=d<220?`translate(${(M.x-cx)*.28}px,${(M.y-cy)*.28}px)`:''}},{passive:true});
(function cl(){M.cx+=(M.x-M.cx)*.2;M.cy+=(M.y-M.cy)*.2;cur.style.transform=`translate(${M.cx}px,${M.cy}px)`;M.px+=(M.x-M.px)*.12;M.py+=(M.y-M.py)*.12;const pv=$('#pv');if(pv&&pv.classList.contains('on'))pv.style.left=M.px+'px',pv.style.top=M.py+'px';requestAnimationFrame(cl)})();
function bindPreview(){const pv=$('#pv');if(!pv||TOUCH)return;$$('[data-prev]').forEach(r=>{r.onmouseenter=()=>{pv.innerHTML=`<img src="photos/${r.dataset.prev}.jpg" alt="">`;M.px=M.x;M.py=M.y;pv.classList.add('on')};r.onmouseleave=()=>pv.classList.remove('on')})}

/* ---------- router ---------- */
function render(h,keep){S.page='';if(E){E.S.onFrame=null;E.unmount()}cine.on=false;closeModal();$('#mm')?.classList.remove('open');document.body.classList.remove('lock');
 let key=h||'home';let title='Strata Atelier · Architecture, Interiors & 3D';
 if(key.startsWith('p-')){const p=pj(key.slice(2));if(p){S.page='project';mount('work',pageProject(p));bindProject(p);title=p.n+' · Strata Atelier'}else key='404'}
 else if(key.startsWith('j-')){const j=J.find(x=>x.s===key.slice(2));if(j){S.page='article';mount('journal',pageArticle(j));$('#cpy').onclick=()=>{navigator.clipboard?.writeText(location.href).then(()=>toast('Link copied'),()=>toast('Copy not available'))};title=j.t+' · Strata Atelier'}else key='404'}
 if(key==='home'){S.page='home';mount('home',pageHome());bindHome()}
 else if(key==='work'){S.page='work';mount('work',pageWork());$$('[data-wf]').forEach(b=>b.onclick=()=>{S.wf=b.dataset.wf;ls('wf',S.wf);$$('[data-wf]').forEach(x=>x.setAttribute('aria-pressed',x===b));drawWork()});$$('[data-wv]').forEach(b=>b.onclick=()=>{S.wv=b.dataset.wv;ls('wv',S.wv);$$('[data-wv]').forEach(x=>x.setAttribute('aria-pressed',x===b));drawWork()});drawWork();title='Work · Strata Atelier'}
 else if(key==='lab'){S.page='lab';mount('lab',pageLab(),{noFoot:false});bindLab();title='Massing Lab · Strata Atelier'}
 else if(key==='studio'){S.page='studio';mount('studio',pageStudio());title='Studio · Strata Atelier'}
 else if(key==='journal'){S.page='journal';mount('journal',pageJournal());title='Journal · Strata Atelier'}
 else if(key==='contact'){S.page='contact';mount('contact',pageContact());bindContact();title='Start a project · Strata Atelier'}
 else if(key==='404'||!['project','article'].includes(S.page)&&!['home','work','lab','studio','journal','contact'].includes(key)){S.page='404';mount('',`<section class="wrap ph-h" style="min-height:70vh">${split('Not found','h1')}<div class="row"><p>This page does not exist. Perhaps it was never built.</p><a class="btn" href="#home">Back home <span class="ar">${ic('ne','width:14px;height:14px')}</span></a></div></section>`)}
 document.title=title;
 $$('[data-tm]').forEach(b=>b.onclick=()=>tmModal(b.dataset.tm));
 bindPreview();initReveal();if(!keep)scrollTo({top:0,behavior:'instant'});lastY=scrollY;frame()}
function bindHome(){cineInit();$$('#chap [data-ch]').forEach(b=>b.onclick=()=>{const c=CH[+b.dataset.ch];const el=$('#cine');const top=el.offsetTop+(el.offsetHeight-innerHeight)*(c.a+.02);scrollTo({top,behavior:RM?'instant':'smooth'})});
 const roomEl=$('#roomV');let active='cine';
 const sw=w=>{if(w===active||!E)return;active=w;if(w==='room'){use3D(roomEl,S.room,{},{preset:'default'});roomState()}else if(w==='cine'){cineInit()}};
 const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)sw(e.target.id==='room'?'room':'cine')}),{threshold:.08});ob.observe($('#room'));ob.observe($('#cine'));
 const roomState=()=>{const t=+$('#roomT').value;E.S.time=t;E.apply();hots(roomEl,()=>$('#roomV [data-hot="1"]').getAttribute('aria-pressed')==='true')};
 bindViewerUI('room');
 $$('[data-room]').forEach(b=>b.onclick=()=>{S.room=b.dataset.room;$$('[data-room]').forEach(x=>x.setAttribute('aria-pressed',x===b));const p=pjByModel(S.room);$('#roomTag span').textContent=p.n;$('#roomV .fallback img')?.setAttribute('src',`photos/${p.img[0]}.jpg`);
  if(E&&active==='room'){use3D(roomEl,S.room,{},{preset:'default'});$('#roomC').value=100;$('#roomX').value=0;[$('#roomC'),$('#roomX')].forEach(rangeFill);roomState();applyViewerLook('room')}})}
/* room viewer: same UI as bindViewer but model switches; mount is controlled by the observer */
const VW={};
function bindViewerUI(id){const el=$('#'+id+'V');const st=VW[id]={look:1,hot:true};
 const upd=()=>{if(!E||!el.contains(E.renderer.domElement))return;applyViewerLook(id)};
 $$('[data-look]',el).forEach(b=>b.onclick=()=>{st.look=+b.dataset.look;$$('[data-look]',el).forEach(x=>x.setAttribute('aria-pressed',x===b));upd()});
 $$('[data-hot]',el).forEach(b=>b.onclick=()=>{$$('[data-hot]',el).forEach(x=>x.setAttribute('aria-pressed',x===b))});
 const tr=$('#'+id+'T'),cr=$('#'+id+'C'),xr=$('#'+id+'X');[tr,cr,xr].forEach(rangeFill);$('#'+id+'To').textContent=fmtT(+tr.value);
 tr.oninput=()=>{$('#'+id+'To').textContent=fmtT(+tr.value);rangeFill(tr);upd()};cr.oninput=()=>{rangeFill(cr);upd()};xr.oninput=()=>{rangeFill(xr);upd()};
 $$('[data-pre]',el).forEach(b=>b.onclick=()=>{if(!E)return;E.S.cam.auto=false;E.preset(b.dataset.pre);$('#'+id+'Drag')?.classList.add('off')});
 $('[data-full]',el).onclick=()=>{if(document.fullscreenElement)document.exitFullscreen?.();else el.requestFullscreen?.().catch(()=>toast('Fullscreen is not available here'))};
 $('[data-still]',el).onclick=()=>saveStill((E?.meta()?.name||'strata').toLowerCase().replace(/ø/g,'o').replace(/æ/g,'ae').normalize('NFKD').replace(/[^a-z0-9]+/g,'-'));
 el.addEventListener('pointerdown',()=>$('#'+id+'Drag')?.classList.add('off'),{once:true})}
function applyViewerLook(id){if(!E)return;const el=$('#'+id+'V');const st=VW[id]||{look:1};const look=+($('[data-look][aria-pressed="true"]',el)?.dataset.look??1);
 E.S.real=look;E.S.edges=look?.1:.85;E.S.time=+$('#'+id+'T').value;const m=E.meta();const c=+$('#'+id+'C').value;E.S.cut=c>=100?null:lerp(m.bottom+.4,m.top+.2,c/100);E.S.explode=+$('#'+id+'X').value/100;E.apply()}

let routing=false;
function go(){const h=location.hash.slice(1);if(S.first){S.first=false;render(h);return}
 if(RM||routing){render(h);return}routing=true;const c=$('.curtain');c.className='curtain in';
 setTimeout(()=>{render(h);c.className='curtain out';setTimeout(()=>{c.className='curtain';routing=false},750)},600)}
addEventListener('hashchange',go);

/* ---------- boot + loader ---------- */
(function boot(){const cu=document.createElement('div');cu.className='curtain';cu.innerHTML='<i></i><i></i>';document.body.appendChild(cu);
 const g=document.createElement('div');g.className='grain';g.setAttribute('aria-hidden','true');document.body.appendChild(g);
 const ld=document.createElement('div');ld.className='ld';ld.setAttribute('aria-hidden','true');
 const paths=['M60 150 H300','M80 150 V96 H210 V150','M60 96 H330 V64 H60 Z','M120 96 V64','M180 96 V64','M240 96 V64','M300 96 V64','M95 150 V112 H160 V150','M215 150 V116 H280','M20 150 C120 146 250 154 380 150','M330 150 v-10 h24 v10'];
 ld.innerHTML=`<i class="bar" id="ldb"></i><svg viewBox="0 0 400 170">${paths.map((d,i)=>`<path d="${d}" style="--l:600;--d:${i*.12}s"/>`).join('')}</svg><div class="nm"><b>Strata Atelier</b><span class="mono">Loading the model</span></div><div class="ct num" id="ldc">000</div>`;
 document.body.appendChild(ld);const t0=performance.now();let done=false;
 const imgs=['x3','x1','r1','c1'].map(k=>new Promise(r=>{const i=new Image();i.onload=i.onerror=r;i.src=`photos/${k}.jpg`}));
 const need=Promise.race([Promise.all([...imgs,new Promise(r=>{const chk=()=>E_state!=='loading'?r():setTimeout(chk,80);chk()})]),new Promise(r=>setTimeout(r,6000))]);
 need.then(()=>{done=true});
 const step=()=>{const el=performance.now()-t0;const k=done?Math.min(1,el/1400+.5):Math.min(.9,el/3000);$('#ldc').textContent=String(Math.round(k*100)).padStart(3,'0');$('#ldb').style.width=k*100+'%';
  if(k>=1&&el>(RM?200:1500)){ld.classList.add('out');document.documentElement.classList.add('ready');setTimeout(()=>ld.remove(),1300);return}requestAnimationFrame(step)};
 go();requestAnimationFrame(step)})();
