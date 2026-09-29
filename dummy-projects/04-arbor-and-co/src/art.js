/* ===== Arbor & Co. product illustrations (hand-built SVG, soft 3D look) ===== */
const Art=(()=>{
let uid=0;
function mix(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const t=amt<0?0:255,p=Math.abs(amt);r=Math.round(r+(t-r)*p);g=Math.round(g+(t-g)*p);b=Math.round(b+(t-b)*p);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
const lg=(id,a,b,h)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${h?1:0}" y2="${h?0:1}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const rg=(id,a,b)=>`<radialGradient id="${id}" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
const shadow=(cx,cy,rx)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx*.075}" fill="#000" opacity=".07"/><ellipse cx="${cx}" cy="${cy}" rx="${rx*.72}" ry="${rx*.05}" fill="#000" opacity=".10"/>`;
const leg=(x1,y1,x2,y2,w,f)=>`<path d="M${x1-w/2} ${y1}L${x1+w/2} ${y1}L${x2+w*.28} ${y2}L${x2-w*.28} ${y2}Z" fill="${f}"/>`;
function woodDefs(id,w){return lg(id+'w',mix(w,.12),mix(w,-.18))+lg(id+'wh',mix(w,.18),mix(w,-.1),1)}
function boucle(id,c){let d='';const pts=[[3,4],[9,2],[14,7],[6,10],[11,13],[2,15],[16,15],[8,17]];pts.forEach(p=>d+=`<circle cx="${p[0]}" cy="${p[1]}" r="1.6" fill="${mix(c,-.07)}"/>`);pts.forEach(p=>d+=`<circle cx="${p[0]+1}" cy="${p[1]-1}" r=".9" fill="${mix(c,.25)}"/>`);return `<pattern id="${id}" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="${c}"/>${d}</pattern>`}
function rattan(id){return `<pattern id="${id}" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#DCC296"/><path d="M0 0L9 9M9 0L0 9" stroke="#B48E58" stroke-width="1.3"/><circle cx="4.5" cy="4.5" r="1.2" fill="#C9A874"/></pattern>`}

/* each drawer returns {d: defs, b: body} in a 400x400 box */
const D={
sofa(c,w,o={}){const id='a'+(++uid),d=mix(c,-.16),dd=mix(c,-.3),l=mix(c,.14),wd=mix(w,-.3);
 const defs=lg(id+'a',l,c)+lg(id+'b',c,d)+lg(id+'c',mix(c,.05),d)+woodDefs(id,w);
 let b=shadow(200,322,172)+leg(84,290,76,322,13,`url(#${id}w)`)+leg(316,290,324,322,13,`url(#${id}w)`)+leg(150,290,147,312,9,wd)+leg(250,290,253,312,9,wd)
 +`<rect x="44" y="272" width="312" height="22" rx="9" fill="url(#${id}w)"/>`
 +`<rect x="56" y="112" width="288" height="138" rx="36" fill="url(#${id}b)"/>`
 +`<rect x="76" y="122" width="122" height="116" rx="28" fill="url(#${id}a)"/><rect x="202" y="122" width="122" height="116" rx="28" fill="url(#${id}a)"/>`
 +`<path d="M92 132q45-8 90 0M218 132q45-8 90 0" stroke="${l}" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/>`
 +[118,158,244,284].map(x=>`<circle cx="${x}" cy="176" r="3" fill="${dd}" opacity=".45"/>`).join('')
 +`<rect x="86" y="222" width="114" height="56" rx="20" fill="url(#${id}c)"/><rect x="200" y="222" width="114" height="56" rx="20" fill="url(#${id}c)"/>`
 +`<rect x="94" y="226" width="98" height="12" rx="6" fill="${l}" opacity=".55"/><rect x="208" y="226" width="98" height="12" rx="6" fill="${l}" opacity=".55"/>`
 +`<rect x="28" y="168" width="68" height="118" rx="32" fill="url(#${id}b)"/><rect x="304" y="168" width="68" height="118" rx="32" fill="url(#${id}b)"/>`
 +`<rect x="36" y="172" width="52" height="20" rx="10" fill="${l}" opacity=".7"/><rect x="312" y="172" width="52" height="20" rx="10" fill="${l}" opacity=".7"/>`;
 if(o.pillows){const pd='p'+id;b+=`<defs><pattern id="${pd}" width="14" height="16" patternUnits="userSpaceOnUse"><rect width="14" height="16" fill="#D9B54A"/><ellipse cx="7" cy="8" rx="3.4" ry="4.4" fill="#F4EEDC"/></pattern></defs>`
  +`<g transform="rotate(-14 125 190)"><rect x="82" y="150" width="92" height="84" rx="22" fill="url(#${pd})"/><rect x="82" y="150" width="92" height="84" rx="22" fill="none" stroke="#B89632" stroke-width="3" opacity=".5"/></g>`
  +`<g transform="rotate(12 290 190)"><rect x="244" y="148" width="92" height="84" rx="24" fill="${mix(c,.2)}"/><rect x="250" y="152" width="80" height="18" rx="9" fill="${mix(c,.35)}" opacity=".7"/></g>`}
 return {d:defs,b}},
lounge(c,w){const id='a'+(++uid),d=mix(c,-.15),dd=mix(c,-.32),l=mix(c,.15),wd=mix(w,-.3);
 const defs=lg(id+'a',l,c)+lg(id+'b',c,d)+woodDefs(id,w);
 let b=shadow(200,324,126)+leg(126,292,114,324,10,`url(#${id}w)`)+leg(274,292,286,324,10,`url(#${id}w)`)+leg(160,292,158,314,8,wd)+leg(240,292,242,314,8,wd)
 +`<path d="M112 280L112 130Q112 66 200 66Q288 66 288 130L288 280Z" fill="url(#${id}b)"/>`;
 for(let i=0;i<6;i++){const x=137+i*25.2;b+=`<path d="M${x} ${i===0||i===5?104:88}L${x} 250" stroke="${dd}" stroke-width="3" opacity=".28" stroke-linecap="round"/><path d="M${x+5} ${i===0||i===5?106:90}L${x+5} 246" stroke="${l}" stroke-width="3" opacity=".35" stroke-linecap="round"/>`}
 b+=`<rect x="90" y="176" width="58" height="116" rx="28" fill="url(#${id}b)"/><rect x="252" y="176" width="58" height="116" rx="28" fill="url(#${id}b)"/>`
 +`<rect x="96" y="180" width="46" height="18" rx="9" fill="${l}" opacity=".6"/><rect x="258" y="180" width="46" height="18" rx="9" fill="${l}" opacity=".6"/>`
 +`<rect x="138" y="236" width="124" height="50" rx="18" fill="url(#${id}a)"/><rect x="100" y="280" width="200" height="16" rx="8" fill="${d}"/>`;
 return {d:defs,b}},
rattan(c,w){const id='a'+(++uid),d=mix(c,-.18),l=mix(c,.16),wd=mix(w,-.3);
 const defs=lg(id+'a',l,c)+woodDefs(id,w)+rattan(id+'r');
 let b=shadow(200,326,112)+leg(160,244,154,314,9,wd)+leg(240,244,246,314,9,wd)+leg(138,246,114,326,13,`url(#${id}w)`)+leg(262,246,286,326,13,`url(#${id}w)`)
 +`<path d="M114 218Q114 104 200 104Q286 104 286 218L266 218Q264 128 200 128Q136 128 134 218Z" fill="url(#${id}r)"/>`
 +`<path d="M110 220Q110 96 200 96Q290 96 290 220" fill="none" stroke="url(#${id}wh)" stroke-width="10" stroke-linecap="round"/>`
 +`<path d="M136 218Q138 132 200 132Q262 132 264 218" fill="none" stroke="${mix(w,-.2)}" stroke-width="4" opacity=".5"/>`
 +`<rect x="92" y="226" width="216" height="34" rx="17" fill="${d}"/><ellipse cx="200" cy="228" rx="108" ry="26" fill="url(#${id}a)"/><ellipse cx="190" cy="222" rx="70" ry="12" fill="${l}" opacity=".5"/>`;
 return {d:defs,b}},
pouf(c,w){const id='a'+(++uid),l=mix(c,.1),d=mix(c,-.1);
 const defs=woodDefs(id,w)+boucle(id+'bo',c)+lg(id+'s',"rgba(0,0,0,0)","rgba(0,0,0,.12)",1);
 let b=shadow(200,322,116)+`<rect x="100" y="150" width="18" height="168" rx="7" fill="url(#${id}wh)"/><rect x="282" y="150" width="18" height="168" rx="7" fill="url(#${id}wh)"/>`
 +`<rect x="100" y="290" width="200" height="14" rx="6" fill="url(#${id}w)"/>`
 +`<rect x="116" y="146" width="168" height="134" rx="44" fill="url(#${id}bo)"/><rect x="116" y="146" width="168" height="134" rx="44" fill="url(#${id}s)"/>`
 +`<ellipse cx="200" cy="160" rx="78" ry="16" fill="${l}" opacity=".55"/><rect x="116" y="146" width="168" height="134" rx="44" fill="none" stroke="${d}" stroke-width="2" opacity=".4"/>`;
 return {d:defs,b}},
nightstand(c,w){const id='a'+(++uid),wd=mix(w,-.3),cr=c;
 const defs=woodDefs(id,w)+lg(id+'d',mix(cr,.1),mix(cr,-.06));
 let b=shadow(200,324,104)+leg(152,262,148,312,8,wd)+leg(248,262,252,312,8,wd)+leg(132,262,112,324,11,`url(#${id}w)`)+leg(268,262,288,324,11,`url(#${id}w)`)
 +`<rect x="112" y="116" width="176" height="152" rx="10" fill="url(#${id}w)"/><rect x="112" y="116" width="176" height="10" rx="5" fill="${mix(w,.25)}"/>`
 +`<rect x="126" y="134" width="148" height="58" rx="7" fill="url(#${id}d)"/><rect x="126" y="198" width="148" height="58" rx="7" fill="url(#${id}d)"/>`
 +`<rect x="184" y="158" width="32" height="7" rx="3.5" fill="${wd}"/><rect x="184" y="222" width="32" height="7" rx="3.5" fill="${wd}"/>`
 +`<path d="M126 192h148M126 256h148" stroke="#000" opacity=".06" stroke-width="3"/>`;
 return {d:defs,b}},
cabinet(c,w){const id='a'+(++uid),d=mix(c,-.12),dd=mix(c,-.3),l=mix(c,.12);
 const defs=lg(id+'a',l,d)+lg(id+'h',mix(c,.05),mix(c,-.08),1)+woodDefs(id,w);
 let b=shadow(200,332,96)+leg(130,300,126,332,7,`url(#${id}w)`)+leg(270,300,274,332,7,`url(#${id}w)`)
 +`<rect x="118" y="58" width="164" height="246" rx="9" fill="url(#${id}a)"/><rect x="113" y="52" width="174" height="14" rx="6" fill="${l}"/>`
 +`<rect x="126" y="72" width="70" height="182" rx="5" fill="url(#${id}h)"/><rect x="204" y="72" width="70" height="182" rx="5" fill="url(#${id}h)"/>`
 +`<rect x="187" y="150" width="4" height="44" rx="2" fill="${dd}"/><rect x="209" y="150" width="4" height="44" rx="2" fill="${dd}"/>`
 +`<rect x="126" y="262" width="148" height="34" rx="5" fill="${mix(c,-.04)}"/><rect x="186" y="276" width="28" height="4" rx="2" fill="${dd}"/>`;
 return {d:defs,b}},
easy(c,w){const id='a'+(++uid),d=mix(c,-.15),l=mix(c,.14);
 const defs=lg(id+'a',l,c)+lg(id+'b',c,d)+woodDefs(id,w);
 let b=shadow(200,324,124)
 +`<path d="M116 112L130 112L150 322L136 322Z" fill="${mix(w,-.25)}"/><path d="M284 112L270 112L250 322L264 322Z" fill="${mix(w,-.25)}"/>`
 +`<path d="M140 104L262 104Q270 104 268 112L258 240L142 240L132 112Q130 104 140 104Z" fill="url(#${id}b)"/><rect x="150" y="112" width="100" height="18" rx="9" fill="${l}" opacity=".6"/>`
 +`<path d="M156 150h88M156 190h88" stroke="${d}" stroke-width="3" opacity=".35" stroke-linecap="round"/>`
 +`<rect x="116" y="232" width="168" height="48" rx="16" fill="url(#${id}a)"/>`
 +`<rect x="112" y="236" width="12" height="88" rx="4" fill="url(#${id}wh)"/><rect x="276" y="236" width="12" height="88" rx="4" fill="url(#${id}wh)"/>`
 +`<rect x="96" y="222" width="86" height="13" rx="6.5" fill="url(#${id}wh)"/><rect x="218" y="222" width="86" height="13" rx="6.5" fill="url(#${id}wh)"/>`
 +`<rect x="112" y="284" width="176" height="9" rx="4" fill="url(#${id}w)"/>`;
 return {d:defs,b}},
sideboard(c,w){const id='a'+(++uid),d=mix(c,-.1),dd=mix(c,-.3),l=mix(c,.12);
 const defs=lg(id+'a',l,d)+woodDefs(id,w);
 let b=shadow(200,318,160)+leg(76,282,70,318,8,`url(#${id}w)`)+leg(324,282,330,318,8,`url(#${id}w)`)+leg(120,282,118,306,6,mix(w,-.3))+leg(280,282,282,306,6,mix(w,-.3))
 +`<rect x="52" y="160" width="296" height="126" rx="8" fill="url(#${id}a)"/><rect x="48" y="154" width="304" height="12" rx="5" fill="url(#${id}wh)"/>`
 +[0,1,2].map(i=>`<rect x="${62+i*94}" y="174" width="88" height="102" rx="4" fill="${i===1?`url(#${id}w)`:mix(c,.04)}"/>`).join('')
 +`<rect x="146" y="214" width="4" height="26" rx="2" fill="${dd}"/><rect x="250" y="214" width="4" height="26" rx="2" fill="${dd}"/>`
 +`<path d="M112 154Q108 124 118 110Q114 104 118 100L128 100Q132 104 128 110Q138 124 134 154Z" fill="#E7E1D6"/><path d="M123 100Q118 70 104 60M123 100Q128 72 144 64" stroke="#6E8B62" stroke-width="3" fill="none"/><rect x="250" y="120" width="54" height="34" rx="3" fill="#fff"/><rect x="255" y="125" width="44" height="24" fill="#B9C9D8"/>`;
 return {d:defs,b}},
bed(c,w){const id='a'+(++uid),d=mix(c,-.14),l=mix(c,.14),wd=mix(w,-.3);
 const defs=lg(id+'b',c,d)+woodDefs(id,w)+lg(id+'q',mix(c,.45),mix(c,.3));
 let b=shadow(200,318,182)+leg(56,290,54,316,10,wd)+leg(344,290,346,316,10,wd)
 +`<rect x="38" y="104" width="324" height="156" rx="28" fill="url(#${id}b)"/>`;
 for(let i=0;i<7;i++){b+=`<path d="M${74+i*42} 122V238" stroke="${mix(c,-.3)}" stroke-width="3" opacity=".22" stroke-linecap="round"/>`}
 b+=`<rect x="26" y="248" width="348" height="44" rx="12" fill="url(#${id}w)"/>`
 +`<rect x="42" y="214" width="316" height="42" rx="14" fill="#F7F5F0"/>`
 +`<rect x="72" y="178" width="112" height="48" rx="20" fill="#FFFFFF"/><rect x="216" y="178" width="112" height="48" rx="20" fill="#FFFFFF"/><rect x="72" y="178" width="112" height="48" rx="20" fill="none" stroke="#E4DFD6" stroke-width="2"/><rect x="216" y="178" width="112" height="48" rx="20" fill="none" stroke="#E4DFD6" stroke-width="2"/>`
 +`<path d="M42 236L358 236L358 270Q200 288 42 270Z" fill="url(#${id}q)"/><path d="M42 236L358 236" stroke="${l}" stroke-width="5" stroke-linecap="round"/>`;
 return {d:defs,b}},
table(c,w){const id='a'+(++uid),wd=mix(w,-.32);
 const defs=woodDefs(id,w)+lg(id+'v',mix(c,.2),mix(c,-.15));
 let b=shadow(200,318,150)+leg(162,226,160,302,10,wd)+leg(238,226,240,302,10,wd)+leg(118,226,106,318,14,`url(#${id}w)`)+leg(282,226,294,318,14,`url(#${id}w)`)
 +`<ellipse cx="200" cy="218" rx="158" ry="34" fill="${wd}"/><ellipse cx="200" cy="210" rx="158" ry="34" fill="url(#${id}wh)"/><ellipse cx="170" cy="202" rx="90" ry="14" fill="#fff" opacity=".14"/>`
 +`<rect x="228" y="178" width="70" height="12" rx="3" fill="#EDE6D8"/><rect x="232" y="168" width="62" height="11" rx="3" fill="${mix(c,-.1)}"/>`
 +`<path d="M142 202Q136 172 148 156Q142 150 148 146L160 146Q166 150 160 156Q172 172 166 202Z" fill="url(#${id}v)"/><path d="M154 146Q150 120 136 110M154 146Q160 118 176 112" stroke="#6E8B62" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="134" cy="108" rx="10" ry="5" fill="#8FAE7E" transform="rotate(-30 134 108)"/><ellipse cx="178" cy="110" rx="10" ry="5" fill="#8FAE7E" transform="rotate(25 178 110)"/>`;
 return {d:defs,b}},
lamp(c,w){const id='a'+(++uid);
 const defs=lg(id+'s',mix(c,.15),mix(c,-.12))+rg(id+'g','rgba(255,236,180,.9)','rgba(255,236,180,0)');
 let b=shadow(170,330,70)+`<ellipse cx="236" cy="140" rx="90" ry="60" fill="url(#${id}g)"/>`
 +`<ellipse cx="160" cy="324" rx="46" ry="10" fill="#2B2B2B"/><rect x="156" y="300" width="8" height="24" fill="#2B2B2B"/>`
 +`<path d="M160 304L160 124Q160 64 236 76" fill="none" stroke="#2B2B2B" stroke-width="6" stroke-linecap="round"/>`
 +`<path d="M194 88Q236 58 278 88L288 134Q236 122 184 134Z" fill="url(#${id}s)"/><ellipse cx="236" cy="132" rx="50" ry="8" fill="#FFF3CE"/>`
 +`<rect x="150" y="214" width="20" height="10" rx="4" fill="${w}"/>`;
 return {d:defs,b}},
dining(c,w){const id='a'+(++uid),wd=mix(w,-.3);
 const defs=woodDefs(id,w)+lg(id+'a',mix(c,.14),c);
 let b=shadow(200,324,96)+leg(146,244,140,324,11,`url(#${id}w)`)+leg(254,244,260,324,11,`url(#${id}w)`)+leg(160,240,158,306,8,wd)+leg(240,240,242,306,8,wd)
 +`<path d="M148 82L160 82L166 240L152 240Z" fill="url(#${id}wh)"/><path d="M252 82L240 82L234 240L248 240Z" fill="url(#${id}wh)"/>`
 +`<rect x="150" y="88" width="100" height="26" rx="10" fill="url(#${id}w)"/><rect x="156" y="124" width="88" height="8" rx="4" fill="url(#${id}w)"/>`
 +`<rect x="136" y="226" width="128" height="22" rx="9" fill="url(#${id}w)"/><rect x="140" y="214" width="120" height="20" rx="10" fill="url(#${id}a)"/>`;
 return {d:defs,b}}
};

function product(type,c,w,view='front',extra){const r=D[type](c,w,extra||{});
 const vb=view==='detail'?'90 130 220 220':view==='top'?'40 40 320 320':'0 0 400 400';
 let bg='';if(view==='room'){bg=`<rect x="-200" y="-100" width="800" height="600" fill="#EEF0F1"/><rect x="-200" y="318" width="800" height="200" fill="#E4DDD2"/><rect x="236" y="40" width="96" height="120" rx="4" fill="#fff"/><rect x="244" y="48" width="80" height="104" fill="#DDE6EE"/><path d="M252 140Q280 70 318 96L318 144L252 144Z" fill="#9FB6CC"/>`}
 return `<svg class="art" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs>${r.d}</defs>${bg}${r.b}</svg>`}
function group(type,c,w,x,y,s,extra){const r=D[type](c,w,extra||{});return {d:r.d,g:`<g transform="translate(${x} ${y}) scale(${s})">${r.b}</g>`}}

function heroRoom(){const s=group('sofa','#8FA9C4','#C49060',300,55,2.5,{pillows:true});
 return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${s.d}<linearGradient id="hw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F1F2F3"/><stop offset="1" stop-color="#E3E6E8"/></linearGradient><linearGradient id="hf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2DACD"/><stop offset="1" stop-color="#D4CABB"/></linearGradient><radialGradient id="hl" cx=".75" cy=".2" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
 <rect width="1600" height="900" fill="url(#hw)"/><rect width="1600" height="900" fill="url(#hl)"/>
 <g><rect x="520" y="-20" width="300" height="250" fill="#FAFAF8"/><rect x="540" y="0" width="260" height="210" fill="#E8EDF2"/><path d="M560 210Q600 60 700 90Q760 110 800 40L800 210Z" fill="#6E8DAE"/><path d="M540 140Q620 120 660 210L540 210Z" fill="#2F4460"/></g>
 <g><rect x="900" y="-20" width="300" height="250" fill="#FAFAF8"/><rect x="920" y="0" width="260" height="210" fill="#EEF1F4"/><path d="M1000 210L1000 60Q1060 30 1100 80L1100 210Z" fill="#324A68"/><circle cx="1130" cy="60" r="26" fill="#A9BCD1"/></g>
 <g><rect x="1370" y="560" width="110" height="140" rx="16" fill="#EDE7DD"/><path d="M1425 560Q1380 470 1330 440M1425 560Q1440 450 1500 400M1425 560Q1470 490 1540 480M1425 560Q1400 480 1410 380" stroke="#6E8B62" stroke-width="7" fill="none" stroke-linecap="round"/>${[[1330,440,-30],[1500,400,30],[1540,480,10],[1410,380,-5],[1370,470,-50],[1470,440,40]].map(p=>`<ellipse cx="${p[0]}" cy="${p[1]}" rx="34" ry="14" fill="#86A576" transform="rotate(${p[2]} ${p[0]} ${p[1]})"/>`).join('')}</g>
 <rect x="0" y="780" width="1600" height="120" fill="url(#hf)"/><rect x="0" y="780" width="1600" height="4" fill="#CFC6B8"/>
 ${s.g}</svg>`}
function videoScene(){const s=group('sofa','#9AA0A6','#B98B5E',40,100,1.55);const t=group('table','#B9C7D4','#B98B5E',560,380,.9);
 return `<svg class="scene" viewBox="0 0 900 675" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${s.d}${t.d}<linearGradient id="vw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9E3DB"/><stop offset="1" stop-color="#DCD3C8"/></linearGradient></defs>
 <rect width="900" height="675" fill="url(#vw)"/><rect x="690" y="40" width="190" height="400" fill="#F7F4EE"/><path d="M785 40V440M690 240H880" stroke="#D8CFC3" stroke-width="6"/><rect x="690" y="40" width="190" height="400" fill="#fff" opacity=".35"/>
 <path d="M240 0V120M470 0V100" stroke="#3a3a3a" stroke-width="2"/><path d="M220 120h40l-6 22h-28z M450 100h40l-6 22h-28z" fill="#2E2E2E"/><ellipse cx="240" cy="146" rx="26" ry="6" fill="#FFE9B0" opacity=".8"/><ellipse cx="470" cy="126" rx="26" ry="6" fill="#FFE9B0" opacity=".8"/>
 <rect x="170" y="230" width="360" height="10" rx="3" fill="#B99470"/><rect x="200" y="186" width="44" height="44" fill="#fff"/><rect x="206" y="192" width="32" height="32" fill="#9FB3C6"/><rect x="262" y="198" width="36" height="32" fill="#2F2F2F"/><rect x="420" y="192" width="30" height="38" rx="14" fill="#A8BF9E"/>
 <rect y="560" width="900" height="115" fill="#CFC5B7"/><rect y="556" width="900" height="6" fill="#BFB4A5"/>${s.g}${t.g}</svg>`}
function bannerScene(){const a=group('lounge','#6F8DB0','#C9A86A',560,120,1.35);const b=group('lounge','#6F8DB0','#C9A86A',1090,140,1.3);
 return `<svg class="scene" viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${a.d}${b.d}<linearGradient id="bw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6A8098"/><stop offset="1" stop-color="#8FA3B7"/></linearGradient><pattern id="rug" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#4E5E70"/><circle cx="3" cy="3" r="1.5" fill="#5D6F83"/><circle cx="8" cy="7" r="1.3" fill="#445364"/></pattern></defs>
 <rect width="1600" height="700" fill="url(#bw)"/><rect y="560" width="1600" height="140" fill="#46566A"/><ellipse cx="1080" cy="640" rx="560" ry="60" fill="url(#rug)"/>
 ${a.g}${b.g}
 <g><rect x="1036" y="420" width="10" height="200" fill="#C9A86A"/><ellipse cx="1041" cy="420" rx="70" ry="12" fill="#D8BC82"/><ellipse cx="1041" cy="618" rx="48" ry="8" fill="#B8975A"/><path d="M1020 418Q1014 370 1030 350Q1024 340 1030 336L1052 336Q1058 340 1052 350Q1068 370 1062 418Z" fill="#6B6F76" opacity=".85"/><path d="M1041 336Q1030 270 1000 250M1041 336Q1050 280 1086 262M1041 336Q1041 290 1044 240" stroke="#31402F" stroke-width="3" fill="none"/><circle cx="1000" cy="250" r="9" fill="#E7E1D6"/><circle cx="1086" cy="262" r="9" fill="#E7E1D6"/><circle cx="1044" cy="240" r="10" fill="#F1ECE3"/></g>
 </svg>`}
function pill(type,c,w){const r=D[type](c,w,{});return `<svg viewBox="${type==='sofa'?'20 90 360 250':'80 60 240 280'}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${r.d}</defs><rect x="-100" y="-100" width="600" height="600" fill="#E9ECEE"/>${r.b}</svg>`}
function slide(i){const scenes=[videoScene(),heroRoom(),bannerScene(),workshop()];return scenes[i%4]}
function workshop(){return `<svg viewBox="0 0 900 506" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="900" height="506" fill="#E7DDCD"/><rect y="360" width="900" height="146" fill="#B99B78"/><rect x="120" y="250" width="560" height="26" rx="6" fill="#8A6443"/><rect x="150" y="276" width="18" height="100" fill="#7A5638"/><rect x="630" y="276" width="18" height="100" fill="#7A5638"/>${[0,1,2,3,4].map(i=>`<rect x="${170+i*80}" y="${220-i*4}" width="200" height="22" rx="4" fill="${['#C99B6A','#B78657','#D4AE82','#A8794C','#C29063'][i]}" transform="rotate(${-3+i*1.5} ${270+i*80} 230)"/>`).join('')}<circle cx="760" cy="120" r="70" fill="#F4E6C8"/><rect x="40" y="60" width="180" height="120" rx="8" fill="#F3ECE0"/><path d="M60 160L110 100L150 140L200 90" stroke="#8FA9C4" stroke-width="6" fill="none"/></svg>`}
return {product,heroRoom,videoScene,bannerScene,pill,slide,mix}})();
