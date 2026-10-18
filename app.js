/**
 * ==========================================================================
 * PIP · JUNIOR DREAM ENGINEER AT MIDNIGHT NURSERY
 * Modular Vanilla JavaScript Application
 * ==========================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
   * 1. AUDIO MANAGER (Web Audio API Synthesizer)
   * -------------------------------------------------------------------------- */
  class AudioManager {
    constructor() {
      this.ctx = null;
      this.isMuted = localStorage.getItem('pip-sound-enabled') === 'false';
      this.frequencies = {
        C5: 523.25,
        E5: 659.25,
        G5: 783.99,
        B5: 987.77,
        C6: 1046.50
      };

      this.soundBtn = document.getElementById('sound-toggle-btn');
      this.statusText = document.getElementById('sound-status-text');
      this.initUI();
    }

    initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    initUI() {
      if (this.isMuted) {
        this.soundBtn.classList.add('muted');
        this.soundBtn.setAttribute('aria-pressed', 'false');
        this.statusText.textContent = 'Sound: OFF';
      } else {
        this.soundBtn.classList.remove('muted');
        this.soundBtn.setAttribute('aria-pressed', 'true');
        this.statusText.textContent = 'Sound: ON';
      }

      this.soundBtn.addEventListener('click', () => {
        this.toggleSound();
      });
    }

    toggleSound() {
      this.initContext();
      this.isMuted = !this.isMuted;
      localStorage.setItem('pip-sound-enabled', (!this.isMuted).toString());

      if (this.isMuted) {
        this.soundBtn.classList.add('muted');
        this.soundBtn.setAttribute('aria-pressed', 'false');
        this.statusText.textContent = 'Sound: OFF';
      } else {
        this.soundBtn.classList.remove('muted');
        this.soundBtn.setAttribute('aria-pressed', 'true');
        this.statusText.textContent = 'Sound: ON';
        this.playTone(this.frequencies.G5, 0.25, 'sine');
      }
    }

    /**
     * Synthesizes a warm celestial chime tone
     */
    playTone(freq, duration = 0.8, type = 'sine', delay = 0, gainLevel = 0.25) {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const startTime = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Lowpass filter for dreamy acoustic warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, startTime);

      // Primary tone
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Gentle harmonic overtone for celesta/music-box chime sparkle
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2, startTime);

      // Envelope
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.exponentialRampToValueAtTime(gainLevel, startTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gainNode);
      overtone.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(this.ctx.destination);

      osc.start(startTime);
      overtone.start(startTime);
      osc.stop(startTime + duration + 0.05);
      overtone.stop(startTime + duration + 0.05);
    }

    /**
     * Plays the sweet dream arpeggio: C5, E5, G5, B5, C6
     */
    playDreamArpeggio(callback) {
      if (this.isMuted) {
        if (callback) callback();
        return;
      }
      this.initContext();

      const notes = [
        this.frequencies.C5,
        this.frequencies.E5,
        this.frequencies.G5,
        this.frequencies.B5,
        this.frequencies.C6
      ];

      notes.forEach((freq, index) => {
        this.playTone(freq, 1.2, 'sine', index * 0.16, 0.28);
      });

      if (callback) {
        setTimeout(callback, notes.length * 160 + 400);
      }
    }

    /**
     * Retro mechanical tick sound for odometer ticker
     */
    playClickTick() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);

      gainNode.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    }

    /**
     * Whimsical giggle chime arpeggio for Easter Egg
     */
    playGiggleChimes() {
      if (this.isMuted) return;
      this.initContext();
      const pitches = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      pitches.forEach((freq, i) => {
        this.playTone(freq, 0.6, 'triangle', i * 0.09, 0.22);
      });
    }
  }

  /* --------------------------------------------------------------------------
   * 2. THEME MANAGER (Day / Midnight Nursery Switcher)
   * -------------------------------------------------------------------------- */
  class ThemeManager {
    constructor() {
      this.toggleBtn = document.getElementById('theme-toggle-btn');
      this.statusText = document.getElementById('theme-status-text');
      this.savedTheme = localStorage.getItem('pip-theme') || 'midnight';

      this.applyTheme(this.savedTheme);
      this.initEvents();
    }

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('pip-theme', theme);
      if (theme === 'day') {
        this.statusText.textContent = 'Day Nursery';
        this.toggleBtn.setAttribute('title', 'Switch to Starry Navy Midnight');
      } else {
        this.statusText.textContent = 'Midnight';
        this.toggleBtn.setAttribute('title', 'Switch to Pastel Lavender Day');
      }
    }

    initEvents() {
      this.toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'midnight';
        const nextTheme = currentTheme === 'midnight' ? 'day' : 'midnight';
        this.applyTheme(nextTheme);
      });
    }
  }

  /* --------------------------------------------------------------------------
   * 3. SPARKLE CURSOR TRAIL (Lightweight HTML5 Canvas)
   * -------------------------------------------------------------------------- */
  class SparkleCursorTrail {
    constructor() {
      this.canvas = document.getElementById('sparkle-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.maxParticles = 65;
      this.colors = ['#ffd166', '#a78bfa', '#38bdf8', '#f472b6', '#ffffff'];
      this.lastSpawnTime = 0;
      this.isRunning = false;

      this.resize();
      this.bindEvents();
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    bindEvents() {
      window.addEventListener('resize', () => this.resize(), { passive: true });

      const addPoint = (x, y) => {
        const now = performance.now();
        if (now - this.lastSpawnTime > 18) {
          this.lastSpawnTime = now;
          this.spawnParticle(x, y);
        }
      };

      window.addEventListener('mousemove', (e) => {
        addPoint(e.clientX, e.clientY);
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          addPoint(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });
    }

    spawnParticle(x, y) {
      if (this.particles.length > this.maxParticles) {
        this.particles.shift();
      }

      this.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6 + 0.4,
        size: Math.random() * 4 + 2.5,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        life: 1.0,
        decay: Math.random() * 0.025 + 0.018,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.1
      });

      if (!this.isRunning) {
        this.isRunning = true;
        requestAnimationFrame(() => this.loop());
      }
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius, color, alpha, rot) {
      const ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = color;

      let rotAngle = (Math.PI / 2) * 3;
      let x = 0;
      let y = 0;
      const step = Math.PI / spikes;

      ctx.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = Math.cos(rotAngle) * outerRadius;
        y = Math.sin(rotAngle) * outerRadius;
        ctx.lineTo(x, y);
        rotAngle += step;

        x = Math.cos(rotAngle) * innerRadius;
        y = Math.sin(rotAngle) * innerRadius;
        ctx.lineTo(x, y);
        rotAngle += step;
      }
      ctx.lineTo(0, -outerRadius);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    loop() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.life -= p.decay;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        const currentSize = p.size * p.life;
        this.drawStar(p.x, p.y, 4, currentSize, currentSize * 0.4, p.color, p.life, p.rotation);
      }

      if (this.particles.length > 0) {
        requestAnimationFrame(() => this.loop());
      } else {
        this.isRunning = false;
      }
    }
  }

  /* --------------------------------------------------------------------------
   * 4. PIP 3D TILT & POINTER TRACKER
   * -------------------------------------------------------------------------- */
  class PipTiltTracker {
    constructor() {
      this.zone = document.getElementById('hero-avatar-zone');
      this.cardInner = document.getElementById('avatar-card-inner');
      this.aura = document.getElementById('avatar-aura');
      if (!this.zone || !this.cardInner) return;

      this.currentX = 0;
      this.currentY = 0;
      this.targetX = 0;
      this.targetY = 0;
      this.isHovering = false;

      this.bindEvents();
      this.render();
    }

    bindEvents() {
      const handleMove = (clientX, clientY) => {
        const rect = this.zone.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (clientX - centerX) / (rect.width / 2);
        const deltaY = (clientY - centerY) / (rect.height / 2);

        // Clamped tilt values (-1 to 1)
        this.targetX = Math.max(-1, Math.min(1, deltaX));
        this.targetY = Math.max(-1, Math.min(1, deltaY));
        this.isHovering = true;
      };

      this.zone.addEventListener('mousemove', (e) => {
        handleMove(e.clientX, e.clientY);
      });

      this.zone.addEventListener('mouseleave', () => {
        this.isHovering = false;
        this.targetX = 0;
        this.targetY = 0;
      });

      // Touch screen support
      this.zone.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      this.zone.addEventListener('touchend', () => {
        this.isHovering = false;
        this.targetX = 0;
        this.targetY = 0;
      });
    }

    render() {
      // Smooth lerp interpolation
      const ease = 0.08;
      this.currentX += (this.targetX - this.currentX) * ease;
      this.currentY += (this.targetY - this.currentY) * ease;

      const rotateY = this.currentX * 18; // Max 18deg tilt horizontally
      const rotateX = -this.currentY * 18; // Max 18deg tilt vertically

      this.cardInner.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

      if (this.aura) {
        const auraX = this.currentX * 20;
        const auraY = this.currentY * 20;
        this.aura.style.transform = `translate(${auraX.toFixed(1)}px, ${auraY.toFixed(1)}px)`;
      }

      requestAnimationFrame(() => this.render());
    }
  }

  /* --------------------------------------------------------------------------
   * 5. PROJECT 1: THE LULLABY LAB
   * -------------------------------------------------------------------------- */
  class LullabyLab {
    constructor(audioManager, odometer) {
      this.audio = audioManager;
      this.odometer = odometer;

      this.trigger = document.getElementById('lullaby-box-trigger');
      this.fullArpeggioBtn = document.getElementById('play-full-arpeggio-btn');
      this.heroChimeBtn = document.getElementById('hero-play-chime-btn');
      this.notesBurst = document.getElementById('lullaby-notes-burst');
      this.visualizer = document.getElementById('audio-visualizer');
      this.feedback = document.getElementById('melody-feedback');

      this.chimeKeys = document.querySelectorAll('.chime-key');

      this.bindEvents();
    }

    bindEvents() {
      // Click music box to play full sweet dream chime
      if (this.trigger) {
        this.trigger.addEventListener('click', () => {
          this.playMelody();
        });
        this.trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.playMelody();
          }
        });
      }

      if (this.fullArpeggioBtn) {
        this.fullArpeggioBtn.addEventListener('click', () => {
          this.playMelody();
        });
      }

      if (this.heroChimeBtn) {
        this.heroChimeBtn.addEventListener('click', () => {
          this.playMelody();
        });
      }

      // Individual Chime Keys
      this.chimeKeys.forEach((key) => {
        key.addEventListener('click', () => {
          const freq = parseFloat(key.getAttribute('data-freq'));
          const note = key.getAttribute('data-note');
          this.playSingleChime(key, freq, note);
        });
      });

      // Keyboard numerical shortcuts (1: C5, 2: E5, 3: G5, 4: B5, 5: C6)
      window.addEventListener('keydown', (e) => {
        if (e.target.matches('input, textarea, select')) return;
        const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4 };
        if (keyMap[e.key] !== undefined && this.chimeKeys[keyMap[e.key]]) {
          const btn = this.chimeKeys[keyMap[e.key]];
          const freq = parseFloat(btn.getAttribute('data-freq'));
          const note = btn.getAttribute('data-note');
          this.playSingleChime(btn, freq, note);
        }
      });
    }

    playSingleChime(keyEl, freq, note) {
      keyEl.classList.add('key-active');
      setTimeout(() => keyEl.classList.remove('key-active'), 250);

      this.audio.playTone(freq, 0.9, 'sine', 0, 0.3);
      this.spawnNoteParticle(note);
      if (this.feedback) {
        this.feedback.textContent = `Chime: ${note} (${freq.toFixed(1)} Hz)`;
      }
    }

    playMelody() {
      if (this.visualizer) this.visualizer.classList.add('playing');
      if (this.feedback) this.feedback.textContent = 'Playing: C5 → E5 → G5 → B5 → C6';

      // Burst of floating notes
      const symbols = ['♪', '♫', '♬', '✨', '⭐'];
      symbols.forEach((sym, i) => {
        setTimeout(() => this.spawnNoteParticle(sym), i * 160);
      });

      this.audio.playDreamArpeggio(() => {
        if (this.visualizer) this.visualizer.classList.remove('playing');
        if (this.feedback) this.feedback.textContent = 'Melody complete ✨ Ready to play';
      });

      // Playing a lullaby delivers sweet dreams
      if (this.odometer) {
        this.odometer.increment(1);
      }
    }

    spawnNoteParticle(text) {
      if (!this.notesBurst) return;
      const note = document.createElement('span');
      note.className = 'floating-note';
      note.textContent = text;

      const randomX = Math.floor(Math.random() * 180) + 40;
      const offsetX = (Math.random() - 0.5) * 60;
      const rot = (Math.random() - 0.5) * 50;

      note.style.left = `${randomX}px`;
      note.style.bottom = '40px';
      note.style.setProperty('--offset-x', `${offsetX}px`);
      note.style.setProperty('--rot', `${rot}deg`);

      this.notesBurst.appendChild(note);

      setTimeout(() => {
        if (note.parentNode) note.parentNode.removeChild(note);
      }, 1600);
    }
  }

  /* --------------------------------------------------------------------------
   * 6. PROJECT 2: NIGHTLIGHT COLLECTION
   * -------------------------------------------------------------------------- */
  class NightlightCollection {
    constructor(audioManager) {
      this.audio = audioManager;
      this.buttons = document.querySelectorAll('.glow-mode-btn');
      this.glowStage = document.getElementById('lantern-room-glow');
      this.statusTag = document.getElementById('active-mode-label');

      this.modes = {
        soft: { label: 'Soft Glow (Cozy Amber 1800K)', soundFreq: 523.25 },
        starry: { label: 'Starry Glow (Cyan Starlight)', soundFreq: 783.99 },
        sleep: { label: 'Sleep Mode (Breathing Indigo Pulse)', soundFreq: 659.25 }
      };

      this.bindEvents();
    }

    bindEvents() {
      this.buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const mode = btn.getAttribute('data-mode');
          this.setMode(mode);
        });
      });
    }

    setMode(modeKey) {
      if (!this.modes[modeKey]) return;

      // Update button active state
      this.buttons.forEach((btn) => {
        const isActive = btn.getAttribute('data-mode') === modeKey;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-checked', isActive.toString());
      });

      // Update glow class
      if (this.glowStage) {
        this.glowStage.className = `lantern-room-glow mode-${modeKey}`;
      }

      // Update label
      if (this.statusTag) {
        this.statusTag.textContent = this.modes[modeKey].label;
      }

      // Subtle switch audio feedback
      this.audio.playTone(this.modes[modeKey].soundFreq, 0.4, 'sine', 0, 0.15);
    }
  }

  /* --------------------------------------------------------------------------
   * 7. PROJECT 3: DREAM DELIVERY ROUTES
   * -------------------------------------------------------------------------- */
  class DreamDeliveryRoutes {
    constructor(audioManager) {
      this.audio = audioManager;
      this.routeBtns = document.querySelectorAll('.route-tab-btn');
      this.paths = {
        a: document.getElementById('flight-path-a'),
        b: document.getElementById('flight-path-b'),
        c: document.getElementById('flight-path-c')
      };
      this.drone = document.getElementById('flying-pip-drone');
      this.statusText = document.getElementById('route-speed-status');
      this.tooltip = document.getElementById('waypoint-tooltip');
      this.tooltipTitle = document.getElementById('tooltip-title');
      this.tooltipDesc = document.getElementById('tooltip-desc');
      this.waypoints = document.querySelectorAll('.map-waypoint');

      this.activeRoute = 'a';
      this.progress = 0;
      this.speeds = { a: 0.0018, b: 0.0014, c: 0.0022 };
      this.statusMessages = {
        a: 'Estimated Flight Time: 4.2 sleep cycles (Express)',
        b: 'Estimated Flight Time: 6.8 sleep cycles (Scenic Detour)',
        c: 'Estimated Flight Time: 3.5 sleep cycles (Patrol Scan)'
      };

      this.stationLore = {
        Cribs: {
          title: 'Starlight Cribs (Hub)',
          desc: 'Departure nest for midnight dream packets. Fluff level: 100%.'
        },
        Cloud9: {
          title: 'Cloud 9 Station',
          desc: 'Midway deep REM recharge station. Temperature: Warm Milk (37°C).'
        },
        Teddy: {
          title: 'Teddy Bear Tower',
          desc: 'Nightmare deflection radar sentinel. Monster detection: 0%.'
        },
        Lighthouse: {
          title: 'Lullaby Lighthouse',
          desc: 'Final harbor of sweet dreams. Guides cradles to peaceful awakening.'
        }
      };

      this.bindEvents();
      this.animateDrone();
    }

    bindEvents() {
      this.routeBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const route = btn.getAttribute('data-route');
          this.switchRoute(route);
        });
      });

      // Waypoint clicks and hovers
      this.waypoints.forEach((wp) => {
        const station = wp.getAttribute('data-station');
        const show = () => this.showStationInfo(station);

        wp.addEventListener('mouseenter', show);
        wp.addEventListener('click', () => {
          show();
          this.audio.playTone(880, 0.2, 'sine', 0, 0.15);
        });
      });
    }

    switchRoute(routeKey) {
      if (!this.paths[routeKey]) return;
      this.activeRoute = routeKey;

      // Update route tabs
      this.routeBtns.forEach((btn) => {
        const isActive = btn.getAttribute('data-route') === routeKey;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive.toString());
      });

      // Update path styling
      Object.keys(this.paths).forEach((k) => {
        if (this.paths[k]) {
          this.paths[k].classList.toggle('route-active', k === routeKey);
        }
      });

      // Update status
      if (this.statusText) {
        this.statusText.textContent = this.statusMessages[routeKey];
      }

      this.progress = 0; // Reset drone to start of new path
      this.audio.playTone(659.25, 0.3, 'sine', 0, 0.15);
    }

    showStationInfo(stationKey) {
      const info = this.stationLore[stationKey];
      if (!info || !this.tooltip) return;
      this.tooltipTitle.textContent = info.title;
      this.tooltipDesc.textContent = info.desc;
    }

    animateDrone() {
      const path = this.paths[this.activeRoute];
      if (path && this.drone && path.getTotalLength) {
        const totalLen = path.getTotalLength();
        this.progress += this.speeds[this.activeRoute] || 0.0018;
        if (this.progress > 1) this.progress = 0;

        const currentLen = totalLen * this.progress;
        const pt = path.getPointAtLength(currentLen);

        this.drone.setAttribute('transform', `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`);
      }

      requestAnimationFrame(() => this.animateDrone());
    }
  }

  /* --------------------------------------------------------------------------
   * 8. STORY SECTION (Scroll Reveal via IntersectionObserver)
   * -------------------------------------------------------------------------- */
  class StoryScrollReveal {
    constructor() {
      this.cards = document.querySelectorAll('.story-card');
      this.initObserver();
    }

    initObserver() {
      if (!('IntersectionObserver' in window)) {
        this.cards.forEach((c) => c.classList.add('revealed'));
        return;
      }

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.25,
        rootMargin: '0px 0px -50px 0px'
      });

      this.cards.forEach((card) => observer.observe(card));
    }
  }

  /* --------------------------------------------------------------------------
   * 9. MIDNIGHT WISH WALL (Guestbook with LocalStorage)
   * -------------------------------------------------------------------------- */
  class MidnightWishWall {
    constructor(audioManager, odometer) {
      this.audio = audioManager;
      this.odometer = odometer;

      this.form = document.getElementById('wish-form');
      this.nameInput = document.getElementById('dreamer-name');
      this.flavorSelect = document.getElementById('dream-category');
      this.textArea = document.getElementById('dream-text');
      this.charCounter = document.getElementById('char-count');
      this.wishesGrid = document.getElementById('wishes-grid');
      this.counterPill = document.getElementById('wishes-count-pill');
      this.resetBtn = document.getElementById('reset-wishes-btn');

      this.flavorEmojiMap = {
        cloud: '☁️',
        flight: '🌙',
        cozy: '🧸',
        lullaby: '🎵',
        shield: '🛡️'
      };

      this.sampleWishes = [
        {
          id: 'sample-1',
          name: 'Baby Theo (Age 4)',
          category: 'cloud',
          text: 'May my little sister finally sleep through the whole night without monsters under the bed.',
          timestamp: '10:42 PM',
          hearts: 14
        },
        {
          id: 'sample-2',
          name: 'Luna the Owl',
          category: 'flight',
          text: 'Hoping for a dream where I can fly over marshmallow mountains with my dog and count falling stars.',
          timestamp: '11:15 PM',
          hearts: 9
        },
        {
          id: 'sample-3',
          name: 'Barnaby Bear',
          category: 'cozy',
          text: 'A warm cup of chamomile tea, golden honey toast, and cozy woolen socks that never slip off.',
          timestamp: '11:58 PM',
          hearts: 22
        }
      ];

      this.wishes = this.loadWishes();
      this.render();
      this.bindEvents();
    }

    loadWishes() {
      try {
        const stored = localStorage.getItem('pip-wishes');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Could not read wishes from localStorage', e);
      }
      return [...this.sampleWishes];
    }

    saveWishes() {
      try {
        localStorage.setItem('pip-wishes', JSON.stringify(this.wishes));
      } catch (e) {
        console.warn('Could not save wishes to localStorage', e);
      }
    }

    bindEvents() {
      // Character count tracking
      if (this.textArea && this.charCounter) {
        this.textArea.addEventListener('input', () => {
          this.charCounter.textContent = this.textArea.value.length;
        });
      }

      // Form submission
      if (this.form) {
        this.form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.submitWish();
        });
      }

      // Reset to samples button
      if (this.resetBtn) {
        this.resetBtn.addEventListener('click', () => {
          this.wishes = [...this.sampleWishes];
          this.saveWishes();
          this.render();
          this.audio.playTone(523.25, 0.3, 'sine');
        });
      }
    }

    submitWish() {
      const name = this.nameInput.value.trim();
      const text = this.textArea.value.trim();
      const category = this.flavorSelect.value;

      if (!name || !text) {
        alert('Please share both your name and your bedtime wish! ✨');
        return;
      }

      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');

      const newWish = {
        id: 'wish-' + Date.now(),
        name: name,
        category: category,
        text: text,
        timestamp: `${hours}:${mins}`,
        hearts: 1
      };

      this.wishes.unshift(newWish);
      this.saveWishes();
      this.render();

      // Reset form
      this.form.reset();
      if (this.charCounter) this.charCounter.textContent = '0';

      // Feedback chime & counter increment
      this.audio.playDreamArpeggio();
      if (this.odometer) this.odometer.increment(1);
    }

    render() {
      if (!this.wishesGrid) return;
      this.wishesGrid.innerHTML = '';

      if (this.counterPill) {
        this.counterPill.textContent = `${this.wishes.length} ${this.wishes.length === 1 ? 'Wish' : 'Wishes'}`;
      }

      this.wishes.forEach((w) => {
        const card = document.createElement('article');
        card.className = 'wish-card';
        card.id = w.id;

        const emoji = this.flavorEmojiMap[w.category] || '⭐';

        card.innerHTML = `
          <span class="wish-pin" aria-hidden="true">📌</span>
          <div class="wish-card-header">
            <span class="wish-avatar-emoji" aria-hidden="true">${emoji}</span>
            <div>
              <strong class="wish-author">${this.escapeHTML(w.name)}</strong>
              <div class="wish-flavor-tag">${this.formatCategory(w.category)}</div>
            </div>
          </div>
          <p class="wish-text">“${this.escapeHTML(w.text)}”</p>
          <div class="wish-card-footer">
            <span class="wish-time">🕒 ${w.timestamp}</span>
            <button type="button" class="wish-like-btn" data-wish-id="${w.id}" aria-label="Send sweet dreams heart to ${this.escapeHTML(w.name)}">
              <span>❤️</span>
              <span class="heart-count">${w.hearts || 0}</span>
            </button>
          </div>
        `;

        const likeBtn = card.querySelector('.wish-like-btn');
        likeBtn.addEventListener('click', () => {
          w.hearts = (w.hearts || 0) + 1;
          this.saveWishes();
          likeBtn.querySelector('.heart-count').textContent = w.hearts;
          this.audio.playTone(783.99, 0.25, 'sine', 0, 0.2);
          if (this.odometer) this.odometer.increment(1);
        });

        this.wishesGrid.appendChild(card);
      });
    }

    formatCategory(cat) {
      const map = {
        cloud: 'Marshmallow Clouds',
        flight: 'Starlight Whales',
        cozy: 'Warm Milk & Blanket',
        lullaby: 'Sleeping Melody',
        shield: 'Nightmare Deflection'
      };
      return map[cat] || 'Bedtime Wish';
    }

    escapeHTML(str) {
      return str.replace(/[&<>'"]/g, (tag) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag));
    }
  }

  /* --------------------------------------------------------------------------
   * 10. VINTAGE HIT COUNTER (Mechanical Odometer Ticker)
   * -------------------------------------------------------------------------- */
  class VintageOdometer {
    constructor(audioManager) {
      this.audio = audioManager;
      this.box = document.getElementById('odometer-box');
      this.digitsTrack = document.getElementById('odometer-digits');

      const savedCount = parseInt(localStorage.getItem('pip-dreams-delivered'), 10);
      this.count = !isNaN(savedCount) && savedCount >= 1420 ? savedCount : 1420;

      this.render();
      this.bindEvents();
    }

    bindEvents() {
      if (this.box) {
        this.box.addEventListener('click', () => {
          this.increment(1);
        });
        this.box.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.increment(1);
          }
        });
      }
    }

    increment(amount = 1) {
      this.count += amount;
      localStorage.setItem('pip-dreams-delivered', this.count.toString());
      this.audio.playClickTick();
      this.render(true);
    }

    render(isRolling = false) {
      if (!this.digitsTrack) return;

      // Format as 6 digits with comma: e.g. 001,420
      const formatted = this.count.toString().padStart(6, '0');
      const d1 = formatted[0];
      const d2 = formatted[1];
      const d3 = formatted[2];
      const d4 = formatted[3];
      const d5 = formatted[4];
      const d6 = formatted[5];

      const html = `
        <span class="digit-tumbler ${isRolling ? 'rolling' : ''}"><span class="digit-val">${d1}</span></span>
        <span class="digit-tumbler ${isRolling ? 'rolling' : ''}"><span class="digit-val">${d2}</span></span>
        <span class="digit-tumbler ${isRolling ? 'rolling' : ''}"><span class="digit-val">${d3}</span></span>
        <span class="digit-comma">,</span>
        <span class="digit-tumbler ${isRolling ? 'rolling' : ''}"><span class="digit-val">${d4}</span></span>
        <span class="digit-tumbler ${isRolling ? 'rolling' : ''}"><span class="digit-val">${d5}</span></span>
        <span class="digit-tumbler ${isRolling ? 'rolling' : ''}"><span class="digit-val">${d6}</span></span>
      `;

      this.digitsTrack.innerHTML = html;
    }
  }

  /* --------------------------------------------------------------------------
   * 11. EASTER EGG (Click Pip's Nightcap 3 Times)
   * -------------------------------------------------------------------------- */
  class NightcapEasterEgg {
    constructor(audioManager, odometer) {
      this.audio = audioManager;
      this.odometer = odometer;

      this.nightcapBtn = document.getElementById('nightcap-hitbox');
      this.pipAvatarImg = document.getElementById('pip-avatar-img');
      this.modal = document.getElementById('easter-modal');
      this.modalClose = document.getElementById('easter-modal-close');
      this.modalClaim = document.getElementById('easter-modal-claim-btn');
      this.secretBadgeSlot = document.getElementById('secret-badge-slot');
      this.secretBadgeIcon = document.getElementById('secret-badge-icon');
      this.secretBadgeTitle = document.getElementById('secret-badge-title');
      this.secretBadgeDesc = document.getElementById('secret-badge-desc');

      this.clickCount = 0;
      this.clickTimer = null;
      this.isUnlocked = localStorage.getItem('pip-easter-unlocked') === 'true';

      if (this.isUnlocked) {
        this.unlockBadgeUI();
      }

      this.bindEvents();
    }

    bindEvents() {
      if (this.nightcapBtn) {
        this.nightcapBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleNightcapClick();
        });
      }

      if (this.modalClose) {
        this.modalClose.addEventListener('click', () => this.closeModal());
      }

      if (this.modalClaim) {
        this.modalClaim.addEventListener('click', () => this.closeModal());
      }

      if (this.modal) {
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) this.closeModal();
        });
      }
    }

    handleNightcapClick() {
      this.clickCount++;
      clearTimeout(this.clickTimer);

      if (this.clickCount === 1) {
        this.audio.playTone(783.99, 0.2, 'sine', 0, 0.2);
        this.clickTimer = setTimeout(() => { this.clickCount = 0; }, 2400);
      } else if (this.clickCount === 2) {
        this.audio.playTone(987.77, 0.25, 'sine', 0, 0.25);
        this.clickTimer = setTimeout(() => { this.clickCount = 0; }, 2400);
      } else if (this.clickCount >= 3) {
        this.clickCount = 0;
        this.triggerEasterEgg();
      }
    }

    triggerEasterEgg() {
      // 1. Giggle bounce animation on Pip
      if (this.pipAvatarImg) {
        this.pipAvatarImg.classList.add('giggle-active');
        setTimeout(() => {
          this.pipAvatarImg.classList.remove('giggle-active');
        }, 1400);
      }

      // 2. Play cheerful giggle chime melody
      this.audio.playGiggleChimes();

      // 3. Shower of falling golden stars
      this.dropGoldStars(28);

      // 4. Unlock Badge permanently
      this.isUnlocked = true;
      localStorage.setItem('pip-easter-unlocked', 'true');
      this.unlockBadgeUI();

      // 5. Increment dream delivery odometer
      if (this.odometer) {
        this.odometer.increment(7);
      }

      // 6. Show secret reward modal
      setTimeout(() => {
        if (this.modal) {
          this.modal.removeAttribute('hidden');
        }
      }, 700);
    }

    unlockBadgeUI() {
      if (!this.secretBadgeSlot) return;
      this.secretBadgeSlot.classList.remove('locked');
      this.secretBadgeSlot.classList.add('unlocked');
      this.secretBadgeIcon.textContent = '👑';
      this.secretBadgeTitle.textContent = '★ Master Dream Weaver ★';
      this.secretBadgeDesc.textContent = 'Secret Unlocked: Nightcap Tickle Champion';
    }

    closeModal() {
      if (this.modal) {
        this.modal.setAttribute('hidden', '');
      }
    }

    dropGoldStars(count = 25) {
      const symbols = ['⭐', '✨', '🌟', '✦'];
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const star = document.createElement('div');
          star.className = 'star-drop-particle';
          star.textContent = symbols[Math.floor(Math.random() * symbols.length)];

          const startX = Math.random() * window.innerWidth;
          const shiftX = (Math.random() - 0.5) * 200;
          const rot = Math.random() * 720;

          star.style.left = `${startX}px`;
          star.style.top = '-40px';
          star.style.setProperty('--x-shift', `${shiftX}px`);
          star.style.setProperty('--rot', `${rot}deg`);

          document.body.appendChild(star);

          setTimeout(() => {
            if (star.parentNode) star.parentNode.removeChild(star);
          }, 2600);
        }, i * 70);
      }
    }
  }

  /* --------------------------------------------------------------------------
   * 12. MOBILE MENU & ACCESSIBILITY POLISH
   * -------------------------------------------------------------------------- */
  class MobileNavigation {
    constructor() {
      this.btn = document.getElementById('mobile-menu-btn');
      this.nav = document.getElementById('main-nav');
      this.links = document.querySelectorAll('.nav-link');

      if (!this.btn || !this.nav) return;

      this.btn.addEventListener('click', () => {
        const isOpen = this.nav.classList.toggle('mobile-open');
        this.btn.setAttribute('aria-expanded', isOpen.toString());
      });

      this.links.forEach((l) => {
        l.addEventListener('click', () => {
          this.nav.classList.remove('mobile-open');
          this.btn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
   * 13. BOOTSTRAP APPLICATION
   * -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Managers
    const audio = new AudioManager();
    const theme = new ThemeManager();
    const sparkles = new SparkleCursorTrail();
    const tilt = new PipTiltTracker();

    // 2. Odometer Ticker
    const odometer = new VintageOdometer(audio);

    // 3. Project Showcases
    const lullaby = new LullabyLab(audio, odometer);
    const lantern = new NightlightCollection(audio);
    const routes = new DreamDeliveryRoutes(audio);

    // 4. Story & Wish Wall
    const story = new StoryScrollReveal();
    const wishes = new MidnightWishWall(audio, odometer);

    // 5. Easter Egg & Navigation
    const easter = new NightcapEasterEgg(audio, odometer);
    const mobileNav = new MobileNavigation();

    // Console easter egg for curious hackathon judges
    console.log(
      '%c✦ Pip · Junior Dream Engineer at Midnight Nursery ✦\n%cBuilt for haX.baby · Baby\'s First Website Hackathon (17–19 Oct 2026)\nReady for sweet slumber!',
      'color: #ffd166; font-size: 16px; font-weight: bold; background: #0a0e1c; padding: 6px 10px; border-radius: 4px;',
      'color: #a78bfa; font-size: 12px; margin-top: 4px;'
    );
  });
})();
