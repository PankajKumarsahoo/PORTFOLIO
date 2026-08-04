/* ============ PRELOADER ============ */
(function(){
  let hidden = false;
  function hidePreloader(){
    if(hidden) return;
    hidden = true;
    const pre = document.getElementById('preloader');
    if(pre) pre.classList.add('hide');
  }
  window.addEventListener('load', ()=> setTimeout(hidePreloader, 400));
  setTimeout(hidePreloader, 2500);
})();

/* ============ THEME TOGGLE ============ */
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
if(themeToggle){
  themeToggle.addEventListener('click', ()=>{
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.querySelector('i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  });
}

/* ============ MOBILE NAV ============ */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if(burger && navLinks) burger.addEventListener('click', ()=> navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(link=>{
  link.addEventListener('click', ()=> navLinks && navLinks.classList.remove('open'));
});

/* active nav link on scroll + scroll progress bar */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
const progressFill = document.getElementById('progressFill');
window.addEventListener('scroll', ()=>{
  let current = '';
  sections.forEach(sec=>{
    const top = sec.offsetTop - 140;
    if(scrollY >= top) current = sec.getAttribute('id');
  });
  navItems.forEach(a=>{
    if(current) a.classList.toggle('active', a.getAttribute('href') === '#'+current);
  });
  const toTopBtn = document.getElementById('toTop');
  if(toTopBtn) toTopBtn.classList.toggle('show', scrollY > 600);

  if(progressFill){
    const doc = document.documentElement;
    const scrollPct = (doc.scrollTop) / (doc.scrollHeight - doc.clientHeight) * 100;
    progressFill.style.width = scrollPct + '%';
  }
});

/* ============ BACK TO TOP ============ */
const toTop = document.getElementById('toTop');
if(toTop) toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

/* ============ REVEAL ON SCROLL ============ */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

/* ============ COUNTER ANIMATION ============ */
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el = e.target; const target = +el.dataset.count; let cur = 0;
      const step = Math.max(1, target/40);
      const t = setInterval(()=>{
        cur += step;
        if(cur >= target){ cur = target; clearInterval(t);}
        el.textContent = Math.round(cur) + (target>=10?'+':'');
      }, 30);
      counterIO.unobserve(el);
    }
  });
},{threshold:.5});
counters.forEach(c=> counterIO.observe(c));

/* ============ SKILL BARS ============ */
const bars = document.querySelectorAll('.bar-fill');
const barIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.style.width = e.target.dataset.width + '%'; barIO.unobserve(e.target); }
  });
},{threshold:.4});
bars.forEach(b=> barIO.observe(b));

/* ============ PROJECT FILTER ============ */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    filterBtns.forEach(b=> b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projectCards.forEach(card=>{
      const cats = card.dataset.cat || '';
      const show = f === 'all' || cats.includes(f);
      card.style.display = show ? '' : 'none';
    });
  });
});

/* ============ 3D TILT EFFECT FOR ALL CARDS ============ */
const allCards = document.querySelectorAll('.card, .photo-frame, .about-visual');
allCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
  });
});

/* ============ CUSTOM CURSOR ============ */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const cursorLabel = document.getElementById('cursorLabel');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarse = window.matchMedia('(pointer: coarse)').matches;
const cursorColorMap = { cyan:'var(--cyan)', violet:'var(--violet)', pink:'var(--pink)', amber:'var(--amber)', green:'var(--green)' };

if(!reduceMotion && !isCoarse && cursorDot && cursorRing){
  let mx = -100, my = -100, rx = -100, ry = -100;
  window.addEventListener('mousemove', (e)=>{
    mx = e.clientX; my = e.clientY;
    cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });
  function ringLoop(){
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(ringLoop);
  }
  ringLoop();

  document.querySelectorAll('a, button, input, textarea, .card:not([data-cursor-label])').forEach(el=>{
    el.addEventListener('mouseenter', ()=> cursorRing.classList.add('grow'));
    el.addEventListener('mouseleave', ()=> cursorRing.classList.remove('grow'));
  });

  document.querySelectorAll('[data-cursor-label]').forEach(el=>{
    el.addEventListener('mouseenter', ()=>{
      cursorLabel.textContent = el.dataset.cursorLabel;
      cursorRing.classList.add('label-mode');
      cursorDot.classList.add('hide');
    });
    el.addEventListener('mouseleave', ()=>{
      cursorRing.classList.remove('label-mode');
      cursorDot.classList.remove('hide');
    });
  });

  const cursorSections = document.querySelectorAll('section[data-cursor]');
  const cursorSectionIO = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const key = entry.target.dataset.cursor;
        document.documentElement.style.setProperty('--cursor-color', cursorColorMap[key] || 'var(--cyan)');
      }
    });
  }, { threshold: 0.5 });
  cursorSections.forEach(sec => cursorSectionIO.observe(sec));
} else {
  document.body.classList.add('no-cursor');
}

