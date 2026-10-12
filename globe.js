(()=>{const S=window.STORIES,U=window.SUI||{};const cv=document.getElementById('globe');if(!cv||!S)return;
const ctx=cv.getContext('2d'),W=cv.width,R=W*.43,C=W/2,list=document.getElementById('glist');
let rot=72,tilt=-14,target=null,act=-1,hover=-1,vis=false,drag=null,moved=0,tk=0,idle=0;
const rad=d=>d*Math.PI/180;const lab=s=>{const p=s.place.split(' · ');return s.k==='andean'?p[1].replace(/^(The|Los) /,''):p[0]};
function proj(la,lo){const l=rad(lo+rot),p=rad(la),t=rad(tilt);let x=Math.cos(p)*Math.sin(l),y=Math.sin(p),z=Math.cos(p)*Math.cos(l);const y2=y*Math.cos(t)-z*Math.sin(t),z2=y*Math.sin(t)+z*Math.cos(t);return[C+R*x,C-R*y2,z2]}
// coarse land dots from a tiny continent mask (lat,lon boxes) for texture
const LAND=[[-55,-35,-75,-35],[-35,12,-82,-34],[12,30,-118,-80],[30,70,-168,-55],[60,83,-75,-15],[35,71,-10,40],[-35,37,-18,51],[5,77,40,180],[-45,-10,112,155],[30,46,128,146]];
const DOTS=[];for(let la=-60;la<=78;la+=3.2)for(let lo=-180;lo<180;lo+=3.2/Math.max(.3,Math.cos(rad(la))))if(LAND.some(b=>la>=b[0]&&la<=b[1]&&lo>=b[2]&&lo<=b[3]))DOTS.push([la,lo]);
S.forEach((s,i)=>{const li=document.createElement('li');const b=document.createElement('button');b.type='button';b.textContent=lab(s);b.onclick=()=>openS(i);b.onmouseenter=()=>{hover=i;focus(i)};li.appendChild(b);list.appendChild(li)});
function focus(i){target=-S[i].lo}
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv);
function pinAt(px,py){const r=cv.getBoundingClientRect(),x=(px-r.left)*W/r.width,y=(py-r.top)*W/r.height;let best=-1,bd=1e9;S.forEach((s,i)=>{const[a,b,z]=proj(s.la,s.lo);if(z<0)return;const d=Math.hypot(a-x,b-y);if(d<bd){bd=d;best=i}});return bd<W*.075?best:-1}
cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,r:rot,t:tilt};moved=0;target=null;cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved=Math.max(moved,Math.hypot(dx,dy));rot=drag.r+dx*.45;tilt=Math.max(-40,Math.min(30,drag.t+dy*.2));idle=0}else{const p=pinAt(e.clientX,e.clientY);hover=p;cv.style.cursor=p>=0?'pointer':'grab'}});
cv.addEventListener('pointerup',e=>{const was=drag;drag=null;if(was&&moved<8){const p=pinAt(e.clientX,e.clientY);if(p>=0)openS(p)}});
cv.style.touchAction='pan-y';
function draw(){requestAnimationFrame(draw);if(!vis)return;tk++;idle++;
 if(target!==null){let d=((target-rot+540)%360)-180;rot+=d*.08;if(Math.abs(d)<.2)target=null}else if(!drag&&idle>90)rot+=.12;
 ctx.clearRect(0,0,W,W);
 const halo=ctx.createRadialGradient(C,C,R*.9,C,C,R*1.18);halo.addColorStop(0,'#d9cf8f33');halo.addColorStop(1,'#d9cf8f00');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(C,C,R*1.18,0,7);ctx.fill();
 const g=ctx.createRadialGradient(C-R*.35,C-R*.4,R*.05,C,C,R);g.addColorStop(0,'#1b3f74');g.addColorStop(.6,'#0E1E4E');g.addColorStop(1,'#050f1f');ctx.fillStyle=g;ctx.beginPath();ctx.arc(C,C,R,0,7);ctx.fill();
 ctx.strokeStyle='#b0a56826';ctx.lineWidth=1;
 for(let la=-60;la<=60;la+=30){ctx.beginPath();let f=1;for(let lo=-180;lo<=180;lo+=4){const[x,y,z]=proj(la,lo);if(z<0){f=1;continue}f?ctx.moveTo(x,y):ctx.lineTo(x,y);f=0}ctx.stroke()}
 for(let lo=-180;lo<180;lo+=30){ctx.beginPath();let f=1;for(let la=-90;la<=90;la+=4){const[x,y,z]=proj(la,lo);if(z<0){f=1;continue}f?ctx.moveTo(x,y):ctx.lineTo(x,y);f=0}ctx.stroke()}
 DOTS.forEach(([la,lo])=>{const[x,y,z]=proj(la,lo);if(z<0.02)return;ctx.fillStyle=`rgba(217,207,143,${.12+z*.38})`;ctx.fillRect(x-1.6,y-1.6,3.2,3.2)});
 ctx.strokeStyle='#b0a568';ctx.lineWidth=2;ctx.beginPath();ctx.arc(C,C,R,0,7);ctx.stroke();
 S.forEach((s,i)=>{const[x,y,z]=proj(s.la,s.lo);if(z<0)return;const on=i===hover||i===act,ph=((tk+i*23)%90)/90;
  const gl=ctx.createRadialGradient(x,y,0,x,y,34);gl.addColorStop(0,'#f6e7a8cc');gl.addColorStop(1,'#f6e7a800');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(x,y,34,0,7);ctx.fill();
  ctx.strokeStyle=`rgba(246,231,168,${(1-ph)*.9})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,10+ph*30,0,7);ctx.stroke();
  ctx.fillStyle=on?'#fff6d6':'#d9cf8f';ctx.beginPath();ctx.arc(x,y,on?12:9,0,7);ctx.fill();ctx.fillStyle='#0E1E4E';ctx.beginPath();ctx.arc(x,y,3.5,0,7);ctx.fill();
  if(on||W/cv.getBoundingClientRect().width>1.6){ctx.font='600 30px Inter,sans-serif';const t=lab(s).toUpperCase(),tw=ctx.measureText(t).width;const lx=x+tw+40>W?x-tw-22:x+20;ctx.fillStyle='#050f1fcc';ctx.fillRect(lx-8,y-20,tw+16,34);ctx.fillStyle='#f4efe2';ctx.fillText(t,lx,y+6)}});
 [...list.children].forEach((l,i)=>l.classList.toggle('on',i===hover||i===act))}
draw();
// sheet
const sh=document.createElement('div');sh.className='story';sh.setAttribute('role','dialog');sh.setAttribute('aria-modal','true');sh.hidden=true;
sh.innerHTML=`<div class="st-card"><button class="st-x" aria-label="${U.close}">×</button><figure class="st-img"><img alt=""><span class="st-ill">${U.ill}</span></figure><div class="st-body"><p class="kicker st-place"></p><h3 class="st-craft"></h3><span class="st-real">${U.real}</span><p class="st-story"></p><h4>${U.atrisk}</h4><p class="st-risk"></p><h4>${U.we}</h4><p class="st-role"></p><div class="st-act"><a class="btn gold big" target="_blank" rel="noopener" href="${window.PP}">${U.donate}</a></div><div class="st-nav"><button class="st-p" aria-label="${U.prev}">← ${U.prev}</button><span class="st-n"></span><button class="st-nx" aria-label="${U.next}">${U.next} →</button></div></div></div>`;
document.body.appendChild(sh);const q=c=>sh.querySelector(c);
function fill(i){const s=S[i];act=i;focus(i);q('.st-img img').src=s.img;q('.st-img img').alt=s.craft;q('.st-place').textContent=s.place;q('.st-craft').textContent=s.craft;q('.st-story').textContent=s.story;q('.st-risk').textContent=s.risk;q('.st-role').textContent=s.role;q('.st-real').style.display=s.real?'':'none';q('.st-n').textContent=(i+1)+' / '+S.length;q('.st-body').scrollTop=0;sh.scrollTop=0;
 const c=q('.st-card');c.classList.remove('swap');void c.offsetWidth;c.classList.add('swap')}
let last=null;function openS(i){last=document.activeElement;fill(i);sh.hidden=false;requestAnimationFrame(()=>sh.classList.add('show'));document.documentElement.classList.add('story-open');q('.st-x').focus()}
function closeS(){sh.classList.remove('show');document.documentElement.classList.remove('story-open');act=-1;setTimeout(()=>sh.hidden=true,350);last&&last.focus&&last.focus()}
q('.st-x').onclick=closeS;sh.onclick=e=>{if(e.target===sh)closeS()};q('.st-p').onclick=()=>fill((act-1+S.length)%S.length);q('.st-nx').onclick=()=>fill((act+1)%S.length);
addEventListener('keydown',e=>{if(sh.hidden)return;if(e.key==='Escape')closeS();if(e.key==='ArrowRight')q('.st-nx').click();if(e.key==='ArrowLeft')q('.st-p').click()});
let sx=null;q('.st-img').addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});q('.st-img').addEventListener('touchend',e=>{if(sx===null)return;const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)(d<0?q('.st-nx'):q('.st-p')).click();sx=null});
window.openStory=openS})();
