// @ts-expect-error bun:test
import { test, expect } from "bun:test";
import {
  confirmSubscriberFields,
  shouldApplyConfirm,
  shouldApplyUnsubscribe,
  unsubscribeSubscriberFields,
} from "./mailing-list-token-actions";

test("pending subscriber should confirm", () => {
  expect(
    shouldApplyConfirm({ confirmed: false, unsubscribedAt: null }),
  ).toBe(true);
});

test("confirmed active subscriber is idempotent", () => {
  expect(
    shouldApplyConfirm({ confirmed: true, unsubscribedAt: null }),
  ).toBe(false);
});

test("unsubscribed subscriber can confirm again", () => {
  expect(
    shouldApplyConfirm({
      confirmed: true,
      unsubscribedAt: new Date("2026-01-01"),
    }),
  ).toBe(true);
});

test("active subscriber should not unsubscribe twice", () => {
  expect(
    shouldApplyUnsubscribe({ confirmed: true, unsubscribedAt: null }),
  ).toBe(true);
  expect(
    shouldApplyUnsubscribe({
      confirmed: true,
      unsubscribedAt: new Date("2026-01-01"),
    }),
  ).toBe(false);
});

test("confirm fields clear unsubscribe", () => {
  const now = new Date("2026-06-01T12:00:00Z");
  expect(confirmSubscriberFields(now)).toEqual({
    confirmed: true,
    confirmedAt: now,
    unsubscribedAt: null,
  });
});

test("unsubscribe fields set timestamp", () => {
  const now = new Date("2026-06-01T12:00:00Z");
  expect(unsubscribeSubscriberFields(now)).toEqual({ unsubscribedAt: now });
});