/* ============ MAGNETIC BUTTONS ============ */
if(!reduceMotion && !isCoarse){
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove', (e)=>{
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      el.style.transform = `translate(${x*0.18}px, ${y*0.3}px)`;
    });
    el.addEventListener('mouseleave', ()=>{ el.style.transform = 'translate(0,0)'; });
  });
}

/* ============ CONTACT FORM ============ */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(formStatus) formStatus.textContent = 'Sending…';
    setTimeout(()=>{
      if(formStatus) formStatus.textContent = "Message sent! I'll get back to you soon. ✅";
      contactForm.reset();
      showToast('Message sent successfully!');
    }, 900);
  });
}

/* ============ COPY EMAIL ============ */
const copyEmailBtn = document.getElementById('copyEmail');
if(copyEmailBtn){
  copyEmailBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    navigator.clipboard.writeText('pankajsahoo8260@gmail.com').then(()=>{
      showToast('Email copied to clipboard!');
    }).catch(()=> showToast('Could not copy — email is pankajsahoo8260@gmail.com'));
  });
}

/* ============ CLICK RIPPLE — new micro-interaction on icon buttons ============ */
function addRipple(e, el){
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
  el.appendChild(ripple);
  setTimeout(()=> ripple.remove(), 650);
}
if(!reduceMotion){
  document.querySelectorAll('.social-icon, a.contact-icon, .chat-fab, .copy-btn').forEach(el=>{
    el.style.position = el.style.position || 'relative';
    el.addEventListener('click', (e)=> addRipple(e, el));
  });
}

/* ============ TOAST ============ */
function showToast(msg){
  const toast = document.getElementById('toast');
  if(!toast) return;
  const toastMsg = document.getElementById('toastMsg');
  if(toastMsg) toastMsg.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(()=> toast.classList.remove('show'), 3000);
}

/* ============ DOWNLOAD CV (demo) ============ */
const downloadCvBtn = document.getElementById('downloadCv');
if(downloadCvBtn){
  downloadCvBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    showToast('CV download coming soon — check back later!');
  });
}

/* ============ AMBIENT VIDEO + CLICK-TO-UNMUTE SOUND — reusable everywhere ============
   Used for the big hero video (home), the projects background video, and the
   compact page-hero banner video on every other page. Hovering the section
   unmutes automatically (unless the user has manually muted via the button);
   clicking the round sound button always toggles it directly, so the sound
   control is clickable on every section that has one. */
function initAmbientVideo(sectionEl, videoEl, hintEl){
  if(!videoEl || !sectionEl) return;
  if(reduceMotion){
    videoEl.pause();
    videoEl.style.display = 'none';
    if(hintEl) hintEl.style.display = 'none';
    return;
  }
  videoEl.volume = 0.55;
  videoEl.addEventListener('error', ()=>{ videoEl.style.display = 'none'; if(hintEl) hintEl.style.display = 'none'; });

  /* Video always plays in the background, regardless of the pointer.
     Sound is controlled only by clicking the round sound button below —
     hovering/leaving the section no longer mutes or restarts it. */
  videoEl.play().catch(()=>{});

  if(hintEl){
    hintEl.addEventListener('click', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      videoEl.muted = !videoEl.muted;
      hintEl.classList.toggle('active', !videoEl.muted);
      hintEl.querySelector('i').className = videoEl.muted
        ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
      if(!videoEl.muted) videoEl.play().catch(()=>{});
    });
  }
}

initAmbientVideo(document.getElementById('home'), document.getElementById('heroBgVideo'), document.getElementById('heroSoundHint'));
initAmbientVideo(document.getElementById('projects'), document.getElementById('projectsBgVideo'), document.getElementById('projectsSoundHint'));
/* every compact page-hero banner (About/Skills/Projects list/Journey/Blog/Contact/detail pages) */
document.querySelectorAll('.page-hero').forEach(sec=>{
  const vid = sec.querySelector('.page-hero-video');
  const hint = sec.querySelector('.page-hero-sound');
  initAmbientVideo(sec, vid, hint);
});

