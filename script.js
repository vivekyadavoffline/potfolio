const revealElements = document.querySelectorAll('.reveal');
const sectionElements = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const navTabs = document.querySelector('.nav-tabs');
const navSlider = document.querySelector('#nav-slider');
const menuToggle = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#site-nav');
const menuScrim = document.querySelector('#menu-scrim');
const backToTopBtn = document.querySelector('#back-to-top');
const progressBar = document.querySelector('#scroll-progress');
const dynamicRole = document.querySelector('#dynamic-role');
const availabilityPill = document.querySelector('#availability-pill');
const heroGreeting = document.querySelector('#hero-greeting');
const heroIntroLine = document.querySelector('#hero-intro-line');
const heroMeta = document.querySelector('#hero-meta');
const heroSummary = document.querySelector('#hero-summary');
const heroBadge1 = document.querySelector('#hero-badge-1');
const heroBadge2 = document.querySelector('#hero-badge-2');
const heroBadge3 = document.querySelector('#hero-badge-3');
const heroStatValue1 = document.querySelector('#hero-stat-value-1');
const heroStatLabel1 = document.querySelector('#hero-stat-label-1');
const heroStatValue2 = document.querySelector('#hero-stat-value-2');
const heroStatLabel2 = document.querySelector('#hero-stat-label-2');
const heroStatValue3 = document.querySelector('#hero-stat-value-3');
const heroStatLabel3 = document.querySelector('#hero-stat-label-3');
const ctaCaption = document.querySelector('#cta-caption');
const themeButtons = document.querySelectorAll('[data-theme-btn]');
const audienceGate = document.querySelector('#audience-gate');
const heroProfile = document.querySelector('#hero-profile');
const agePicker = document.querySelector('#age-picker');
const ageChips = document.querySelectorAll('[data-age-range]');
const audienceChoiceButtons = document.querySelectorAll('[data-audience-choice]');
const audiencePickerTrigger = document.querySelector('#audience-picker-trigger');
const audiencePill = document.querySelector('#audience-pill');
const audienceGateNote = document.querySelector('#audience-gate-note');
const femalePortraitToggle = document.querySelector('#female-portrait-toggle');
const soundToggleBtn = document.querySelector('#sound-toggle');
const skillsTrack = document.querySelector('#skills-strip .skills-track');
const modalTriggers = document.querySelectorAll('.social-trigger, .modal-trigger');
const socialModal = document.querySelector('#social-modal');
const socialModalScrim = document.querySelector('#social-modal-scrim');
const socialModalClose = document.querySelector('#social-modal-close');
const socialModalDismiss = document.querySelector('#social-modal-dismiss');
const socialModalTitle = document.querySelector('#social-modal-title');
const socialModalHandle = document.querySelector('#social-modal-handle');
const socialModalDescription = document.querySelector('#social-modal-description');
const socialModalAction = document.querySelector('#social-modal-action');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const themeKey = 'portfolio-theme';
const audienceKey = 'portfolio-audience';
const ageKey = 'portfolio-age-range';
const supportedThemes = ['dark', 'neon', 'light', 'liquid'];
const soundKey = 'portfolio-sound';
let soundEnabled = true;
let audioContext = null;
let lastHoverSoundAt = 0;
let lastTypeSoundAt = 0;
let backToTopWasVisible = false;
let roleTypingTimer = null;
const defaultRolePhrases = [
  'Software Developer',
  'Aspiring Full Stack Web Developer',
  'Frontend-Focused Problem Solver',
  'Building Real-World Web Projects',
];
let activeRolePhrases = [...defaultRolePhrases];

const getAgeTone = (ageRange) => {
  if (ageRange === '13-17' || ageRange === '18-24') return 'youth';
  if (ageRange === '35-44' || ageRange === '45+') return 'professional';
  return 'balanced';
};

