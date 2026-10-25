// namratasri.com — shared scripts
(function () {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Faint gaze-fixation pattern behind dark headers (decorative)
  document.querySelectorAll('svg.fixations').forEach((svg, k) => {
    const w = 1400, h = 700;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    let seed = 113 + k * 977;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    let out = '', x = 520, y = 120;
    for (let i = 0; i < 34; i++) {
      const nx = Math.min(w - 30, Math.max(480, x + (rnd() - .3) * 170));
      const ny = Math.min(h - 30, Math.max(30, y + (rnd() - .45) * 160));
      if (nx > w - 60) { x = 520 + rnd() * 200; y = 80 + rnd() * 540; continue; }
      out += `<line x1="${x}" y1="${y}" x2="${nx}" y2="${ny}" stroke="#8FB0E8" stroke-opacity=".16" stroke-width="1.2"/>`;
      x = nx; y = ny;
      out += `<circle cx="${x}" cy="${y}" r="${6 + rnd() * 22}" fill="#5D8BF0" fill-opacity="${.06 + rnd() * .08}" stroke="#8FB0E8" stroke-opacity=".22"/>`;
    }
    svg.innerHTML = out;
  });

  // Learning curve draws itself once when it scrolls into view
  const path = document.getElementById('drawpath');
  if (path && !calm && 'IntersectionObserver' in window) {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) {
        path.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1)';
        path.style.strokeDashoffset = 0;
        io.disconnect();
      }
    }), { threshold: .5 });
    io.observe(document.getElementById('curve'));
  }

  // "Ask about my research" chat with pre-written answers (no AI calls)
  const answers = {
    build: "SciStory, a story-based science game where AI characters help students gather evidence and argue a case, and LearnLens, a dashboard that summarizes students' open-ended responses so teachers can act during the lesson.",
    before: "During my PhD I used eye-tracking and thermal imaging to measure cognitive load. At Monash, I worked on learning analytics at scale, including 7M+ course enrollment records.",
    measure: "I look past clicks and time-on-task to students' strategies, sequences of actions, attention, and cognitive load, and connect them to learning outcomes.",
    roles: "Yes. I'm looking for research scientist and data science roles in industry, especially where AI meets learning. Email me at namratasrivastava.research@gmail.com."
  };
  const log = document.getElementById('chatlog');
  document.querySelectorAll('#chips button').forEach(b => b.addEventListener('click', () => {
    b.disabled = true;
    const q = document.createElement('div'); q.className = 'msg me'; q.textContent = b.textContent; log.appendChild(q);
    const a = document.createElement('div'); a.className = 'msg bot'; a.textContent = '…'; log.appendChild(a);
    log.scrollTop = log.scrollHeight;
    setTimeout(() => { a.textContent = answers[b.dataset.q]; log.scrollTop = log.scrollHeight; }, calm ? 0 : 650);
  }));

  // Publication year filters
  const filters = document.querySelectorAll('.filters button');
  filters.forEach(b => b.addEventListener('click', () => {
    filters.forEach(x => x.setAttribute('aria-pressed', x === b));
    document.querySelectorAll('.year-group').forEach(g => {
      g.hidden = !(b.dataset.year === 'all' || g.dataset.year === b.dataset.year || (b.dataset.year === 'older' && +g.dataset.year < 2022));
    });
  }));
})();

// Skill explorer: show the projects that use a selected skill
(function () {
  const chips = document.querySelectorAll('.skill-chips button');
  const cards = document.querySelectorAll('.evidence .ev');
  const count = document.querySelector('.skill-count');
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.setAttribute('aria-pressed', c === chip));
    const k = chip.dataset.skill; let n = 0;
    cards.forEach(card => {
      const show = k === 'all' || card.dataset.skills.split(' ').includes(k);
      card.hidden = !show; if (show) n++;
    });
    if (count) count.textContent = n + (n === 1 ? ' project' : ' projects');
  }));
})();
