import './styles/index.css';
import './styles/sections.css';
import './styles/animations.css';

import gsap from 'gsap';
import { initScrollAnimations } from './animations.js';
import { initCountdown } from './countdown.js';
import { initParticles } from './particles.js';
import { initGallery, openLightboxAtIndex } from './gallery.js';
import { playTempleBellSound, playSparkleChime } from './sounds.js';
import { initScratchCard } from './scratch.js';
import { initPetalShower } from './petals.js';

// Prevent browser automatic scroll restoration on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  const royalGatesScreen = document.getElementById('royal-gates-screen');
  const openGatesBtn = document.getElementById('open-gates-btn');
  const gateLeft = document.getElementById('gate-door-left');
  const gateRight = document.getElementById('gate-door-right');
  const radiance = document.querySelector('.palace-inner-radiance');
  const mainContent = document.getElementById('main-content');
  const bgMusic = document.getElementById('bg-music');
  const musicToggleBtn = document.getElementById('music-toggle');
  const hangingBell = document.getElementById('hanging-temple-bell');
  const secretHeartBtn = document.getElementById('secret-heart-btn');
  const viewTogetherBtn = document.getElementById('view-together-portrait-btn');

  // Lock body scroll on initial gates screen
  if (royalGatesScreen) {
    document.body.classList.add('splash-active');
    window.scrollTo(0, 0);
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
        console.warn('Audio autoplay blocked or waiting for gesture:', error);
        if (musicToggleBtn) {
          musicToggleBtn.classList.add('muted');
          musicToggleBtn.classList.remove('playing');
        }
      });
  };

  // ═══════════════════════════════════════════════════
  // ROYAL GATES OPENING CINEMATIC SEQUENCE
  // ═══════════════════════════════════════════════════
  let gatesOpened = false;
  if (openGatesBtn && royalGatesScreen && mainContent) {
    openGatesBtn.addEventListener('click', () => {
      if (gatesOpened) return;
      gatesOpened = true;

      // 1. Play authentic resonant temple bell and sparkle chime
      playTempleBellSound(0.9);
      setTimeout(() => playTempleBellSound(1.2), 600);
      playSparkleChime();

      // 2. Start background shehnai music synchronously in user click
      playAudioSafely();

      // 3. Trigger initial celebratory flower petal flurry
      if (window.triggerPetalShower) {
        window.triggerPetalShower(window.innerWidth / 2, window.innerHeight * 0.4, 40);
      }

      // 4. Animate Gates 3D Swing Open over 3 seconds
      const tl = gsap.timeline({
        onComplete: () => {
          royalGatesScreen.remove();
          document.body.classList.remove('splash-active');
          mainContent.setAttribute('aria-hidden', 'false');
          window.scrollTo(0, 0);

          // Initialize all page interactions
          initScrollAnimations();
          initCountdown();
          initParticles();
          initGallery();
          initScratchCard();
          initPetalShower();

          if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
          }
        }
      });

      // Fade out overlay proclamation card immediately so doors parting is unobstructed
      const overlayContent = royalGatesScreen.querySelector('.lovable-gates-overlay-content, .royal-gates-overlay-content');
      if (overlayContent) {
        tl.to(overlayContent, {
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          ease: 'power2.in'
        }, 0);
      }

      // Part the full-screen gates majestically
      if (gateLeft) {
        tl.to(gateLeft, {
          rotateY: -115,
          duration: 3.2,
          ease: 'power3.inOut'
        }, 0);
      }

      if (gateRight) {
        tl.to(gateRight, {
          rotateY: 115,
          duration: 3.2,
          ease: 'power3.inOut'
        }, 0);
      }

      // Radiant inner golden light explosion
      if (radiance) {
        tl.to(radiance, {
          opacity: 1,
          scale: 1.8,
          duration: 2.8,
          ease: 'power2.out'
        }, 0.2);
      }

      // Camera flies forward into the palace courtyard
      tl.to(royalGatesScreen, {
        scale: 1.25,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut'
      }, 2.2);
    });
  }

  // ═══════════════════════════════════════════════════
  // INTERACTIVE HANGING TEMPLE BELL
  // ═══════════════════════════════════════════════════
  if (hangingBell) {
    hangingBell.addEventListener('click', () => {
      // Ring sound
      playTempleBellSound(1.05);

      // Swing animation
      hangingBell.classList.remove('is-ringing');
      // Trigger reflow
      void hangingBell.offsetWidth;
      hangingBell.classList.add('is-ringing');

      // Floating gentle petal burst
      if (window.triggerPetalShower) {
        const rect = hangingBell.getBoundingClientRect();
        window.triggerPetalShower(rect.left + rect.width / 2, rect.bottom + 10, 16);
      }
    });
  }

  // ═══════════════════════════════════════════════════
  // INTERACTIVE SECRET HEART "H ♥ D"
  // ═══════════════════════════════════════════════════
  if (secretHeartBtn) {
    secretHeartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSparkleChime();
      if (window.triggerPetalShower) {
        const rect = secretHeartBtn.getBoundingClientRect();
        window.triggerPetalShower(rect.left + rect.width / 2, rect.top, 30);
      }

      // Pulse animation
      gsap.fromTo(secretHeartBtn, 
        { scale: 1 }, 
        { scale: 1.5, duration: 0.3, yoyo: true, repeat: 3, ease: 'back.out(2)' }
      );
    });
  }

  // ═══════════════════════════════════════════════════
  // MUSIC TOGGLE BUTTON
  // ═══════════════════════════════════════════════════
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

  // View full portrait button handler
  if (viewTogetherBtn) {
    viewTogetherBtn.addEventListener('click', () => {
      openLightboxAtIndex(0);
    });
  }
});