const getRolePhrasesForAge = (ageRange) => {
  switch (ageRange) {
    case '13-17':
      return [
        'Creative Web Learner',
        'Building Projects While Learning',
        'Exploring Frontend Skills',
        'Growing Through Practice',
      ];
    case '18-24':
      return [
        'Software Developer',
        'Aspiring Full Stack Web Developer',
        'Internship-Focused Builder',
        'Building Career-Ready Projects',
      ];
    case '35-44':
      return [
        'Software Developer',
        'Structured Web Portfolio',
        'Project-Based Technical Growth',
        'Reliable Frontend Execution',
      ];
    case '45+':
      return [
        'Software Developer',
        'Professional Portfolio Overview',
        'Clear Technical Direction',
        'Steady Development Journey',
      ];
    default:
      return [...defaultRolePhrases];
  }
};
const ageExperienceMap = {
  '13-17': {
    pill: 'Explore coding, creativity, and beginner-friendly projects',
    greeting: 'Hey there, welcome!',
    intro: "I'm Vivek Yadav",
    meta: 'Student developer | Learning and building every day',
    summary: 'I create simple and fun projects that help beginners understand how websites work. My goal is to make coding interesting through visual interfaces and hands-on experimentation.',
    badges: ['Beginner Friendly', 'Creative Learning', 'Explore Coding'],
    stats: [
      ['3+', 'Learning paths'],
      ['10+', 'Practice builds'],
      ['Daily', 'Coding habit']
    ],
    caption: 'Perfect for young learners discovering how coding and web development work.'
  },

  '18-24': {
    pill: 'Open to internships, collaborations, and career growth',
    greeting: 'Hello there, welcome to my portfolio.',
    intro: "I'm Vivek Yadav",
    meta: 'New Delhi, India | Computer Science student',
    summary: 'I focus on building modern web interfaces, improving problem-solving through C++, and developing practical projects that strengthen my portfolio for internships and real development experience.',
    badges: ['Career Focused', 'Frontend + Backend', 'Portfolio Growth'],
    stats: [
      ['8.57', 'Current CGPA'],
      ['2+', 'Deployed projects'],
      ['7x', 'District chess champion']
    ],
    caption: 'Designed for students, peers, and recruiters exploring my early career work.'
  },

  '25-34': {
    pill: 'Modern web development with practical project execution',
    greeting: 'Hello, and thanks for visiting.',
    intro: "I'm Vivek Yadav",
    meta: 'Web developer | Building practical web solutions',
    summary: 'My focus is on writing clean code, developing responsive web interfaces, and learning full-stack technologies that support real product development.',
    badges: ['Execution Focused', 'Modern Web Stack', 'Problem Solver'],
    stats: [
      ['2+', 'Live web projects'],
      ['Frontend', 'Core expertise'],
      ['Full Stack', 'Learning direction']
    ],
    caption: 'A practical overview of my projects, technical skills, and development progress.'
  },

  '35-44': {
    pill: 'Structured portfolio highlighting technical growth and discipline',
    greeting: 'Welcome, and thank you for reviewing my portfolio.',
    intro: "I'm Vivek Yadav",
    meta: 'Developer portfolio | Technical learning journey',
    summary: 'This portfolio presents my academic achievements, technical learning path, and web development projects built while strengthening my software engineering fundamentals.',
    badges: ['Structured Profile', 'Reliable Foundation', 'Consistent Learning'],
    stats: [
      ['8.57', 'Academic CGPA'],
      ['2+', 'Published projects'],
      ['Ongoing', 'Skill development']
    ],
    caption: 'A structured view of my progress in web development and software engineering.'
  },

  '45+': {
    pill: 'Clear and concise overview of skills, projects, and development progress',
    greeting: 'Welcome. Thank you for taking the time to review my profile.',
    intro: "I'm Vivek Yadav",
    meta: 'Computer Science student | Developer portfolio',
    summary: 'This portfolio highlights my academic performance, practical development work, and continued effort to build strong technical foundations in modern web technologies.',
    badges: ['Professional Overview', 'Technical Focus', 'Steady Growth'],
    stats: [
      ['8.57', 'Academic standing'],
      ['2+', 'Portfolio projects'],
      ['Long-Term', 'Learning mindset']
    ],
    caption: 'A concise summary of my skills, projects, and development journey.'
  }
};