/* ============ PARTICLE BACKGROUND CANVAS ============ */
const canvas = document.getElementById('bg-canvas');
if(canvas){
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function initParticles(){
    const count = Math.min(70, Math.floor(window.innerWidth/22));
    particles = Array.from({length:count}, ()=> ({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.6 + 0.4,
      vx: (Math.random()-0.5)*0.25,
      vy: (Math.random()-0.5)*0.25,
      hue: Math.random() > 0.5 ? '139,92,246' : '34,211,238'
    }));
  }
  function animateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r*1.8, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${p.hue},0.55)`;
      ctx.fill();
    });
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if(d < 120){
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle = `rgba(139,92,246,${0.12*(1-d/120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  resizeCanvas(); initParticles(); animateParticles();
  window.addEventListener('resize', ()=>{ resizeCanvas(); initParticles(); });
}

/* ============================================================
   FLOATING AI CHATBOT WIDGET — corner icon → iframe chat panel
   ============================================================ */
const chatFab = document.getElementById('chatFab');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatFrame = document.getElementById('chatFrame');
let chatFrameLoaded = false;

function buildChatFrameSrcDoc(){
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<style>
:root{--violet:#8b5cf6;--cyan:#22d3ee;--pink:#f472b6;--green:#34d399;--bg:#111627;--bg2:#161c30;--border:rgba(148,163,184,.16);--text:#e7ecf7;--dim:#94a3b8;}
*{box-sizing:border-box;}
body{margin:0;font-family:Inter,sans-serif;background:var(--bg);color:var(--text);display:flex;flex-direction:column;height:100vh;overflow:hidden;}
.win{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:12px;}
.msg{max-width:82%;padding:11px 14px;border-radius:14px;font-size:13.5px;line-height:1.5;animation:in .3s ease;}
@keyframes in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
.msg.bot{background:var(--bg2);border:1px solid var(--border);border-bottom-left-radius:4px;align-self:flex-start;}
.msg.user{background:linear-gradient(120deg,var(--violet),var(--cyan));color:#fff;border-bottom-right-radius:4px;align-self:flex-end;}
.dots{display:inline-flex;gap:4px;}
.dots span{width:6px;height:6px;border-radius:50%;background:var(--dim);animation:blink 1.2s infinite;}
.dots span:nth-child(2){animation-delay:.2s;}
.dots span:nth-child(3){animation-delay:.4s;}
@keyframes blink{0%,80%,100%{opacity:.25;}40%{opacity:1;}}
.suggest{display:flex;gap:8px;flex-wrap:wrap;padding:0 16px 12px;}
.chip{padding:7px 12px;border-radius:100px;border:1px solid var(--border);font-size:11.5px;color:var(--dim);background:var(--bg2);cursor:pointer;}
.chip:hover{border-color:var(--cyan);color:var(--text);}
.input-row{display:flex;gap:8px;padding:14px;border-top:1px solid var(--border);flex-shrink:0;}
input{flex:1;background:#0d111f;border:1px solid var(--border);border-radius:11px;padding:11px 14px;color:var(--text);font-size:13.5px;outline:none;}
input:focus{border-color:var(--violet);}
.send{width:40px;height:40px;border-radius:11px;background:linear-gradient(120deg,var(--violet),var(--cyan));color:#fff;border:0;flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;}
::-webkit-scrollbar{width:8px;}::-webkit-scrollbar-thumb{background:var(--bg2);border-radius:8px;}
</style></head>
<body>
<div class="win" id="win"><div class="msg bot">Hello! I'm your AI assistant. Ask me anything about Pankaj Kumar Sahoo — his skills, projects, or how to get in touch.</div></div>
<div class="suggest">
  <div class="chip" data-q="What are your skills?">What are your skills?</div>
  <div class="chip" data-q="Tell me about your projects">Projects</div>
  <div class="chip" data-q="How can I contact you?">Contact</div>
</div>
<div class="input-row">
  <input id="inp" placeholder="Type your question…" autocomplete="off">
  <button class="send" id="send"><i class="fa-solid fa-paper-plane"></i></button>
</div>
<script>
const kb=[
 {k:['skill','know','good at','expertise'],r:"Pankaj works with Python, TensorFlow, PyTorch, SQL, HTML/CSS/JavaScript — plus tools like Git, Streamlit and LangChain for building AI applications."},
 {k:['project','built','work','portfolio'],r:"He's built a Medical Research Chatbot (RAG), EyeCareAI for eye-disease prediction, a satellite-based Land Mining Detection system, a Crop Yield Predictor, a Resume Screener and a Sentiment Analysis Dashboard — check the Projects page!"},
 {k:['technolog','tech stack','tools','frameworks'],r:"His stack includes Python, TensorFlow, PyTorch, Keras, LangChain, Streamlit, SQL and modern frontend tools like HTML, CSS and JavaScript."},
 {k:['experience','years','background'],r:"Pankaj is a Computer Science Engineering student with 2+ years learning AI/ML, and has completed 10+ hands-on projects."},
 {k:['contact','reach','email','hire','collaborate'],r:"You can reach him at pankajsahoo8260@gmail.com or +91 8260933150 — or use the contact form on the site!"},
 {k:['hobby','interest','passion','about you','who are you','who is'],r:"He's an AI/ML Engineer, Data Enthusiast and Problem Solver — passionate about turning ideas into real-world, impactful applications."},
 {k:['blog','article','post','write'],r:"He writes about RAG, deep learning, MLOps and the Python libraries he uses — check the Blog page for the full list."},
 {k:['hello','hi','hey'],r:"Hey there! 👋 Ask me about Pankaj's skills, projects, or how to get in touch."},
];
function reply(q){
  const s=q.toLowerCase();
  for(const item of kb){ if(item.k.some(k=>s.includes(k))) return item.r; }
  return "Great question! For details beyond my knowledge, reach out directly via pankajsahoo8260@gmail.com.";
}
const win=document.getElementById('win'), inp=document.getElementById('inp');
function append(t,c){const d=document.createElement('div');d.className='msg '+c;d.textContent=t;win.appendChild(d);win.scrollTop=win.scrollHeight;return d;}
function send(text){
  const v=(text!==undefined?text:inp.value).trim();
  if(!v)return;
  append(v,'user'); inp.value='';
  const t=document.createElement('div'); t.className='msg bot';
  t.innerHTML='<span class="dots"><span></span><span></span><span></span></span>';
  win.appendChild(t); win.scrollTop=win.scrollHeight;
  setTimeout(()=>{ t.textContent=reply(v); win.scrollTop=win.scrollHeight; }, 650+Math.random()*400);
}
document.getElementById('send').addEventListener('click',()=>send());
inp.addEventListener('keydown',e=>{ if(e.key==='Enter') send(); });
document.querySelectorAll('.chip').forEach(c=> c.addEventListener('click',()=> send(c.dataset.q)));
inp.focus();
<\/script>
</body></html>`;
}

const fabPeek = document.getElementById('fabPeek');
function hidePeek(){ if(fabPeek) fabPeek.classList.remove('show'); }
if(fabPeek){
  setTimeout(()=>{
    if(chatPanel && !chatPanel.classList.contains('open')) fabPeek.classList.add('show');
    setTimeout(hidePeek, 5000);
  }, 2600);
}

function openChat(){
  hidePeek();
  if(!chatFrameLoaded){
    chatFrame.srcdoc = buildChatFrameSrcDoc();
    chatFrameLoaded = true;
  }
  chatPanel.classList.add('open');
  chatPanel.setAttribute('aria-hidden','false');
  chatFab.classList.add('open');
  chatFab.setAttribute('aria-label','Close AI assistant');
}
function closeChat(){
  chatPanel.classList.remove('open');
  chatPanel.setAttribute('aria-hidden','true');
  chatFab.classList.remove('open');
  chatFab.setAttribute('aria-label','Open AI assistant');
}
if(chatFab && chatPanel){
  chatFab.addEventListener('click', ()=>{
    chatPanel.classList.contains('open') ? closeChat() : openChat();
  });
  if(chatClose) chatClose.addEventListener('click', closeChat);
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && chatPanel.classList.contains('open')) closeChat();
  });
  document.addEventListener('click', (e)=>{
    const widget = document.getElementById('chatWidget');
    if(chatPanel.classList.contains('open') && widget && !widget.contains(e.target)) closeChat();
  });
}