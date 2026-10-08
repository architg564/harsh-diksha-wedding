import { playSparkleChime } from './sounds.js';

export function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  const container = document.getElementById('scratch-card-wrapper');
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  let isDrawing = false;
  let isRevealed = false;
  let lastPos = null;

  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    drawFoilCover(rect.width, rect.height);
  }

  function drawFoilCover(width, height) {
    if (isRevealed) return;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    // Rich antique gold metallic gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#E6C687');
    grad.addColorStop(0.25, '#B8860B');
    grad.addColorStop(0.5, '#F9E4B7');
    grad.addColorStop(0.75, '#C59A3F');
    grad.addColorStop(1, '#8C6721');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Rajasthani border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.strokeStyle = '#6B4E12';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    // Subtle gold glitter specks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 40; i++) {
      const rx = (i * 37) % width;
      const ry = (i * 23) % height;
      ctx.beginPath();
      ctx.arc(rx, ry, (i % 3) + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Proclamation Text
    ctx.fillStyle = '#2B1A04';
    ctx.font = 'bold 15px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ SCRATCH TO REVEAL ✦', width / 2, height / 2 - 12);

    ctx.font = 'italic 13px "Cormorant Garamond", serif';
    ctx.fillStyle = '#4A3408';
    ctx.fillText('Touch or drag to unveil the auspicious date', width / 2, height / 2 + 14);

    ctx.restore();
  }

  function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratch(pos) {
    if (!pos || isRevealed) return;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 36;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    if (lastPos) {
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
    } else {
      ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.restore();

    lastPos = pos;
    checkProgress();
  }

  let checkThrottle = 0;
  function checkProgress() {
    const now = Date.now();
    if (now - checkThrottle < 200 || isRevealed) return;
    checkThrottle = now;

    try {
      const dpr = window.devicePixelRatio || 1;
      const sampleW = Math.floor(canvas.width / 4);
      const sampleH = Math.floor(canvas.height / 4);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;
      const totalPixels = pixels.length / 4;

      // Sample every 16th pixel for high performance
      for (let i = 3; i < pixels.length; i += 64) {
        if (pixels[i] === 0) transparentCount++;
      }

      const scratchedRatio = transparentCount / (totalPixels / 16);
      if (scratchedRatio > 0.42) {
        revealCompletely();
      }
    } catch (err) {
      // Fallback
    }
  }

  function revealCompletely() {
    if (isRevealed) return;
    isRevealed = true;
    playSparkleChime();

    canvas.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    canvas.style.opacity = '0';
    canvas.style.transform = 'scale(1.05)';
    setTimeout(() => {
      canvas.remove();
      const badge = document.getElementById('revealed-badge');
      if (badge) badge.classList.add('is-revealed');
    }, 850);
  }

  // Pointer event listeners
  const startScratch = (e) => {
    isDrawing = true;
    lastPos = getPointerPos(e);
    scratch(lastPos);
  };

  const moveScratch = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    scratch(getPointerPos(e));
  };

  const endScratch = () => {
    isDrawing = false;
    lastPos = null;
  };

  canvas.addEventListener('mousedown', startScratch);
  window.addEventListener('mousemove', moveScratch);
  window.addEventListener('mouseup', endScratch);

  canvas.addEventListener('touchstart', startScratch, { passive: false });
  window.addEventListener('touchmove', moveScratch, { passive: false });
  window.addEventListener('touchend', endScratch);

  window.addEventListener('resize', () => {
    if (!isRevealed) resizeCanvas();
  });

  // Initial render
  setTimeout(resizeCanvas, 150);
}
