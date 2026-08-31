// @ts-expect-error bun:test
import { test, expect } from "bun:test";
import { planAcademyMailingListSync } from "./mailing-list-academy-sync";

test("no row -> insert_confirmed", () => {
  expect(planAcademyMailingListSync(null)).toBe("insert_confirmed");
});

test("pending -> promote_pending", () => {
  expect(
    planAcademyMailingListSync({ confirmed: false, unsubscribedAt: null }),
  ).toBe("promote_pending");
});

test("confirmed -> noop", () => {
  expect(
    planAcademyMailingListSync({ confirmed: true, unsubscribedAt: null }),
  ).toBe("noop");
});

test("unsubscribed -> skip_unsubscribed", () => {
  expect(
    planAcademyMailingListSync({
      confirmed: true,
      unsubscribedAt: new Date(),
    }),
  ).toBe("skip_unsubscribed");
});
