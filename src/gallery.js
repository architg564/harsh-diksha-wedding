let globalOpenLightbox = null;

export function openLightboxAtIndex(index) {
  if (typeof globalOpenLightbox === 'function') {
    globalOpenLightbox(index);
  }
}

export function initGallery() {
  const mediaElements = document.querySelectorAll('[data-full]');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const counterCurrent = document.getElementById('lightbox-current');
  const counterTotal = document.getElementById('lightbox-total');

  if (!lightbox || !lightboxImg || mediaElements.length === 0) return;

  const items = Array.from(mediaElements);
  let currentIndex = 0;
  if (counterTotal) counterTotal.textContent = items.length;

  function openLightbox(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const src = item.getAttribute('data-full');
    const caption = item.getAttribute('data-caption') || '';

    lightboxImg.style.opacity = '0';
    if (lightboxCaption) lightboxCaption.style.opacity = '0';

    lightbox.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      lightboxImg.src = src;
      if (lightboxCaption) {
        lightboxCaption.textContent = caption;
      }
      lightboxImg.onload = () => {
        lightboxImg.style.transition = 'opacity 0.3s ease';
        lightboxImg.style.opacity = '1';
        if (lightboxCaption) {
          lightboxCaption.style.transition = 'opacity 0.3s ease';
          lightboxCaption.style.opacity = '1';
        }
      };
    }, 120);

    if (counterCurrent) counterCurrent.textContent = currentIndex + 1;
  }

  globalOpenLightbox = openLightbox;
  window.openGalleryLightbox = openLightbox;

  function closeLightbox() {
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    if (lightboxContent) {
      lightboxContent.style.opacity = '0';
      lightboxContent.style.transform = 'scale(0.9)';
      setTimeout(() => {
        lightbox.setAttribute('aria-hidden', 'true');
      }, 250);
    } else {
      lightbox.setAttribute('aria-hidden', 'true');
    }
  }

  function showNext() {
    openLightbox(currentIndex + 1);
  }

  function showPrev() {
    openLightbox(currentIndex - 1);
  }

  items.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    }
  });
}
