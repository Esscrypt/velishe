export const SPOTLIGHT_CARDS_PER_SET = 3;

export const GRID_IMAGE_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw";

export const PROFILE_IMAGE_SIZES = "(max-width: 1024px) 100vw, 50vw";

export function isLcpImageIndex(index: number): boolean {
  return index === 0;
}

export function shuffleModels<T>(models: readonly T[], seed: number): T[] {
  const shuffled = [...models];
  let state = seed >>> 0;
  const seededRandom = () => {
    state += 0x6d2b79f5;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function getSpotlightSet<T>(models: readonly T[], seed?: number): T[] {
  if (models.length === 0) {
    return [];
  }

  const source = seed === undefined ? [...models] : shuffleModels(models, seed);
  const set = source.slice(0, SPOTLIGHT_CARDS_PER_SET);

  while (set.length < SPOTLIGHT_CARDS_PER_SET) {
    set.push(source[set.length % source.length]);
  }

  return set;
}

export function getInitialSpotlightModels<T>(models: readonly T[]): T[] {
  return models.slice(0, SPOTLIGHT_CARDS_PER_SET);
}
