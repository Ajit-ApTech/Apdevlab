/**
 * particles.js — Canvas Particle/Network Background System
 * Apdevlab — Premium Agency Website
 */

class ParticleSystem {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.opts = Object.assign({
      count: 80,
      lineDistance: 120,
      repelRadius: 100,
      color: '6,182,212',
      partMinRadius: 1.5,
      partMaxRadius: 2,
      partMinOpacity: 0.3,
      partMaxOpacity: 0.5,
      maxVelocity: 0.3,
      maxRepelVelocity: 2,
    }, options);

    this.particles = [];
    this.mouse = { x: -9999, y: -9999 };
    this.animFrame = null;
    this.lastTime = 0;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();

    if (!this.prefersReducedMotion) {
      this.loop(0);
    } else {
      this.drawStatic();
    }
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.canvas.width  = parent ? parent.offsetWidth  : window.innerWidth;
    this.canvas.height = parent ? parent.offsetHeight : window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.opts.count; i++) {
      this.particles.push({
        x:       Math.random() * this.canvas.width,
        y:       Math.random() * this.canvas.height,
        vx:      (Math.random() - 0.5) * this.opts.maxVelocity * 2,
        vy:      (Math.random() - 0.5) * this.opts.maxVelocity * 2,
        radius:  this.opts.partMinRadius + Math.random() * (this.opts.partMaxRadius - this.opts.partMinRadius),
        opacity: this.opts.partMinOpacity + Math.random() * (this.opts.partMaxOpacity - this.opts.partMinOpacity),
      });
    }
  }

  bindEvents() {
    const isTouch = window.matchMedia('(hover: none)').matches;

    if (!isTouch) {
      document.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });
      document.addEventListener('mouseleave', () => {
        this.mouse.x = -9999;
        this.mouse.y = -9999;
      });
    } else {
      document.addEventListener('touchmove', (e) => {
        const rect  = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.mouse.x = touch.clientX - rect.left;
        this.mouse.y = touch.clientY - rect.top;
      }, { passive: true });
      document.addEventListener('touchend', () => {
        this.mouse.x = -9999;
        this.mouse.y = -9999;
      });
    }

    // Throttled resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.resize();
        this.createParticles();
      }, 150);
    });
  }

  update() {
    const { width, height } = this.canvas;
    const { repelRadius, maxRepelVelocity, maxVelocity } = this.opts;

    for (const p of this.particles) {
      // Mouse repulsion
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < repelRadius && dist > 0) {
        const force = (repelRadius - dist) / repelRadius;
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * 0.4;
        p.vy += Math.sin(angle) * force * 0.4;
      }

      // Clamp velocity
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxRepelVelocity) {
        p.vx = (p.vx / speed) * maxRepelVelocity;
        p.vy = (p.vy / speed) * maxRepelVelocity;
      }

      // Friction
      if (speed > maxVelocity) {
        p.vx *= 0.96;
        p.vy *= 0.96;
      }

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0)     { p.x = 0;     p.vx = Math.abs(p.vx); }
      if (p.x > width) { p.x = width; p.vx = -Math.abs(p.vx); }
      if (p.y < 0)     { p.y = 0;     p.vy = Math.abs(p.vy); }
      if (p.y > height){ p.y = height; p.vy = -Math.abs(p.vy); }
    }
  }

  draw() {
    const { ctx, canvas, opts: { color, lineDistance }, particles } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a  = particles[i];
        const b  = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);

        if (d < lineDistance) {
          const alpha = (1 - d / lineDistance) * 0.4;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${color},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw dots
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${p.opacity})`;
      ctx.fill();
    }
  }

  drawStatic() {
    // Draw once, no animation
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${this.opts.color},${p.opacity * 0.5})`;
      this.ctx.fill();
    }
  }

  loop(timestamp) {
    // Cap to ~60fps
    const delta = timestamp - this.lastTime;
    if (delta >= 16) {
      this.lastTime = timestamp;
      this.update();
      this.draw();
    }
    this.animFrame = requestAnimationFrame((t) => this.loop(t));
  }

  destroy() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }
}

// Initialise after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window._heroParticles = new ParticleSystem('canvas-hero', { count: 80 });
  window._techParticles = new ParticleSystem('canvas-tech', { count: 50 });
});
