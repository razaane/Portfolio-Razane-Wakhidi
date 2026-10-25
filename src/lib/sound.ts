"use client";

// Tiny synthesized sounds (no audio files). Off by default; the toggle stores the choice.
const KEY = "razane:sound";
let ctx: AudioContext | undefined;

export const soundEnabled = () => {
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
};

export const setSoundEnabled = (on: boolean) => {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
};

const audio = () => (ctx ??= new AudioContext());

export function playSound(kind: "pop" | "rustle") {
  if (!soundEnabled()) return;
  const ac = audio();
  const now = ac.currentTime;
  const gain = ac.createGain();
  gain.connect(ac.destination);

  if (kind === "pop") {
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.15);
    return;
  }

  // Paper rustle: a short burst of band-passed noise.
  const length = Math.floor(ac.sampleRate * 0.35);
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2;
  const noise = ac.createBufferSource();
  noise.buffer = buffer;
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 3200;
  band.Q.value = 0.7;
  gain.gain.setValueAtTime(0.12, now);
  noise.connect(band).connect(gain);
  noise.start(now);
}
