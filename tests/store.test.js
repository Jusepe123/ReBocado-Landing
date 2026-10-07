import { test } from "node:test";
import assert from "node:assert/strict";
import {
  merchants,
  nextDay,
  remainingStock,
  todayInBolivia,
} from "../src/app/catalog.js";
import {
  changeOrder,
  createReservation,
  emptyState,
  loadState,
  sanitizeState,
} from "../src/app/store.js";

const now = new Date("2026-10-08T01:00:00Z");
const date = todayInBolivia(now);
const input = (overrides = {}) => ({
  merchantId: merchants[0].id,
  quantity: 1,
  date,
  method: "cash",
  accepted: true,
  ...overrides,
});

test("dates use Bolivia, including UTC midnight crossing", () => {
  assert.equal(date, "2026-10-07");
  assert.equal(nextDay("2026-12-31"), "2027-01-01");
  assert.equal(nextDay("2028-02-28"), "2028-02-29");
});

test("reservation creates unique codes and consumes only the selected day", () => {
  const first = createReservation(emptyState(), input({ quantity: 2 }), now);
  const second = createReservation(first, input(), now);
  assert.notEqual(first.orders[0].id, second.orders[0].id);
  assert.match(second.orders[0].code, /^RB-[A-F0-9]{6}$/);
  assert.equal(remainingStock(merchants[0], second.orders, date), 2);
  assert.equal(remainingStock(merchants[0], second.orders, nextDay(date)), 5);
  assert.equal(second.orders[0].payment, "pending");
});

test("invalid quantities, dates, methods, merchants and missing consent are rejected", () => {
  for (const override of [
    { quantity: 0 },
    { quantity: -1 },
    { quantity: 1.5 },
    { quantity: 6 },
    { date: "2020-01-01" },
    { merchantId: "missing" },
    { method: "bank" },
    { accepted: false },
  ]) {
    assert.throws(() => createReservation(emptyState(), input(override), now));
  }
});

test("cancelling restores stock; repeated cancellation does not add stock", () => {
  const full = createReservation(emptyState(), input({ quantity: 5 }), now);
  assert.equal(remainingStock(merchants[0], full.orders, date), 0);
  assert.throws(() => createReservation(full, input(), now));
  const cancelled = changeOrder(full, full.orders[0].id, "cancel");
  assert.equal(remainingStock(merchants[0], cancelled.orders, date), 5);
  assert.deepEqual(
    changeOrder(cancelled, full.orders[0].id, "cancel"),
    cancelled,
  );
});

test("pickup cannot precede simulated payment and finalized orders cannot change", () => {
  const state = createReservation(emptyState(), input(), now);
  const id = state.orders[0].id;
  assert.equal(changeOrder(state, id, "collect").orders[0].status, "reserved");
  const paid = changeOrder(state, id, "pay");
  assert.equal(paid.orders[0].payment, "simulated");
  const collected = changeOrder(paid, id, "collect");
  assert.equal(collected.orders[0].status, "collected");
  assert.equal(remainingStock(merchants[0], collected.orders, date), 4);
  assert.deepEqual(changeOrder(collected, id, "cancel"), collected);
  const digital = createReservation(
    emptyState(),
    input({ method: "qr-demo" }),
    now,
  );
  assert.equal(digital.orders[0].payment, "simulated");
});

test("corrupt local storage recovers and unrecognized data is removed", () => {
  assert.deepEqual(loadState({ getItem: () => "{corrupt" }), emptyState());
  assert.deepEqual(
    loadState({
      getItem: () => {
        throw new Error("blocked");
      },
    }),
    emptyState(),
  );
  const valid = createReservation(emptyState(), input(), now);
  const sanitized = sanitizeState({
    name: "x".repeat(60),
    favorites: ["mesa-verde", "missing", "mesa-verde"],
    orders: [null, {}, ...valid.orders],
  });
  assert.equal(sanitized.name.length, 40);
  assert.deepEqual(sanitized.favorites, ["mesa-verde"]);
  assert.equal(sanitized.orders.length, 1);
});