const updateMenuScrim = (isOpen) => {
  if (!menuScrim) return;
  menuScrim.setAttribute('aria-hidden', String(!isOpen));
};

const syncNavSlider = (activeLink, behavior = 'smooth') => {
  if (!navTabs || !navSlider || window.innerWidth <= 980) return;
  if (!(activeLink instanceof HTMLElement)) {
    navSlider.style.opacity = '0';
    return;
  }

  const left = activeLink.offsetLeft;
  const width = activeLink.offsetWidth;
  navSlider.style.width = `${width}px`;
  navSlider.style.transform = `translateX(${left}px)`;
  navSlider.style.opacity = '1';

  const tabsViewport = navTabs.clientWidth;
  const targetScroll = Math.max(0, left - (tabsViewport - width) / 2);
  navTabs.scrollTo({
    left: targetScroll,
    behavior: prefersReducedMotion ? 'auto' : behavior,
  });
};

const updateColorScheme = (theme) => {
  document.documentElement.style.colorScheme = theme === 'light' || theme === 'liquid' ? 'light' : 'dark';
};

const updateAudienceUi = (audience, ageRange = '') => {
  if (audiencePill) {
    const audienceLabel = audience ? `${audience.charAt(0).toUpperCase()}${audience.slice(1)} Theme` : 'Default';
    audiencePill.textContent = ageRange ? `${audienceLabel} | ${ageRange}` : audienceLabel;
  }
  if (audienceGateNote) {
    audienceGateNote.textContent = ageRange
      ? `Saved for age group ${ageRange}. You can change this again from the top bar.`
      : 'You can change this again from the top bar.';
  }
};

const updateAgeExperience = (ageRange = '') => {
  const content = ageExperienceMap[ageRange] || ageExperienceMap['25-34'];
  document.documentElement.dataset.ageRange = ageRange || '25-34';
  activeRolePhrases = getRolePhrasesForAge(ageRange);
  if (availabilityPill) availabilityPill.textContent = content.pill;
  if (heroGreeting) heroGreeting.textContent = content.greeting;
  if (heroIntroLine) heroIntroLine.innerHTML = '<span class="intro-accent"></span>' + content.intro;
  if (heroMeta) heroMeta.textContent = content.meta;
  if (heroSummary) heroSummary.textContent = content.summary;
  if (heroBadge1) heroBadge1.textContent = content.badges[0];
  if (heroBadge2) heroBadge2.textContent = content.badges[1];
  if (heroBadge3) heroBadge3.textContent = content.badges[2];
  if (heroStatValue1) heroStatValue1.textContent = content.stats[0][0];
  if (heroStatLabel1) heroStatLabel1.textContent = content.stats[0][1];
  if (heroStatValue2) heroStatValue2.textContent = content.stats[1][0];
  if (heroStatLabel2) heroStatLabel2.textContent = content.stats[1][1];
  if (heroStatValue3) heroStatValue3.textContent = content.stats[2][0];
  if (heroStatLabel3) heroStatLabel3.textContent = content.stats[2][1];
  if (ctaCaption) ctaCaption.textContent = content.caption;
};

const markSelectedAgeChip = (ageRange) => {
  ageChips.forEach((chip) => {
    const isMatch = chip.dataset.ageRange === ageRange;
    chip.classList.toggle('is-selected', isMatch);
    chip.setAttribute('aria-pressed', String(isMatch));
  });
};

const markSelectedAudienceButton = (audience) => {
  audienceChoiceButtons.forEach((button) => {
    const isMatch = button.dataset.audienceChoice === audience;
    button.classList.toggle('is-selected', isMatch);
    button.setAttribute('aria-pressed', String(isMatch));
  });
};

