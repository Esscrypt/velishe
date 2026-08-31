import { describe, expect, test } from "bun:test";
import {
  HEADER_REVEAL_AT_TOP_PX,
  HEADER_SCROLL_DELTA_PX,
  nextHeaderScrollState,
} from "./header-scroll";

const visible = { hidden: false, lastY: 0 };

describe("nextHeaderScrollState", () => {
  test("stays visible at the top of the page", () => {
    expect(nextHeaderScrollState(visible, 0)).toEqual({
      hidden: false,
      lastY: 0,
    });
  });

  test("ignores downward jitter smaller than the delta", () => {
    const next = nextHeaderScrollState(
      { hidden: false, lastY: 80 },
      80 + HEADER_SCROLL_DELTA_PX - 1,
    );
    expect(next.hidden).toBe(false);
  });

  test("hides after scrolling down past the delta", () => {
    const next = nextHeaderScrollState(
      { hidden: false, lastY: 80 },
      80 + HEADER_SCROLL_DELTA_PX + 1,
    );
    expect(next.hidden).toBe(true);
    expect(next.lastY).toBe(80 + HEADER_SCROLL_DELTA_PX + 1);
  });

  test("shows after scrolling up past the delta", () => {
    const next = nextHeaderScrollState(
      { hidden: true, lastY: 400 },
      400 - HEADER_SCROLL_DELTA_PX - 1,
    );
    expect(next.hidden).toBe(false);
  });

  test("always shows near the top even if the last move was down", () => {
    const next = nextHeaderScrollState(
      { hidden: true, lastY: HEADER_REVEAL_AT_TOP_PX + 40 },
      HEADER_REVEAL_AT_TOP_PX,
    );
    expect(next.hidden).toBe(false);
  });

  test("always shows while the mobile menu is open", () => {
    const next = nextHeaderScrollState(
      { hidden: true, lastY: 200 },
      280,
      { menuOpen: true },
    );
    expect(next.hidden).toBe(false);
  });

  test("treats iOS overscroll as the top of the page", () => {
    const next = nextHeaderScrollState({ hidden: true, lastY: 12 }, -40);
    expect(next.hidden).toBe(false);
    expect(next.lastY).toBe(0);
  });

  test("stays hidden through tiny movement while already hidden", () => {
    const next = nextHeaderScrollState(
      { hidden: true, lastY: 300 },
      300 + HEADER_SCROLL_DELTA_PX - 1,
    );
    expect(next.hidden).toBe(true);
  });
});
