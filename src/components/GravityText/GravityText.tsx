import { ElementType, useEffect, useMemo, useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import "@/components/GravityText/GravityText.scss";

type GravityTextProps<T extends ElementType = "p"> = {
  text: string;
  as?: T;
  className?: string;
  maxWords?: number;
  threshold?: number;
  once?: boolean;
  onComplete?: () => void;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children">;

type Piece = { text: string };
type Range = readonly [number, number];

const EASES: [number, number, number, number][] = [
  [0.2, 0.8, 0.2, 1],
  [0.22, 1, 0.36, 1],
  [0.16, 1, 0.3, 1],
];

function seededRandom(seedBase: number) {
  let seed = (seedBase * 9301 + 49297) % 233280;
  return (min = 0, max = 1) => {
    seed = (seed * 9301 + 49297) % 233280;
    const r = seed / 233280;
    return min + r * (max - min);
  };
}

const HOLD_BEFORE_DROP = 0.42;                 
const GLOBAL_DELAY_JITTER: Range = [0, 0.03];  
const PRE_DUR: Range = [0.5, 0.7];            
const FALL_DUR: Range = [2.8, 3.8];         
const DRIFT_X: Range = [-80, 80];            
const DRIFT_Y: Range = [1.05, 1.35];           
const ROTATE: Range = [-12, 12];               
const ARC_UP: Range = [6, 10];                 

const rBetween = (rand: (min?: number, max?: number) => number, range: Range) =>
  rand(range[0], range[1]);

export function GravityText<T extends ElementType = "p">({
  text,
  as,
  className,
  maxWords = 12,
  threshold = 20,
  once = true,
  onComplete,
  ...rest
}: GravityTextProps<T>) {
  const Tag = (as || "p") as ElementType;
  const prefersReduced = useReducedMotion();
  const [triggered, setTriggered] = useState(false);

  const completed = useRef<Set<number>>(new Set());
  const totalPiecesRef = useRef(0);

  const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;

  const rawTokens = useMemo<Piece[]>(() => {
    const m = text.match(/\S+/g) || [];
    return m.map((t) => ({ text: t }));
  }, [text]);

  const pieces = useMemo<Piece[]>(() => {
    if (rawTokens.length <= maxWords) return rawTokens;
    const groups = maxWords;
    const step = Math.ceil(rawTokens.length / groups);
    const compact: Piece[] = [];
    for (let i = 0; i < rawTokens.length; i += step) {
      compact.push({
        text: rawTokens.slice(i, i + step).map((p) => p.text).join(" "),
      });
    }
    return compact;
  }, [rawTokens, maxWords]);

  totalPiecesRef.current = pieces.length;

  useEffect(() => {
    if (prefersReduced || triggered) return;
    const onScroll = () => {
      if (window.scrollY > threshold) {
        setTriggered(true);
        if (once) window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReduced, triggered, threshold, once]);

  const handlePieceComplete = (idx: number) => {
    if (completed.current.has(idx)) return;
    completed.current.add(idx);
    if (completed.current.size >= totalPiecesRef.current) {
      onComplete?.();
    }
  };

  if (prefersReduced) {
    return (
      <Tag className={["gt-container", className].filter(Boolean).join(" ")} {...rest}>
        {text}
      </Tag>
    );
  }

  const centerIndex = Math.floor(pieces.length / 2);

  return (
    <Tag className={["gt-container", className].filter(Boolean).join(" ")} {...rest}>
      {pieces.map((piece, i) => {
        const rand = seededRandom(i + piece.text.length);

        const side = i < centerIndex ? -1 : 1;
        const delay = HOLD_BEFORE_DROP + rBetween(rand, GLOBAL_DELAY_JITTER);

        const driftX = side * rBetween(rand, DRIFT_X);
        const fallY = viewportH * rBetween(rand, DRIFT_Y);
        const rotateFinal = side * rBetween(rand, ROTATE);

        const preDur = rBetween(rand, PRE_DUR);
        const fallDuration = rBetween(rand, FALL_DUR);
        const totalDuration = preDur + fallDuration;

        const preX = side * rand(4, 10);
        const preY = -rBetween(rand, ARC_UP);
        const preR = rand(-4, 4);

       
        const midT = (preDur + 0.35 * fallDuration) / totalDuration;
        const times = [0, preDur / totalDuration, midT, 1]; 
        const ease = EASES[1]; 

        const keyframes = {
          x: triggered ? [0, preX, driftX * 0.35, driftX] : [0],
          y: triggered ? [0, preY, fallY * 0.35, fallY] : [0],
          rotate: triggered ? [0, preR, rotateFinal * 0.5, rotateFinal] : [0],
          opacity: triggered ? [1, 1, 0.95, 0.9] : [1], 
        };

        return (
          <m.span
            key={`${piece.text}-${i}`}
            className="gt-word"
            aria-hidden="true"
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            style={{
              transformOrigin: "50% 12%", 
              display: "inline-block",
            }}
            animate={
              triggered
                ? {
                    ...keyframes,
                    transition: {
                      delay,
                      duration: totalDuration,
        
                      ease: ["easeOut", ease, ease],
                      times,
                    },
                  }
                : undefined
            }
            onAnimationComplete={() => handlePieceComplete(i)}
          >
            {piece.text}
          </m.span>
        );
      })}
    </Tag>
  );
}
