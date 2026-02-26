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
let lastHoverSoundAt = 0;
let lastTypeSoundAt = 0;
let backToTopWasVisible = false;

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

const playChord = (notes, options = {}) => {
  notes.forEach((frequency, index) => {
    const offset = (options.staggerMs ?? 0) * index;
    window.setTimeout(() => {
      playTone({
        frequency,
        duration: options.duration ?? 0.05,
        type: options.type ?? 'sine',
        volume: options.volume ?? 0.02,
      });
    }, offset);
  });
};

const playUiSound = (name) => {
  if (name === 'tap') {
    playTone({ frequency: 580, duration: 0.045, type: 'triangle', volume: 0.025, endFrequency: 520 });
    playTone({ frequency: 860, duration: 0.032, type: 'sine', volume: 0.012, endFrequency: 780 });
    return;
  }
  if (name === 'toggle') {
    playTone({ frequency: 420, duration: 0.06, type: 'sine', volume: 0.03, endFrequency: 760 });
    playTone({ frequency: 300, duration: 0.04, type: 'triangle', volume: 0.014, endFrequency: 340 });
    return;
  }
  if (name === 'menu-open') {
    playChord([390, 520, 660], { duration: 0.05, type: 'triangle', volume: 0.018, staggerMs: 12 });
    return;
  }
  if (name === 'menu-close') {
    playChord([660, 520, 390], { duration: 0.045, type: 'triangle', volume: 0.016, staggerMs: 10 });
    return;
  }
  if (name === 'theme') {
    playChord([540, 690, 840], { duration: 0.05, type: 'sine', volume: 0.02, staggerMs: 8 });
    playTone({ frequency: 930, duration: 0.055, type: 'triangle', volume: 0.015, endFrequency: 1090 });
    return;
  }
  if (name === 'hover') {
    const now = performance.now();
    if (now - lastHoverSoundAt < 90) return;
    lastHoverSoundAt = now;
    playTone({ frequency: 740, duration: 0.024, type: 'triangle', volume: 0.01, endFrequency: 780 });
    return;
  }
  if (name === 'reveal') {
    playTone({ frequency: 320, duration: 0.05, type: 'sine', volume: 0.014, endFrequency: 420 });
    playTone({ frequency: 520, duration: 0.036, type: 'triangle', volume: 0.009, endFrequency: 640 });
    return;
  }
  if (name === 'type') {
    const now = performance.now();
    if (now - lastTypeSoundAt < 80) return;
    lastTypeSoundAt = now;
    playTone({ frequency: 520, duration: 0.018, type: 'square', volume: 0.006, endFrequency: 500 });
    return;
  }
  if (name === 'scroll-cue') {
    playChord([480, 620], { duration: 0.03, type: 'sine', volume: 0.012, staggerMs: 14 });
    return;
  }
  if (name === 'top') {
    playTone({ frequency: 350, duration: 0.07, type: 'sine', volume: 0.028, endFrequency: 760 });
    playTone({ frequency: 760, duration: 0.05, type: 'triangle', volume: 0.014, endFrequency: 980 });
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

if (prefersReducedMotion || typeof window.IntersectionObserver !== 'function') {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        playUiSound('reveal');
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

  link.addEventListener('mouseenter', () => {
    playUiSound('hover');
  });

  link.addEventListener('focus', () => {
    playUiSound('hover');
  });
});

if (menuToggle && navMenu) {
  const closeMobileMenu = (withSound = false) => {
    navMenu.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (withSound) {
      playUiSound('menu-close');
    }
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
    playUiSound(isOpen ? 'menu-open' : 'menu-close');
  });

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const clickedInsideHeader = target ? target.closest('#top') : null;
    if (!clickedInsideHeader && navMenu.classList.contains('is-open')) {
      closeMobileMenu(true);
    }
  });

  if (menuScrim) {
    menuScrim.addEventListener('click', () => {
      if (navMenu.classList.contains('is-open')) {
        closeMobileMenu(true);
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMobileMenu(true);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980 && navMenu.classList.contains('is-open')) {
      closeMobileMenu(false);
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
    const isVisible = scrollTop > 420;
    backToTopBtn.classList.toggle('is-visible', isVisible);
    if (isVisible && !backToTopWasVisible) {
      playUiSound('scroll-cue');
    }
    backToTopWasVisible = isVisible;
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
  node.addEventListener('mouseenter', () => {
    playUiSound('hover');
  });
  node.addEventListener('focus', () => {
    playUiSound('hover');
  });
});

themeButtons.forEach((button) => {
  button.addEventListener('mouseenter', () => {
    playUiSound('hover');
  });
  button.addEventListener('focus', () => {
    playUiSound('hover');
  });
});

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('mouseenter', () => {
    playUiSound('hover');
  });
}

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
    if (!deleting && charIndex % 3 === 0) {
      playUiSound('type');
    }

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
