// Ambient and Interactive Indian Wedding Flower Petals (Marigold & Rose)
export function initPetalShower() {
  const container = document.createElement('div');
  container.id = 'petals-container';
  container.className = 'petals-overlay';
  document.body.appendChild(container);

  const colors = [
    'linear-gradient(135deg, #FF9933, #FFD700)', // Vibrant Marigold orange-gold
    'linear-gradient(135deg, #C2185B, #E91E63)', // Deep velvet Rose pink
    'linear-gradient(135deg, #880E4F, #AD1457)', // Crimson Rose
    'linear-gradient(135deg, #FFC107, #FFEB3B)', // Bright Turmeric Yellow
    'linear-gradient(135deg, #FFF0F5, #F8BBD0)'  // Soft Jasmine / Lotus pink
  ];

  function createPetal(originX, originY, burst = false) {
    const petal = document.createElement('div');
    petal.className = 'falling-petal';

    const size = 12 + Math.random() * 16;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.4}px`;
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    petal.style.borderRadius = `${Math.random() > 0.5 ? '50% 0 50% 50%' : '0 50% 50% 50%'}`;

    const startX = originX !== undefined ? originX : Math.random() * window.innerWidth;
    const startY = originY !== undefined ? originY : -30;

    petal.style.left = `${startX}px`;
    petal.style.top = `${startY}px`;

    const duration = burst ? 2.5 + Math.random() * 2.0 : 6.0 + Math.random() * 5.0;
    const drift = (Math.random() - 0.5) * (burst ? 300 : 180);
    const rotation = Math.random() * 720 - 360;

    petal.style.animation = `petal-fall ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
    petal.style.setProperty('--drift', `${drift}px`);
    petal.style.setProperty('--rot', `${rotation}deg`);

    container.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000);
  }

  // Ambient gentle fall
  let interval = setInterval(() => {
    if (document.hidden) return;
    if (container.children.length < 18) {
      createPetal();
    }
  }, 1200);

  // Trigger burst from coordinates
  window.triggerPetalShower = (x, y, count = 28) => {
    const px = x || window.innerWidth / 2;
    const py = y || window.innerHeight * 0.3;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        createPetal(px + (Math.random() - 0.5) * 120, py + (Math.random() - 0.5) * 80, true);
      }, i * 35);
    }
  };

  // Wire floating petal shower button if present
  const showerBtn = document.getElementById('shower-petals-btn');
  if (showerBtn) {
    showerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = showerBtn.getBoundingClientRect();
      window.triggerPetalShower(rect.left + rect.width / 2, rect.top, 35);
    });
  }
}
