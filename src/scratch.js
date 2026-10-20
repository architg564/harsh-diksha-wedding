import { playSparkleChime } from './sounds.js';

export function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  const container = document.getElementById('scratch-card-wrapper');
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  let isDrawing = false;
  let isRevealed = false;
  let hasDrawnFoil = false;
  let isScratchedYet = false;
  let lastPos = null;

  function getDimensions() {
    const rect = container.getBoundingClientRect();
    const w = container.clientWidth || container.offsetWidth || Math.round(rect.width) || 440;
    const h = container.clientHeight || container.offsetHeight || Math.round(rect.height) || 260;
    return {
      width: Math.max(w, 280),
      height: Math.max(h, 200)
    };
  }

  function resizeAndDrawFoil(force = false) {
    if (isRevealed) return;
    if (isScratchedYet && !force) return; // Preserve scratch progress if user has already started

    const { width, height } = getDimensions();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.save();
    ctx.scale(dpr, dpr);
    drawFoilCover(width, height);
    ctx.restore();
    hasDrawnFoil = true;
  }

  function drawFoilCover(width, height) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    // Rich antique gold metallic gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#F5DEB3');
    grad.addColorStop(0.2, '#D4AF37');
    grad.addColorStop(0.4, '#FFF8DC');
    grad.addColorStop(0.65, '#B8860B');
    grad.addColorStop(0.85, '#CF9B38');
    grad.addColorStop(1, '#8C6721');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative inner borders
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.strokeStyle = 'rgba(92, 64, 12, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    // Glitter flecks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    for (let i = 0; i < 50; i++) {
      const rx = (i * 47) % width;
      const ry = (i * 31) % height;
      ctx.beginPath();
      ctx.arc(rx, ry, (i % 3) + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sparkle Icons
    ctx.fillStyle = '#4A2E05';
    ctx.font = 'bold 16px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ SCRATCH TO UNVEIL THE DATE ✦', width / 2, height / 2 - 14);

    ctx.font = 'italic 14px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#5A3E0C';
    ctx.fillText('Swipe or drag to reveal the auspicious day', width / 2, height / 2 + 14);

    ctx.font = '12px "Cinzel", serif';
    ctx.fillStyle = '#7C5815';
    ctx.fillText('✦ SIDDHESH RESORT · 2026 ✦', width / 2, height / 2 + 38);

    ctx.restore();
  }

  function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Scale coordinates accurately even if element has dynamic CSS width/height
    const scaleX = (canvas.width / dpr) / rect.width;
    const scaleY = (canvas.height / dpr) / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function scratch(pos) {
    if (!pos || isRevealed) return;
    isScratchedYet = true;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 42;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    if (lastPos) {
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
    } else {
      ctx.arc(pos.x, pos.y, 21, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.restore();

    lastPos = pos;
    checkProgress();
  }

  let checkThrottle = 0;
  function checkProgress() {
    const now = Date.now();
    if (now - checkThrottle < 180 || isRevealed) return;
    checkThrottle = now;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;
      const totalPixels = pixels.length / 4;

      // Sample every 32nd pixel for instant smooth performance
      for (let i = 3; i < pixels.length; i += 128) {
        if (pixels[i] === 0) transparentCount++;
      }

      const scratchedRatio = transparentCount / (totalPixels / 32);
      if (scratchedRatio > 0.38) {
        revealCompletely();
      }
    } catch (err) {
      console.warn('Canvas check error:', err);
    }
  }

  function revealCompletely() {
    if (isRevealed) return;
    isRevealed = true;
    playSparkleChime();

    if (window.triggerPetalShower) {
      const rect = container.getBoundingClientRect();
      window.triggerPetalShower(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
    }

    canvas.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    canvas.style.opacity = '0';
    canvas.style.transform = 'scale(1.04)';
    canvas.style.pointerEvents = 'none';

    setTimeout(() => {
      canvas.remove();
      const badge = document.getElementById('revealed-badge');
      if (badge) badge.classList.add('is-revealed');
    }, 750);
  }

  // Pointer Events (unifies Mouse, Touch & Pen seamlessly across all devices)
  const onPointerDown = (e) => {
    isDrawing = true;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (_) {}
    lastPos = getPointerPos(e);
    scratch(lastPos);
  };

  const onPointerMove = (e) => {
    if (!isDrawing) return;
    scratch(getPointerPos(e));
  };

  const onPointerUp = (e) => {
    isDrawing = false;
    lastPos = null;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  // ResizeObserver for robust layout detection
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => {
      if (!isRevealed && !isScratchedYet) {
        resizeAndDrawFoil();
      }
    });
    ro.observe(container);
  }

  // IntersectionObserver to guarantee foil is drawn the moment section is viewed
  if (window.IntersectionObserver) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasDrawnFoil && !isRevealed) {
          resizeAndDrawFoil(true);
        }
      });
    }, { threshold: 0.1 });
    io.observe(container);
  }

  window.addEventListener('resize', () => {
    if (!isRevealed && !isScratchedYet) {
      resizeAndDrawFoil();
    }
  });

  // Safe initial render
  resizeAndDrawFoil(true);
  setTimeout(() => resizeAndDrawFoil(true), 250);
  setTimeout(() => resizeAndDrawFoil(true), 600);
}
