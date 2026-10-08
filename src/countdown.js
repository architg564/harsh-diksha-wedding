export function initCountdown() {
  // Target date: November 24, 2026, 00:00:00 IST
  // IST is UTC+5:30.
  const targetDate = new Date('2026-11-24T00:00:00+05:30').getTime();

  const daysEl = document.querySelector('#countdown-days .flip-card-value');
  const hoursEl = document.querySelector('#countdown-hours .flip-card-value');
  const minutesEl = document.querySelector('#countdown-minutes .flip-card-value');
  const secondsEl = document.querySelector('#countdown-seconds .flip-card-value');
  const messageEl = document.getElementById('countdown-message');
  const containerEl = document.getElementById('countdown-container');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function pad(num) {
    return num < 10 ? '0' + num : num.toString();
  }

  function updateValue(el, newValue) {
    const currentVal = el.innerText;
    if (currentVal !== newValue) {
      el.innerText = newValue;
      el.classList.remove('flip');
      void el.offsetWidth; // trigger reflow
      el.classList.add('flip');
      
      // Remove class after animation (assuming 600ms defined in css)
      setTimeout(() => {
        el.classList.remove('flip');
      }, 600);
    }
  }

  function tick() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (containerEl) containerEl.style.display = 'none';
      if (messageEl) {
        messageEl.style.display = 'block';
        messageEl.innerText = 'The Big Day is Here!';
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    updateValue(daysEl, pad(days));
    updateValue(hoursEl, pad(hours));
    updateValue(minutesEl, pad(minutes));
    updateValue(secondsEl, pad(seconds));

    requestAnimationFrame(tick);
  }

  // Using setTimeout for 1s interval approximation or just simple setInterval
  // We'll use requestAnimationFrame wrapped to update approx every second for smoothness or simple logic
  setInterval(tick, 1000);
  tick(); // Initial call
}
