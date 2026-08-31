// @ts-expect-error bun:test
import { test, expect } from "bun:test";
import { planSubscribeAction } from "./mailing-list-state";

test("new email -> create_pending", () => {
  expect(planSubscribeAction(null).action).toBe("create_pending");
});

test("pending -> resend_confirm", () => {
  expect(
    planSubscribeAction({
      confirmed: false,
      unsubscribedAt: null,
    }).action,
  ).toBe("resend_confirm");
});

test("confirmed active -> already_subscribed", () => {
  expect(
    planSubscribeAction({
      confirmed: true,
      unsubscribedAt: null,
    }).action,
  ).toBe("already_subscribed");
});

test("unsubscribed -> reactivate_pending", () => {
  expect(
    planSubscribeAction({
      confirmed: true,
      unsubscribedAt: new Date(),
    }).action,
  ).toBe("reactivate_pending");
});
