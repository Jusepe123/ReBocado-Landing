const BASE_SIZE = 360;
const lerp = (from, to, amount) => from + (to - from) * amount;
const ease = (value) => value * value * (3 - 2 * value);
const tilts = { happy: -3, curious: 5, delighted: -5, wink: 4 };

function dockPose(anchor, scrollY) {
  return {
    x: anchor.x,
    y: anchor.y - scrollY,
    size: Math.min(440, anchor.width * 0.96, anchor.height * 0.96),
    rotate: tilts[anchor.mood] ?? 0,
  };
}

function blend(from, to, progress) {
  const amount = ease(progress);
  return {
    x: lerp(from.x, to.x, amount),
    y: lerp(from.y, to.y, amount),
    size: lerp(from.size, to.size, amount),
    rotate: lerp(from.rotate, to.rotate, amount),
  };
}

function frame(pose, anchor, mood = anchor.mood, speechOpacity = 1) {
  return {
    x: pose.x - pose.size / 2,
    y: pose.y - pose.size / 2,
    scale: pose.size / BASE_SIZE,
    rotate: pose.rotate,
    mood,
    chapterId: anchor.id,
    speechOpacity,
  };
}

/**
 * Document-space dock centers, ordered top to bottom, become a continuous route.
 * One persistent character visits each dock, then becomes a small companion by
 * the edge while the reader crosses the gap. Never select only visible docks:
 * that caused the former unmounts and jumps between sections.
 */
export function getGuideFrame(anchors, scrollY, viewport) {
  if (!anchors.length) return null;
  const focusLine = viewport.height / 2;
  const focusY = scrollY + focusLine;
  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  if (focusY <= first.y) return frame(dockPose(first, scrollY), first);
  if (focusY >= last.y) return frame(dockPose(last, scrollY), last);

  const index = anchors.findIndex((anchor) => anchor.y > focusY);
  const from = anchors[index - 1];
  const to = anchors[index];
  const distance = to.y - from.y;
  // Keep the face and its message at full size while the section is being read.
  // Cap the hold for closely spaced docks, so their reading zones never overlap.
  const readingHold = Math.min(viewport.height * 0.22, distance * 0.24);
  if (focusY <= from.y + readingHold)
    return frame(dockPose(from, scrollY), from);
  if (focusY >= to.y - readingHold) return frame(dockPose(to, scrollY), to);
  const progress =
    (focusY - from.y - readingHold) / (distance - 2 * readingHold);
  const companion = {
    x: viewport.width - 58,
    y: viewport.height - 76,
    size: 88,
    rotate: -8,
  };
  // Swap dialogue while the bubble is hidden, just before arriving at a dock.
  const chapter = progress <= 0.6 ? from : to;
  let pose;
  let speechOpacity = 0;
  if (progress < 0.4) {
    pose = blend(dockPose(from, scrollY), companion, progress / 0.4);
    speechOpacity = 1 - ease(progress / 0.4);
  } else if (progress > 0.6) {
    pose = blend(companion, dockPose(to, scrollY), (progress - 0.6) / 0.4);
    speechOpacity = ease((progress - 0.6) / 0.4);
  } else pose = companion;
  const mood =
    progress < 0.12 ? from.mood : progress > 0.88 ? to.mood : "curious";
  return frame(pose, chapter, mood, speechOpacity);
}
