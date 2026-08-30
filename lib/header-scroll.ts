export const HEADER_SCROLL_DELTA_PX = 8;
export const HEADER_REVEAL_AT_TOP_PX = 16;

export type HeaderScrollState = {
  hidden: boolean;
  lastY: number;
};

export function nextHeaderScrollState(
  state: HeaderScrollState,
  scrollY: number,
  options: { menuOpen?: boolean } = {},
): HeaderScrollState {
  const y = Math.max(0, scrollY);
  const next: HeaderScrollState = { hidden: state.hidden, lastY: y };

  if (options.menuOpen || y <= HEADER_REVEAL_AT_TOP_PX) {
    next.hidden = false;
    return next;
  }

  const delta = y - state.lastY;
  if (delta > HEADER_SCROLL_DELTA_PX) {
    next.hidden = true;
  } else if (delta < -HEADER_SCROLL_DELTA_PX) {
    next.hidden = false;
  }

  return next;
}
