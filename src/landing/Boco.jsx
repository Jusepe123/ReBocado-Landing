import { useEffect, useId, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { getGuideFrame } from "./guideMotion.js";
import "./Boco.css";

// Matching path commands let each expression change as one unbroken gesture.
const expressions = {
  happy: {
    tilt: -2,
    leftEye: 1,
    rightEye: 1,
    leftBrow: "M135 186 Q150 177 165 183",
    rightBrow: "M235 183 Q250 177 265 186",
    mouth: "M168 270 C186 280 214 280 232 270 C229 299 173 299 168 270Z",
    teeth: "M175 274 Q200 284 225 274 L222 282 Q200 290 178 282Z",
  },
  curious: {
    tilt: -6,
    leftEye: 1.1,
    rightEye: 0.92,
    leftBrow: "M135 177 Q150 167 165 175",
    rightBrow: "M235 187 Q250 182 265 188",
    mouth: "M177 273 C193 280 211 278 224 270 C219 284 191 288 177 273Z",
    teeth: "M182 275 Q202 282 219 274 L217 277 Q201 283 184 278Z",
  },
  delighted: {
    tilt: 3,
    leftEye: 0.62,
    rightEye: 0.62,
    leftBrow: "M135 180 Q150 168 165 177",
    rightBrow: "M235 177 Q250 168 265 180",
    mouth: "M164 265 C185 277 215 277 236 265 C230 310 170 310 164 265Z",
    teeth: "M171 270 Q200 284 229 270 L225 281 Q200 293 175 281Z",
  },
  wink: {
    tilt: 5,
    leftEye: 1,
    rightEye: 0.09,
    leftBrow: "M135 181 Q150 173 165 180",
    rightBrow: "M235 189 Q250 177 265 185",
    mouth: "M168 272 C187 280 215 278 232 267 C229 297 175 301 168 272Z",
    teeth: "M175 276 Q201 283 225 272 L222 281 Q200 291 178 283Z",
  },
};

/** Original face-only character, with a plain cap and quiet expressions. */
export default function Boco({
  mood = "happy",
  paused = false,
  className = "",
}) {
  const titleId = useId();
  const reducedMotion = useReducedMotion();
  const still = paused || reducedMotion;
  const expression = expressions[mood] || expressions.happy;
  const leftBlink = useMotionValue(1);
  const rightBlink = useMotionValue(1);
  const pupilX = mood === "curious" ? 3 : mood === "wink" ? -2 : 0;

  useEffect(() => {
    let timer;
    let controls = [];
    let count = 0;
    leftBlink.jump(1);
    rightBlink.jump(1);
    if (still) return;
    const blink = () => {
      const wink = ++count % 3 === 0 && mood !== "wink";
      controls = [
        animate(rightBlink, [1, 0.06, 1], { duration: wink ? 0.48 : 0.24 }),
      ];
      if (!wink)
        controls.push(animate(leftBlink, [1, 0.06, 1], { duration: 0.24 }));
      timer = window.setTimeout(blink, wink ? 5800 : 4300);
    };
    timer = window.setTimeout(blink, 3100);
    return () => {
      window.clearTimeout(timer);
      controls.forEach((control) => control.stop());
    };
  }, [leftBlink, rightBlink, mood, still]);

  const transition = { duration: still ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] };
  return (
    <svg
      className={`boco-character boco-character--${mood} ${className}`}
      viewBox="45 15 310 350"
      fill="none"
      role="img"
      aria-labelledby={titleId}
    >
      <title id={titleId}>
        Boco, un niño con gorra blanca y contornos verdes
      </title>
      <motion.g
        className="boco-head"
        initial={false}
        animate={{ rotate: expression.tilt }}
        transition={transition}
      >
        <path
          d="M109 205c-30-13-43 8-35 36 5 18 18 28 39 22m180-59c31-13 45 8 36 35-5 18-18 29-39 22"
          fill="white"
          stroke="currentColor"
          strokeWidth="7"
        />
        <path
          d="M91 226c9-3 14 2 16 12m204-12c-9-3-14 2-16 12"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M105 175c1-59 44-93 100-93 57 0 95 36 96 97l-5 68c-3 57-41 98-91 98-52 0-90-43-94-94l-6-76Z"
          fill="white"
          stroke="currentColor"
          strokeWidth="7"
        />
        <path
          d="M109 214c-19-26-18-57-4-76 8 6 15 16 20 31l-8 43-8 2Zm183-2c20-22 20-50 9-72-13 7-18 18-22 31l7 41h6Z"
          fill="currentColor"
        />
        <path
          d="M118 166c13-4 26-13 34-27-1 13 6 23 14 26 7-12 14-20 24-27-1 16 5 25 13 30 8-10 17-19 29-24 3 13 10 20 18 25 7-4 14-13 19-21l15 23 12-35-172-23-6 53Z"
          fill="currentColor"
        />
        <g
          className="boco-cap"
          fill="white"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinejoin="round"
        >
          <path d="M93 148c1-58 37-106 102-110 59-4 105 31 117 86l-25 29-194-5Z" />
          <path d="M85 143c42-28 142-37 211-18 18 5 31 11 36 19 5 9-4 17-18 17-24 0-40-10-69-12-57-4-87 15-130 17-19 1-36-11-30-23Z" />
        </g>
        <g stroke="currentColor" strokeWidth="6" strokeLinecap="round">
          <motion.path
            initial={false}
            animate={{ d: expression.leftBrow }}
            transition={transition}
          />
          <motion.path
            initial={false}
            animate={{ d: expression.rightBrow }}
            transition={transition}
          />
        </g>
        <motion.g
          className="boco-eye boco-eye--left"
          initial={false}
          animate={{ scaleY: expression.leftEye }}
          transition={transition}
        >
          <motion.g className="boco-eye__blink" style={{ scaleY: leftBlink }}>
            <motion.g
              initial={false}
              animate={{ x: pupilX }}
              transition={transition}
            >
              <ellipse cx="153" cy="219" rx="11" ry="17" fill="currentColor" />
              <ellipse cx="157" cy="213" rx="3" ry="4" fill="white" />
            </motion.g>
          </motion.g>
        </motion.g>
        <motion.g
          className="boco-eye boco-eye--right"
          initial={false}
          animate={{ scaleY: expression.rightEye }}
          transition={transition}
        >
          <motion.g className="boco-eye__blink" style={{ scaleY: rightBlink }}>
            <motion.g
              initial={false}
              animate={{ x: pupilX }}
              transition={transition}
            >
              <ellipse cx="247" cy="219" rx="11" ry="17" fill="currentColor" />
              <ellipse cx="251" cy="213" rx="3" ry="4" fill="white" />
            </motion.g>
          </motion.g>
        </motion.g>
        <path
          d="m199 224-7 20c-1 4 6 7 14 4"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity=".45"
        >
          <path d="m130 251-3 6m13-4-2 6m124-10 2 6m8-10 3 6" />
        </g>
        <motion.path
          initial={false}
          animate={{ d: expression.mouth }}
          transition={transition}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <motion.path
          initial={false}
          animate={{ d: expression.teeth }}
          transition={transition}
          fill="white"
        />
      </motion.g>
    </svg>
  );
}

