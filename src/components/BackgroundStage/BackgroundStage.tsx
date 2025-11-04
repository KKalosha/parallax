import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionTemplate,
  useAnimationFrame,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import "./BackgroundStage.scss";


const TAU = Math.PI * 2;


const safeGetVar = (name: string, fallback = ""): string => {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
};

type BlobPos = { x: string; y: string; scale: number };
type Scene = {
  bg1: string;
  bg2: string;
  accent1: string;
  accent2: string;
  grain: number;
  blobA: BlobPos;
  blobB: BlobPos;
};


const makeScenes = (): Scene[] => [
  {
    bg1: safeGetVar("--scene-1-bg1"),
    bg2: safeGetVar("--scene-1-bg2"),
    accent1: safeGetVar("--scene-1-accent1"),
    accent2: safeGetVar("--scene-1-accent2"),
    grain: 0.18,
    blobA: { x: "10%", y: "20%", scale: 1.2 },
    blobB: { x: "70%", y: "70%", scale: 1.3 },
  },
  {
    bg1: safeGetVar("--scene-2-bg1"),
    bg2: safeGetVar("--scene-2-bg2"),
    accent1: safeGetVar("--scene-2-accent1"),
    accent2: safeGetVar("--scene-2-accent2"),
    grain: 0.22,
    blobA: { x: "20%", y: "40%", scale: 1.4 },
    blobB: { x: "65%", y: "65%", scale: 1.2 },
  },
  {
    bg1: safeGetVar("--scene-3-bg1"),
    bg2: safeGetVar("--scene-3-bg2"),
    accent1: safeGetVar("--scene-3-accent1"),
    accent2: safeGetVar("--scene-3-accent2"),
    grain: 0.2,
    blobA: { x: "30%", y: "60%", scale: 1.3 },
    blobB: { x: "60%", y: "35%", scale: 1.5 },
  },
  {
    bg1: safeGetVar("--scene-4-bg1"),
    bg2: safeGetVar("--scene-4-bg2"),
    accent1: safeGetVar("--scene-4-accent1"),
    accent2: safeGetVar("--scene-4-accent2"),
    grain: 0.16,
    blobA: { x: "15%", y: "70%", scale: 1.5 },
    blobB: { x: "75%", y: "25%", scale: 1.4 },
  },
];

