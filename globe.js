(()=>{const S=window.STORIES,U=window.SUI||{};const cv=document.getElementById('globe');if(!cv||!S||!window.d3)return;
const ctx=cv.getContext('2d'),W=cv.width,R=W*.42,C=W/2,list=document.getElementById('glist');
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const ISO={andean:'604',bora:'604',morocco:'504',india:'356',japan:'392'};
const LBL={andean:[-1,1],bora:[1,-1],morocco:[-1,-1],india:[1,-1],japan:[1,1]};
let rot=[60,-12],anim=null,act=-1,hover=-1,vis=false,drag=null,moved=0,tk=0,idle=0,userT=0,auto=0;
const lab=s=>{const p=s.place.split(' · ');return s.k==='andean'?p[1].replace(/^(The|Los) /,''):s.k==='bora'?(document.documentElement.lang==='es'?'Amazonía':'Amazon'):p[0]};
const proj=d3.geoOrthographic().scale(R).translate([C,C]).clipAngle(90).precision(.6),path=d3.geoPath(proj,ctx),grat=d3.geoGraticule10(),sphere={type:'Sphere'};
let land=null,feat={};
fetch(cv.dataset.world||'assets/countries-110m.json').then(r=>r.json()).then(t=>{land=topojson.feature(t,t.objects.land);topojson.feature(t,t.objects.countries).features.forEach(f=>feat[f.id]=f)});
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function focus(i){const s=S[i],to=[-s.lo,Math.max(-35,Math.min(35,-s.la*.8))];if(RM){rot=to;return}let d=((to[0]-rot[0]+540)%360)-180;anim={f:rot.slice(),t:[rot[0]+d,to[1]],s:performance.now()}}
S.forEach((s,i)=>{const li=document.createElement('li');const b=document.createElement('button');b.type='button';b.textContent=lab(s);b.onclick=()=>openS(i);b.onmouseenter=()=>{hover=i;userT=0;focus(i)};li.appendChild(b);list.appendChild(li)});
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv);
function vis3(s){const r=d3.geoRotation(rot)([s.lo,s.la]);return Math.cos(r[1]*Math.PI/180)*Math.cos(r[0]*Math.PI/180)}
function pinAt(px,py){const r=cv.getBoundingClientRect(),x=(px-r.left)*W/r.width,y=(py-r.top)*W/r.height;let best=-1,bd=1e9;S.forEach((s,i)=>{if(vis3(s)<0)return;const[a,b]=proj([s.lo,s.la]);const d=Math.hypot(a-x,b-y);if(d<bd){bd=d;best=i}});return bd<W*.07?best:-1}
cv.addEventListener('pointerdown',e=>{userT=0;drag={x:e.clientX,y:e.clientY,r:rot.slice()};moved=0;anim=null;cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved=Math.max(moved,Math.hypot(dx,dy));rot=[drag.r[0]+dx*.4,Math.max(-40,Math.min(40,drag.r[1]-dy*.2))];idle=0}else{const p=pinAt(e.clientX,e.clientY);hover=p;cv.style.cursor=p>=0?'pointer':'grab'}});
cv.addEventListener('pointerup',e=>{const was=drag;drag=null;if(was&&moved<8){const p=pinAt(e.clientX,e.clientY);if(p>=0){openS(p)}}});
cv.style.touchAction='pan-y';
function draw(now){requestAnimationFrame(draw);if(!vis)return;tk++;idle++;userT++;
 if(!RM&&userT>200&&act<0&&!drag&&tk%260===0){auto=(auto+1)%S.length;hover=auto;focus(auto)}
 if(anim){const k=Math.min(1,(now-anim.s)/1200),e=ease(k);rot=[anim.f[0]+(anim.t[0]-anim.f[0])*e,anim.f[1]+(anim.t[1]-anim.f[1])*e];if(k>=1)anim=null}
 else if(!RM&&!drag&&idle>120&&hover<0&&act<0)rot[0]+=.06;
 proj.rotate(rot);ctx.clearRect(0,0,W,W);
 const halo=ctx.createRadialGradient(C,C,R*.96,C,C,R*1.14);halo.addColorStop(0,'#9fb8e855');halo.addColorStop(.35,'#d9cf8f22');halo.addColorStop(1,'#d9cf8f00');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(C,C,R*1.14,0,7);ctx.fill();
 const g=ctx.createRadialGradient(C-R*.35,C-R*.4,R*.05,C,C,R);g.addColorStop(0,'#1d4580');g.addColorStop(.65,'#0E1E4E');g.addColorStop(1,'#071530');ctx.fillStyle=g;ctx.beginPath();path(sphere);ctx.fill();
 ctx.beginPath();path(grat);ctx.strokeStyle='#b0a5681a';ctx.lineWidth=1;ctx.stroke();
 if(land){ctx.beginPath();path(land);ctx.fillStyle='#e9e2c21f';ctx.fill();ctx.strokeStyle='#d9cf8f55';ctx.lineWidth=1.2;ctx.stroke();
  const done={};S.forEach((s,i)=>{const id=ISO[s.k],f=feat[id];if(!f)return;const on=S.some((t,j)=>(j===hover||j===act)&&ISO[t.k]===id);if(done[id]&&!on)return;done[id]=1;
   const pul=on?.55+.25*Math.sin(now/380):.38;ctx.beginPath();path(f);ctx.fillStyle=`rgba(217,207,143,${pul})`;ctx.fill();ctx.strokeStyle='#f3e6a6';ctx.lineWidth=on?2.6:1.6;ctx.stroke()})}
 ctx.beginPath();path(sphere);ctx.strokeStyle='#b0a568aa';ctx.lineWidth=2;ctx.stroke();
 const boxes=[];ctx.font='600 26px Inter,sans-serif';
 S.forEach((s,i)=>{const z=vis3(s);if(z<.05)return;const[x,y]=proj([s.lo,s.la]);const on=i===hover||i===act,ph=((now/1000+i*.37)%2.2)/2.2,a=Math.min(1,z*2.5);
  ctx.globalAlpha=a;const gl=ctx.createRadialGradient(x,y,0,x,y,28);gl.addColorStop(0,'#f6e7a8aa');gl.addColorStop(1,'#f6e7a800');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(x,y,28,0,7);ctx.fill();
  if(!RM){ctx.strokeStyle=`rgba(246,231,168,${(1-ph)*.8})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,8+ph*26,0,7);ctx.stroke()}
  ctx.fillStyle=on?'#fff6d6':'#d9cf8f';ctx.beginPath();ctx.arc(x,y,on?10:7.5,0,7);ctx.fill();ctx.fillStyle='#0E1E4E';ctx.beginPath();ctx.arc(x,y,3,0,7);ctx.fill();
  const t=lab(s).toUpperCase(),tw=ctx.measureText(t).width+18,th=32,[dx,dy]=LBL[s.k]||[1,-1];
  const cand=[[dx,dy],[-dx,dy],[dx,-dy],[-dx,-dy]];let bx;for(const[cx,cy]of cand){const lx=cx>0?x+16:x-16-tw,ly=cy>0?y+10:y-10-th;const r=[Math.max(4,Math.min(W-tw-4,lx)),ly,tw,th];if(!boxes.some(b=>r[0]<b[0]+b[2]&&r[0]+r[2]>b[0]&&r[1]<b[1]+b[3]&&r[1]+r[3]>b[1])){bx=r;break}}
  if(bx){boxes.push(bx);ctx.fillStyle=on?'#d9cf8f':'#050f1fd9';ctx.beginPath();ctx.roundRect?ctx.roundRect(bx[0],bx[1],bx[2],bx[3],16):ctx.rect(...bx);ctx.fill();ctx.fillStyle=on?'#0E1E4E':'#f4efe2';ctx.fillText(t,bx[0]+9,bx[1]+23)}
  ctx.globalAlpha=1});
 [...list.children].forEach((l,i)=>l.classList.toggle('on',i===hover||i===act))}
requestAnimationFrame(draw);
// sheet
const sh=document.createElement('div');sh.className='story';sh.setAttribute('role','dialog');sh.setAttribute('aria-modal','true');sh.hidden=true;
sh.innerHTML=`<div class="st-card"><button class="st-x" aria-label="${U.close}">×</button><figure class="st-img"><img alt=""><span class="st-ill">${U.ill}</span></figure><div class="st-body"><p class="kicker st-place"></p><h3 class="st-craft"></h3><span class="st-real">${U.real}</span><p class="st-story"></p><h4>${U.atrisk}</h4><p class="st-risk"></p><h4>${U.we}</h4><p class="st-role"></p><div class="st-act"><a class="btn gold big" target="_blank" rel="noopener" href="${window.PP}">${U.donate}</a></div><div class="st-nav"><button class="st-p" aria-label="${U.prev}">← ${U.prev}</button><span class="st-n"></span><button class="st-nx" aria-label="${U.next}">${U.next} →</button></div></div></div>`;
document.body.appendChild(sh);const q=c=>sh.querySelector(c);
function fill(i){const s=S[i];act=i;focus(i);q('.st-img img').src=s.img;q('.st-img img').style.objectPosition=s.fp||'';q('.st-img img').alt=s.craft;q('.st-place').textContent=s.place;q('.st-craft').textContent=s.craft;q('.st-story').textContent=s.story;q('.st-risk').textContent=s.risk;q('.st-role').textContent=s.role;q('.st-real').style.display=s.real?'':'none';q('.st-n').textContent=(i+1)+' / '+S.length;q('.st-body').scrollTop=0;sh.scrollTop=0;
 const c=q('.st-card');c.classList.remove('swap');void c.offsetWidth;c.classList.add('swap')}
let last=null;function openS(i){last=document.activeElement;fill(i);sh.hidden=false;requestAnimationFrame(()=>sh.classList.add('show'));document.documentElement.classList.add('story-open');q('.st-x').focus()}
function closeS(){sh.classList.remove('show');document.documentElement.classList.remove('story-open');act=-1;setTimeout(()=>sh.hidden=true,350);last&&last.focus&&last.focus()}
q('.st-x').onclick=closeS;sh.onclick=e=>{if(e.target===sh)closeS()};q('.st-p').onclick=()=>fill((act-1+S.length)%S.length);q('.st-nx').onclick=()=>fill((act+1)%S.length);
addEventListener('keydown',e=>{if(sh.hidden)return;if(e.key==='Escape')closeS();if(e.key==='ArrowRight')q('.st-nx').click();if(e.key==='ArrowLeft')q('.st-p').click()});
let sx=null;q('.st-img').addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});q('.st-img').addEventListener('touchend',e=>{if(sx===null)return;const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)(d<0?q('.st-nx'):q('.st-p')).click();sx=null});
window.openStory=openS})();
