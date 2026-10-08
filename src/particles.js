export function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '-1'; // Behind everything
  canvas.style.pointerEvents = 'none';

  const particles = [];
  const particleCount = 60;
  const colors = ['#D4A853', '#FFF8E7'];

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Initial random y
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 100; // Start below screen
      this.size = Math.random() * 3 + 1; // 1-4px
      this.speedX = (Math.random() - 0.5) * 0.5; // slow horizontal drift
      this.speedY = Math.random() * 0.5 + 0.2; // slow upward movement
      this.opacity = Math.random() * 0.4 + 0.1; // 0.1-0.5
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.sinValue = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.05 + 0.01;
      this.isTwinkling = Math.random() > 0.5;
      this.baseSize = this.size;
    }

    update() {
      this.y -= this.speedY;
      this.sinValue += 0.01;
      this.x += Math.sin(this.sinValue) * 0.5 + this.speedX;

      if (this.isTwinkling) {
        this.size = this.baseSize + Math.sin(this.sinValue * 2) * 1.5;
        if (this.size < 0.5) this.size = 0.5;
      }

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });
}
