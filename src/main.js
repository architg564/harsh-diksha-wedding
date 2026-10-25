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

// Reveal body now that Vite CSS modules above have been injected into the DOM
document.body.classList.add('styles-loaded');

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
  const royalScrollIndicator = document.getElementById('royal-scroll-indicator');
  const heroScrollCue = document.getElementById('hero-scroll-cue');

  // Pause audio when tab is hidden, resume when visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (bgMusic && !bgMusic.paused) {
        bgMusic.pause();
        bgMusic.dataset.wasPlaying = 'true';
      }
    } else {
      if (bgMusic && bgMusic.dataset.wasPlaying === 'true') {
        bgMusic.play().catch(err => console.warn(err));
        delete bgMusic.dataset.wasPlaying;
      }
    }
  });

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

  // Prime info card initially hidden until gates open and courtyard is beheld
  const heroInner = document.querySelector('.hero-inner');
  if (heroInner) {
    gsap.set(heroInner, { opacity: 0, y: 40, scale: 0.96 });
  }

  // ═══════════════════════════════════════════════════
  // ═══════════════════════════════════════════════════
  // ROYAL GATES OPENING CINEMATIC SEQUENCE
  // ═══════════════════════════════════════════════════
  let gatesOpened = false;

  const triggerGateOpening = () => {
    if (gatesOpened) return;
    gatesOpened = true;

    // 1. Play authentic resonant temple bell and sparkle chime
    playTempleBellSound(0.9);
    setTimeout(() => playTempleBellSound(1.2), 700);
    playSparkleChime();

    // 2. Start background shehnai music synchronously in user click
    playAudioSafely();

    // 3. Trigger celebratory flower petal flurry
    if (window.triggerPetalShower) {
      window.triggerPetalShower(window.innerWidth / 2, window.innerHeight * 0.4, 45);
    }

    // 4. Animate Gates 3D Swing Open with majestic pacing (4.8 seconds)
    const tl = gsap.timeline({
      onComplete: () => {
        // Show ONLY the breathtaking royal courtyard background for 1.8 seconds,
        // then smoothly float the royal invitation card into view!
        setTimeout(() => {
          if (heroInner) {
            gsap.to(heroInner, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.4,
              ease: 'power3.out',
              onComplete: () => {
                // Mark all hero-inner animated children as done BEFORE
                // initScrollAnimations, so they are NOT re-triggered by ScrollTrigger.
                // This prevents the double-popup where the card flickers in again.
                heroInner.querySelectorAll('[data-animate]').forEach(el => {
                  el.setAttribute('data-animate-done', 'true');
                  // Ensure they are fully visible (reset any gsap from states)
                  gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
                });

                initScrollAnimations();
                if (window.triggerPetalShower) {
                  window.triggerPetalShower(window.innerWidth / 2, window.innerHeight * 0.35, 30);
                }
              }
            });

            // Reveal scroll indicator gracefully alongside the hero card arrival
            setTimeout(() => {
              showRoyalScrollIndicator();
            }, 600);
          } else {
            initScrollAnimations();
            showRoyalScrollIndicator();
          }
        }, 80);
      }
    });

    // Fade out overlay proclamation card immediately so gates parting is unobstructed
    const overlayContent = royalGatesScreen.querySelector('.lovable-gates-overlay-content, .royal-gates-overlay-content');
    if (overlayContent) {
      tl.to(overlayContent, {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power2.in'
      }, 0);
    }

    // Majestic slow 3D parting of the full-screen royal gates (4.8s)
    if (gateLeft) {
      tl.to(gateLeft, {
        rotateY: -120,
        duration: 4.8,
        ease: 'power2.inOut'
      }, 0.2);
    }

    if (gateRight) {
      tl.to(gateRight, {
        rotateY: 120,
        duration: 4.8,
        ease: 'power2.inOut'
      }, 0.2);
    }

    // Radiant inner golden light burst
    if (radiance) {
      tl.to(radiance, {
        opacity: 0.75,
        scale: 1.6,
        duration: 2.4,
        ease: 'power2.out'
      }, 0.4);
      tl.to(radiance, {
        opacity: 0,
        duration: 1.8,
        ease: 'power2.in'
      }, 2.6);
    }

    // At 3.8s: reveal mainContent BEHIND the gate screen so the hero courtyard
    // is already visible when the gate screen dissolves — no black flash.
    tl.call(() => {
      document.body.classList.remove('splash-active');
      mainContent.setAttribute('aria-hidden', 'false');
      window.scrollTo(0, 0);

      // Initialize background systems while dissolve plays
      initCountdown();
      initParticles();
      initGallery();
      initScratchCard();
      initPetalShower();

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }, null, 3.8);

    // Gates screen dissolves gently into the main courtyard view (seamless overlap)
    tl.to(royalGatesScreen, {
      scale: 1.15,
      opacity: 0,
      duration: 1.3,
      ease: 'power2.inOut',
      onComplete: () => {
        // Fully remove after dissolve is complete
        royalGatesScreen.remove();
      }
    }, 4.2);
  };

  if (openGatesBtn && royalGatesScreen && mainContent) {
    openGatesBtn.addEventListener('click', triggerGateOpening);
    openGatesBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      triggerGateOpening();
    }, { passive: false });

    // Auto-open if query param ?open=true or hash #open is present (great for testing & direct preview)
    if (window.location.hash === '#open' || new URLSearchParams(window.location.search).get('open') === 'true') {
      setTimeout(triggerGateOpening, 150);
    }
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

  // Floating Directions button audio feedback
  const directionsBtn = document.getElementById('directions-toggle');
  if (directionsBtn) {
    directionsBtn.addEventListener('click', () => {
      playSparkleChime();
    });
  }

  // ═══════════════════════════════════════════════════
  // ROYAL SCROLL SYSTEM: PROGRESS, IN-SECTION & HERO PROMPT
  // ═══════════════════════════════════════════════════
  const progressFill = document.getElementById('royal-progress-fill');

  // 1. Update Royal Journey Progress Bar (Top of Screen)
  const updateProgressBar = () => {
    if (!progressFill) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const pct = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      progressFill.style.width = `${pct}%`;
    }
  };


  // 3. First Screen Floating Indicator (Appears only on Hero landing)
  const scrollToNextCelebration = () => {
    playSparkleChime();
    const nextSection = document.getElementById('scratch-section') || document.querySelector('.section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  if (royalScrollIndicator) {
    royalScrollIndicator.addEventListener('click', scrollToNextCelebration);
    royalScrollIndicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToNextCelebration();
      }
    });
  }

  if (heroScrollCue) {
    heroScrollCue.addEventListener('click', scrollToNextCelebration);
  }

  // 4. Scroll Listener:
  // - Top progress bar continuously tracks progress across the whole invitation.
  // - Floating indicator is strictly visible on Hero to invite first scroll, and hides everywhere else.
  const handleScrollVisibility = () => {
    updateProgressBar();

    if (!royalScrollIndicator) return;
    const currentScroll = window.scrollY || document.documentElement.scrollTop;

    if (currentScroll > 80) {
      royalScrollIndicator.classList.add('is-scrolled-away');
    } else if (gatesOpened) {
      royalScrollIndicator.classList.remove('is-scrolled-away');
      royalScrollIndicator.classList.add('is-visible');
    }
  };

  window.addEventListener('scroll', handleScrollVisibility, { passive: true });

  function showRoyalScrollIndicator() {
    updateProgressBar();
    if (!royalScrollIndicator) return;

    royalScrollIndicator.classList.remove('is-scrolled-away');
    royalScrollIndicator.classList.add('is-visible');

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    // Gentle ripple attention on gate open
    setTimeout(() => {
      const scrollNow = window.scrollY || document.documentElement.scrollTop;
      if (scrollNow < 50 && royalScrollIndicator.classList.contains('is-visible')) {
        const ring = royalScrollIndicator.querySelector('.scroll-glow-ring');
        if (ring) {
          gsap.fromTo(ring, 
            { scale: 1, opacity: 0.8 }, 
            { scale: 1.35, opacity: 0, duration: 1.2, ease: 'power2.out', repeat: 2 }
          );
        }
      }
    }, 2800);
  }
});


