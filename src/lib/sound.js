// Tiny sound-effect helper.
// Keeps one preloaded <audio> per source in a module-level cache so the
// element is never garbage-collected mid-playback (the reason a bare
// `new Audio(src).play()` can silently fail before it finishes loading).
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
    // ignore — currentTime can throw if the media isn't seekable yet
  }
  const played = audio.play();
  if (played && typeof played.catch === "function") played.catch(() => {});
  return audio;
}
