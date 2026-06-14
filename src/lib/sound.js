// Sound effect helpers
const cache = {};

export function playSound(src, volume = 1) {
  let audio = cache[src];
  if (!audio) {
    audio = new Audio(src);
    audio.preload = "auto";
    cache[src] = audio;
  }
  audio.volume = volume;
  try {
    audio.currentTime = 0;
  } catch {
  }
  const played = audio.play();
  if (played && typeof played.catch === "function") played.catch(() => {});
  return audio;
}

let hoverAudio = null;

export function startHoverSound(src, volume = 0.35) {
  stopHoverSound();
  hoverAudio = new Audio(src);
  hoverAudio.loop = true;
  hoverAudio.volume = volume;
  const played = hoverAudio.play();
  if (played && typeof played.catch === "function") played.catch(() => {});
  return hoverAudio;
}

export function stopHoverSound() {
  if (hoverAudio) {
    hoverAudio.pause();
    hoverAudio.src = "";
    hoverAudio = null;
  }
}
