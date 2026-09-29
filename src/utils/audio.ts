// Web Audio API Synthesizer for rich, delightful kid-friendly sounds
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Frequency map for digits 0-9 (pleasant musical scale)
const DIGIT_FREQS: Record<string, number> = {
  '1': 329.63, // E4
  '2': 369.99, // F#4
  '3': 392.00, // G4
  '4': 440.00, // A4
  '5': 493.88, // B4
  '6': 523.25, // C5
  '7': 587.33, // D5
  '8': 659.25, // E5
  '9': 698.46, // F5
  '0': 783.99, // G5
};

export function playKeySound(digit: string, theme: string = 'paper'): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const freq = DIGIT_FREQS[digit] || 440;
  osc.frequency.setValueAtTime(freq, now);

  if (theme === 'cyber') {
    osc.type = 'sawtooth';
    // Cyber filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    osc.connect(filter);
    filter.connect(gain);
  } else if (theme === 'castle') {
    osc.type = 'triangle'; // Gentle harp/bell tone
    osc.connect(gain);
  } else {
    // Paper / Vault: Friendly arcade bubble pop tone
    osc.type = 'sine';
    osc.connect(gain);
  }

  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.start(now);
  osc.stop(now + 0.12);

  triggerHaptic('tap');
}

export function playEraseSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(500, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.14);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.14);

  triggerHaptic('tap');
}

export function playUnlockFanfare(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Cheerful multi-note victory chime: C5 -> E5 -> G5 -> C6!
  const notes = [
    { freq: 523.25, time: 0.00, dur: 0.12 }, // C5
    { freq: 659.25, time: 0.10, dur: 0.12 }, // E5
    { freq: 783.99, time: 0.20, dur: 0.14 }, // G5
    { freq: 1046.50, time: 0.32, dur: 0.45 }, // C6
  ];

  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(n.freq, now + n.time);

    gain.gain.setValueAtTime(0, now + n.time);
    gain.gain.linearRampToValueAtTime(0.35, now + n.time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + n.time);
    osc.stop(now + n.time + n.dur);
  });

  // Second celebratory layer: sparkling higher harmonic bell
  setTimeout(() => {
    if (!ctx) return;
    const t2 = ctx.currentTime;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, t2); // E6
    osc2.frequency.exponentialRampToValueAtTime(1567.98, t2 + 0.25); // G6
    gain2.gain.setValueAtTime(0.2, t2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.4);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t2);
    osc2.stop(t2 + 0.4);
  }, 220);

  // Mechanical bolt clatter sound
  playMechanicalUnlockSound();

  triggerHaptic('success');
}

export function playMechanicalUnlockSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + 0.15;
  // White noise burst for latch sliding
  const bufferSize = ctx.sampleRate * 0.12;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
}

export function playLockSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Solid deep clunk (locking bolt)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.18);

  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.18);

  triggerHaptic('tap');
}

export function playErrorBuzzer(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Friendly comic "womp-womp" or retro boing sound
  const tones = [
    { freq: 240, time: 0, dur: 0.14 },
    { freq: 175, time: 0.15, dur: 0.28 },
  ];

  tones.forEach((t) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(t.freq, now + t.time);

    // Filter to make it warmer / more cartoon-like
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;

    gain.gain.setValueAtTime(0.25, now + t.time);
    gain.gain.exponentialRampToValueAtTime(0.001, now + t.time + t.dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + t.time);
    osc.stop(now + t.time + t.dur);
  });

  triggerHaptic('error');
}

export function speakMessage(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.pitch = 1.25; // Joyful kid-friendly friendly tone

    // Try finding a pt-BR voice
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find((v) => v.lang.startsWith('pt') || v.lang.startsWith('pt-BR'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech errors gracefully
  }
}

export function triggerHaptic(type: 'tap' | 'success' | 'error'): void {
  if (typeof window === 'undefined' || !navigator.vibrate) return;

  try {
    if (type === 'tap') {
      navigator.vibrate(25);
    } else if (type === 'success') {
      navigator.vibrate([60, 40, 100, 40, 160]);
    } else if (type === 'error') {
      navigator.vibrate([120, 60, 120]);
    }
  } catch {
    // Ignore vibration failure
  }
}
