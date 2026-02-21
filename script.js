const revealElements = document.querySelectorAll('.reveal');
const sectionElements = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#site-nav');
const menuScrim = document.querySelector('#menu-scrim');
const backToTopBtn = document.querySelector('#back-to-top');
const progressBar = document.querySelector('#scroll-progress');
const dynamicRole = document.querySelector('#dynamic-role');
const themeButtons = document.querySelectorAll('[data-theme-btn]');
const soundToggleBtn = document.querySelector('#sound-toggle');
const skillsTrack = document.querySelector('#skills-strip .skills-track');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const themeKey = 'portfolio-theme';
const supportedThemes = ['dark', 'neon', 'light'];
const soundKey = 'portfolio-sound';
let soundEnabled = true;
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    audioContext = new AudioCtx();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

const playTone = ({ frequency = 440, duration = 0.05, type = 'sine', volume = 0.03, endFrequency }) => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  if (typeof endFrequency === 'number') {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(endFrequency, 1), now + duration);
  }

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.015);
};

const playUiSound = (name) => {
  if (name === 'tap') {
    playTone({ frequency: 580, duration: 0.045, type: 'triangle', volume: 0.025, endFrequency: 520 });
    return;
  }
  if (name === 'toggle') {
    playTone({ frequency: 420, duration: 0.06, type: 'sine', volume: 0.03, endFrequency: 760 });
    return;
  }
  if (name === 'theme') {
    playTone({ frequency: 660, duration: 0.05, type: 'triangle', volume: 0.025, endFrequency: 920 });
    return;
  }
  if (name === 'top') {
    playTone({ frequency: 350, duration: 0.07, type: 'sine', volume: 0.028, endFrequency: 760 });
  }
};

const applyTheme = (theme, persist = true) => {
  if (!supportedThemes.includes(theme)) return;
  document.documentElement.dataset.theme = theme;
  themeButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.themeBtn === theme);
  });

  if (persist) {
    try {
      localStorage.setItem(themeKey, theme);
    } catch (_err) {
      // Ignore persistence errors.
    }
  }
};

let initialTheme = 'dark';
try {
  const savedTheme = localStorage.getItem(themeKey);
  if (savedTheme && supportedThemes.includes(savedTheme)) {
    initialTheme = savedTheme;
  }
} catch (_err) {
  // Ignore read errors and use default theme.
}

applyTheme(initialTheme, false);

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyTheme(button.dataset.themeBtn);
    playUiSound('theme');
  });
});

try {
  const savedSound = localStorage.getItem(soundKey);
  if (savedSound === 'off') {
    soundEnabled = false;
  }
} catch (_err) {
  // Ignore read errors and use default sound setting.
}

if (soundToggleBtn) {
  const refreshSoundUi = () => {
    soundToggleBtn.textContent = soundEnabled ? 'Sound: On' : 'Sound: Off';
    soundToggleBtn.classList.toggle('is-muted', !soundEnabled);
    soundToggleBtn.setAttribute('aria-pressed', String(soundEnabled));
  };

  refreshSoundUi();

  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    refreshSoundUi();
    try {
      localStorage.setItem(soundKey, soundEnabled ? 'on' : 'off');
    } catch (_err) {
      // Ignore write errors.
    }
    if (soundEnabled) {
      playUiSound('toggle');
    }
  });
}

if (prefersReducedMotion) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const setActiveNav = (id) => {
  navLinks.forEach((link) => {
    const isMatch = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', isMatch);
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveNav(entry.target.id);
      }
    });
  },
  {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0.01,
  }
);

sectionElements.forEach((section) => sectionObserver.observe(section));

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    playUiSound('tap');

    if (navMenu && menuToggle && navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });
});

if (menuToggle && navMenu) {
  const closeMobileMenu = () => {
    navMenu.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
    playUiSound('toggle');
  });

  document.addEventListener('click', (event) => {
    const clickedInsideHeader = event.target.closest('#top');
    if (!clickedInsideHeader && navMenu.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  if (menuScrim) {
    menuScrim.addEventListener('click', () => {
      if (navMenu.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980 && navMenu.classList.contains('is-open')) {
      closeMobileMenu();
    } else if (window.innerWidth > 980) {
      document.body.classList.remove('menu-open');
    }
  });
}

const updateScrollUi = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }

  if (backToTopBtn) {
    backToTopBtn.classList.toggle('is-visible', scrollTop > 420);
  }
};

window.addEventListener('scroll', updateScrollUi, { passive: true });
updateScrollUi();

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    playUiSound('top');
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

const initSkillsMarquee = () => {
  if (!skillsTrack) return;

  const labels = Array.from(skillsTrack.querySelectorAll('span:not([aria-hidden="true"])'))
    .map((node) => node.textContent?.trim())
    .filter(Boolean);

  if (!labels.length) return;

  const makeChip = (label, hidden = false) => {
    const chip = document.createElement('span');
    chip.textContent = label;
    if (hidden) {
      chip.setAttribute('aria-hidden', 'true');
    }
    return chip;
  };

  skillsTrack.innerHTML = '';
  labels.forEach((label) => skillsTrack.appendChild(makeChip(label)));

  const trackStyle = window.getComputedStyle(skillsTrack);
  const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || '0') || 0;
  const baseWidth = skillsTrack.scrollWidth;
  const parentWidth = skillsTrack.parentElement ? skillsTrack.parentElement.clientWidth : 0;
  const loopDistance = baseWidth + gap;

  skillsTrack.style.setProperty('--skills-loop-distance', `${loopDistance}px`);

  while (skillsTrack.scrollWidth < parentWidth + loopDistance * 2) {
    labels.forEach((label) => skillsTrack.appendChild(makeChip(label, true)));
  }
};

initSkillsMarquee();

let marqueeResizeTimer = null;
window.addEventListener('resize', () => {
  if (marqueeResizeTimer) {
    clearTimeout(marqueeResizeTimer);
  }
  marqueeResizeTimer = window.setTimeout(initSkillsMarquee, 140);
});

document.querySelectorAll('.btn, .social-link').forEach((node) => {
  node.addEventListener('click', () => {
    playUiSound('tap');
  });
});

const rolePhrases = [
  'Software Developer',
  'Aspiring Full Stack Web Developer',
  'Frontend-Focused Problem Solver',
  'Building Real-World Web Projects',
];

if (dynamicRole && !prefersReducedMotion) {
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeTick = () => {
    const currentText = rolePhrases[phraseIndex];

    if (deleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    dynamicRole.textContent = currentText.slice(0, charIndex);

    let delay = deleting ? 45 : 75;

    if (!deleting && charIndex === currentText.length) {
      delay = 1200;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % rolePhrases.length;
      delay = 300;
    }

    window.setTimeout(typeTick, delay);
  };

  dynamicRole.textContent = '';
  window.setTimeout(typeTick, 450);
}
