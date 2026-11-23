const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let pieces = [];

function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
resize();
addEventListener('resize', resize);

function confetti(amount = 45) {
  const colors = ['#d98aa8','#c5b17d','#7690a6','#f4a9b8','#fff8dc'];
  for (let i = 0; i < amount; i++) {
    pieces.push({x:Math.random()*innerWidth,y:-20,vx:(Math.random()-.5)*2,vy:1+Math.random()*3,size:4+Math.random()*7,color:colors[Math.random()*colors.length|0],spin:Math.random()*6,life:220+Math.random()*80});
  }
}
function animate() {
  ctx.clearRect(0,0,innerWidth,innerHeight);
  pieces = pieces.filter(p=>p.life>0&&p.y<innerHeight+20);
  pieces.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.spin+=.08;p.life--;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.spin);ctx.globalAlpha=Math.min(1,p.life/30);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2);ctx.restore();});
  requestAnimationFrame(animate);
}
animate();

let current = 1;
const pages = [...document.querySelectorAll('.page')];

function goTo(pageNumber) {
  if (pageNumber === current) return;
  const oldPage = pages[current - 1];
  const newPage = pages[pageNumber - 1];
  const goingForward = pageNumber > current || (current === 4 && pageNumber === 1);
  newPage.classList.add('incoming');
  oldPage.classList.add(goingForward ? 'turning-out' : 'turning-back');
  setTimeout(() => {
    oldPage.classList.remove('active','turning-out','turning-back');
    newPage.classList.remove('incoming');
    newPage.classList.add('active');
    current = pageNumber;
    if (pageNumber === 2) {
      const age = newPage.querySelector('.age-page') || newPage;
      age.classList.remove('animate-age');
      void age.offsetWidth;
      age.classList.add('animate-age');
      const counter = document.getElementById('ageCounter');
      counter.textContent = '0';
      let value = 0;
      cancelAnimationFrame(window.ageFrame);
      const startedAt = performance.now() + 500;
      const countNext = now => {
        if (now < startedAt) {
          window.ageFrame = requestAnimationFrame(countNext);
          return;
        }
        value = Math.min(20, Math.floor((now - startedAt) / 75) + 1);
        counter.textContent = String(value);
        if (value < 20) window.ageFrame = requestAnimationFrame(countNext);
      };
      counter.textContent = '0';
      window.ageFrame = requestAnimationFrame(countNext);
    }
    if (pageNumber === 3) confetti(35);
  }, 720);
}

document.querySelectorAll('[data-next]').forEach(button => {
  button.addEventListener('click', () => goTo(Number(button.dataset.next)));
});

addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' && current < 4) goTo(current + 1);
  if (e.key === 'ArrowLeft' && current > 1) goTo(current - 1);
});

let touchStart = 0;
addEventListener('touchstart', e => touchStart=e.changedTouches[0].clientX, {passive:true});
addEventListener('touchend', e => {
  const delta=e.changedTouches[0].clientX-touchStart;
  if (Math.abs(delta)>60) delta<0&&current<4 ? goTo(current+1) : delta>0&&current>1 ? goTo(current-1) : null;
}, {passive:true});

setTimeout(()=>confetti(70),700);
