// Text-to-speech via our backend's /api/speak endpoint, which proxies Deepgram
// so the API key stays server-side (never shipped in the client bundle).
const TTS_ENDPOINT = "https://mh-backend-eight.vercel.app/api/speech";

const supported = typeof window !== "undefined" && typeof Audio !== "undefined";

let currentAudio = null;
let playToken = 0;

const urlCache = new Map();

export function isSpeechSupported() {
  return supported;
}

async function fetchAudioUrl(text) {
  if (urlCache.has(text)) return urlCache.get(text);

  const res = await fetch(TTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: String(text) }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`TTS ${res.status}: ${detail}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  urlCache.set(text, url);
  return url;
}

export async function prefetchSpeech(text) {
  if (!supported || !text) return;
  try {
    await fetchAudioUrl(text);
  } catch (e) {
    console.warn("[speech] TTS prefetch failed:", e);
  }
}

  // Speak the given text aloud. Cancels anything currently playing so successive calls don't overlap.
export async function speak(text) {
  if (!supported || !text) return;

  const token = ++playToken;
  stopCurrent();

  let url;
  try {
    url = await fetchAudioUrl(text);
  } catch (e) {
    console.warn("[speech] TTS request failed:", e);
    return;
  }

  if (token !== playToken) return;

  const audio = new Audio(url);
  currentAudio = audio;

  return new Promise((resolve) => {
    const done = () => {
      if (currentAudio === audio) currentAudio = null;
      resolve();
    };
    audio.onended = done;
    audio.onerror = done;
    const played = audio.play();
    if (played && typeof played.catch === "function") {
      played.catch((err) => {
        console.warn("[speech] playback blocked:", err);
        done();
      });
    }
  });
}

function stopCurrent() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
  }
}

// Stop any speech immediately 
export function stopSpeaking() {
  playToken++;
  stopCurrent();
}
