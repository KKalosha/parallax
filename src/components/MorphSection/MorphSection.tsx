import {
  m,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { useRef } from "react";
import "./MorphSection.scss";

const STATS = [
  {
    value: "3+",
    label: "Years of experience",
    sub: "Building production apps",
    offsetX: -250,
    offsetY: -250,
  },
  {
    value: "3+",
    label: "Projects shipped",
    sub: "From concept to deploy",
    offsetX: 0,
    offsetY: 300,
  },
  {
    value: "∞",
    label: "Lines of passion",
    sub: "React · TS · Node · SCSS",
    offsetX: 250,
    offsetY: -100,
  },
];

const LIGHT_GRADIENTS = [
  "linear-gradient(135deg, #bfdbfe 0%, #93c5fd 50%, #67e8f9 100%)",
  "linear-gradient(160deg, #67e8f9 0%, #38bdf8 40%, #818cf8 100%)",
  "linear-gradient(180deg, #34d399 0%, #22d3ee 50%, #60a5fa 100%)",
  "linear-gradient(160deg, #a5f3fc 0%, #67e8f9 50%, #818cf8 100%)",
  "linear-gradient(135deg, #c7d2fe 0%, #a5f3fc 50%, #bfdbfe 100%)",
];

const DARK_GRADIENTS = [
  "linear-gradient(135deg, #1e3a5f 0%, #1a2e5a 50%, #0d3d50 100%)",
  "linear-gradient(160deg, #0d3d50 0%, #0f3060 40%, #2a2060 100%)",
  "linear-gradient(180deg, #0d3d2a 0%, #0a3040 50%, #1a2060 100%)",
  "linear-gradient(160deg, #0a3540 0%, #0d3d50 50%, #1e1a60 100%)",
  "linear-gradient(135deg, #1e2060 0%, #0a3040 50%, #1e3a5f 100%)",
];

const StatCard = ({
  stat,
  smooth,
}: {
  stat: (typeof STATS)[0];
  smooth: MotionValue<number>;
}) => {
  const x = useTransform(smooth, [0.42, 0.68], [0, stat.offsetX]);
  const y = useTransform(smooth, [0.42, 0.68], [0, stat.offsetY]);
  const cardScale = useTransform(smooth, [0.42, 0.68], [0.4, 1]);
  const opacity = useTransform(smooth, [0.42, 0.58, 0.88, 0.96], [0, 1, 1, 0]);

  return (
    <m.div
      className="morph-stat-card"
      style={{ x, y, scale: cardScale, opacity }}
    >
      <span className="morph-stat-value">{stat.value}</span>
      <span className="morph-stat-label">{stat.label}</span>
      <span className="morph-stat-sub">{stat.sub}</span>
    </m.div>
  );
};

const MorphSection = () => {
  const ref = useRef<HTMLElement>(null);

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.dataset.theme === "dark";

  const gradients = isDark ? DARK_GRADIENTS : LIGHT_GRADIENTS;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.6,
  });

  const scale = useTransform(
    smooth,
    [0, 0.25, 0.45, 0.7, 1],
    [0.4, 0.85, 1.15, 1.05, 0.75],
  );

  const borderRadius = useTransform(
    smooth,
    [0, 0.15, 0.32, 0.5, 0.7, 0.88, 1],
    [
      "18px",
      "50% 30% 60% 40% / 40% 60% 40% 60%",
      "60% 40% 50% 50% / 50% 50% 60% 40%",
      "50%",
      "38% 62% 55% 45% / 55% 45% 62% 38%",
      "45% 55% 45% 55% / 60% 40% 60% 40%",
      "24px",
    ],
  );

  const rotate = useTransform(smooth, [0, 0.5, 1], [-8, 10, 28]);

  const background = useTransform(smooth, [0, 0.25, 0.5, 0.75, 1], gradients);

  const boxShadow = useTransform(
    smooth,
    [0, 0.35, 0.65, 1],
    isDark
      ? [
          "0 16px 48px rgba(0,0,0,0.4)",
          "0 50px 140px rgba(61,189,122,0.18), 0 20px 60px rgba(124,104,232,0.2)",
          "0 50px 140px rgba(61,189,122,0.22), 0 20px 60px rgba(26,168,189,0.18)",
          "0 24px 80px rgba(124,104,232,0.25)",
        ]
      : [
          "0 16px 48px rgba(100,180,255,0.12)",
          "0 50px 140px rgba(34,211,238,0.3), 0 20px 60px rgba(99,102,241,0.15)",
          "0 50px 140px rgba(52,211,153,0.28), 0 20px 60px rgba(34,211,238,0.2)",
          "0 24px 80px rgba(129,140,248,0.22)",
        ],
  );

  const glowScale = useTransform(smooth, [0, 0.5, 1], [0.6, 1.8, 1.2]);
  const glowOpacity = useTransform(
    smooth,
    [0, 0.4, 0.7, 1],
    [0.1, 0.45, 0.35, 0.15],
  );

  const titleOpacity = useTransform(smooth, [0, 0.1, 0.38], [0, 1, 0]);
  const titleY = useTransform(smooth, [0, 0.1, 0.38], [24, 0, -20]);

  const shapeOpacity = useTransform(smooth, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="morph-section">
      <div className="morph-sticky">
        <m.div
          className="morph-ambient"
          style={{ scale: glowScale, opacity: glowOpacity }}
        />

        <div className="morph-content">
          <m.div
            className="morph-heading"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <span className="morph-eyebrow">A bit about me</span>
            <h2>Crafted with code & care</h2>
          </m.div>

          {STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} smooth={smooth} />
          ))}

          <m.div
            className="morph-shape"
            style={{
              scale,
              borderRadius,
              rotate,
              background,
              boxShadow,
              opacity: shapeOpacity,
            }}
          >
            <div className="morph-inner-orb" />
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default MorphSection;
