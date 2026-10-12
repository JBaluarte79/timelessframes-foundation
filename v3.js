(()=>{document.documentElement.classList.add('js-ok');const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const aud=$('#aud'),snd=$('#snd'),intro=$('#intro');
function setSound(on){if(!aud)return;if(on){aud.volume=0;aud.play().then(()=>{let v=0;const f=setInterval(()=>{v=Math.min(.55,v+.03);aud.volume=v;if(v>=.55)clearInterval(f)},80)}).catch(()=>{});snd&&snd.classList.add('on')}else{aud.pause();snd&&snd.classList.remove('on')}}
function enter(s){document.body.classList.remove('locked');intro.classList.add('go');document.body.classList.add('ready');setSound(s);setTimeout(()=>intro.remove(),2200)}
if(intro){$('#enterSnd').onclick=()=>enter(true);$('#enterQ').onclick=()=>enter(false);if(sessionStorage.tffIn){enter(false)}sessionStorage.tffIn=1}else document.body.classList.add('ready');
snd&&(snd.onclick=()=>setSound(aud.paused));
const nav=$('#nav'),bg=$('#burger');bg&&(bg.onclick=()=>{const o=nav.classList.toggle('open');document.documentElement.classList.toggle('menu-open',o);document.body.classList.toggle('menu-open',o);bg.setAttribute('aria-expanded',o)});nav&&nav.querySelectorAll('a').forEach(a=>a.onclick=()=>{nav.classList.remove('open');document.documentElement.classList.remove('menu-open');document.body.classList.remove('menu-open')});
const top=$('.top');
// reveal
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);const v=e.target.querySelector('video.lazyv');if(v&&!v.src){v.src=v.dataset.src;v.play().catch(()=>{})}}}),{threshold:0,rootMargin:'0px 0px -8% 0px'}):null;
$$('.revive,.dreams,.manifesto h2,.trans,.blog,.vision,.pillars .pill,.contact').forEach(el=>{if(!el.classList.contains('revive'))el.classList.add('rv');io?io.observe(el):el.classList.add('in')});
const rvSafety=()=>$$('.rv:not(.in)').forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)el.classList.add('in')});addEventListener('scroll',rvSafety,{passive:true});setTimeout(rvSafety,600);
const mob=()=>innerWidth<=980;
const words=$$('#words .w'),chs=$$('.chap'),chImgs=$$('.ch-media img'),chSec=$('.chapters'),art=$('.artisans'),track=$('#track'),fin=$('.fin-bg');
function sizeArt(){if(!art||!track)return;if(mob()){art.style.height='';track.style.transform='';return}art.style.height=(track.scrollWidth-innerWidth+innerHeight+200)+'px'}
sizeArt();addEventListener('resize',sizeArt);addEventListener('load',sizeArt);
let ticking=false;function onScroll(){ticking=false;const y=scrollY,h=innerHeight;top&&top.classList.toggle('solid',y>60);
 if(words.length){const r=$('#words').getBoundingClientRect();const p=Math.min(1,Math.max(0,(h*.95-r.top)/(r.height*.7+1)));const n=Math.ceil(p*words.length);words.forEach((w,i)=>{if(i<n)w.classList.add('on')})}
 if(chSec){const r=chSec.getBoundingClientRect();const p=Math.min(.999,Math.max(0,-r.top/(r.height-h)));const i=Math.floor(p*chs.length);chs.forEach((c,j)=>c.classList.toggle('on',j===i));chImgs.forEach((c,j)=>c.classList.toggle('on',j<=i));$('#chbar').style.width=(p*100)+'%'}
 if(art&&track&&!mob()){const r=art.getBoundingClientRect();const max=track.scrollWidth-innerWidth;const p=Math.min(1,Math.max(0,-r.top/(r.height-h)));track.style.transform=`translate3d(${-p*max}px,0,0)`}
 if(fin){const r=fin.parentNode.getBoundingClientRect();const p=Math.min(1,Math.max(0,1-(r.top+r.height)/(h+r.height)));fin.style.transform=`scale(${1.25-p*.25})`}}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
