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
import "./BackgroundStage.scss";

const getVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const scenes = [
  {
    bg1: getVar("--scene-1-bg1"),
    bg2: getVar("--scene-1-bg2"),
    accent1: getVar("--scene-1-accent1"),
    accent2: getVar("--scene-1-accent2"),
    grain: 0.18,
    blobA: { x: "10%", y: "20%", scale: 1.2 },
    blobB: { x: "70%", y: "70%", scale: 1.3 },
  },
  {
    bg1: getVar("--scene-2-bg1"),
    bg2: getVar("--scene-2-bg2"),
    accent1: getVar("--scene-2-accent1"),
    accent2: getVar("--scene-2-accent2"),
    grain: 0.22,
    blobA: { x: "20%", y: "40%", scale: 1.4 },
    blobB: { x: "65%", y: "65%", scale: 1.2 },
  },
  {
    bg1: getVar("--scene-3-bg1"),
    bg2: getVar("--scene-3-bg2"),
    accent1: getVar("--scene-3-accent1"),
    accent2: getVar("--scene-3-accent2"),
    grain: 0.20,
    blobA: { x: "30%", y: "60%", scale: 1.3 },
    blobB: { x: "60%", y: "35%", scale: 1.5 },
  },
  {
    bg1: getVar("--scene-4-bg1"),
    bg2: getVar("--scene-4-bg2"),
    accent1: getVar("--scene-4-accent1"),
    accent2: getVar("--scene-4-accent2"),
    grain: 0.16,
    blobA: { x: "15%", y: "70%", scale: 1.5 },
    blobB: { x: "75%", y: "25%", scale: 1.4 },
  },
];

export default function BackgroundStage() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const hasScroll =
    typeof window !== "undefined" &&
    document.documentElement.scrollHeight > window.innerHeight;

  const stops = scenes.length - 1;
  const range = Array.from({ length: scenes.length }, (_, i) => i / stops);

  const bg1   = useTransform(scrollYProgress, range, scenes.map((s) => s.bg1));
  const bg2   = useTransform(scrollYProgress, range, scenes.map((s) => s.bg2));
  const a1    = useTransform(scrollYProgress, range, scenes.map((s) => s.accent1));
  const a2    = useTransform(scrollYProgress, range, scenes.map((s) => s.accent2));
  const grain = useTransform(scrollYProgress, range, scenes.map((s) => s.grain));

  const yBack  = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 180]);
  const yMid   = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 120]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 60]);

  const blobA_X     = useTransform(scrollYProgress, range, scenes.map(s => s.blobA.x));
  const blobA_Y     = useTransform(scrollYProgress, range, scenes.map(s => s.blobA.y));
  const blobA_Scale = useTransform(scrollYProgress, range, scenes.map(s => s.blobA.scale));

  const blobB_X     = useTransform(scrollYProgress, range, scenes.map(s => s.blobB.x));
  const blobB_Y     = useTransform(scrollYProgress, range, scenes.map(s => s.blobB.y));
  const blobB_Scale = useTransform(scrollYProgress, range, scenes.map(s => s.blobB.scale));


  const aBreathX = useMotionValue(0);
  const aBreathY = useMotionValue(0);
  const aPulse   = useMotionValue(1);

  const bBreathX = useMotionValue(0);
  const bBreathY = useMotionValue(0);
  const bPulse   = useMotionValue(1);

  useAnimationFrame((t) => {

    if (prefersReduced) {
      aBreathX.set(0); aBreathY.set(0); aPulse.set(1);
      bBreathX.set(0); bBreathY.set(0); bPulse.set(1);
      return;
    }

    const e = t / 1000;
    const TAU = Math.PI * 2;

    aBreathX.set(20 * Math.sin((e / 11.5) * TAU));  
    aBreathY.set(16 * Math.cos((e / 12.5) * TAU));  
    aPulse.set(1 + 0.12 * Math.sin((e / 11.5) * TAU)); 

  
    bBreathX.set(22 * Math.cos((e / 12.5) * TAU + 0.7));
    bBreathY.set(18 * Math.sin((e / 10.5) * TAU + 1.1)); 
    bPulse.set(1 + 0.10 * Math.cos((e / 12.5) * TAU + 0.3)); 
  });

  
  const blobA_Scale_Final = useTransform<[number, number], number>(
    [blobA_Scale as MotionValue<number>, aPulse],
    ([base, pulse]) => Number(base) * Number(pulse)
  );
  const blobB_Scale_Final = useTransform<[number, number], number>(
    [blobB_Scale as MotionValue<number>, bPulse],
    ([base, pulse]) => Number(base) * Number(pulse)
  );


  const aOpacity = useTransform(aPulse, [0.88, 1, 1.12], [0.25, 0.35, 0.45]);
  const bOpacity = useTransform(bPulse, [0.90, 1, 1.10], [0.22, 0.33, 0.42]);

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
    <div className="bgstage" aria-hidden>
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
