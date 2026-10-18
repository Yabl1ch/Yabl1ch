/**
 * Web Audio API synthesized celestial glass chime.
 * Generates a warm, pleasant, and harmonic chord (E-major 9th arpeggio)
 * without requiring external audio files.
 */

let hasPlayedIntroChime = false;

function synthesizeChime(ctx: AudioContext): void {
  const now = ctx.currentTime;

  // Harmonious chord frequencies: E5, G#5, B5, E6, F#6 (E-major 9th)
  const notes = [
    { freq: 659.25, timeOffset: 0.0, duration: 0.65 },
    { freq: 830.61, timeOffset: 0.016, duration: 0.6 },
    { freq: 987.77, timeOffset: 0.032, duration: 0.55 },
    { freq: 1318.51, timeOffset: 0.048, duration: 0.5 },
    { freq: 1479.98, timeOffset: 0.064, duration: 0.45 },
  ];

  // Master Gain with soft, click-free attack and gentle natural decay
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.linearRampToValueAtTime(0.14, now + 0.02);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

  // Silky lowpass filter to remove harsh high frequencies
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(3200, now);
  filter.Q.setValueAtTime(1.0, now);

  masterGain.connect(filter);
  filter.connect(ctx.destination);

  notes.forEach(({ freq, timeOffset, duration }, idx) => {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    // Alternate sine and triangle waves for an acoustic chime body
    osc.type = idx % 2 === 0 ? "sine" : "triangle";
    osc.frequency.setValueAtTime(freq, now + timeOffset);

    const startTime = now + timeOffset;
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(0.09, startTime + 0.012);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  });

  // Safely close context after sound decay
  setTimeout(() => {
    try {
      if (ctx.state !== "closed") {
        ctx.close().catch((err: unknown) => {
          console.warn("AudioContext close failed", err);
        });
      }
    } catch (err: unknown) {
      console.warn("AudioContext cleanup error", err);
    }
  }, 1000);
}

/**
 * Triggers the pleasant intro chime. Handles browser autoplay policies defensively.
 */
export function playIntroChime(): void {
  if (hasPlayedIntroChime) return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    if (ctx.state === "suspended") {
      ctx
        .resume()
        .then(() => {
          if (!hasPlayedIntroChime) {
            hasPlayedIntroChime = true;
            synthesizeChime(ctx);
          }
        })
        .catch(() => {
          // Autoplay blocked by browser policy without user gesture.
          // Listen for first interaction as fallback.
          const handleFirstInteraction = () => {
            if (!hasPlayedIntroChime) {
              hasPlayedIntroChime = true;
              try {
                const freshCtx = new AudioContextClass();
                freshCtx
                  .resume()
                  .then(() => synthesizeChime(freshCtx))
                  .catch((err: unknown) => {
                    console.warn("Fallback audio play failed", err);
                  });
              } catch (err: unknown) {
                console.warn("Fallback context creation failed", err);
              }
            }
            window.removeEventListener("pointerdown", handleFirstInteraction);
            window.removeEventListener("keydown", handleFirstInteraction);
          };

          window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
          window.addEventListener("keydown", handleFirstInteraction, { once: true });
        });
    } else {
      hasPlayedIntroChime = true;
      synthesizeChime(ctx);
    }
  } catch (err: unknown) {
    console.warn("Web Audio API not supported in current environment", err);
  }
}

/**
 * Resets playback state for testing or hot reloads.
 */
export function resetAudioState(): void {
  hasPlayedIntroChime = false;
}
