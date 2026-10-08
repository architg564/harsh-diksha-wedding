import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Helper function to split text into spans
  const splitText = (element) => {
    const text = element.innerText;
    element.innerHTML = '';
    const chars = text.split('');
    chars.forEach((char) => {
      const span = document.createElement('span');
      span.innerText = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      element.appendChild(span);
    });
    return element.querySelectorAll('span');
  };

  const fadeUpElements = document.querySelectorAll('[data-animate="fade-up"]');
  fadeUpElements.forEach(el => {
    gsap.from(el, {
      y: 60, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  const fadeRightElements = document.querySelectorAll('[data-animate="fade-right"]');
  fadeRightElements.forEach(el => {
    gsap.from(el, {
      x: -80, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  const fadeLeftElements = document.querySelectorAll('[data-animate="fade-left"]');
  fadeLeftElements.forEach(el => {
    gsap.from(el, {
      x: 80, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  const scaleInElements = document.querySelectorAll('[data-animate="scale-in"]');
  scaleInElements.forEach(el => {
    gsap.from(el, {
      scale: 0, opacity: 0, duration: 1, ease: 'back.out(1.7)',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  const splitCharsContainer = document.querySelector('[data-animate="split-chars"]');
  if (splitCharsContainer) {
    const heroNameEls = splitCharsContainer.querySelectorAll('.hero-name');
    heroNameEls.forEach(nameEl => {
      const chars = splitText(nameEl);
      gsap.from(chars, {
        y: 80, opacity: 0, rotateX: -90, stagger: 0.05, duration: 0.8, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: splitCharsContainer, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });
    // Also animate the heart
    const heart = splitCharsContainer.querySelector('.hero-heart');
    if (heart) {
      gsap.from(heart, {
        scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)',
        delay: 0.5,
        scrollTrigger: { trigger: splitCharsContainer, start: 'top 85%', toggleActions: 'play none none none' }
      });
    }
  }

  const timelineItems = document.querySelectorAll('[data-animate="timeline"]');
  timelineItems.forEach((el, index) => {
    const isLeft = el.classList.contains('timeline-item--left');
    const dot = el.querySelector('.timeline-dot');
    const xOffset = isLeft ? -60 : 60;
    
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });

    if (dot) tl.from(dot, { scale: 0, duration: 0.4, ease: 'back.out(2)' }, 0);
    tl.from(el, { x: xOffset, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.2);
  });

  const staggerUpElements = document.querySelectorAll('[data-animate="stagger-up"]');
  staggerUpElements.forEach(el => {
    const children = el.children;
    gsap.from(children, {
      y: 40, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // Hero Parallax
  const heroContent = document.querySelector('.hero-content');
  const heroSection = document.querySelector('#hero');
  if (heroContent && heroSection) {
    gsap.to(heroContent, {
      y: 100, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  // Timeline Line Animation
  const timelineLine = document.querySelector('.timeline-line');
  const timelineSection = document.querySelector('#events');
  if (timelineLine && timelineSection) {
    gsap.fromTo(timelineLine, 
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', transformOrigin: 'top center',
        scrollTrigger: { trigger: timelineSection, start: 'top center', end: 'bottom center', scrub: true }
      }
    );
  }

  // Hero Mandala Rotation
  const mandala = document.querySelector('.hero-mandala');
  if (mandala) {
    gsap.to(mandala, {
      rotation: 180, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });
  }
}
