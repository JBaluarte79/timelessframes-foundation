(()=>{const c=document.getElementById('car');if(!c)return;const S=[...c.querySelectorAll('.car-s')],D=[...c.querySelectorAll('.car-dots button')];let i=0,t=null,paused=false;
function go(n){i=(n+S.length)%S.length;S.forEach((s,k)=>s.classList.toggle('on',k===i));D.forEach((d,k)=>{d.classList.toggle('on',k===i);d.classList.remove('run');if(k===i){void d.offsetWidth;d.classList.add('run')}})}
function start(){clearInterval(t);if(!paused)t=setInterval(()=>go(i+1),4000);D[i]&&D[i].classList.toggle('paused',paused)}
D.forEach((d,k)=>d.onclick=()=>{go(k);start()});
c.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){paused=true;clearInterval(t);c.classList.add('paused')}});
c.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){paused=false;c.classList.remove('paused');go(i);start()}});
let x0=null;c.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;paused=true;clearInterval(t);c.classList.add('paused')},{passive:true});
c.addEventListener('touchend',e=>{const d=x0===null?0:e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(d)>40)go(i+(d<0?1:-1));paused=false;c.classList.remove('paused');go(i);start()});
c.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){go(i+1);start()}if(e.key==='ArrowLeft'){go(i-1);start()}});
new IntersectionObserver(e=>{if(e[0].isIntersecting){go(i);start()}else clearInterval(t)}).observe(c)})();
// mobile hero: no video on phones
(()=>{if(!matchMedia('(max-width:760px)').matches)return;const v=document.querySelector('.hero-v');if(v){v.pause();v.removeAttribute('autoplay');v.querySelectorAll('source').forEach(s=>s.remove());v.load();v.remove()}})();
