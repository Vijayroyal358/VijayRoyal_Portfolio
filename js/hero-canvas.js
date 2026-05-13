/**
 * SVK Portfolio — 3D Hero Canvas: Network Topology
 * Floating nodes connected by lines — relevant for a Telecom Engineer
 */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, nodes, animId;

  // Theme-aware colors — recalculate on each frame
  function getColors() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      gold:  isLight ? 'rgba(120,90,20,'   : 'rgba(201,168,76,',
      blue:  isLight ? 'rgba(60,80,180,'   : 'rgba(99,150,255,',
      white: isLight ? 'rgba(40,60,120,'   : 'rgba(200,215,255,',
      // Visibility multipliers - reduced by 25% for balance
      nodeMax: isLight ? 0.42 : 0.72,
      connMax: isLight ? 0.22 : 0.42,
      gridMax: isLight ? 0.09 : 0.14,
    };
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Node {
    constructor() { this.reset(true); }

    reset(init) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : -20;
      this.r    = Math.random() * 1.4 + 0.6;  // 0.6–2.0px
      this.vx   = (Math.random() - 0.5) * 0.28;
      this.vy   = (Math.random() - 0.5) * 0.28;
      this.life = Math.random();
      this.speed = Math.random() * 0.002 + 0.0008;
      this.isGold = Math.random() < 0.18; 
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life += this.speed;

      // Wrap edges
      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H + 20) this.y = -20;
    }

    draw() {
      const { gold, white, nodeMax } = getColors();
      const pulse = (Math.sin(this.life * Math.PI * 2) + 1) / 2;
      const alpha = (0.2 + pulse * 0.5) * nodeMax; // Stronger alpha
      const color = this.isGold ? gold : white;

      // Glow halo - more visible
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 6);
      grd.addColorStop(0, color + (alpha * 0.6) + ')');
      grd.addColorStop(0.4, color + (alpha * 0.2) + ')');
      grd.addColorStop(1, color + '0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 6, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = color + (alpha * 1.2) + ')';
      ctx.fill();
    }
  }

  function drawConnections() {
    const { gold, blue, connMax } = getColors();
    const MAX_DIST = 150; // Increased range
    const now = Date.now() / 1000;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * connMax;
          const isGoldConn = nodes[i].isGold || nodes[j].isGold;
          const color = isGoldConn ? gold : blue;

          // Main line
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = color + alpha + ')';
          ctx.lineWidth = 0.6; 
          ctx.stroke();

          // Data packet "pulse" moving along line
          if (dist < 110 && Math.random() < 0.08) {
            const time = (now + i + j) % 1.6 / 1.6; 
            const px = nodes[i].x + (nodes[j].x - nodes[i].x) * time;
            const py = nodes[i].y + (nodes[j].y - nodes[i].y) * time;
            
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = color + (alpha * 2.2) + ')';
            ctx.fill();
          }
        }
      }
    }
  }

  function drawGrid() {
    const { gold, gridMax } = getColors();
    const LINES = 10;
    const vanishY = H * 0.72;
    const groundY = H + 60;

    ctx.save();
    for (let i = 0; i <= LINES; i++) {
      const t = i / LINES;
      const perspective = Math.pow(t, 2);
      const lineY = vanishY + (groundY - vanishY) * perspective;
      const spread = (lineY - vanishY) * 1.4;
      const alpha = (1 - t) * gridMax;

      ctx.beginPath();
      ctx.moveTo(W / 2 - spread, lineY);
      ctx.lineTo(W / 2 + spread, lineY);
      ctx.strokeStyle = gold + alpha + ')';
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }

    const VLINES = 8;
    for (let i = 0; i <= VLINES; i++) {
      const t = (i / VLINES) - 0.5;
      const alpha = (1 - Math.abs(t) * 1.6) * gridMax;
      if (alpha <= 0) continue;
      const endX = W / 2 + t * (W * 1.3);
      ctx.beginPath();
      ctx.moveTo(W / 2, vanishY);
      ctx.lineTo(endX, groundY);
      ctx.strokeStyle = gold + alpha + ')';
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }
    ctx.restore();
  }

  function init() {
    resize();
    // Balanced density
    const count = Math.min(65, Math.floor((W * H) / 13000));
    nodes = Array.from({ length: count }, () => new Node());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawConnections();
    nodes.forEach(n => { n.update(); n.draw(); });
    animId = requestAnimationFrame(loop);
  }

  // Start
  init();
  loop();

  // Resize handler
  const ro = new ResizeObserver(() => { resize(); });
  ro.observe(canvas);

  // Pause when hidden (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(animId); }
    else { loop(); }
  });

  // Mouse interaction — nodes repel from cursor gently
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    nodes.forEach(n => {
      const dx = n.x - mx;
      const dy = n.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.6;
        n.vx += (dx / dist) * force;
        n.vy += (dy / dist) * force;
        // Clamp velocity
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > 1.5) { n.vx = (n.vx / speed) * 1.5; n.vy = (n.vy / speed) * 1.5; }
      }
    });
  }, { passive: true });

})();