// globe
const cv=$('#globe');if(cv&&window.PTS){const ctx=cv.getContext('2d'),W=cv.width,R=W*.42,C=W/2,list=$('#glist');let rot=-60,act=0,vis=false;
 PTS.forEach((p,i)=>{const li=document.createElement('li');li.textContent=p[2];li.onmouseenter=()=>{act=i;rot=-p[1]};list.appendChild(li)});
 new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv);
 const rad=d=>d*Math.PI/180;function proj(la,lo){const l=rad(lo+rot),p=rad(la),t=rad(-18);let x=Math.cos(p)*Math.sin(l),y=Math.sin(p),z=Math.cos(p)*Math.cos(l);const y2=y*Math.cos(t)-z*Math.sin(t),z2=y*Math.sin(t)+z*Math.cos(t);return[C+R*x,C-R*y2,z2]}
 let tk=0;function draw(){requestAnimationFrame(draw);if(!vis)return;tk++;rot+=.15;if(tk%180===0){act=(act+1)%PTS.length}
  [...list.children].forEach((l,i)=>l.classList.toggle('on',i===act));
  ctx.clearRect(0,0,W,W);const g=ctx.createRadialGradient(C-R*.3,C-R*.3,R*.1,C,C,R);g.addColorStop(0,'#13325e');g.addColorStop(1,'#050f1f');ctx.fillStyle=g;ctx.beginPath();ctx.arc(C,C,R,0,7);ctx.fill();
  ctx.strokeStyle='#b0a56840';ctx.lineWidth=1;
  for(let la=-60;la<=60;la+=30){ctx.beginPath();let f=1;for(let lo=-180;lo<=180;lo+=4){const[x,y,z]=proj(la,lo);if(z<0){f=1;continue}f?ctx.moveTo(x,y):ctx.lineTo(x,y);f=0}ctx.stroke()}
  for(let lo=-180;lo<180;lo+=30){ctx.beginPath();let f=1;for(let la=-90;la<=90;la+=4){const[x,y,z]=proj(la,lo);if(z<0){f=1;continue}f?ctx.moveTo(x,y):ctx.lineTo(x,y);f=0}ctx.stroke()}
  ctx.strokeStyle='#b0a568';ctx.lineWidth=2;ctx.beginPath();ctx.arc(C,C,R,0,7);ctx.stroke();
  PTS.forEach((p,i)=>{const[x,y,z]=proj(p[0],p[1]);if(z<0)return;const on=i===act,pulse=(tk%60)/60;
   ctx.fillStyle=on?'#d9cf8f':'#b0a568';ctx.beginPath();ctx.arc(x,y,on?9:6,0,7);ctx.fill();
   ctx.strokeStyle=`rgba(217,207,143,${1-pulse})`;ctx.beginPath();ctx.arc(x,y,8+pulse*26,0,7);ctx.stroke();
   if(on){ctx.fillStyle='#f4efe2';ctx.font='600 26px Inter,sans-serif';ctx.fillText(p[2].toUpperCase(),x+16,y+8)}})}
 draw()}

// thank-you overlay (?thanks=1)
const th=$('#thanks');if(th&&new URLSearchParams(location.search).get('thanks')==='1'){th.hidden=false;document.body.classList.add('thanks-open');const cl=$('#thanksClose');const go=()=>{th.hidden=true;document.body.classList.remove('thanks-open');try{history.replaceState(null,'',location.pathname+location.hash)}catch(e){}};cl&&(cl.onclick=go);th.onclick=e=>{if(e.target===th)go()}}
})();

(()=>{if(!matchMedia('(max-width:760px)').matches)return;const v=document.querySelector('.hero-v');if(v){v.pause();v.querySelectorAll('source').forEach(s=>s.remove());v.remove()}})();

(()=>{const im=[...document.querySelectorAll('.dr-fade img')];if(im.length<2||matchMedia('(prefers-reduced-motion:reduce)').matches)return;let i=0;setInterval(()=>{im[i].classList.remove('on');i=(i+1)%im.length;im[i].classList.add('on')},5000)})();
