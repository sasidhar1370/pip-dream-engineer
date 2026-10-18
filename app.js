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
      const audioCtx = this.ctx;
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
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

      // Automatically resume Web Audio AudioContext on first click of any button
      document.addEventListener('click', (e) => {
        const audioCtx = this.ctx;
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        } else if (!audioCtx && e.target.closest('button, .btn, [role="button"], a')) {
          this.initContext();
        }
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
      const audioCtx = this.ctx;
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
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
     * Plays the sweet dream arpeggio: C5, E5, G5, B5, C6 cleanly with 250ms spacing
     */
    playDreamArpeggio(callback, onNoteStep) {
      if (this.isMuted) {
        if (callback) callback();
        return;
      }
      this.initContext();

      const noteNames = ['C5', 'E5', 'G5', 'B5', 'C6'];
      const notes = [
        this.frequencies.C5,
        this.frequencies.E5,
        this.frequencies.G5,
        this.frequencies.B5,
        this.frequencies.C6
      ];

      notes.forEach((freq, index) => {
        const timeDelay = index * 0.25;
        this.playTone(freq, 1.2, 'sine', timeDelay, 0.28);
        if (onNoteStep) {
          setTimeout(() => {
            onNoteStep(noteNames[index], freq, index);
          }, index * 250);
        }
      });

      if (callback) {
        setTimeout(callback, notes.length * 250 + 400);
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
      if (document.body) {
        document.body.classList.toggle('day-mode', theme === 'day');
      }
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
   * 2.5. CELESTIAL AMBIENT STARFIELD CANVAS (Living Midnight Nursery Starfield)
   * -------------------------------------------------------------------------- */
  class CelestialSkyStarfield {
    constructor() {
      this.canvas = document.getElementById('celestial-sky-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.particleCount = 55; // 45–60 twinkling stardust particles
      this.colors = ['#ffd166', '#ffffff', '#c084fc', '#38bdf8', '#fed7aa'];
      this.animationFrameId = null;
      this.isRunning = false;

      this.resize();
      this.initParticles();
      this.bindEvents();
      this.start();
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    initParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push(this.createParticle(true));
      }
    }

    createParticle(randomY = false) {
      return {
        x: Math.random() * (this.width || window.innerWidth),
        y: randomY ? Math.random() * (this.height || window.innerHeight) : (this.height || window.innerHeight) + 10,
        radius: 1 + Math.random() * 1.5, // 1px–2.5px
        vx: (Math.random() - 0.5) * 0.25, // gentle sideways drift
        vy: -(0.15 + Math.random() * 0.35), // gentle upward drift
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        baseAlpha: 0.2 + Math.random() * 0.4,
        twinkleSpeed: 0.015 + Math.random() * 0.03,
        twinkleOffset: Math.random() * Math.PI * 2
      };
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.resize();
      }, { passive: true });

      // Battery & CPU optimization: Pause when document is hidden
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stop();
        } else {
          this.start();
        }
      });
    }

    start() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.loop();
      }
    }

    stop() {
      this.isRunning = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }

    loop() {
      if (!this.isRunning) return;

      this.render();
      this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    render() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      const time = performance.now() * 0.001;

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders
        if (p.y < -10) {
          this.particles[i] = this.createParticle(false);
          continue;
        }
        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;

        // Shimmer / twinkle alpha pulse between 0.2 and 0.85
        const twinkle = Math.sin(time * (p.twinkleSpeed * 60) + p.twinkleOffset);
        const alpha = Math.min(0.85, Math.max(0.2, p.baseAlpha + twinkle * 0.3));

        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = p.radius * 2;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }
  }

  /* --------------------------------------------------------------------------
   * 3. SPARKLE CURSOR TRAIL (Lightweight Micro-Stardust Canvas Overlay)
   * -------------------------------------------------------------------------- */
  class SparkleCursorTrail {
    constructor() {
      this.canvas = document.getElementById('sparkle-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.maxParticles = 65;
      this.symbols = ['★', '✦', '✧'];
      this.colors = ['#f7d794', '#b388ff', '#c8d6e5', '#ffffff'];
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

      const handleMove = (x, y) => {
        const now = performance.now();
        if (now - this.lastSpawnTime > 22) {
          this.lastSpawnTime = now;
          // Emit 2–3 micro stardust stars
          const count = Math.floor(Math.random() * 2) + 2;
          for (let i = 0; i < count; i++) {
            this.spawnParticle(x, y);
          }
        }
      };

      window.addEventListener('pointermove', (e) => {
        handleMove(e.clientX, e.clientY);
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });
    }

    spawnParticle(x, y) {
      if (this.particles.length > this.maxParticles) {
        this.particles.shift();
      }

      const glyph = this.symbols[Math.floor(Math.random() * this.symbols.length)];
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const duration = 600; // Shimmer & fade out over 600ms
      const startTime = performance.now();

      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.2 - 0.3,
        gravity: 0.045, // Downward drift with slight gravity
        glyph,
        color,
        size: Math.floor(Math.random() * 6) + 11,
        startTime,
        duration,
        rotation: (Math.random() - 0.5) * 0.4
      });

      if (!this.isRunning) {
        this.isRunning = true;
        requestAnimationFrame(() => this.loop());
      }
    }

    loop() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      const now = performance.now();

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        const elapsed = now - p.startTime;

        if (elapsed >= p.duration) {
          this.particles.splice(i, 1);
          continue;
        }

        const progress = elapsed / p.duration;
        const alpha = Math.max(0, 1 - progress);

        // Drift downward with slight gravity
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;

        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.font = `${p.size}px "Plus Jakarta Sans", sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(p.glyph, p.x, p.y);
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        requestAnimationFrame(() => this.loop());
      } else {
        this.isRunning = false;
      }
    }
  }

  /* --------------------------------------------------------------------------
   * 4. PIP 3D TILT & POINTER TRACKER (Tier 1 Cursor Reaction)
   * -------------------------------------------------------------------------- */
  class PipTiltTracker {
    constructor() {
      this.hero = document.getElementById('hero');
      this.zone = document.getElementById('hero-avatar-zone');
      this.cardInner = document.getElementById('avatar-card-inner');
      this.aura = document.getElementById('avatar-aura');
      if (!this.cardInner) return;

      this.currentTiltX = 0;
      this.currentTiltY = 0;
      this.targetTiltX = 0;
      this.targetTiltY = 0;
      this.isInteracting = false;
      this.maxTilt = 14; // Clamp maximum tilt angle between -14deg and +14deg

      this.bindEvents();
      this.render();
    }

    bindEvents() {
      const handlePointer = (clientX, clientY) => {
        const anchor = this.zone || this.cardInner;
        const rect = anchor.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const maxRangeX = Math.max(window.innerWidth / 2, 350);
        const maxRangeY = Math.max(window.innerHeight / 2, 350);

        const deltaX = (clientX - centerX) / maxRangeX;
        const deltaY = (clientY - centerY) / maxRangeY;

        // Calculate 3D tilt clamped between -14deg and +14deg
        const rawTiltX = deltaX * this.maxTilt;
        const rawTiltY = -deltaY * this.maxTilt;

        this.targetTiltX = Math.max(-this.maxTilt, Math.min(this.maxTilt, rawTiltX));
        this.targetTiltY = Math.max(-this.maxTilt, Math.min(this.maxTilt, rawTiltY));
        this.isInteracting = true;
      };

      const heroEl = this.hero || document.body;

      // Pointermove listener on hero section
      heroEl.addEventListener('pointermove', (e) => {
        handlePointer(e.clientX, e.clientY);
      });

      heroEl.addEventListener('pointerleave', () => {
        this.isInteracting = false;
        this.targetTiltX = 0;
        this.targetTiltY = 0;
      });

      // Touchmove fallback for mobile so dragging a finger across the hero makes Pip gently lean
      heroEl.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          handlePointer(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      heroEl.addEventListener('touchend', () => {
        this.isInteracting = false;
        this.targetTiltX = 0;
        this.targetTiltY = 0;
      });
    }

    render() {
      // Smooth lerp interpolation for buttery transition
      const lerp = 0.08;
      this.currentTiltX += (this.targetTiltX - this.currentTiltX) * lerp;
      this.currentTiltY += (this.targetTiltY - this.currentTiltY) * lerp;

      const tiltX = this.currentTiltX.toFixed(2);
      const tiltY = this.currentTiltY.toFixed(2);
      const scale = this.isInteracting ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)';

      // 3D tilt formula: perspective(800px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) scale3d(1.02, 1.02, 1.02)
      this.cardInner.style.transform = `perspective(800px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) ${scale}`;

      if (this.aura) {
        const auraX = (this.currentTiltX * 1.5).toFixed(1);
        const auraY = (-this.currentTiltY * 1.5).toFixed(1);
        this.aura.style.transform = `translate(${auraX}px, ${auraY}px)`;
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
      if (this.isPlayingMelody) return;
      this.isPlayingMelody = true;

      if (this.feedback) this.feedback.textContent = 'Sequencing: C5 → E5 → G5 → B5 → C6...';

      // Initial flourish burst of floating musical stardust symbols
      this.spawnNoteParticle();
      setTimeout(() => this.spawnNoteParticle(), 150);
      setTimeout(() => this.spawnNoteParticle(), 300);

      this.audio.playDreamArpeggio(() => {
        if (this.feedback) this.feedback.textContent = 'Melody complete · Ready to chime';
        this.isPlayingMelody = false;
      }, (noteName, freq) => {
        // Find corresponding chime key and bob it in sync
        const keyEl = document.querySelector(`.chime-key[data-note="${noteName}"]`);
        if (keyEl) {
          keyEl.classList.add('key-active');
          setTimeout(() => keyEl.classList.remove('key-active'), 220);
        }
        this.spawnNoteParticle(noteName);
        if (this.feedback) {
          this.feedback.textContent = `Chiming: ${noteName} (${freq.toFixed(1)} Hz)`;
        }
      });

      // Playing a lullaby delivers sweet dreams
      if (this.odometer) {
        this.odometer.increment(1);
      }
    }

    spawnNoteParticle(noteName = '') {
      if (!this.notesBurst) return;
      const symbols = ['♪', '♫', '✦', '★', '✧'];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];

      const note = document.createElement('span');
      note.className = 'floating-note';
      note.textContent = noteName ? `${symbol} ${noteName}` : symbol;

      const randomX = Math.floor(Math.random() * 200) + 30;
      const offsetX = (Math.random() - 0.5) * 70;
      const rot = (Math.random() - 0.5) * 40;
      const colors = ['#f7d794', '#b388ff', '#70a1ff', '#ffffff'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      note.style.left = `${randomX}px`;
      note.style.bottom = '30px';
      note.style.color = color;
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
      this.direction = 1; // 1 = forward (Cribs Hub -> Lighthouse), -1 = return (Lighthouse -> Cribs Hub)
      this.speeds = { a: 0.002, b: 0.0016, c: 0.0025 };
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

      this.initSkylineGradient();
      this.bindEvents();
      // Select initial signature waypoint with active radar ping ring
      this.selectWaypoint('Teddy');
      this.animateDrone();
    }

    initSkylineGradient() {
      // Ensure smooth vertical gradient (#090d1a to #1a223f) is present in SVG defs
      const defs = document.querySelector('#routes-svg-map defs');
      if (defs && !document.getElementById('skylineGrad')) {
        const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.id = 'skylineGrad';
        grad.setAttribute('x1', '0%');
        grad.setAttribute('y1', '100%');
        grad.setAttribute('x2', '0%');
        grad.setAttribute('y2', '0%');
        grad.innerHTML = '<stop offset="0%" stop-color="#090d1a" /><stop offset="100%" stop-color="#1a223f" />';
        defs.appendChild(grad);
      }
    }

    bindEvents() {
      this.routeBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const route = btn.getAttribute('data-route');
          this.switchRoute(route);
        });
      });

      // Waypoint clicks and hovers
      this.waypoints.forEach((wp) => {
        const station = wp.getAttribute('data-station');
        wp.addEventListener('mouseenter', () => {
          this.showStationInfo(station);
        });
        wp.addEventListener('click', () => {
          this.selectWaypoint(station);
          if (this.audio) {
            this.audio.playTone(880, 0.2, 'sine', 0, 0.15);
          }
        });
      });
    }

    selectWaypoint(stationKey) {
      if (!stationKey) return;
      this.waypoints.forEach((wp) => {
        const match = wp.getAttribute('data-station') === stationKey;
        wp.classList.toggle('selected', match);
        wp.classList.toggle('active', match);
      });
      this.showStationInfo(stationKey);
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

      // Update status text
      if (this.statusText) {
        this.statusText.textContent = this.statusMessages[routeKey];
      }

      // Automatically focus and ping the signature waypoint for this route
      const routeWaypoints = {
        a: 'Lighthouse',
        b: 'Cloud9',
        c: 'Teddy'
      };
      this.selectWaypoint(routeWaypoints[routeKey] || 'Cloud9');

      if (this.audio) {
        this.audio.playTone(659.25, 0.25, 'sine', 0, 0.15);
      }
    }

    showStationInfo(stationKey) {
      const info = this.stationLore[stationKey];
      if (!info || !this.tooltip) return;
      this.tooltip.style.opacity = '0';
      this.tooltip.style.transform = 'translateY(-4px)';
      setTimeout(() => {
        this.tooltipTitle.textContent = info.title;
        this.tooltipDesc.textContent = info.desc;
        this.tooltip.style.opacity = '1';
        this.tooltip.style.transform = 'translateY(0)';
      }, 120);
    }

    animateDrone() {
      const path = this.paths[this.activeRoute];
      if (path && this.drone) {
        try {
          if (typeof path.getTotalLength === 'function') {
            const totalLen = path.getTotalLength();
            if (totalLen > 0) {
              const speed = this.speeds[this.activeRoute] || 0.002;
              this.progress += speed * (this.direction || 1);

              // Smoothly glide from Cribs Hub to Lighthouse and back
              if (this.progress >= 1) {
                this.progress = 1;
                this.direction = -1; // Smooth return flight back to Cribs Hub
              } else if (this.progress <= 0) {
                this.progress = 0;
                this.direction = 1; // Smooth forward flight to Lighthouse
              }

              const currentLen = totalLen * this.progress;
              const pt = path.getPointAtLength(currentLen);
              this.drone.setAttribute('transform', `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`);
            }
          }
        } catch (err) {
          // Graceful fallback if SVG path not yet computed
        }
      }

      requestAnimationFrame(() => this.animateDrone());
    }
  }

  /* --------------------------------------------------------------------------
   * 8. STORY & COMPONENT SCROLL REVEAL (IntersectionObserver)
   * -------------------------------------------------------------------------- */
  class StoryScrollReveal {
    constructor() {
      this.elements = document.querySelectorAll('.scroll-reveal, .story-card, .project-card, .gear-card, #wishes .wish-card');
      this.initObserver();
    }

    initObserver() {
      // Ensure elements have scroll-reveal class for CSS transitions
      this.elements.forEach((el) => {
        if (!el.classList.contains('scroll-reveal')) {
          el.classList.add('scroll-reveal');
        }
      });

      if (!('IntersectionObserver' in window)) {
        this.elements.forEach((c) => c.classList.add('revealed'));
        return;
      }

      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          } else {
            // Remove class when scrolled out of view so it animates again on return
            entry.target.classList.remove('revealed');
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      this.elements.forEach((el) => revealObserver.observe(el));
      this.observer = revealObserver;
    }

    observeNew(element) {
      if (!element) return;
      element.classList.add('scroll-reveal');
      if (this.observer) {
        this.observer.observe(element);
      } else {
        element.classList.add('revealed');
      }
    }
  }

  /* --------------------------------------------------------------------------
   * 8.5. INTERACTIVE STORYBOOK 3D PAGE FLIP (Tier 2 Feature)
   * -------------------------------------------------------------------------- */
  class InteractiveStorybook {
    constructor(audioManager) {
      this.audio = audioManager;
      this.cards = Array.from(document.querySelectorAll('.story-card'));
      this.prevBtn = document.getElementById('story-prev-btn');
      this.nextBtn = document.getElementById('story-next-btn');
      this.pageIndicator = document.getElementById('story-current-page');
      this.stage = document.getElementById('story-timeline');

      this.currentPage = 1;
      this.totalPages = this.cards.length || 3;

      if (this.cards.length === 0) return;

      this.initPages();
      this.bindEvents();
    }

    initPages() {
      this.updatePageState();
    }

    bindEvents() {
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.prevPage());
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.nextPage());
      }

      // Keyboard arrow keys navigation (Left/Right)
      window.addEventListener('keydown', (e) => {
        const storySection = document.getElementById('story');
        if (!storySection) return;
        const rect = storySection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInView || document.activeElement.closest('#story')) {
          if (e.key === 'ArrowRight') {
            this.nextPage();
          } else if (e.key === 'ArrowLeft') {
            this.prevPage();
          }
        }
      });
    }

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePageState();
        this.playPageSound(false);
      }
    }

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updatePageState();
        this.playPageSound(true);
      }
    }

    updatePageState() {
      this.cards.forEach((card, index) => {
        const pageNum = index + 1;
        card.classList.remove('page-flipped', 'active-page', 'page-hidden');

        if (pageNum < this.currentPage) {
          card.classList.add('page-flipped');
        } else if (pageNum === this.currentPage) {
          card.classList.add('active-page');
        } else {
          card.classList.add('page-hidden');
        }
      });

      if (this.pageIndicator) {
        this.pageIndicator.textContent = this.currentPage;
      }

      if (this.prevBtn) {
        this.prevBtn.disabled = this.currentPage <= 1;
        this.prevBtn.classList.toggle('disabled', this.currentPage <= 1);
      }
      if (this.nextBtn) {
        this.nextBtn.disabled = this.currentPage >= this.totalPages;
        this.nextBtn.classList.toggle('disabled', this.currentPage >= this.totalPages);
      }
    }

    playPageSound(isNext) {
      if (!this.audio) return;
      const pitch = isNext ? 783.99 : 659.25;
      this.audio.playTone(pitch, 0.35, 'triangle', 0, 0.18);
    }
  }

  /* --------------------------------------------------------------------------
   * 8.6. PIP'S INTERACTIVE DIALOGUE BOT (Tier 3 Legendary: Character Chats Back)
   * -------------------------------------------------------------------------- */
  class PipDialogueBot {
    constructor(audioManager) {
      this.audio = audioManager;
      this.chips = document.querySelectorAll('.dialogue-chip');
      this.speechPill = document.getElementById('avatar-gesture-pill');
      this.speechText = document.querySelector('#avatar-gesture-pill .gesture-text');
      this.typingTimer = null;

      this.responses = {
        nightcap: "The pink bow keeps my dream antennas tuned to 432 Hz so I never miss a whimpering cradle!",
        nightmares: "With warm amber light (1800K)! Monsters are allergic to chamomile and fuzzy socks.",
        recipe: "40% Moonbeam Yarn, 35% warm honey mist, and 25% lavender raindrops. Stir counter-clockwise!"
      };

      this.initEvents();
    }

    initEvents() {
      this.chips.forEach((chip) => {
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          const q = chip.getAttribute('data-question');
          this.respond(q, chip);
        });
      });
    }

    respond(questionKey, activeChip) {
      const reply = this.responses[questionKey];
      if (!reply || !this.speechText) return;

      // Highlight active chip
      this.chips.forEach((c) => c.classList.toggle('active', c === activeChip));

      // Typewriter animation
      if (this.typingTimer) {
        clearInterval(this.typingTimer);
        this.typingTimer = null;
      }

      if (this.speechPill) {
        this.speechPill.classList.add('typing');
      }

      this.speechText.textContent = '';
      let charIdx = 0;

      // Initial chiptune chime
      if (this.audio) {
        this.audio.playTone(880, 0.15, 'triangle', 0, 0.15);
      }

      this.typingTimer = setInterval(() => {
        if (charIdx < reply.length) {
          this.speechText.textContent += reply[charIdx];

          // Tiny chiptune click chime every 4 characters
          if (charIdx % 4 === 0 && this.audio) {
            this.audio.playTone(1200 + (charIdx % 3) * 150, 0.04, 'sine', 0, 0.06);
          }
          charIdx++;
        } else {
          clearInterval(this.typingTimer);
          this.typingTimer = null;
          if (this.speechPill) {
            this.speechPill.classList.remove('typing');
          }
          // Final cheerful arrival chime
          if (this.audio) {
            this.audio.playTone(1046.50, 0.25, 'triangle', 0, 0.15);
          }
        }
      }, 22);
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
        cloud: '✦',
        flight: '☽',
        cozy: '•',
        lullaby: '♪',
        shield: '★'
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

      this.wishes.forEach((w, index) => {
        const card = document.createElement('article');
        card.className = 'wish-card';
        card.id = w.id;

        // Subtle organic rotation for floating pinned paper slips
        const rotAngles = [-1.5, 1.2, -0.8, 1.8, -1.2, 0.9];
        const rot = rotAngles[index % rotAngles.length];
        card.style.setProperty('--slip-rot', `${rot}deg`);

        const glyph = this.flavorEmojiMap[w.category] || '✦';

        card.innerHTML = `
          <span class="wish-pin" aria-hidden="true">✦</span>
          <div class="wish-card-header">
            <span class="wish-avatar-emoji" aria-hidden="true">${glyph}</span>
            <div>
              <strong class="wish-author">${this.escapeHTML(w.name)}</strong>
              <div class="wish-flavor-tag">${this.formatCategory(w.category)}</div>
            </div>
          </div>
          <p class="wish-text">“${this.escapeHTML(w.text)}”</p>
          <div class="wish-card-footer">
            <span class="wish-time">• ${w.timestamp}</span>
            <button type="button" class="wish-like-btn" data-wish-id="${w.id}" aria-label="Send sweet dreams heart to ${this.escapeHTML(w.name)}">
              <span>♥</span>
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

      const extraCloseBtn = document.getElementById('easter-egg-close-btn');
      if (extraCloseBtn) {
        extraCloseBtn.addEventListener('click', () => this.closeModal());
      }

      // Ensure clicking the overlay background (outside the modal box) closes the modal
      if (this.modal) {
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal || !e.target.closest('.secret-modal-card')) {
            this.closeModal();
          }
        });
      }

      // Keydown listener for the 'Escape' key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeModal();
        }
      });
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
      this.secretBadgeIcon.textContent = '★';
      this.secretBadgeTitle.textContent = 'Certified Master Dream Weaver';
      this.secretBadgeDesc.textContent = 'Secret Unlocked · Nightcap Tickle Champion';
    }

    closeModal() {
      if (this.modal) {
        this.modal.setAttribute('hidden', '');
      }
    }

    dropGoldStars(count = 25) {
      const symbols = ['✦', '★', '☽', '•'];
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
   * 13. DREAM LANTERN BEAM MANAGER (Tier 2 Feature)
   * -------------------------------------------------------------------------- */
  class DreamLanternBeam {
    constructor(audioManager) {
      this.audio = audioManager;
      this.btn = document.getElementById('lantern-beam-toggle-btn');
      this.statusText = document.getElementById('beam-status-text');
      this.isActive = false;

      this.initEvents();
    }

    initEvents() {
      // Dynamic cursor & touch tracker updating CSS variables for radial flashlight beam
      const updateCoords = (e) => {
        const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
        const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);
        document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);
      };

      ['mousemove', 'pointermove', 'touchmove'].forEach((evt) => {
        window.addEventListener(evt, updateCoords, { passive: true });
      });

      if (!this.btn) return;

      this.btn.addEventListener('click', () => {
        this.toggleBeam();
      });
    }

    toggleBeam() {
      this.isActive = !this.isActive;
      document.body.classList.toggle('lantern-beam-on', this.isActive);
      document.body.classList.toggle('lantern-active', this.isActive);
      this.btn.classList.toggle('active', this.isActive);
      this.btn.setAttribute('aria-pressed', this.isActive.toString());

      if (this.statusText) {
        this.statusText.textContent = this.isActive ? 'Beam: ON' : 'Lantern Beam';
      }

      if (this.audio) {
        const pitch = this.isActive ? 987.77 : 659.25;
        this.audio.playTone(pitch, 0.4, 'sine', 0, 0.22);
      }
    }
  }

  /* --------------------------------------------------------------------------
   * 14. STARDUST CATCHER MINI-TOY (Tier 2 Feature)
   * -------------------------------------------------------------------------- */
  class StardustCatcherToy {
    constructor(audioManager, odometer) {
      this.audio = audioManager;
      this.odometer = odometer;

      this.card = document.getElementById('stardust-toy-card');
      this.startBtn = document.getElementById('start-stardust-btn');
      this.statusPill = document.getElementById('stardust-status-pill');
      this.scoreDisplay = document.getElementById('stardust-score-display');

      this.caughtCount = 0;
      this.totalStars = 5;
      this.isRunning = false;
      this.pentatonicFrequencies = [523.25, 587.33, 659.25, 783.99, 880.00]; // C5, D5, E5, G5, A5

      this.init();
    }

    init() {
      if (!this.startBtn) return;
      this.startBtn.addEventListener('click', () => {
        this.startDrift();
      });
    }

    startDrift() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.caughtCount = 0;
      this.updateScore();

      if (this.statusPill) {
        this.statusPill.textContent = 'Catch the stars!';
      }

      if (this.startBtn) {
        this.startBtn.disabled = true;
      }

      // Spawn 5 gentle star particles descending down screen
      for (let i = 0; i < this.totalStars; i++) {
        setTimeout(() => {
          this.spawnStar(i);
        }, i * 650);
      }
    }

    spawnStar(index) {
      const star = document.createElement('div');
      star.className = 'falling-star-spark';
      star.textContent = '★';
      star.setAttribute('aria-label', `Falling Star ${index + 1}`);

      const minX = 70;
      const maxX = Math.max(window.innerWidth - 100, 300);
      const startX = Math.floor(Math.random() * (maxX - minX)) + minX;
      const fallDuration = 6.0 + Math.random() * 2.5;

      star.style.left = `${startX}px`;
      star.style.setProperty('--fall-duration', `${fallDuration}s`);

      const noteFreq = this.pentatonicFrequencies[index % this.pentatonicFrequencies.length];

      const catchHandler = (e) => {
        e.stopPropagation();
        this.audio.playTone(noteFreq, 0.7, 'sine', 0, 0.32);
        this.audio.playTone(noteFreq * 2, 0.35, 'triangle', 0.04, 0.16);

        // Pop flare
        const pop = document.createElement('div');
        pop.className = 'caught-star-pop';
        pop.textContent = '✦ +1 Star!';
        pop.style.left = `${e.clientX || startX}px`;
        pop.style.top = `${e.clientY || 150}px`;
        document.body.appendChild(pop);
        setTimeout(() => { if (pop.parentNode) pop.parentNode.removeChild(pop); }, 800);

        if (star.parentNode) star.parentNode.removeChild(star);

        this.caughtCount++;
        this.updateScore();

        if (this.caughtCount === this.totalStars) {
          this.celebrateCompletion();
        }
      };

      star.addEventListener('click', catchHandler);
      star.addEventListener('touchstart', catchHandler, { passive: true });

      document.body.appendChild(star);

      // Clean up if not caught before reaching bottom
      setTimeout(() => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
          if (this.caughtCount < this.totalStars && !document.querySelector('.falling-star-spark')) {
            this.finishDrift();
          }
        }
      }, (fallDuration + 0.5) * 1000);
    }

    updateScore() {
      if (this.scoreDisplay) {
        this.scoreDisplay.textContent = `Stars Caught: ${this.caughtCount} / ${this.totalStars}`;
      }
    }

    celebrateCompletion() {
      if (this.statusPill) {
        this.statusPill.textContent = '★ 5/5 Caught! +5 Delivered!';
      }
      if (this.scoreDisplay) {
        this.scoreDisplay.textContent = `★ All 5 Caught! +5 Dreams Delivered!`;
      }

      // Reward +5 to the Dreams Delivered odometer
      if (this.odometer) {
        this.odometer.increment(5);
      }

      // Celebratory chime arpeggio
      if (this.audio) {
        this.pentatonicFrequencies.forEach((freq, idx) => {
          this.audio.playTone(freq * 1.5, 0.5, 'sine', idx * 0.08, 0.25);
        });
      }

      setTimeout(() => {
        this.finishDrift();
      }, 1500);
    }

    finishDrift() {
      this.isRunning = false;
      if (this.startBtn) {
        this.startBtn.disabled = false;
      }
      if (this.statusPill && this.caughtCount < this.totalStars) {
        this.statusPill.textContent = '5 Drift Sparks';
      }
    }
  }

  /* --------------------------------------------------------------------------
   * 15. RETURNING VISITOR MEMORY (Tier 3 Feature)
   * -------------------------------------------------------------------------- */
  class ReturningVisitorMemory {
    constructor() {
      this.checkAndGreet();
    }

    checkAndGreet() {
      try {
        const storedCount = localStorage.getItem('pip_visit_count');
        const visitCount = (parseInt(storedCount, 10) || 0) + 1;
        localStorage.setItem('pip_visit_count', visitCount.toString());

        if (visitCount > 1) {
          const speechBubble = document.getElementById('avatar-gesture-pill');
          if (speechBubble) {
            speechBubble.classList.add('returning-visitor');
            const textSpan = speechBubble.querySelector('.gesture-text') || speechBubble;
            textSpan.textContent = 'Welcome back, little dreamer! Pip kept the nightlight burning for you.';
          }
        }
      } catch (err) {
        // Safe fallback if localStorage is unavailable
      }
    }
  }

  /* --------------------------------------------------------------------------
   * 16. BOOTSTRAP APPLICATION
   * -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Managers
    const audio = new AudioManager();
    const theme = new ThemeManager();
    const celestialSky = new CelestialSkyStarfield();
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
    const storybook = new InteractiveStorybook(audio);
    const wishes = new MidnightWishWall(audio, odometer);

    // 5. Easter Egg & Navigation
    const easter = new NightcapEasterEgg(audio, odometer);
    const mobileNav = new MobileNavigation();

    // 6. Tier 2 & Tier 3 Standout Features
    const beam = new DreamLanternBeam(audio);
    const dialogue = new PipDialogueBot(audio);
    const stardust = new StardustCatcherToy(audio, odometer);
    const memory = new ReturningVisitorMemory();

    // Console easter egg for curious hackathon judges
    console.log(
      '%c✦ Pip · Junior Dream Engineer at Midnight Nursery ✦\n%cBuilt for haX.baby · Baby\'s First Website Hackathon (17–19 Oct 2026)\nReady for sweet slumber!',
      'color: #ffd166; font-size: 16px; font-weight: bold; background: #0a0e1c; padding: 6px 10px; border-radius: 4px;',
      'color: #a78bfa; font-size: 12px; margin-top: 4px;'
    );
  });
})();
