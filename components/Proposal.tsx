import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Teasing from "./Teasing";

interface Props {
  onAccept: () => void;
  onNoThirdClick?: () => void;
  realName: string;
  isMobile: boolean;
}

const allGifs = [
  "/gif/crying.gif",
  "/gif/cutting.gif",
  "/gif/empathy.gif",
  "/gif/escaping.gif",
  "/gif/funny.gif",
  "/gif/hugging.gif",
  "/gif/kissing.gif",
  "/gif/loving.gif",
  "/gif/no.gif",
  "/gif/riding.gif",
  "/gif/rose.gif",
  "/gif/rotating.gif",
  "/gif/upset.gif",
  "/gif/bathing.gif",
  "/gif/spank.gif",
  "/gif/kis2.gif",
  "/gif/cooking.gif",
  "/gif/holding.gif",
  "/gif/medicine.gif",
  "/gif/massage.gif",
  "/gif/pushing.gif",
];

const TRIGGER_RADIUS = 140; // px — how close cursor can get before button teleports

// Generate 10 pre-defined escape spots spread across the viewport.
// Each spot is a fraction (0-1) of viewport width/height so they adapt to screen size.
// They are spread out across corners, edges, and mid-areas — never near center where Yes button lives.
const ESCAPE_SPOTS: Array<{ xFrac: number; yFrac: number }> = [
  { xFrac: 0.05, yFrac: 0.05 }, // top-left corner
  { xFrac: 0.9, yFrac: 0.05 }, // top-right corner
  { xFrac: 0.05, yFrac: 0.9 }, // bottom-left corner
  { xFrac: 0.9, yFrac: 0.9 }, // bottom-right corner
  { xFrac: 0.05, yFrac: 0.45 }, // mid-left
  { xFrac: 0.9, yFrac: 0.45 }, // mid-right
  { xFrac: 0.45, yFrac: 0.05 }, // top-center
  { xFrac: 0.45, yFrac: 0.9 }, // bottom-center
  { xFrac: 0.2, yFrac: 0.25 }, // upper-left area
  { xFrac: 0.78, yFrac: 0.72 }, // lower-right area
];

