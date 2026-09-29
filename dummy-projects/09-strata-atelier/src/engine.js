/* ============================================================
   Strata 3D engine: procedural architecture in three.js
   createEngine(THREE, RoomEnvironment) -> engine API
   ============================================================ */
function createEngine(THREE, RoomEnvironment){
 const C=(h)=>new THREE.Color(h);
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),lerp=(a,b,t)=>a+(b-a)*t;
 const ss=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
 const easeOut=t=>1-Math.pow(1-t,3);

 /* ---------- renderer ---------- */
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.localClippingEnabled=true;
 const canvas=renderer.domElement;canvas.className='gl';
 const scene=new THREE.Scene();
 const pmrem=new THREE.PMREMGenerator(renderer);
 let env=null;try{env=pmrem.fromScene(new RoomEnvironment(renderer),0.04).texture;scene.environment=env}catch(e){}
 const camera=new THREE.PerspectiveCamera(32,1,0.5,900);
 scene.fog=new THREE.Fog(0xECE8E1,55,300);

 /* sky dome */
 const skyU={top:{value:C('#E4E0D8')},bot:{value:C('#F2EFE9')},hor:{value:C('#F2EFE9')}};
 const sky=new THREE.Mesh(new THREE.SphereGeometry(400,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:skyU,
  vertexShader:'varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'uniform vec3 top;uniform vec3 bot;uniform vec3 hor;varying vec3 vP;void main(){float h=vP.y;vec3 c=h>0.0?mix(hor,top,pow(clamp(h*1.6,0.0,1.0),0.7)):mix(hor,bot,clamp(-h*4.0,0.0,1.0));gl_FragColor=vec4(c,1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'}));
 scene.add(sky);

 /* lights */
 const hemi=new THREE.HemisphereLight(0xffffff,0xd8d2c6,0.9);scene.add(hemi);
 const sun=new THREE.DirectionalLight(0xffffff,2.6);sun.castShadow=true;
 sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-0.0004;sun.shadow.normalBias=0.03;
 Object.assign(sun.shadow.camera,{left:-34,right:34,top:34,bottom:-34,near:1,far:160});
 scene.add(sun);scene.add(sun.target);

 /* ---------- materials ---------- */
 const MODEL='#F3F1EC';
 const M={};const matList=[];
 function mat(name,real,opts={}){const o=Object.assign({rough:.85,metal:0,model:MODEL,stage:'structure',rm:.95},opts);
  const m=new THREE.MeshStandardMaterial({color:C(o.model),roughness:o.rm,metalness:0,flatShading:!!o.flat,side:o.side||THREE.FrontSide});
  m.userData={cr:C(real),cm:C(o.model),rr:o.rough,rm:o.rm,mr:o.metal,stage:o.stage,glass:!!o.glass,water:!!o.water};
  if(o.glass){m.transparent=true;m.depthWrite=false;m.opacity=.35;m.side=THREE.DoubleSide}
  M[name]=m;matList.push(m);return m}
 mat('concrete','#BDB8AF',{rough:.88});
 mat('concreteD','#8F8B84',{rough:.9});
 mat('slab','#D3CFC7',{rough:.85});
 mat('timber','#8A5B38',{rough:.72,stage:'envelope'});
 mat('timberD','#3B2F27',{rough:.8,stage:'envelope'});
 mat('brick','#9A5840',{rough:.92,stage:'envelope'});
 mat('render','#EEEBE5',{rough:.9,stage:'envelope'});
 mat('frame','#1D1D1D',{rough:.45,metal:.55,stage:'envelope'});
 mat('roof','#4A514D',{rough:.5,metal:.35,stage:'envelope'});
 mat('glass','#22303A',{rough:.04,metal:.2,stage:'glass',glass:true,model:'#DDE4E8',rm:.3});
 mat('deck','#A27B55',{rough:.75,stage:'landscape'});
 mat('lawn','#8C9A67',{rough:1,stage:'landscape'});
 mat('foliage','#6D7C4E',{rough:.95,stage:'landscape',flat:true});
 mat('foliage2','#56663F',{rough:.95,stage:'landscape',flat:true});
 mat('trunk','#5A4A3D',{rough:.9,stage:'landscape'});
 mat('rock','#9C978E',{rough:.95,stage:'site',flat:true});
 mat('stone','#B7AE9F',{rough:.95,stage:'site'});
 mat('sand','#CFC4AE',{rough:1,stage:'site',model:'#EAE6DE'});
 mat('water','#3C8C9E',{rough:.06,metal:.1,stage:'landscape',water:true,model:'#E4EAEC',rm:.4});
 mat('fabric','#C9BBA6',{rough:1,stage:'envelope'});
 mat('ground','#D3CCBF',{rough:1,stage:'site',model:'#EAE6DF'});
 const glowMat=new THREE.MeshBasicMaterial({color:new THREE.Color(2.4,1.45,.72),transparent:true,opacity:0,depthWrite:false});
 const poolGlow=new THREE.MeshBasicMaterial({color:new THREE.Color(.12,.95,1.35),transparent:true,opacity:0,depthWrite:false});
 const lineMat=new THREE.LineBasicMaterial({color:0x151515,transparent:true,opacity:.9});
 const contourMat=new THREE.LineBasicMaterial({color:0x151515,transparent:true,opacity:.0});
 const clipPlane=new THREE.Plane(new THREE.Vector3(0,-1,0),999);
 [...matList,glowMat,poolGlow,lineMat].forEach(m=>{m.clippingPlanes=[clipPlane]});

 /* distant hills (horizon) */
 const hillMat=new THREE.MeshStandardMaterial({color:C('#CFC8BC'),roughness:1,flatShading:true});
 const hills=new THREE.Group();for(let i=0;i<22;i++){const a=i/22*Math.PI*2+.3;const r=250+((i*53)%70);const g=new THREE.IcosahedronGeometry(40+((i*29)%35),1);g.scale(1.9,.22+((i*7)%5)*.05,1.2);const m=new THREE.Mesh(g,hillMat);m.position.set(Math.cos(a)*r,-6,Math.sin(a)*r);m.rotation.y=-a;hills.add(m)}scene.add(hills);
 const gdisc=new THREE.Mesh(new THREE.CircleGeometry(420,48),hillMat);gdisc.rotation.x=-Math.PI/2;gdisc.position.y=-1.3;gdisc.receiveShadow=false;scene.add(gdisc);matList.push(hillMat);hillMat.userData={cr:C('#CFC8BC'),cm:C('#E8E4DC'),rr:1,rm:1,mr:0,stage:'site',env:.5};
 /* glow sprite texture */
 const gtex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,200,130,.9)');r.addColorStop(.35,'rgba(255,170,90,.35)');r.addColorStop(1,'rgba(255,150,70,0)');g.fillStyle=r;g.fillRect(0,0,128,128);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
 const spriteMat=new THREE.SpriteMaterial({map:gtex,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,fog:false});

 /* ---------- model builder ---------- */
 function Builder(){
  const root=new THREE.Group(),parts=[],edges=[],sprites=[],hot=[];let order=0;
  const lines=new THREE.Group();root.add(lines);
  function add(geo,m,{x=0,y=0,z=0,ry=0,level=0,stage,kind='rise',edge=true,cast=true,recv=true,delay}={}){
   const mesh=new THREE.Mesh(geo,m);mesh.position.set(x,y,z);mesh.rotation.y=ry;mesh.castShadow=cast&&!m.userData?.glass;mesh.receiveShadow=recv;
   const st=stage||m.userData?.stage||'structure';
   const p={mesh,stage:st,kind,level,base:new THREE.Vector3(x,y,z),delay:delay??(order++%23)/23,edge:null};
   if(edge&&!(m===glowMat||m===poolGlow)){const eg=new THREE.EdgesGeometry(geo,25);const l=new THREE.LineSegments(eg,lineMat);l.position.copy(mesh.position);l.rotation.copy(mesh.rotation);l.userData.n=eg.attributes.position.count;lines.add(l);p.edge=l;edges.push(p)}
   root.add(mesh);parts.push(p);return p}
  /* axis-aligned box from min/max, base anchored for rise */
  function box(x0,y0,z0,x1,y1,z1,m,o={}){const w=x1-x0,h=y1-y0,d=z1-z0;const g=new THREE.BoxGeometry(w,h,d);g.translate(0,h/2,0);return add(g,m,Object.assign({x:(x0+x1)/2,y:y0,z:(z0+z1)/2},o))}
  function glow(x0,y0,z0,x1,y1,z1,o={}){const p=box(x0,y0,z0,x1,y1,z1,glowMat,Object.assign({edge:false,cast:false,recv:false,stage:'glass'},o));p.mesh.renderOrder=3;
   const s=new THREE.Sprite(spriteMat);const w=Math.max(x1-x0,z1-z0);s.scale.set(w*1.5,(y1-y0)*2.6,1);s.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);s.userData.level=o.level||0;s.userData.base=s.position.clone();root.add(s);sprites.push(s);return p}
  function panel(x0,y0,z0,x1,y1,z1,o={}){const oo=Object.assign({},o);delete oo.lit;const p=box(x0,y0,z0,x1,y1,z1,glowMat,Object.assign({edge:false,cast:false,recv:false,stage:'glass'},oo));p.mesh.renderOrder=3;
   const s=new THREE.Sprite(spriteMat);s.scale.set(Math.max(x1-x0,z1-z0)*1.25,(y1-y0)*2.2,1);s.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);s.renderOrder=4;s.userData.level=o.level||0;s.userData.base=s.position.clone();root.add(s);sprites.push(s);return p}
  /* glazing with mullions along x (face z) or along z (face x) */
  function glazeX(x0,x1,y0,y1,z,step=1.6,o={}){box(x0,y0,z-.03,x1,y1,z+.03,M.glass,Object.assign({edge:false},o));if(o.lit){const zi=z-o.lit*.1;panel(x0+.1,y0+.1,zi-.01,x1-.1,y1-.12,zi+.01,o)}const n=Math.max(1,Math.round((x1-x0)/step));for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n;box(x-.05,y0,z-.06,x+.05,y1,z+.06,M.frame,o)}box(x0,y1-.08,z-.06,x1,y1,z+.06,M.frame,o);box(x0,y0,z-.06,x1,y0+.08,z+.06,M.frame,o)}
  function glazeZ(z0,z1,y0,y1,x,step=1.6,o={}){box(x-.03,y0,z0,x+.03,y1,z1,M.glass,Object.assign({edge:false},o));if(o.lit){const xi=x-o.lit*.1;panel(xi-.01,y0+.1,z0+.1,xi+.01,y1-.12,z1-.1,o)}const n=Math.max(1,Math.round((z1-z0)/step));for(let i=0;i<=n;i++){const z=z0+(z1-z0)*i/n;box(x-.06,y0,z-.05,x+.06,y1,z+.05,M.frame,o)}box(x-.06,y1-.08,z0,x+.06,y1,z1,M.frame,o)}
  /* vertical slats (timber screen) along x at face z */
  function slatsX(x0,x1,y0,y1,z,gap=.22,m=M.timber,o={}){const n=Math.floor((x1-x0)/gap);const g=new THREE.BoxGeometry(.07,y1-y0,.12);g.translate(0,(y1-y0)/2,0);const im=new THREE.InstancedMesh(g,m,n);const d=new THREE.Object3D();for(let i=0;i<n;i++){d.position.set(x0+gap*(i+.5),0,0);d.updateMatrix();im.setMatrixAt(i,d.matrix)}im.castShadow=true;im.receiveShadow=true;im.position.set(0,y0,z);root.add(im);parts.push({mesh:im,stage:o.stage||m.userData.stage,kind:'rise',level:o.level||0,base:new THREE.Vector3(0,y0,z),delay:o.delay??.5,edge:null});}
  function tree(x,z,s=1,v=0,o={}){const y0=o.y||0;const oo=Object.assign({},o);delete oo.y;const h=2.2*s;box(x-.09*s,y0,z-.09*s,x+.09*s,y0+h,z+.09*s,M.trunk,Object.assign({kind:'grow',edge:false},oo));const g=new THREE.IcosahedronGeometry(1.6*s,1);g.translate(0,1.1*s,0);const f=add(g,v?M.foliage2:M.foliage,Object.assign({x,y:y0+h-.5*s,z,kind:'grow'},oo));
   const g2=new THREE.IcosahedronGeometry(1.05*s,1);g2.translate(0,.6*s,0);add(g2,v?M.foliage:M.foliage2,Object.assign({x:x+.8*s,y:y0+h+.3*s,z:z-.4*s,kind:'grow'},oo));return f}
  function rock(x,z,s=1){const g=new THREE.DodecahedronGeometry(s,0);g.scale(1,.55,.8);g.rotateY(x*.7);add(g,M.rock,{x,y:0,z,kind:'grow',stage:'site'})}
  function gable(x,z,w,len,wallH,ridge,m,ry=0,o={}){ // extruded house profile along z
   const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,wallH);s.lineTo(0,ridge);s.lineTo(-w/2,wallH);s.lineTo(-w/2,0);
   const g=new THREE.ExtrudeGeometry(s,{depth:len,bevelEnabled:false});g.translate(0,0,-len/2);return add(g,m,Object.assign({x,y:0,z,ry},o))}
  function roofGable(x,z,w,len,wallH,ridge,m,ry=0,o={}){const half=w/2+.35,rise=ridge-wallH,sl=Math.hypot(half,rise+.25),ang=Math.atan2(rise,w/2);const grp=[];
   for(const sd of[-1,1]){const g=new THREE.BoxGeometry(sl,.14,len+.6);g.translate(0,0,0);const mesh=new THREE.Mesh(g,m);const p=add(g,m,Object.assign({x,y:0,z,ry},o));
    const pv=new THREE.Vector3(sd*(w/4+.08),(wallH+ridge)/2+.12,0).applyAxisAngle(new THREE.Vector3(0,1,0),ry);p.mesh.position.set(x+pv.x,pv.y,z+pv.z);p.mesh.rotation.set(0,ry,0);p.mesh.rotateZ(-sd*ang);p.base.copy(p.mesh.position);p.kind='drop';if(p.edge){p.edge.position.copy(p.mesh.position);p.edge.rotation.copy(p.mesh.rotation)}grp.push(p)}return grp}
  function contours(cx,cz,n=7,r0=10,seed=1){const g=new THREE.Group();for(let k=0;k<n;k++){const pts=[];const r=r0+k*4.2;for(let i=0;i<=72;i++){const a=i/72*Math.PI*2;const rr=r*(1+.13*Math.sin(a*3+seed+k*.6)+.07*Math.sin(a*5-k));pts.push(new THREE.Vector3(cx+Math.cos(a)*rr,.02,cz+Math.sin(a)*rr*.78))}const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),contourMat);g.add(l)}root.add(g);return g}
  return {root,parts,edges,sprites,hot,add,box,glow,panel,glazeX,glazeZ,slatsX,tree,rock,gable,roofGable,contours}
 }

 /* ---------- models ---------- */
 const MODELS={};
 /* 1. Cliff House: parametric (used by the Lab too) */
 MODELS.cliff=(P={})=>{P=Object.assign({floors:2,cant:5,facade:'timber',glaze:.7,roofGarden:false,pool:true},P);const b=Builder();
  const fac={timber:M.timber,concrete:M.concreteD,brick:M.brick,render:M.render}[P.facade]||M.timber;
  // site
  b.box(-22,-1.2,-14,22,0,16,M.ground,{edge:false,stage:'site',delay:0});b.box(-22,-2.4,16,22,-1.2,24,M.stone,{stage:'site',delay:.1});b.box(-22,-3.6,24,22,-2.4,30,M.sand,{stage:'site',delay:.2,edge:false});
  for(let i=0;i<5;i++)b.box(-2+i*.0,-1.2-i*.24,16+i*.5,2,-1.2-i*.24+.24,16.5+i*.5,M.stone,{stage:'site'});
  b.box(-10,0,-3.6,6,.3,4.2,M.slab,{level:0,delay:.05}); // podium slab
  // ground floor
  const gH=3.4,gx0=-9,gx1=5;
  b.box(gx0,.3,-3.2,gx0+5.5,gH,3.2,M.concrete,{level:0}); // core
  b.box(gx0,.3,-3.2,gx1,gH,-2.9,M.concrete,{level:0}); // back wall
  const gl0=gx0+5.5,glw=(gx1-gl0);const glz=gl0+glw*(1-P.glaze);
  if(glz>gl0+.2)b.box(gl0,.3,2.9,glz,gH,3.2,M.concrete,{level:0});
  b.glazeX(glz,gx1,.3,gH,3.05,1.6,{level:0});b.glazeZ(-2.9,2.9,.3,gH,gx1,1.45,{level:0});
  b.glow(gl0+.3,.35,-2.6,gx1-.4,gH-.3,2.4,{level:0});
  b.box(gx0-.4,gH,-3.6,gx1+.5,gH+.35,3.8,M.slab,{level:0});
  b.hot.push({p:[gx1-1,1.8,3.2],t:'Floor-to-ceiling glazing',n:'01'});
  // upper floors
  let y=gH+.35;const len=12+P.cant;
  for(let f=1;f<P.floors;f++){const odd=f%2===1;const h=3.1;
   if(odd){const x0=-7,x1=-7+len;b.box(x0,y,-2.4,x1,y+h,2.4,fac,{level:f});
    if(P.facade==='timber'){b.slatsX(x0,x1,y+.15,y+h-.15,2.47,.24,M.timber,{level:f,delay:.3});b.slatsX(x0,x1,y+.15,y+h-.15,-2.47,.24,M.timber,{level:f,delay:.3})}
    b.glazeX(x0+len*.35,x1-.4,y+.5,y+h-.4,2.56,1.8,{level:f,lit:1});b.glow(x0+len*.35,y+.55,-1.8,x1-.6,y+h-.5,2.2,{level:f});
    b.box(x0-.3,y+h,-2.7,x1+.3,y+h+.3,2.7,M.slab,{level:f});
    if(P.cant>0)b.hot.push({p:[x1-1,y+h*.6,2.5],t:`${P.cant.toFixed(1)} m cantilever`,n:'02'});
   }else{const x0=-9,x1=1;b.box(x0,y,-3,x1,y+h,3,M.concrete,{level:f});b.glazeX(x0+2,x1-.5,y+.4,y+h-.4,3.14,1.6,{level:f,lit:1});b.glow(x0+2,y+.5,-2.4,x1-.8,y+h-.5,2.6,{level:f});b.box(x0-.3,y+h,-3.3,x1+.3,y+h+.3,3.3,M.slab,{level:f})}
   y+=h+.3}
  if(P.roofGarden){b.box(-6,y,-2,2,y+.35,2,M.lawn,{level:P.floors,stage:'landscape'});b.tree(-3,0,.55,1,{y:y+.35,level:P.floors});}
  // pool + deck
  if(P.pool){b.box(6,-.3,5.8,16,.1,8.8,M.water,{edge:false});b.box(6.1,.1,5.9,15.9,.11,8.7,poolGlow,{edge:false,cast:false,stage:'glass'});
   b.box(5.8,0,5.6,16.2,.2,5.8,M.stone);b.box(5.8,0,8.8,16.2,.2,9,M.stone);b.box(5.8,0,5.6,6,.2,9,M.stone);b.box(16,0,5.6,16.2,.2,9,M.stone);b.hot.push({p:[11,.3,7.3],t:'10 m lap pool',n:'03'})}
  b.box(-12,0,4.2,17,.16,5.6,M.deck,{stage:'landscape',edge:false});
  // landscape
  [[-15,-8,1.2,0],[-17,2,1,1],[-13,10,.9,0],[14,-7,1.3,1],[19,2,1,0],[-4,-10,1.1,1],[9,-11,.9,0],[20,12,.8,1]].forEach(t=>b.tree(t[0],t[1],t[2],t[3]));
  [[-19,13,1.4],[17,14,1.1],[-8,14,.8],[3,13.5,.7],[21,-3,1]].forEach(r=>b.rock(r[0],r[1],r[2]));
  b.contours(0,0,8,16,1.3);
  b.meta={center:[1,3,1],radius:26,name:'Flinders Cliff House'};return b};

 /* 2. Dune houses: gabled timber cabins */
 MODELS.cabins=()=>{const b=Builder();
  b.box(-26,-1,-18,26,0,18,M.sand,{edge:false,stage:'site',delay:0});
  [[-20,-10,5],[18,-12,6],[-14,12,4],[22,10,5],[0,-16,4]].forEach((d,i)=>{const g=new THREE.SphereGeometry(d[2],16,10);g.scale(1.6,.35,1);b.add(g,M.sand,{x:d[0],y:0,z:d[1],kind:'grow',edge:false,stage:'site'})});
  const cab=[[-8,0,0,6,11,3,5.4],[1.5,-1.5,.22,5,9,2.8,5],[10,1,-.18,5.4,8,2.9,5.2]];
  cab.forEach(([x,z,ry,w,len,wh,rg],i)=>{b.box(x-w/2-.3,0,z-len/2-.3,x+w/2+.3,.35,z+len/2+.3,M.concreteD,{level:0,ry});
   b.gable(x,z,w,len,wh,rg,M.timberD,ry,{level:0,y:.35});const parts=b.roofGable(x,z,w,len,wh+.35,rg+.35,M.roof,ry,{level:1});
   const s=new THREE.Shape();s.moveTo(-w/2+.3,.1);s.lineTo(w/2-.3,.1);s.lineTo(w/2-.3,wh-.1);s.lineTo(0,rg-.35);s.lineTo(-w/2+.3,wh-.1);s.lineTo(-w/2+.3,.1);
   const gg=new THREE.ShapeGeometry(s);const pv=new THREE.Vector3(0,0,len/2+.1).applyAxisAngle(new THREE.Vector3(0,1,0),ry);b.add(gg,M.glass,{x:x+pv.x,y:.35,z:z+pv.z,ry,edge:false,level:0});
   const pg=new THREE.ShapeGeometry(s);pg.scale(.94,.94,1);const pv2=new THREE.Vector3(0,0,len/2+.04).applyAxisAngle(new THREE.Vector3(0,1,0),ry);const gp=b.add(pg,glowMat,{x:x+pv2.x,y:.45,z:z+pv2.z,ry,edge:false,level:0,stage:'glass',cast:false,recv:false});gp.mesh.renderOrder=3;
   const sp=new THREE.Sprite(spriteMat);sp.scale.set(w*1.3,rg*1.4,1);sp.position.set(x+pv2.x,rg*.45,z+pv2.z);sp.renderOrder=4;sp.userData.level=0;sp.userData.base=sp.position.clone();b.root.add(sp);b.sprites.push(sp);
   b.glow(x-w/2+.6,.5,z-len/2+1,x+w/2-.6,wh,z+len/2-.8,{level:0,ry});});
  b.box(-12,0,5.2,14,.25,6.6,M.deck,{stage:'landscape'});b.box(-1,0,6.6,.6,.25,16,M.deck,{stage:'landscape'});
  // grass tufts
  const tg=new THREE.ConeGeometry(.18,1,4);tg.translate(0,.5,0);const im=new THREE.InstancedMesh(tg,M.foliage,260);const d=new THREE.Object3D();let k=0;for(let i=0;i<260;i++){const a=i*2.39,r=9+((i*37)%100)/100*17;const x=Math.cos(a)*r*1.2,z=Math.sin(a)*r*.7;d.position.set(x,0,z);const s=.6+((i*13)%10)/10;d.scale.set(s,s*1.3,s);d.rotation.z=((i%7)-3)*.08;d.updateMatrix();im.setMatrixAt(k++,d.matrix)}b.root.add(im);b.parts.push({mesh:im,stage:'landscape',kind:'grow',level:0,base:new THREE.Vector3(),delay:.4});
  b.hot.push({p:[-8,2.2,5.6],t:'Glazed gable to the sea',n:'01'},{p:[1.5,4.6,-1.5],t:'Standing-seam roof',n:'02'},{p:[4,.4,6],t:'Boardwalk to the water',n:'03'});
  b.contours(0,0,7,20,2.1);b.meta={center:[1,2,0],radius:28,name:'Hardanger Fjord Cabins'};return b};

 /* 3. Tower: multi-residential */
 MODELS.tower=()=>{const b=Builder();const F=7,fh=3.2,W=9,D=6;
  b.box(-24,-1,-18,24,0,18,M.ground,{edge:false,stage:'site',delay:0});
  for(let f=0;f<F;f++){const y=f*fh;const L=f;
   b.box(-W,y,-D,W,y+.3,D,M.slab,{level:L});
   if(f===0){b.glazeX(-W+.4,W-.4,.3,fh,D-.2,2.2,{level:L});b.glazeX(-W+.4,W-.4,.3,fh,-D+.2,2.2,{level:L});b.glow(-W+.8,.4,-D+.8,W-.8,fh-.2,D-.8,{level:L})}
   else{b.glazeX(-W+.6,W-.6,y+.3,y+fh,D-.8,1.8,{level:L});b.glazeX(-W+.6,W-.6,y+.3,y+fh,-D+.8,1.8,{level:L});b.glazeZ(-D+.8,D-.8,y+.3,y+fh,W-.6,1.8,{level:L});b.glazeZ(-D+.8,D-.8,y+.3,y+fh,-W+.6,1.8,{level:L});
    b.glow(-W+1,y+.4,-D+1.1,W-1,y+fh-.3,D-1.1,{level:L});
    const side=f%2?1:-1;for(let bx=-W+1;bx<W-1;bx+=4.5){b.box(bx,y,side>0?D:-D-1.6,bx+3.4,y+.25,side>0?D+1.6:-D,M.slab,{level:L});b.box(bx,y+.25,side>0?D+1.52:-D-1.6,bx+3.4,y+1.25,side>0?D+1.6:-D-1.52,M.glass,{level:L,edge:false})}}
   for(const px of[-W,-W/2,0,W/2,W])for(const pz of[-D,D])b.box(px-.35,y+.3,pz-.35,px+.35,y+fh,pz+.35,M.brick,{level:L})}
  const top=F*fh;b.box(-W-.3,top,-D-.3,W+.3,top+.4,D+.3,M.slab,{level:F});b.box(-W+.5,top+.4,-D+.5,W-.5,top+.8,D-.5,M.lawn,{level:F,stage:'landscape'});
  [[-5,-2],[4,2],[6,-3]].forEach(([x,z],i)=>b.tree(x,z,.55,i%2,{level:F,y:top+.8}));
  [[-16,-9,1.2],[16,-10,1],[-17,9,1.1],[17,10,1.3],[-12,13,.9]].forEach(t=>b.tree(t[0],t[1],t[2],1));
  b.hot.push({p:[W,fh*3.5,D+1.6],t:'Deep winter balconies',n:'01'},{p:[W,fh*5,D],t:'Recycled brick piers',n:'02'},{p:[0,top+1.2,0],t:'Shared roof garden',n:'03'});
  b.contours(0,0,7,16,.4);b.meta={center:[0,10,0],radius:34,name:'Nørrebro Lofts'};return b};

 /* 4. Courtyard house */
 MODELS.courtyard=()=>{const b=Builder();const h=3.6;
  b.box(-22,-1,-16,22,0,16,M.ground,{edge:false,stage:'site',delay:0});
  b.box(-11,0,-8,11,.25,8,M.stone,{level:0});
  b.box(-11,.25,-8,11,h,-7.5,M.brick,{level:0});b.box(-11,.25,-8,-10.5,h,8,M.brick,{level:0});b.box(10.5,.25,-8,11,h,8,M.brick,{level:0});
  b.box(-11,.25,7.5,-3,h,8,M.brick,{level:0});b.box(3,.25,7.5,11,h,8,M.brick,{level:0});b.box(-3,2.6,7.5,3,h,8,M.brick,{level:0});
  // wings
  b.box(-10.5,.25,-7.5,-3,h,-2,M.render,{level:0});b.box(-10.5,h,-8,-2.6,h+.3,-1.6,M.slab,{level:1});
  b.box(3,.25,-7.5,10.5,h,7.5,M.render,{level:0});b.box(2.6,h,-8,11,h+.3,8,M.slab,{level:1});
  b.box(3.2,h+.3,-6,10,h+3.3,1,M.brick,{level:1});b.glazeX(3.6,9.6,h+.6,h+3,1.14,1.5,{level:1,lit:1});b.glow(3.8,h+.7,-5,9.4,h+3,.6,{level:1});b.box(3,h+3.3,-6.3,10.3,h+3.6,1.3,M.slab,{level:2});
  b.glazeZ(-7,7,.25,h-.1,2.85,1.6,{level:0,lit:-1});b.glazeX(-10.2,-3.2,.25,h-.1,-1.85,1.4,{level:0,lit:1});b.glow(3.3,.3,-6.8,10,h-.2,7,{level:0});b.glow(-10,.3,-7,-3.4,h-.2,-2.4,{level:0});
  b.box(-9,.25,-1,1.8,.35,6.5,M.deck,{stage:'landscape',edge:false});b.box(-10.5,.25,.5,-6,.5,6.8,M.lawn,{stage:'landscape'});
  b.tree(-4,2.5,1.05,0);b.tree(-8.5,4.5,.6,1);
  [[-17,-9,1.1],[16,-11,1.2],[-16,10,.9],[17,11,1]].forEach(t=>b.tree(t[0],t[1],t[2],t[3]?1:0));
  b.hot.push({p:[-4,5,2.5],t:'A tree at the centre',n:'01'},{p:[3,2,4],t:'Sliding glass to the court',n:'02'},{p:[-11,2,6],t:'Reclaimed brick envelope',n:'03'});
  b.contours(0,0,6,15,3);b.meta={center:[0,2.4,0],radius:27,name:'Fitzroy Courtyard House'};return b};

 /* 5. Pavilion café (interior) */
 MODELS.pavilion=()=>{const b=Builder();const h=4.2;
  b.box(-22,-1,-16,22,0,16,M.ground,{edge:false,stage:'site',delay:0});
  b.box(-12,0,-7,12,.4,7,M.concrete,{level:0});
  for(let x=-11;x<=11;x+=5.5)for(const z of[-6.3,6.3])b.box(x-.12,.4,z-.12,x+.12,h,z+.12,M.frame,{level:0});
  b.glazeX(-11.4,11.4,.4,h-.1,6.1,2.2,{level:0});b.glazeZ(-6,6,.4,h-.1,11.3,2,{level:0});b.box(-11.6,.4,-6.4,11.6,h,-6,M.render,{level:0});b.box(-11.6,.4,-6.4,-11.2,h,6.2,M.render,{level:0});
  b.box(-13.5,h,-8.5,13.5,h+.35,-3,M.slab,{level:1});b.box(-13.5,h,3,13.5,h+.35,8.5,M.slab,{level:1});b.box(-13.5,h,-3,-5,h+.35,3,M.slab,{level:1});b.box(5,h,-3,13.5,h+.35,3,M.slab,{level:1});
  for(let x=-4.5;x<=4.5;x+=1.5)b.box(x-.06,h+.1,-3,x+.06,h+.3,3,M.timber,{level:1,edge:false});
  // interior
  b.box(-9,.4,-5,1,1.5,-3.8,M.timber,{level:0,stage:'envelope'});b.box(-9,1.5,-5.1,1,1.6,-3.7,M.concreteD,{level:0,stage:'envelope'});
  for(const [x,z] of [[-8,2],[-4,3],[0,1.5],[4,3.5],[7.5,1],[5,-2.5],[8.5,-3]]){const g=new THREE.CylinderGeometry(.55,.55,.06,24);g.translate(0,1.02,0);b.add(g,M.timber,{x,y:.4,z,level:0,stage:'envelope'});b.box(x-.05,.4,z-.05,x+.05,1.02,z+.05,M.frame,{level:0,edge:false});
   for(const a of[0,2.1,4.2]){const g2=new THREE.CylinderGeometry(.2,.2,.45,12);g2.translate(0,.45,0);b.add(g2,M.fabric,{x:x+Math.cos(a)*.9,y:.4,z:z+Math.sin(a)*.9,level:0,edge:false})}
   const lg=new THREE.SphereGeometry(.22,12,8);b.add(lg,glowMat,{x,y:2.9,z,edge:false,cast:false,stage:'glass'})}
  b.glow(-10.8,.5,-5.8,10.8,h-.3,5.6,{level:0});
  [[-9,-4.5],[9.5,4.5],[-10,4.6]].forEach(([x,z])=>{b.box(x-.5,.4,z-.5,x+.5,1.1,z+.5,M.concreteD,{level:0});b.tree(x,z,.45,1,{level:0,y:1.1})});
  [[-17,-9,1.2],[16,-11,1.1],[-17,10,1],[18,9,1.3]].forEach(t=>b.tree(t[0],t[1],t[2],0));
  b.hot.push({p:[-4,1.6,-4.4],t:'Terrazzo & oak bar',n:'01'},{p:[0,h,6.2],t:'Slim steel frame',n:'02'},{p:[4,2.9,3.5],t:'Hand-blown pendants',n:'03'});
  b.contours(0,0,6,15,4);b.meta={center:[0,1.8,0],radius:25,name:'Kiln Café'};return b};

 /* 6. Hillside terraces */
 MODELS.terrace=()=>{const b=Builder();
  const tY=z=>{if(z>=10)return 1.2;for(let i=0;i<5;i++){const z0=10-(i+1)*6.4;if(z>=z0)return 1.2+i*2.2}return 10};
  b.box(-24,-1,10,24,1.2,22,M.ground,{edge:false,stage:'site',delay:0});
  for(let i=0;i<5;i++){const z0=10-(i+1)*6.4;b.box(-24,-1,z0,24,1.2+i*2.2,z0+6.4,M.stone,{stage:'site',delay:i*.1})}
  const T=[[-8,6,1.2,16,6],[-3,.2,3.4,14,5.4],[2,-5.8,5.6,12,5]];
  T.forEach(([x,z,y,w,d],L)=>{b.box(x-w/2,y,z-d/2,x+w/2,y+3,z+d/2,M.render,{level:L});b.glazeX(x-w/2+.5,x+w/2-.5,y+.1,y+2.9,z+d/2+.14,1.8,{level:L,lit:1});b.glow(x-w/2+.8,y+.2,z-d/2+.6,x+w/2-.8,y+2.7,z+d/2-.3,{level:L});
   b.box(x-w/2-.3,y+3,z-d/2-.3,x+w/2+.3,y+3.3,z+d/2+.3,M.slab,{level:L});b.box(x-w/2+.2,y+3.3,z-d/2+.2,x+w/2-.2,y+3.6,z+d/2-.2,M.lawn,{level:L,stage:'landscape'});
   b.box(x-w/2,y,z+d/2,x+w/2,y+.2,z+d/2+2.2,M.deck,{level:L,stage:'landscape',edge:false})});
  for(let L=0;L<3;L++){const zw=3.6-6.4*L,yl=1.2+2.2*L;for(let k=0;k<5;k++)b.box(9,yl,zw+(4-k)*.64,11.2,yl+(k+1)*.44,zw+(5-k)*.64,M.stone,{delay:.2+k*.05})}
  [[-19,8,1.2],[16,6,1.1],[-17,-8,1],[19,-9,1.3],[13,13,.8],[-13,14,.9],[-20,-16,1.1],[15,-17,1]].forEach((t,i)=>{b.tree(t[0],t[1],t[2],i%2,{y:tY(t[1])})});
  b.hot.push({p:[-8,4.8,6],t:'Planted roofs step with the hill',n:'01'},{p:[2,9,-5.8],t:'Every level has a garden',n:'02'},{p:[10,3.4,3],t:'Stone stair spine',n:'03'});
  b.meta={center:[0,4.5,0],radius:30,name:'Byron Hill Terraces'};return b};

 /* ---------- state ---------- */
 const S={model:null,key:'',group:null,mount:null,real:1,edges:.12,draw:1,time:13,glowOn:null,cut:null,explode:0,
  show:{site:1,structure:1,envelope:1,glass:1,landscape:1},stageReal:null,
  cam:{mode:'orbit',theta:.75,phi:1.1,r:40,tgt:new THREE.Vector3(),vt:0,vp:0,auto:true,path:null},par:{x:0,y:0,tx:0,ty:0},
  dirty:true,running:false,onFrame:null,yaw:0,spin:0,contour:0,w:1,h:1};
 const tmpV=new THREE.Vector3();

 function load(key,params){
  if(S.group){scene.remove(S.group.root);S.group.root.traverse(o=>{if(o.geometry&&o.geometry!==undefined)o.geometry.dispose?.()})}
  const b=MODELS[key](params);S.group=b;S.key=key;scene.add(b.root);
  const bb=new THREE.Box3();b.parts.forEach(p=>{if(p.stage!=='site'&&p.stage!=='landscape'&&p.mesh.isMesh&&!p.mesh.isInstancedMesh){p.mesh.updateMatrixWorld(true);bb.expandByObject(p.mesh)}});b.meta.top=bb.max.y;b.meta.bottom=Math.max(0,bb.min.y);
  const c=b.meta.center;S.cam.tgt.set(c[0],c[1],c[2]);S.cam.r=b.meta.radius*1.55;
  sun.target.position.set(c[0],0,c[2]);
  apply();S.dirty=true;return b}

 function apply(){const b=S.group;if(!b)return;
  // materials realness per stage
  matList.forEach(m=>{const u=m.userData;const r=S.stageReal?(S.stageReal[u.stage]??S.real):S.real;
   m.color.lerpColors(u.cm,u.cr,r);if(u.stage==='site'&&S._dusk)m.color.multiplyScalar(1-S._dusk*.42*r);m.roughness=lerp(u.rm,u.rr,r);m.metalness=lerp(0,u.mr,r);
   if(u.glass){m.opacity=lerp(.3,.62,r)}u.env=lerp(.3,.75,r)});
  // parts: show + explode
  const ex=S.explode*3.4;
  b.parts.forEach(p=>{const sh=S.show[p.stage]??1;const t=easeOut(clamp((sh-p.delay*.55)/.45,0,1));const m=p.mesh;
   m.visible=t>.001;
   if(p.kind==='grow'){m.scale.setScalar(Math.max(t,.001))}
   else if(p.kind==='drop'){m.scale.set(1,1,1);m.position.y=p.base.y+(1-t)*6}
   else m.scale.set(1,Math.max(t,.001),1);
   if(p.kind!=='drop')m.position.y=p.base.y+p.level*ex;else m.position.y+=p.level*ex;
   if(p.edge){p.edge.position.y=p.base.y+p.level*ex;const n=p.edge.userData.n;p.edge.geometry.setDrawRange(0,Math.floor(n*clamp(S.draw*1.15-p.delay*.15,0,1)/2)*2)}});
  b.sprites.forEach(s=>{s.position.y=s.userData.base.y+s.userData.level*ex});
  lineMat.opacity=S.edges;lineMat.visible=S.edges>.01;
  contourMat.opacity=S.contour;
  clipPlane.constant=S.cut==null?999:S.cut;
  setTime(S.time);S.dirty=true}

 const DAY={top:C('#DAD6CE'),hor:C('#F1EEE8'),bot:C('#ECE8E1'),fog:C('#ECE8E1')},GOLD={top:C('#B9B2B0'),hor:C('#F2C79B'),bot:C('#E2CDB5'),fog:C('#E8CFB3')},DUSK={top:C('#0E1422'),hor:C('#5B4C5C'),bot:C('#252630'),fog:C('#34313C')};
 const tc=C('#fff');
 function setTime(h){S.time=h;const r=S.stageReal?Math.max(S.stageReal.glass??S.real,0):S.real;
  const el=Math.max(.04,Math.sin(Math.PI*clamp((h-6)/15.2,0,1)))*1.05;const az=lerp(-1.9,1.9,clamp((h-6)/15,0,1));
  const R=60;sun.position.set(S.cam.tgt.x+Math.sin(az)*R*Math.cos(el),R*Math.sin(el)+2,S.cam.tgt.z+Math.cos(az)*R*Math.cos(el)*.8+14);
  const gold=ss(15.5,18.2,h)*(1-ss(19.2,20.6,h));const dusk=ss(18.6,20.6,h)*r;const dawn=(1-ss(6,7.6,h))*.7*r;const d=Math.max(dusk,dawn);if(Math.abs((S._dusk||0)-d)>.01){S._dusk=d;apply()}
  const gw=gold*r;
  skyU.top.value.copy(DAY.top).lerp(GOLD.top,gw).lerp(DUSK.top,d);skyU.hor.value.copy(DAY.hor).lerp(GOLD.hor,gw).lerp(DUSK.hor,d);skyU.bot.value.copy(DAY.bot).lerp(GOLD.bot,gw).lerp(DUSK.bot,d);
  scene.fog.color.copy(DAY.fog).lerp(GOLD.fog,gw).lerp(DUSK.fog,d);
  sun.color.setRGB(1,lerp(.98,.7,gw),lerp(.94,.48,gw));sun.intensity=lerp(2.05,1.7,gw)*(1-d*.9);
  hemi.intensity=lerp(.5,.42,gw)*(1-d*.5);matList.forEach(m=>{m.envMapIntensity=(m.userData.env??.7)*(1-d*.97)});hemi.color.setRGB(lerp(1,.55,d),lerp(1,.6,d),lerp(1,.8,d));hemi.groundColor.setRGB(lerp(.85,.18,d),lerp(.82,.17,d),lerp(.78,.2,d));
  const glow=S.glowOn==null?Math.max(d,gw*.25):S.glowOn;const gv=glow*r;
  glowMat.opacity=gv*.9;M.glass.opacity=lerp(.3,.62,S.stageReal?S.stageReal.glass??S.real:S.real)*(1-gv*.35);poolGlow.opacity=gv*.85;spriteMat.opacity=gv*.85;
  renderer.toneMappingExposure=lerp(.92,1.2,d);S.dirty=true}

 /* ---------- camera ---------- */
 function camFromOrbit(){const c=S.cam;const sp=Math.sin(c.phi);camera.position.set(c.tgt.x+c.r*sp*Math.sin(c.theta),c.tgt.y+c.r*Math.cos(c.phi),c.tgt.z+c.r*sp*Math.cos(c.theta));camera.lookAt(c.tgt)}
 function setPath(pos,tgt,fov){S.cam.mode='path';camera.position.copy(pos);camera.lookAt(tgt);if(fov&&camera.fov!==fov){camera.fov=fov;camera.updateProjectionMatrix()}S.cam.pathTgt=tgt.clone();S.dirty=true}
 function orbit(){S.cam.mode='orbit';S.dirty=true}
 function preset(name){const c=S.cam,b=S.group;if(!b)return;const R=b.meta.radius;
  const P={aerial:[.8,.62,R*1.6],eye:[.55,1.45,R*1.25],axo:[.785,.96,R*1.75],front:[0,1.32,R*1.35],top:[.001,.05,R*1.8]}[name]||[.75,1.1,R*1.55];
  anim(c,{theta:P[0],phi:P[1],r:P[2]},900)}
 function anim(o,to,dur){const from={};for(const k in to)from[k]=o[k];const t0=performance.now();S.anims=S.anims||[];S.anims=S.anims.filter(a=>a.o!==o);S.anims.push({o,from,to,t0,dur})}

 /* input: drag orbit, wheel zoom, pinch */
 let drag=null;
 function bindInput(el){
  el.addEventListener('pointerdown',e=>{if(S.cam.mode!=='orbit'||e.target!==canvas)return;drag={x:e.clientX,y:e.clientY,id:e.pointerId};el.setPointerCapture(e.pointerId);S.cam.auto=false;el.classList.add('grabbing')});
  el.addEventListener('pointermove',e=>{const rc=el.getBoundingClientRect();S.par.tx=((e.clientX-rc.left)/rc.width-.5);S.par.ty=((e.clientY-rc.top)/rc.height-.5);
   if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;S.cam.vt=-dx*.0055;S.cam.vp=-dy*.0045;S.cam.theta+=S.cam.vt;S.cam.phi=clamp(S.cam.phi+S.cam.vp,.12,1.5);S.dirty=true});
  const up=e=>{drag=null;el.classList.remove('grabbing')};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  el.addEventListener('wheel',e=>{if(S.cam.mode!=='orbit'||!el.dataset.zoom)return;e.preventDefault();const R=S.group?S.group.meta.radius:30;S.cam.r=clamp(S.cam.r*(1+Math.sign(e.deltaY)*.08),R*.7,R*2.6);S.dirty=true},{passive:false});
  el.addEventListener('dblclick',()=>{S.cam.auto=true})}

 /* ---------- mount / loop ---------- */
 function mount(el){if(S.mount===el)return;S.mount=el;el.prepend(canvas);if(!el.__bound){bindInput(el);el.__bound=1}resize();if(!S.running){S.running=true;requestAnimationFrame(loop)}}
 function unmount(){S.mount=null;canvas.remove()}
 function resize(){const el=S.mount;if(!el)return;const w=el.clientWidth||1,h=el.clientHeight||1;if(w===S.w&&h===S.h)return;S.w=w;S.h=h;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();S.dirty=true}
 let last=performance.now(),visible=true;
 function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-last)/1000);last=t;if(!S.mount||!visible||document.hidden)return;resize();
  if(S.anims&&S.anims.length){S.anims=S.anims.filter(a=>{const k=clamp((t-a.t0)/a.dur,0,1),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;for(const key in a.to)a.o[key]=lerp(a.from[key],a.to[key],e);S.dirty=true;return k<1})}
  const c=S.cam;
  if(c.mode==='orbit'){if(!drag){c.theta+=c.vt;c.phi=clamp(c.phi+c.vp,.12,1.5);c.vt*=.92;c.vp*=.92;if(Math.abs(c.vt)>1e-5||Math.abs(c.vp)>1e-5)S.dirty=true}
   if(c.auto){c.theta+=dt*.06;S.dirty=true}camFromOrbit()}
  S.par.x+=(S.par.tx-S.par.x)*.06;S.par.y+=(S.par.ty-S.par.y)*.06;
  if(S.spin){S.group&&(S.group.root.rotation.y+=dt*S.spin);S.dirty=true}
  if(S.onFrame)S.onFrame(dt);
  if(S.dirty){renderer.render(scene,camera);S.dirty=false}}
 const io=new IntersectionObserver(es=>es.forEach(e=>{visible=e.isIntersecting;S.dirty=true}));io.observe(canvas);

 function project(arr){tmpV.set(arr[0],arr[1],arr[2]);if(S.group)tmpV.applyMatrix4(S.group.root.matrixWorld);tmpV.project(camera);return{x:(tmpV.x*.5+.5)*S.w,y:(-tmpV.y*.5+.5)*S.h,vis:tmpV.z<1&&Math.abs(tmpV.x)<1.05&&Math.abs(tmpV.y)<1.05}}
 function still(){renderer.render(scene,camera);return canvas.toDataURL('image/png')}

 return {THREE,S,scene,sun,hemi,load,apply,setTime,setPath,orbit,preset,mount,unmount,resize,project,still,camera,renderer,models:Object.keys(MODELS),dirty:()=>{S.dirty=true},hot:()=>S.group?S.group.hot:[],meta:()=>S.group?.meta}
}