/** Shared composition keeps the face mounted when its message changes. */
export function BocoScene({
  mood = "happy",
  text,
  paused = false,
  className = "",
  speechOpacity = 1,
}) {
  const reducedMotion = useReducedMotion();
  return (
    <div className={`boco-scene ${className}`}>
      <motion.div
        className="boco-scene__speech"
        style={{ opacity: speechOpacity }}
      >
        {text && (
          <div className="boco-scene__bubble">
            <motion.p
              key={text}
              initial={{ opacity: paused || reducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              {text}
            </motion.p>
          </div>
        )}
      </motion.div>
      <div className="boco-scene__portrait">
        <Boco mood={mood} paused={paused} />
      </div>
    </div>
  );
}

/** One persistent guide. Layout is measured separately from scroll rendering. */
export function ScrollGuide({ sections, paused = false }) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState({ mood: "happy", id: "", text: "" });
  const currentChapter = useRef(chapter);
  const x = useSpring(0, { stiffness: 190, damping: 33, mass: 0.65 });
  const y = useSpring(0, { stiffness: 190, damping: 33, mass: 0.65 });
  const scale = useSpring(1, { stiffness: 160, damping: 29, mass: 0.65 });
  const rotate = useSpring(0, { stiffness: 135, damping: 26, mass: 0.65 });
  const speechOpacity = useSpring(1, { stiffness: 110, damping: 24, mass: 0.65 });

  useEffect(() => {
    let frame = 0;
    let anchors = [];
    let initialized = false;
    let layoutDirty = true;
    const update = () => {
      frame = 0;
      if (layoutDirty) {
        anchors = sections.flatMap((section) => {
          const element = document.querySelector(
            `[data-guide-anchor="${CSS.escape(section.id)}"]`,
          );
          if (!element) return [];
          const rect = element.getBoundingClientRect();
          if (!rect.width || !rect.height) return [];
          return [
            {
              id: section.id,
              mood: section.mood,
              x: rect.left + window.scrollX + rect.width / 2,
              y: rect.top + window.scrollY + rect.height / 2,
              width: rect.width,
              height: rect.height,
            },
          ];
        });
        layoutDirty = false;
      }
      const next = getGuideFrame(anchors, window.scrollY, {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      if (!next) return;
      for (const [value, target] of [
        [x, next.x],
        [y, next.y],
        [scale, next.scale],
        [rotate, next.rotate],
        [speechOpacity, next.speechOpacity ?? 1],
      ]) {
        if (initialized) value.set(target);
        else value.jump(target);
      }
      if (!initialized) {
        initialized = true;
        setReady(true);
      }
      if (
        currentChapter.current.id !== next.chapterId ||
        currentChapter.current.mood !== next.mood
      ) {
        currentChapter.current = {
          id: next.chapterId,
          mood: next.mood,
          text: sections.find((section) => section.id === next.chapterId)?.text || "",
        };
        setChapter(currentChapter.current);
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const measure = () => {
      layoutDirty = true;
      schedule();
    };
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.documentElement);
    for (const section of sections) {
      const element = document.querySelector(
        `[data-guide-anchor="${CSS.escape(section.id)}"]`,
      );
      if (element) resizeObserver.observe(element);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure, true);
    let disposed = false;
    document.fonts?.ready.then(() => {
      if (!disposed) measure();
    });
    update();
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure, true);
      resizeObserver.disconnect();
    };
  }, [sections, x, y, scale, rotate, speechOpacity]);

  return (
    <motion.aside
      className={`boco-guide${paused || reducedMotion ? " boco-guide--still" : ""}`}
      data-chapter={chapter.id}
      aria-hidden="true"
      style={{ x, y, scale, visibility: ready ? "visible" : "hidden" }}
    >
      <motion.div className="boco-guide__face" style={{ rotate }}>
        <BocoScene
          mood={chapter.mood}
          text={chapter.text}
          paused={paused}
          speechOpacity={speechOpacity}
          className="boco-guide__character"
        />
      </motion.div>
    </motion.aside>
  );
}
