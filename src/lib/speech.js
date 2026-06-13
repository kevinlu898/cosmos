const supported = typeof window !== "undefined" && "speechSynthesis" in window;

console.log("[speech] module loaded, supported =", supported);

let voicesPromise = null;

function loadVoices() {
  if (!supported) return Promise.resolve([]);
  if (voicesPromise) return voicesPromise;

  voicesPromise = new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length) {
      resolve(existing);
      return;
    }
    const onChange = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        window.speechSynthesis.removeEventListener("voiceschanged", onChange);
        resolve(voices);
      }
    };
    window.speechSynthesis.addEventListener("voiceschanged", onChange);
    // Fallback in case the event never fires.
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
  });

  return voicesPromise;
}

// Prefer a friendly, natural English voice when one is available.
function pickVoice(voices) {
  if (!voices.length) return null;
  const preferred = [
    "Google US English",
    "Samantha",
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Zira",
  ];
  for (const name of preferred) {
    const match = voices.find((v) => v.name === name);
    if (match) return match;
  }
  return (
    voices.find((v) => v.lang && v.lang.startsWith("en")) || voices[0]
  );
}

export function isSpeechSupported() {
  return supported;
}

let primed = false;

function prime() {
  if (!supported || primed) return;
  primed = true;
  console.log("[speech] priming on first user gesture");
  try {
    window.speechSynthesis.resume();
    const warmup = new SpeechSynthesisUtterance(" ");
    warmup.volume = 0;
    window.speechSynthesis.speak(warmup);
  } catch (e) {
    console.warn("[speech] prime failed", e);
  }
}

if (supported && typeof document !== "undefined") {
  const onGesture = () => prime();
  document.addEventListener("pointerdown", onGesture, true);
  document.addEventListener("keydown", onGesture, true);
  document.addEventListener("click", onGesture, true);
}

export async function speak(text, { rate = 0.95, pitch = 1.15, volume = 1 } = {}) {
  if (!supported || !text) return;

  const voices = await loadVoices();

  const utterance = new SpeechSynthesisUtterance(String(text));
  const voice = pickVoice(voices);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  // Stop anything currently playing so utterances don't overlap.
  window.speechSynthesis.cancel();

  return new Promise((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    setTimeout(() => {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    }, 90);
  });
}

// Stop any speech immediately (e.g. when leaving the page).
export function stopSpeaking() {
  if (supported) window.speechSynthesis.cancel();
}
