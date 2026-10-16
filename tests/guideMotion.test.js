import { test } from "node:test";
import assert from "node:assert/strict";
import { getGuideFrame } from "../src/landing/guideMotion.js";

const viewport = { width: 1440, height: 1000 };
const anchors = [
  { id: "hola", mood: "happy", x: 1060, y: 480, width: 440, height: 440 },
  {
    id: "como-funciona",
    mood: "curious",
    x: 240,
    y: 1450,
    width: 280,
    height: 300,
  },
  { id: "packs", mood: "delighted", x: 1120, y: 2580, width: 260, height: 280 },
  { id: "negocios", mood: "wink", x: 590, y: 4400, width: 245, height: 280 },
];
const center = (frame) => ({
  x: frame.x + 180 * frame.scale,
  y: frame.y + 180 * frame.scale,
});

test("guide remains mounted throughout long gaps between sections", () => {
  for (let scrollY = 0; scrollY <= 4600; scrollY += 10) {
    const frame = getGuideFrame(anchors, scrollY, viewport);
    assert.ok(frame, `guide disappeared at scroll ${scrollY}`);
    for (const name of ["x", "y", "scale", "rotate"])
      assert.ok(Number.isFinite(frame[name]));
    assert.ok(frame.scale > 0);
  }
});

test("guide reaches each reserved dock rather than covering nearby content", () => {
  for (const anchor of anchors) {
    const frame = getGuideFrame(
      anchors,
      anchor.y - viewport.height / 2,
      viewport,
    );
    assert.ok(frame);
    assert.deepEqual(center(frame), { x: anchor.x, y: viewport.height / 2 });
    assert.equal(frame.chapterId, anchor.id);
    assert.equal(frame.mood, anchor.mood);
    assert.ok(frame.scale * 360 <= Math.min(anchor.width, anchor.height));
  }
});

test("position and size stay continuous across scene and travel boundaries", () => {
  let previous = getGuideFrame(anchors, 0, viewport);
  for (let scrollY = 1; scrollY < 4400; scrollY++) {
    const next = getGuideFrame(anchors, scrollY, viewport);
    assert.ok(previous && next);
    assert.ok(
      Math.hypot(next.x - previous.x, next.y - previous.y) < 12,
      `jump at ${scrollY}`,
    );
    assert.ok(
      Math.abs(next.scale - previous.scale) < 0.015,
      `size jump at ${scrollY}`,
    );
    previous = next;
  }
});

test("between docks the guide reduces to a small companion near the edge", () => {
  const middle = (anchors[1].y + anchors[2].y) / 2 - viewport.height / 2;
  const frame = getGuideFrame(anchors, middle, viewport);
  assert.ok(frame);
  assert.ok(frame.scale * 360 <= 100);
  assert.ok(frame.x > viewport.width * 0.85);
  assert.ok(frame.x + frame.scale * 360 <= viewport.width);
  assert.ok(frame.y >= 0 && frame.y + frame.scale * 360 <= viewport.height);
});

test("scrolling backwards retraces the same route without accumulating state", () => {
  const forward = Array.from({ length: 25 }, (_, i) =>
    getGuideFrame(anchors, i * 170, viewport),
  );
  for (let i = 24; i >= 0; i--)
    assert.deepEqual(getGuideFrame(anchors, i * 170, viewport), forward[i]);
});

test("empty or single dock layouts do not create invalid frames", () => {
  assert.equal(getGuideFrame([], 0, viewport), null);
  const frame = getGuideFrame([anchors[0]], 200, viewport);
  assert.ok(frame);
  assert.deepEqual(center(frame), { x: anchors[0].x, y: anchors[0].y - 200 });
});

test("dialogue stays readable and full-sized around each section's focus", () => {
  for (const anchor of anchors) {
    const atDock = getGuideFrame(
      anchors,
      anchor.y - viewport.height / 2,
      viewport,
    );
    for (const offset of [-140, 0, 140]) {
      const frame = getGuideFrame(
        anchors,
        anchor.y - viewport.height / 2 + offset,
        viewport,
      );
      assert.equal(frame.chapterId, anchor.id);
      assert.equal(
        frame.speechOpacity,
        1,
        "dialogue should stay visible during reading",
      );
      assert.equal(
        frame.scale,
        atDock.scale,
        "face should not immediately shrink after arrival",
      );
    }
  }
});

test("hero face uses more of its reserved area", () => {
  const anchor = anchors[0];
  const frame = getGuideFrame(
    anchors,
    anchor.y - viewport.height / 2,
    viewport,
  );
  assert.ok(frame.scale * 360 >= 400);
});

test("dialogue changes while hidden in transit and returns with the next scene", () => {
  const from = anchors[1];
  const to = anchors[2];
  const mid = getGuideFrame(
    anchors,
    (from.y + to.y) / 2 - viewport.height / 2,
    viewport,
  );
  assert.equal(mid.speechOpacity, 0);
  assert.equal(
    mid.chapterId,
    from.id,
    "do not swap messages halfway across the page",
  );
  const arriving = getGuideFrame(
    anchors,
    to.y - viewport.height / 2 - 100,
    viewport,
  );
  assert.equal(arriving.chapterId, to.id);
  assert.equal(arriving.speechOpacity, 1);
});
