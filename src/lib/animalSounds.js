import { animalKey } from "./animalArt";
import { playSound } from "./sound";
import lionSound from "../assets/sounds/lion.mp3";
import elephantSound from "../assets/sounds/elephant.mp3";
import bearSound from "../assets/sounds/bears.mp3";
import deerSound from "../assets/sounds/dear.mp3";
import penguinSound from "../assets/sounds/penguin.mp3";

// Animals that have their own call sound effect. Keyed by animals.json key, so a
// species name ("Lion"), a key ("lion"), or a given name all resolve correctly.
// Bear and polar bear share the same bear call.
const ANIMAL_SOUNDS = {
  lion: lionSound,
  elephant: elephantSound,
  bear: bearSound,
  polar_bear: bearSound,
  deer: deerSound,
  penguin: penguinSound,
};

// The call sound for an animal, or null if it doesn't have one.
export function animalSoundSrc(animal) {
  const key = animalKey(animal);
  return key ? (ANIMAL_SOUNDS[key] ?? null) : null;
}

// Play an animal's call if it has one. No-op for animals without a sound.
export function playAnimalSound(animal, volume = 0.6) {
  const src = animalSoundSrc(animal);
  if (src) playSound(src, volume);
}