const setProfileVisibility = (isVisible, persist = true) => {
  const shouldShow = Boolean(isVisible);
  document.documentElement.dataset.femalePortrait = shouldShow ? 'visible' : 'hidden';
  if (heroProfile) {
    heroProfile.setAttribute('aria-hidden', String(!shouldShow));
  }
  const toggleBtn = document.querySelector('#female-portrait-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = shouldShow ? 'Hide Profile Photo' : 'Show Profile Photo';
    toggleBtn.setAttribute('aria-pressed', String(shouldShow));
    toggleBtn.style.display = '';
  }
  if (persist) {
    try {
      localStorage.setItem('portfolio-profile-visible', shouldShow ? 'visible' : 'hidden');
    } catch (_err) {}
  }
};

const applyAudience = (audience, ageRange = '', persist = true) => {
  if (!['male', 'female'].includes(audience)) return;

  savedAudience = audience;
  savedAgeRange = ageRange;
  document.documentElement.dataset.audience = audience;
  document.documentElement.dataset.ageTone = getAgeTone(ageRange);
  updateAudienceUi(audience, ageRange);
  updateAgeExperience(ageRange);
  markSelectedAgeChip(ageRange);
  markSelectedAudienceButton(audience);

  // Restore profile visibility from localStorage for ALL genders (default visible)
  let profileVisible = true;
  try {
    const saved = localStorage.getItem('portfolio-profile-visible');
    if (saved === 'hidden') profileVisible = false;
  } catch (_err) {}
  setProfileVisibility(profileVisible, false);

  startRoleTyping();

  if (persist) {
    try {
      localStorage.setItem(audienceKey, audience);
      localStorage.setItem(ageKey, ageRange);
    } catch (_err) {}
  }
};

const openAudienceGate = () => {
  if (!audienceGate) return;
  audienceGate.classList.add('is-open');
  audienceGate.setAttribute('aria-hidden', 'false');
  document.body.classList.add('gate-open');
  if (ageChips[0]) {
    window.setTimeout(() => ageChips[0].focus(), 20);
  }
};

const closeAudienceGate = () => {
  if (!audienceGate) return;
  audienceGate.classList.remove('is-open');
  audienceGate.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('gate-open');
};

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
  updateColorScheme(theme);
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
let savedAudience = '';
let savedAgeRange = '';
try {
  const savedTheme = localStorage.getItem(themeKey);
  if (savedTheme && supportedThemes.includes(savedTheme)) {
    initialTheme = savedTheme;
  }
  savedAudience = localStorage.getItem(audienceKey) || '';
  savedAgeRange = localStorage.getItem(ageKey) || '';
} catch (_err) {
  // Ignore read errors and use default theme.
}

applyTheme(initialTheme, false);
updateAudienceUi(savedAudience, savedAgeRange);
document.documentElement.dataset.ageTone = getAgeTone(savedAgeRange);
updateAgeExperience(savedAgeRange);

if (savedAudience && ['male', 'female'].includes(savedAudience)) {
  applyAudience(savedAudience, savedAgeRange, false);
} else {
  // No saved audience — still initialize profile toggle to default visible state
  let profileVisible = true;
  try {
    const saved = localStorage.getItem('portfolio-profile-visible');
    if (saved === 'hidden') profileVisible = false;
  } catch (_err) {}
  setProfileVisibility(profileVisible, false);
}

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyTheme(button.dataset.themeBtn);
    playUiSound('theme');
  });
});

const refreshAudienceChoiceState = () => {
  const hasAge = Boolean(savedAgeRange);
  audienceChoiceButtons.forEach((button) => {
    button.disabled = !hasAge;
  });
  if (!hasAge) {
    markSelectedAgeChip('');
    markSelectedAudienceButton('');
  } else if (savedAudience) {
    markSelectedAgeChip(savedAgeRange);
    markSelectedAudienceButton(savedAudience);
  }
};

