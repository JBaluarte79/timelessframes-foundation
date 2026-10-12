(()=>{const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,root=document.documentElement,body=document.body;
const nav=$('header.nav');const onS=()=>nav.classList.toggle('solid',scrollY>60);onS();addEventListener('scroll',onS,{passive:true});
const b=$('.burger'),ul=$('#menu');b&&b.addEventListener('click',()=>{const o=ul.classList.toggle('open');b.setAttribute('aria-expanded',o)});$$('#menu a').forEach(a=>a.addEventListener('click',()=>{ul.classList.remove('open');b.setAttribute('aria-expanded',false)}));
// sound
const au=$('#amb'),sb=$('.snd');let fadeT;
function setSound(on){if(!au)return;clearInterval(fadeT);sb.setAttribute('aria-pressed',on);sb.setAttribute('aria-label',on?sb.dataset.on:sb.dataset.off);
 if(on){au.volume=0;au.play().catch(()=>{});fadeT=setInterval(()=>{au.volume=Math.min(.55,au.volume+.03);if(au.volume>=.55)clearInterval(fadeT)},80)}
 else{fadeT=setInterval(()=>{au.volume=Math.max(0,au.volume-.05);if(au.volume<=0){clearInterval(fadeT);au.pause()}},60)}try{sessionStorage.setItem('tff-snd',on?1:0)}catch(e){}}
sb&&sb.addEventListener('click',()=>setSound(sb.getAttribute('aria-pressed')!=='true'));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&au&&!au.paused)au.pause();else if(!document.hidden&&sb&&sb.getAttribute('aria-pressed')==='true')au.play().catch(()=>{})});
// intro
const intro=$('#intro');const enter=()=>{body.classList.add('entered');intro&&intro.classList.add('gone');setTimeout(()=>intro&&intro.remove(),1200)};
let seen=false;try{seen=sessionStorage.getItem('tff-in')}catch(e){}
if(!intro){body.classList.add('entered')}else if(seen||RM||navigator.webdriver){root.classList.add('no-intro');enter()}
else{intro.querySelector('[data-enter=sound]').focus({preventScroll:true});$$('[data-enter]',intro).forEach(x=>x.addEventListener('click',()=>{try{sessionStorage.setItem('tff-in',1)}catch(e){}
 if(x.dataset.enter==='sound')setSound(true);intro.classList.add('counting');const c=$('.count',intro),r=$('.ring',intro);let n=3,t0=performance.now();
 (function tick(t){const p=((t-t0)%700)/700;r.style.setProperty('--p',p*360+'deg');const k=3-Math.floor((t-t0)/700);if(k!==n&&k>0){n=k;c.textContent=k}if(t-t0<2100)requestAnimationFrame(tick);else enter()})(t0)}))}
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -5% 0px'});$$('.reveal').forEach(el=>io.observe(el));
// manifesto words
const ws=$$('.words .w');const hero=$('.hero-v');
// chapters
const chs=$$('.chapter'),bgs=$$('.ch-bg');const cio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){chs.forEach(c=>c.classList.toggle('on',c===e.target));bgs.forEach(g=>g.classList.toggle('on',g.dataset.i===e.target.dataset.i))}}),{rootMargin:'-45% 0px -45% 0px'});chs.forEach(c=>cio.observe(c));
const px=$$('.parallax');let tick=false;
function frame(){tick=false;const vh=innerHeight;
 if(!RM){if(hero&&scrollY<vh)hero.style.transform=`scale(1.08) translateY(${scrollY*.3}px)`;
  px.forEach(p=>{const r=p.parentElement.getBoundingClientRect();if(r.bottom>0&&r.top<vh)p.style.transform=`translateY(${(r.top+r.height/2-vh/2)*-(+p.dataset.speed||.3)}px)`})}
 if(ws.length){const r=$('.words').getBoundingClientRect();const pr=Math.min(1,Math.max(0,(vh*.85-r.top)/(r.height+vh*.35)));const n=Math.round(pr*ws.length);ws.forEach((w,i)=>w.classList.toggle('lit',RM||i<n))}}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});frame();
// timecode
const tc=$('#tc');if(tc&&hero){const f=()=>{const t=hero.currentTime||0,p=n=>String(Math.floor(n)).padStart(2,'0');tc.textContent=`00:${p(t/60)}:${p(t%60)}:${p((t%1)*24)}`;requestAnimationFrame(f)};f()}
if(hero&&RM){hero.pause();hero.removeAttribute('autoplay')}
// reel drag
const reel=$('.reel');if(reel){let d=false,x0,s0,moved=0;reel.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;d=true;moved=0;x0=e.clientX;s0=reel.scrollLeft});addEventListener('pointerup',()=>d=false);
 reel.addEventListener('pointermove',e=>{if(!d)return;moved+=Math.abs(e.movementX);reel.scrollLeft=s0-(e.clientX-x0)});
 reel.addEventListener('keydown',e=>{if(e.key==='ArrowRight')reel.scrollBy({left:300,behavior:'smooth'});if(e.key==='ArrowLeft')reel.scrollBy({left:-300,behavior:'smooth'})});
 const lb=$('.lightbox');$$('.shot').forEach(s=>s.addEventListener('click',e=>{if(moved>6)return;const i=$('img',lb);i.src=s.dataset.full;i.alt=$('img',s).alt;lb.showModal()}));
 $('.lb-x').addEventListener('click',()=>lb.close());lb.addEventListener('click',e=>{if(e.target===lb)lb.close()})}
// translate
const gt=$('.gt');let ld=false;gt&&gt.querySelector('button').addEventListener('click',()=>{const o=gt.classList.toggle('open');gt.querySelector('button').setAttribute('aria-expanded',o);
 if(o&&!ld){ld=true;window.googleTranslateElementInit=()=>new google.translate.TranslateElement({pageLanguage:root.lang,autoDisplay:false},'google_translate_element');const s=document.createElement('script');s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';body.appendChild(s)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){gt&&gt.classList.remove('open');ul&&ul.classList.remove('open')}});
})();