const Proposal: React.FC<Props> = ({
  onAccept,
  onNoThirdClick,
  realName,
  isMobile,
}) => {
  const [noCount, setNoCount] = useState(0);
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);
  const noCountRef = useRef(0);
  const currentSpotRef = useRef(-1); // -1 = home position, 0-9 = escape spot index
  const [isTeasingHidden, setIsTeasingHidden] = useState(true);

  // Motion values for No button position
  const noX = useMotionValue(0);
  const noY = useMotionValue(0);

  // Fast spring for first 3 clicks, original slower spring for escape dodges
  const fastSpring = {
    type: "spring" as const,
    stiffness: 600,
    damping: 18,
    mass: 0.4,
  };
  const normalSpring = {
    type: "spring" as const,
    stiffness: 250,
    damping: 35,
    mass: 1.3,
  };

  // Rotate GIFs every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGifIndex((prev) => (prev + 1) % allGifs.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const noPhrases = ["No 😢", "Are you sure? 🤨", "Really sure? 🥺", "No"];

  // Convert a fractional spot to actual pixel offset from button's home position
  const spotToOffset = useCallback(
    (spotIndex: number) => {
      const btn = noBtnRef.current;
      if (!btn) return { x: 0, y: 0 };
      const rect = btn.getBoundingClientRect();
      const homeX = rect.left + rect.width / 2 - noX.get();
      const homeY = rect.top + rect.height / 2 - noY.get();

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pad = 30;
      const spot = ESCAPE_SPOTS[spotIndex];

      // Target center position on screen
      const targetX = pad + spot.xFrac * (vw - rect.width - pad * 2);
      const targetY = pad + spot.yFrac * (vh - rect.height - pad * 2);

      // Convert to offset from home
      return {
        x: targetX - homeX + rect.width / 2,
        y: targetY - homeY + rect.height / 2,
      };
    },
    [noX, noY],
  );

  // Find the farthest non-overlapping spot from the cursor
  const pickBestSpot = useCallback(
    (cursorX: number, cursorY: number, excludeSpot: number) => {
      const btn = noBtnRef.current;
      const yesBtn = yesBtnRef.current;
      if (!btn) return 0;

      const rect = btn.getBoundingClientRect();
      const homeX = rect.left + rect.width / 2 - noX.get();
      const homeY = rect.top + rect.height / 2 - noY.get();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pad = 30;

      let bestIndex = 0;
      let bestDist = -1;

      for (let i = 0; i < ESCAPE_SPOTS.length; i++) {
        if (i === excludeSpot) continue; // don't pick the spot we're already at

        const spot = ESCAPE_SPOTS[i];
        const sx =
          pad + spot.xFrac * (vw - rect.width - pad * 2) + rect.width / 2;
        const sy =
          pad + spot.yFrac * (vh - rect.height - pad * 2) + rect.height / 2;

        // Check overlap with Yes button - use larger margin on mobile
        if (yesBtn) {
          const yesRect = yesBtn.getBoundingClientRect();
          const margin = isMobile ? 100 : 40;
          const overlaps =
            sx - rect.width / 2 - margin < yesRect.right &&
            sx + rect.width / 2 + margin > yesRect.left &&
            sy - rect.height / 2 - margin < yesRect.bottom &&
            sy + rect.height / 2 + margin > yesRect.top;
          if (overlaps) continue;
        }

        // Distance from cursor — we want the farthest spot
        const dx = sx - cursorX;
        const dy = sy - cursorY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      }

      return bestIndex;
    },
    [noX, noY, isMobile],
  );

  const handleCursorMove = useCallback(
    (cursorX: number, cursorY: number) => {
      // Only activate escape after 3 clicks
      if (noCountRef.current < 3) return;

      const btn = noBtnRef.current;
      if (!btn) return;

      // Get current button center (visual position)
      const rect = btn.getBoundingClientRect();
      const btnCX = rect.left + rect.width / 2;
      const btnCY = rect.top + rect.height / 2;

      const dx = btnCX - cursorX;
      const dy = btnCY - cursorY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < TRIGGER_RADIUS) {
        // Cursor is close to wherever the button currently is → jump to a new spot
        const newSpot = pickBestSpot(cursorX, cursorY, currentSpotRef.current);
        currentSpotRef.current = newSpot;
        const offset = spotToOffset(newSpot);
        animate(noX, offset.x, normalSpring);
        animate(noY, offset.y, normalSpring);
      }
    },
    [noX, noY, pickBestSpot, spotToOffset, normalSpring],
  );

  // Track mouse movement globally
  useEffect(() => {
    const onMove = (e: MouseEvent) => handleCursorMove(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [handleCursorMove]);

  // Touch support for mobile
  useEffect(() => {
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0)
        handleCursorMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    return () => {
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
    };
  }, [handleCursorMove]);

  const handleNoClick = () => {
    // Only allow clicks for the first 3 attempts
    if (noCountRef.current >= 3) return;
    const next = noCountRef.current + 1;
    noCountRef.current = next;
    setNoCount(next);

    // Hide teasing component on the 3rd click
    if (next === 3) {
      setIsTeasingHidden(false);
      onNoThirdClick?.();
    }

    // Animate to a random spot — fast spring for first 3 clicks
    const randomSpot = pickBestSpot(0, 0, currentSpotRef.current);
    currentSpotRef.current = randomSpot;
    const offset = spotToOffset(randomSpot);
    animate(noX, offset.x, fastSpring);
    animate(noY, offset.y, fastSpring);
  };

  return (
    <div
      className="flex flex-col items-center text-center mt-4 mb-4 animate-in fade-in slide-in-from-top-4 duration-700"
      style={{ maxHeight: "100vh" }}
    >
      {/* Illustration Area + Teasing */}
      <div className="flex flex-row items-center gap-6 mb-4">
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-white p-3 rounded-[2rem] border-4 border-dashed border-primary/20 shadow-inner">
            <img
              alt="Cute Character"
              className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-2xl hover:scale-105 transition-transform duration-500"
              src={allGifs[currentGifIndex]}
            />
          </div>
        </div>
        <Teasing isTeasingHidden={isTeasingHidden} />
      </div>

      {/* Question Card */}
      <div className="bg-white/90 backdrop-blur-md px-8 py-6 md:px-16 md:py-8 rounded-[2rem] shadow-2xl shadow-primary/5 border border-primary/5 mb-6 max-w-2xl relative">
        <h1 className="text-primary text-3xl md:text-5xl font-black leading-tight tracking-tight mb-2">
          {realName} will you be my Valentine?
        </h1>
        <p className="text-[#8a606b] text-sm md:text-lg font-medium max-w-sm mx-auto">
          I promise it'll be fun and full of treats! Think carefully... 😉
        </p>
      </div>

      {/* Buttons Container */}
      <div className="flex flex-col sm:flex-row gap-6 items-center min-h-[100px]">
        <motion.button
          ref={yesBtnRef}
          onClick={onAccept}
          animate={{ scale: 1 + noCount * 0.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="group relative flex flex-col min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl py-4 px-10 bg-primary text-white shadow-2xl shadow-primary/40 active:scale-95 transition-all duration-300 z-20 hover:bg-primary/80 hover:shadow-primary/60"
        >
          <img
            src="/gif/loving.gif"
            alt="Yes"
            className="w-16 h-16 object-contain mb-1 relative z-10"
          />
          <span className="flex items-center gap-2 text-xl font-black relative z-10">
            Yes 💖
          </span>
        </motion.button>

        <motion.button
          ref={noBtnRef}
          onClick={handleNoClick}
          style={{
            x: noX,
            y: noY,
          }}
          className={
            "group relative inline-flex flex-col items-center justify-center rounded-2xl px-6 py-3 bg-primary text-white font-bold hover:bg-primary/90 border border-primary/10" +
            (noCount === 3 && isMobile && " hidden")
          }
        >
          <img
            // src="./gif/crying.gif"
            src={
              noCount === 0
                ? "/gif/crying.gif"
                : noCount === 1
                  ? "/gif/angry3.gif"
                  : noCount === 2
                    ? "/gif/gun.jpg"
                    : "/gif/angry2.gif"
            }
            alt="No"
            className={
              "w-16 h-16 object-contain mb-1 " +
              (noCount === 2 ? " w-48 h-64 rounded-2xl relative z-10" : "")
            }
          />
          <span className="flex items-center gap-2 text-xl font-black">
            {noPhrases[Math.min(noCount, noPhrases.length - 1)]}
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default Proposal;