if (agePicker) {
  markSelectedAgeChip(savedAgeRange);
  refreshAudienceChoiceState();
  ageChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      savedAgeRange = chip.dataset.ageRange || '';
      markSelectedAgeChip(savedAgeRange);
      refreshAudienceChoiceState();
      playUiSound('tap');
    });
  });
}

audienceChoiceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedAudience = button.dataset.audienceChoice;
    const ageRange = savedAgeRange || '';
    if (!selectedAudience || !ageRange) return;
    applyAudience(selectedAudience, ageRange, true);
    closeAudienceGate();
    playUiSound('theme');
  });
});

if (audiencePickerTrigger) {
  audiencePickerTrigger.addEventListener('click', () => {
    markSelectedAgeChip(savedAgeRange || '');
    refreshAudienceChoiceState();
    openAudienceGate();
    playUiSound('tap');
  });
}

if (femalePortraitToggle) {
  femalePortraitToggle.addEventListener('click', () => {
    const isVisible = document.documentElement.dataset.femalePortrait === 'visible';
    setProfileVisibility(!isVisible, true);
    playUiSound('tap');
  });
}

startRoleTyping();

if (audienceGate) {
  audienceGate.addEventListener('click', (event) => {
    if (event.target === audienceGate || event.target.closest('.audience-gate__scrim')) {
      if (savedAudience && savedAgeRange) {
        closeAudienceGate();
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && audienceGate.classList.contains('is-open') && savedAudience && savedAgeRange) {
      closeAudienceGate();
    }
  });
}

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
  let activeLink = null;
  navLinks.forEach((link) => {
    const isMatch = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', isMatch);
    if (isMatch) {
      link.setAttribute('aria-current', 'page');
      activeLink = link;
    } else {
      link.removeAttribute('aria-current');
    }
  });
  syncNavSlider(activeLink, 'smooth');
};

if (typeof window.IntersectionObserver === 'function') {
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
} else if (sectionElements.length) {
  setActiveNav(sectionElements[0].id);
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const targetId = link.getAttribute('href')?.replace('#', '');
    if (targetId) {
      setActiveNav(targetId);
    }
    playUiSound('tap');

    if (navMenu && menuToggle && navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      updateMenuScrim(false);
    }
  });

  link.addEventListener('mouseenter', () => {
    playUiSound('hover');
  });

  link.addEventListener('focus', () => {
    playUiSound('hover');
    syncNavSlider(link, 'smooth');
  });
});

