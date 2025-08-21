// ======= Utility: clamp =======
const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

// ======= Navbar toggle (mobile) =======
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a[data-link]').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ======= Scroll progress bar =======
const progress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
  progress.style.width = (scrolled * 100) + '%';
});

// ======= Scroll spy (active link) =======
const sections = ['home','about','skills','projects','testimonials','contact'].map(id => document.getElementById(id));
const links = Array.from(document.querySelectorAll('.nav-link'));
const spy = () => {
  let best = sections[0];
  const y = window.scrollY + 140; // header offset
  for (const s of sections) {
    if (s && s.offsetTop <= y) best = s;
  }
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${best.id}`));
};
window.addEventListener('scroll', spy);
window.addEventListener('load', spy);

// ======= Typing effect =======
const typingEl = document.getElementById('typing');
const titles = [
  'Fullstack Developer',
  'Laravel Artisan',
  'ReactJS Enthusiast',
  'API & Performance Lover'
];
let ti = 0, ci = 0, deleting = false;
function typeLoop(){
  const word = titles[ti % titles.length];
  if(!deleting){
    typingEl.textContent = word.slice(0, ++ci);
    if(ci === word.length){ deleting = true; setTimeout(typeLoop, 1100); return; }
  } else {
    typingEl.textContent = word.slice(0, --ci);
    if(ci === 0){ deleting = false; ti++; }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
if (typingEl) typeLoop();

// ======= Animate skill bars when visible =======
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('visible');
      const bar = e.target.querySelector('.bar span');
      const pct = clamp(parseInt(bar.dataset.skill||'0',10), 0, 100);
      requestAnimationFrame(()=>{ bar.style.width = pct + '%'; });
    }
  });
},{ threshold: 0.25 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ======= Year in footer =======
document.getElementById('year').textContent = new Date().getFullYear();

// ======= Theme toggle (light/dark) =======
const themeBtn = document.getElementById('themeBtn');
const setTheme = (t) => {
  document.documentElement.dataset.theme = t;
  localStorage.setItem('theme', t);
};
const saved = localStorage.getItem('theme');
if(saved) setTheme(saved);
if(themeBtn){
  themeBtn.addEventListener('click', ()=>{
    const current = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    setTheme(current);
  });
}

// Light theme styles (inline for simplicity)
const style = document.createElement('style');
style.textContent = `
  :root, :root[data-theme="dark"] {}
  :root[data-theme="light"]{
    --bg: #f7f8fb; --bg-soft:#ffffff; --card:#ffffff; --text:#0b0e14; --muted:#4b5563;
    --shadow: 0 6px 24px rgba(0,0,0,.08);
  }
  :root[data-theme="light"] .header{background:rgba(255,255,255,.75)}
  :root[data-theme="light"] .btn.outline{border-color:rgba(0,0,0,.15)}
`;
document.head.appendChild(style);

// ======= Minimal animated particles background on the hero canvas =======
(function particles(){
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  const particles = [];
  const COUNT = 80;

  function resize(){
    dpr = window.devicePixelRatio || 1;
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
  }

  function reset(p){
    p.x = Math.random() * w; p.y = Math.random() * h;
    p.vx = (Math.random()-0.5) * 0.3; p.vy = (Math.random()-0.5) * 0.3;
    p.r = 1 + Math.random()*2; p.a = 0.3 + Math.random()*0.5;
  }

  function init(){
    particles.length = 0;
    for(let i=0;i<COUNT;i++){
      const p = {}; reset(p); particles.push(p);
    }
  }

  function tick(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save(); ctx.scale(dpr,dpr);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>w||p.y<0||p.y>h) reset(p);
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(124,58,237,${p.a})`; ctx.fill();
    }
    // subtle connecting lines
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx=a.x-b.x, dy=a.y-b.y; const dist = Math.hypot(dx,dy);
        if(dist<120){
          const op = 1 - (dist/120);
          ctx.strokeStyle = `rgba(6,182,212,${op*0.25})`;
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    ctx.restore();
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', ()=>{ resize(); init(); });
  resize(); init(); tick();
})();