export default function BackgroundStage() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();


  const [scenes, setScenes] = useState<Scene[]>(() => makeScenes());
  useEffect(() => {
    if (typeof window === "undefined") return;

    const read = () => setScenes(makeScenes());
    read();


    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  
  const [hasScroll, setHasScroll] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const calc = () =>
      setHasScroll(document.documentElement.scrollHeight > window.innerHeight);
    calc();
    window.addEventListener("resize", calc, { passive: true });

    window.addEventListener("load", calc);
    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("load", calc);
    };
  }, []);


  const range = useMemo(() => {
    const n = Math.max(1, scenes.length);
    const stops = Math.max(1, n - 1);
    return Array.from({ length: n }, (_, i) => i / stops);
  }, [scenes.length]);


  const mapStr = (pick: (s: Scene) => string) => scenes.map(pick);
  const mapNum = (pick: (s: Scene) => number) => scenes.map(pick);


  const bg1 = useTransform(scrollYProgress, range, mapStr((s) => s.bg1));
  const bg2 = useTransform(scrollYProgress, range, mapStr((s) => s.bg2));
  const a1 = useTransform(scrollYProgress, range, mapStr((s) => s.accent1));
  const a2 = useTransform(scrollYProgress, range, mapStr((s) => s.accent2));
  const grain = useTransform(scrollYProgress, range, mapNum((s) => s.grain));


  const yBack = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 180]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 120]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 60]);


  const blobA_X = useTransform(scrollYProgress, range, mapStr((s) => s.blobA.x));
  const blobA_Y = useTransform(scrollYProgress, range, mapStr((s) => s.blobA.y));
  const blobA_Scale = useTransform(scrollYProgress, range, mapNum((s) => s.blobA.scale));

  const blobB_X = useTransform(scrollYProgress, range, mapStr((s) => s.blobB.x));
  const blobB_Y = useTransform(scrollYProgress, range, mapStr((s) => s.blobB.y));
  const blobB_Scale = useTransform(scrollYProgress, range, mapNum((s) => s.blobB.scale));


  const aBreathX = useMotionValue(0);
  const aBreathY = useMotionValue(0);
  const aPulse = useMotionValue(1);

  const bBreathX = useMotionValue(0);
  const bBreathY = useMotionValue(0);
  const bPulse = useMotionValue(1);

 
  const amp = useMemo(() => {
    if (typeof window === "undefined") return { ax: 20, ay: 16, bx: 22, by: 18 };
    const small = window.innerWidth < 420;
    return small ? { ax: 12, ay: 10, bx: 14, by: 12 } : { ax: 20, ay: 16, bx: 22, by: 18 };
  }, []);

  useAnimationFrame((t) => {
    if (prefersReduced) {
      aBreathX.set(0);
      aBreathY.set(0);
      aPulse.set(1);
      bBreathX.set(0);
      bBreathY.set(0);
      bPulse.set(1);
      return;
    }

    const e = t / 1000;

    aBreathX.set(amp.ax * Math.sin((e / 11.5) * TAU));
    aBreathY.set(amp.ay * Math.cos((e / 12.5) * TAU));
    aPulse.set(1 + 0.12 * Math.sin((e / 11.5) * TAU));

    bBreathX.set(amp.bx * Math.cos((e / 12.5) * TAU + 0.7));
    bBreathY.set(amp.by * Math.sin((e / 10.5) * TAU + 1.1));
    bPulse.set(1 + 0.1 * Math.cos((e / 12.5) * TAU + 0.3));
  });


  const blobA_Scale_Final = useTransform<[number, number], number>(
    [blobA_Scale as MotionValue<number>, aPulse],
    ([base, pulse]) => Number(base) * Number(pulse),
  );
  const blobB_Scale_Final = useTransform<[number, number], number>(
    [blobB_Scale as MotionValue<number>, bPulse],
    ([base, pulse]) => Number(base) * Number(pulse),
  );


  const aOpacity = useTransform(aPulse, [0.88, 1, 1.12], [0.25, 0.35, 0.45]);
  const bOpacity = useTransform(bPulse, [0.9, 1, 1.1], [0.22, 0.33, 0.42]);

 
  const backGradient = useMotionTemplate`
    radial-gradient(
      120% 120% at 80% 0%,
      ${bg1} 0%,
      ${bg1} var(--back-solid-stop),
      var(--fade-color) var(--back-fade-stop)
    )`;

  const frontGradient = useMotionTemplate`
    radial-gradient(
      100% 100% at 10% 100%,
      ${bg2} 0%,
      ${bg2} var(--front-solid-stop),
      var(--fade-color) var(--front-fade-stop)
    )`;

  return (
    <div className="bgstage" aria-hidden="true">
      <motion.div
        className="bgstage__layer bgstage__layer--back"
        style={{ y: hasScroll ? yBack : 0, background: backGradient }}
      />

      <motion.div
        className="bgstage__layer bgstage__layer--mid"
        style={{ y: hasScroll ? yMid : 0 }}
      >
        <motion.div
          className="bgstage__blob"
          style={{
            background: a1,
            left: blobA_X,
            top: blobA_Y,
            x: aBreathX,
            y: aBreathY,
            scale: prefersReduced ? blobA_Scale : blobA_Scale_Final,
            opacity: prefersReduced ? 0.35 : aOpacity,
          }}
        />
        <motion.div
          className="bgstage__blob"
          style={{
            background: a2,
            left: blobB_X,
            top: blobB_Y,
            x: bBreathX,
            y: bBreathY,
            scale: prefersReduced ? blobB_Scale : blobB_Scale_Final,
            opacity: prefersReduced ? 0.35 : bOpacity,
          }}
        />
      </motion.div>

      <motion.div
        className="bgstage__layer bgstage__layer--front"
        style={{ y: hasScroll ? yFront : 0, background: frontGradient }}
      />

      <motion.div className="bgstage__grain" style={{ opacity: grain }} />
    </div>
  );
}