if (menuToggle && navMenu) {
  const closeMobileMenu = (withSound = false) => {
    navMenu.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    updateMenuScrim(false);
    if (withSound) {
      playUiSound('menu-close');
    }
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
     updateMenuScrim(isOpen);
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
      updateMenuScrim(false);
    }

    const activeLink = Array.from(navLinks).find((link) => link.classList.contains('active')) || navLinks[0];
    syncNavSlider(activeLink, 'auto');
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
updateMenuScrim(false);
if (!savedAudience || !savedAgeRange) {
  openAudienceGate();
}

const syncNavFromHash = () => {
  const currentHash = window.location.hash.replace('#', '');
  if (!currentHash) {
    setActiveNav('home');
    return;
  }
  const matchingSection = Array.from(sectionElements).find((section) => section.id === currentHash);
  if (matchingSection) {
    setActiveNav(matchingSection.id);
  }
};

syncNavFromHash();
window.addEventListener('hashchange', syncNavFromHash);
window.addEventListener('load', () => {
  const activeLink = Array.from(navLinks).find((link) => link.classList.contains('active')) || navLinks[0];
  syncNavSlider(activeLink, 'auto');
});

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    playUiSound('top');
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

if (socialModal && socialModalTitle && socialModalHandle && socialModalDescription && socialModalAction) {
  const closeSocialModal = () => {
    socialModal.classList.remove('is-open');
    socialModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  const openSocialModal = (trigger) => {
    const actionUrl = trigger.dataset.socialUrl || '#';
    const isInPageLink = actionUrl.startsWith('#');

    socialModalTitle.textContent = trigger.dataset.socialTitle || 'Profile';
    socialModalHandle.textContent = trigger.dataset.socialHandle || '';
    socialModalDescription.textContent = trigger.dataset.socialDescription || '';
    socialModalAction.href = actionUrl;
    socialModalAction.textContent = trigger.dataset.socialAction || 'Open';
    if (isInPageLink) {
      socialModalAction.removeAttribute('target');
      socialModalAction.removeAttribute('rel');
    } else {
      socialModalAction.setAttribute('target', '_blank');
      socialModalAction.setAttribute('rel', 'noopener noreferrer');
    }
    socialModal.classList.add('is-open');
    socialModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      openSocialModal(trigger);
      playUiSound('tap');
    });
  });

  socialModalAction.addEventListener('click', () => {
    if (socialModalAction.getAttribute('href')?.startsWith('#')) {
      closeSocialModal();
    }
  });

  [socialModalClose, socialModalDismiss, socialModalScrim].forEach((node) => {
    if (!node) return;
    node.addEventListener('click', () => {
      closeSocialModal();
      playUiSound('menu-close');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && socialModal.classList.contains('is-open')) {
      closeSocialModal();
    }
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

const getBalancedGridColumns = (count, maxColumns = 4) => {
  if (count <= 1) return 1;
  const baseRows = Math.max(1, Math.floor(Math.sqrt(count)));
  return Math.min(maxColumns, Math.ceil(count / baseRows));
};

const applyBalancedGrid = (selector, maxColumns = 4) => {
  const grid = document.querySelector(selector);
  if (!grid) return;

  const cardCount = grid.children.length;
  const columnCount = getBalancedGridColumns(cardCount, maxColumns);
  grid.style.setProperty('--grid-cols', String(columnCount));
};

const syncBalancedGrids = () => {
  document.querySelectorAll('.info-grid').forEach((grid) => {
    grid.style.setProperty('--grid-cols', String(getBalancedGridColumns(grid.children.length, 3)));
  });

  applyBalancedGrid('.timeline', 3);
  applyBalancedGrid('.projects-grid', 3);
  applyBalancedGrid('.achievements-grid', 4);
  applyBalancedGrid('.certs-grid', 4);
  applyBalancedGrid('.goal-list', 3);
};

initSkillsMarquee();
syncBalancedGrids();

let marqueeResizeTimer = null;
window.addEventListener('resize', () => {
  if (marqueeResizeTimer) {
    clearTimeout(marqueeResizeTimer);
  }
  marqueeResizeTimer = window.setTimeout(() => {
    initSkillsMarquee();
    syncBalancedGrids();
  }, 140);
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

function stopRoleTyping() {
  if (roleTypingTimer) {
    window.clearTimeout(roleTypingTimer);
    roleTypingTimer = null;
  }
}

function startRoleTyping() {
  if (!dynamicRole) return;
  stopRoleTyping();

  if (prefersReducedMotion) {
    dynamicRole.textContent = activeRolePhrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeTick = () => {
    const currentText = activeRolePhrases[phraseIndex];

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
      delay = 1600;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % activeRolePhrases.length;
      delay = 300;
    }

    roleTypingTimer = window.setTimeout(typeTick, delay);
  };

  dynamicRole.textContent = '';
  roleTypingTimer = window.setTimeout(typeTick, 450);
}

/* ─── Floating CTA ─── */
const floatingCtaEl = document.querySelector('#floating-cta');

if (floatingCtaEl) {
  const updateFloatingCta = () => {
    const isVisible = window.scrollY > 440;
    floatingCtaEl.classList.toggle('is-visible', isVisible);
  };

  window.addEventListener('scroll', updateFloatingCta, { passive: true });
  updateFloatingCta();
}

/* ─── Skill chip hover sounds ─── */
document.querySelectorAll('.skill-chip').forEach((chip) => {
  chip.addEventListener('mouseenter', () => {
    playUiSound('hover');
  });
});
