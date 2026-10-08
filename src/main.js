import './styles/index.css';
import './styles/sections.css';
import './styles/animations.css';

import gsap from 'gsap';
import { initScrollAnimations } from './animations.js';
import { initCountdown } from './countdown.js';
import { initParticles } from './particles.js';
import { initGallery, openLightboxAtIndex } from './gallery.js';

// Prevent browser automatic scroll restoration on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  const splashScreen = document.getElementById('splash-screen');
  const splashEnterBtn = document.getElementById('splash-enter-btn');
  const mainContent = document.getElementById('main-content');
  const bgMusic = document.getElementById('bg-music');
  const musicToggleBtn = document.getElementById('music-toggle');
  const viewTogetherBtn = document.getElementById('view-together-portrait-btn');

  // Entrance animation for splash screen (button stays always visible and never flickers away)
  if (splashScreen) {
    document.body.classList.add('splash-active');
    window.scrollTo(0, 0);

    const splashTextElements = splashScreen.querySelectorAll('.splash-subtitle, .splash-names, .splash-tagline, .splash-date-line');
    gsap.from(splashTextElements, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }

  // Audio helper
  const playAudioSafely = () => {
    if (!bgMusic) return;
    bgMusic.play()
      .then(() => {
        if (musicToggleBtn) {
          musicToggleBtn.classList.remove('muted');
          musicToggleBtn.classList.add('playing');
        }
      })
      .catch((error) => {
        console.warn('Audio autoplay blocked or waiting for user interaction:', error);
        if (musicToggleBtn) {
          musicToggleBtn.classList.add('muted');
          musicToggleBtn.classList.remove('playing');
        }
      });
  };

  // Splash Screen Enter button
  if (splashEnterBtn && splashScreen && mainContent) {
    const handleEnter = () => {
      // 1. Trigger audio play IMMEDIATELY synchronously inside user click event
      playAudioSafely();

      // 2. Animate splash dismissal upwards smoothly
      gsap.to(splashScreen, {
        y: '-100%',
        opacity: 0,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          splashScreen.remove();
          document.body.classList.remove('splash-active');
          mainContent.setAttribute('aria-hidden', 'false');
          window.scrollTo(0, 0);
          
          initScrollAnimations();
          initCountdown();
          initParticles();
          initGallery();

          if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
          }
        }
      });
    };

    splashEnterBtn.addEventListener('click', handleEnter);
  }

  // Music toggle button
  if (musicToggleBtn && bgMusic) {
    musicToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (bgMusic.paused) {
        bgMusic.play()
          .then(() => {
            musicToggleBtn.classList.remove('muted');
            musicToggleBtn.classList.add('playing');
          })
          .catch(err => console.error('Audio play error:', err));
      } else {
        bgMusic.pause();
        musicToggleBtn.classList.add('muted');
        musicToggleBtn.classList.remove('playing');
      }
    });
  }

  // Fallback: document click if audio was not started
  const tryStartAudioOnFirstInteraction = () => {
    if (bgMusic && bgMusic.paused && musicToggleBtn && !musicToggleBtn.classList.contains('muted')) {
      playAudioSafely();
    }
  };
  document.body.addEventListener('click', tryStartAudioOnFirstInteraction, { once: true });

  // View full portrait button handler
  if (viewTogetherBtn) {
    viewTogetherBtn.addEventListener('click', () => {
      openLightboxAtIndex(0);
    });
  }
});
