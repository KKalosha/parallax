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

const EASES: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.16, 1, 0.3, 1],
  [0.22, 1, 0.36, 1],
  [0.25, 0.8, 0.2, 1],
] as const;

function seededRandom(seedBase: number) {
  let seed = (seedBase * 9301 + 49297) % 233280;
  return (min = 0, max = 1) => {
    seed = (seed * 9301 + 49297) % 233280;
    const r = seed / 233280;
    return min + r * (max - min);
  };
}

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
const [done, setDone] = useState(false);   

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
        text: rawTokens
          .slice(i, i + step)
          .map((p) => p.text)
          .join(" "),
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
    setDone(true); 
      onComplete?.();
    }
  };

  if (prefersReduced) {
    return (
      <Tag
        className={["gt-container", className].filter(Boolean).join(" ")}
        {...rest}
      >
        {text}
      </Tag>
    );
  }



  return (
    <Tag
      className={["gt-container", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {pieces.map((piece, i) => {
        const rand = seededRandom(i + piece.text.length);

        const cascadeDelay = 0.06 * i + rand(0, 0.24);
        const driftX = rand(-80, 80);
        const fallY = viewportH * rand(1.15, 1.5);
        const rotateFinal = rand(-28, 28);
        const fallDuration = rand(0.9, 1.25);
        const ease = EASES[Math.floor(rand(0, EASES.length))];

        const preDur = 0.12;
        const preX = rand(-6, 6);
        const preY = rand(-4, 4);
        const preR = rand(-3, 3);

        const totalDuration = preDur + fallDuration;
        const times = [0, preDur / totalDuration, 1];

        const keyframes = {
          x: triggered ? [0, preX, driftX] : 0,
          y: triggered ? [0, preY, fallY] : 0,
          rotate: triggered ? [0, preR, rotateFinal] : 0,
          opacity: triggered ? [1, 1, 0] : 1,
        } as const;

        return (
          <m.span
            key={`${piece.text}-${i}`}
            className="gt-word"
            aria-hidden="true"
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={
              triggered
                ? {
                    ...keyframes,
                    transition: {
                      delay: 0.02 + cascadeDelay,
                      duration: totalDuration,
                      ease,
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
