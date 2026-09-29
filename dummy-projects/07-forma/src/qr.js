/* Minimal QR Code encoder (byte mode, ECC level M, versions 1–6). Written for FORMA; no dependencies. */
const QR=(()=>{
 const ECC=[0,10,16,26,18,24,16],NB=[0,1,1,1,2,2,4],AL=[[],[],[6,18],[6,22],[6,26],[6,30],[6,34]];
 const raw=v=>{let r=(16*v+128)*v+64;if(v>=2){const n=Math.floor(v/7)+2;r-=(25*n-10)*n-55}return r};
 const mul=(x,y)=>{let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11D);z^=((y>>>i)&1)*x}return z&255};
 const gen=d=>{const r=new Array(d).fill(0);r[d-1]=1;let root=1;for(let i=0;i<d;i++){for(let j=0;j<d;j++){r[j]=mul(r[j],root);if(j+1<d)r[j]^=r[j+1]}root=mul(root,2)}return r};
 const rem=(data,div)=>{const r=div.map(()=>0);for(const b of data){const f=b^r.shift();r.push(0);div.forEach((c,i)=>r[i]^=mul(c,f))}return r};
 const MASK=[(x,y)=>(x+y)%2===0,(x,y)=>y%2===0,(x,y)=>x%3===0,(x,y)=>(x+y)%3===0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2===0,(x,y)=>x*y%2+x*y%3===0,(x,y)=>(x*y%2+x*y%3)%2===0,(x,y)=>((x+y)%2+x*y%3)%2===0];
 function encode(text){
  const bytes=[...new TextEncoder().encode(text)];let v=1;
  for(;v<=6;v++){if(Math.floor(raw(v)/8)-ECC[v]*NB[v]>=bytes.length+2)break}if(v>6)throw new Error('QR payload too long');
  const cap=Math.floor(raw(v)/8)-ECC[v]*NB[v];const bits=[];const push=(val,len)=>{for(let i=len-1;i>=0;i--)bits.push((val>>>i)&1)};
  push(4,4);push(bytes.length,8);bytes.forEach(b=>push(b,8));push(0,Math.min(4,cap*8-bits.length));while(bits.length%8)bits.push(0);
  const data=[];for(let i=0;i<bits.length;i+=8)data.push(parseInt(bits.slice(i,i+8).join(''),2));for(let p=0xEC;data.length<cap;p^=0xEC^0x11)data.push(p);
  // blocks
  const nb=NB[v],ec=ECC[v],rc=Math.floor(raw(v)/8),nShort=nb-rc%nb,shortLen=Math.floor(rc/nb),g=gen(ec),blocks=[];
  for(let i=0,k=0;i<nb;i++){const d=data.slice(k,k+shortLen-ec+(i<nShort?0:1));k+=d.length;const e=rem(d,g);if(i<nShort)d.push(0);blocks.push(d.concat(e))}
  const cw=[];for(let i=0;i<blocks[0].length;i++)blocks.forEach((b,j)=>{if(i!==shortLen-ec||j>=nShort)cw.push(b[i])});
  // matrix
  const n=v*4+17,M=[...Array(n)].map(()=>Array(n).fill(false)),F=[...Array(n)].map(()=>Array(n).fill(false));
  const set=(x,y,d)=>{M[y][x]=d;F[y][x]=true};
  for(let i=0;i<n;i++){set(6,i,i%2===0);set(i,6,i%2===0)}
  const finder=(cx,cy)=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const x=cx+dx,y=cy+dy;if(x<0||y<0||x>=n||y>=n)continue;const d=Math.max(Math.abs(dx),Math.abs(dy));set(x,y,d!==2&&d!==4)}};
  finder(3,3);finder(n-4,3);finder(3,n-4);
  const al=AL[v],L=al.length;for(let i=0;i<L;i++)for(let j=0;j<L;j++){if((i===0&&j===0)||(i===0&&j===L-1)||(i===L-1&&j===0))continue;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(al[i]+dx,al[j]+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1)}
  const fmt=mask=>{const d=(0<<3)|mask;let r=d;for(let i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);const b=((d<<10)|r)^0x5412;const bit=i=>((b>>>i)&1)===1;
   for(let i=0;i<=5;i++)set(8,i,bit(i));set(8,7,bit(6));set(8,8,bit(7));set(7,8,bit(8));for(let i=9;i<15;i++)set(14-i,8,bit(i));
   for(let i=0;i<8;i++)set(n-1-i,8,bit(i));for(let i=8;i<15;i++)set(8,n-15+i,bit(i));set(8,n-8,true)};
  fmt(0);
  let i=0;for(let right=n-1;right>=1;right-=2){if(right===6)right=5;for(let vert=0;vert<n;vert++)for(let j=0;j<2;j++){const x=right-j,up=((right+1)&2)===0,y=up?n-1-vert:vert;if(!F[y][x]&&i<cw.length*8){M[y][x]=((cw[i>>>3]>>>(7-(i&7)))&1)===1;i++}}}
  // choose mask by simple penalty
  const apply=m=>{for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(!F[y][x]&&MASK[m](x,y))M[y][x]=!M[y][x]};
  const pen=()=>{let p=0,dark=0;for(let y=0;y<n;y++){let rx=1,ry=1;for(let x=0;x<n;x++){if(M[y][x])dark++;if(x){if(M[y][x]===M[y][x-1]){rx++;if(rx===5)p+=3;else if(rx>5)p++}else rx=1;if(M[x][y]===M[x-1][y]){ry++;if(ry===5)p+=3;else if(ry>5)p++}else ry=1}if(x&&y&&M[y][x]===M[y-1][x]&&M[y][x]===M[y][x-1]&&M[y][x]===M[y-1][x-1])p+=3}}p+=Math.floor(Math.abs(dark*20-n*n*10)/(n*n))*10;return p};
  let best=0,bp=1e9;for(let m=0;m<8;m++){apply(m);fmt(m);const p=pen();if(p<bp){bp=p;best=m}apply(m)}
  apply(best);fmt(best);return M}
 function svg(text,{fg='#1C1C1C',bg='#fff'}={}){const M=encode(text),n=M.length,q=4,s=n+q*2;let d='';M.forEach((r,y)=>r.forEach((c,x)=>{if(c)d+=`M${x+q} ${y+q}h1v1h-1z`}));return `<svg viewBox="0 0 ${s} ${s}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="QR code"><rect width="${s}" height="${s}" fill="${bg}"/><path d="${d}" fill="${fg}"/></svg>`}
 return {encode,svg};
})();
if(typeof module!=='undefined')module.exports=QR;
