import { m, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef } from "react";
import "./MorphSection.scss";

const STATS = [
  {
    value: "3+",
    label: "Years of experience",
    sub: "Building production apps",
    offsetX: -240,
    offsetY: -80,
  },
  {
    value: "20+",
    label: "Projects shipped",
    sub: "From concept to deploy",
    offsetX: 0,
    offsetY: 150,
  },
  {
    value: "∞",
    label: "Lines of passion",
    sub: "React · TS · Node · SCSS",
    offsetX: 240,
    offsetY: -80,
  },
];

const StatCard = ({
  stat,
  smooth,
}: {
  stat: (typeof STATS)[0];
  smooth: MotionValue<number>;
}) => {
  const x = useTransform(smooth, [0.3, 0.55], [0, stat.offsetX]);
  const y = useTransform(smooth, [0.3, 0.55], [0, stat.offsetY]);
  const cardScale = useTransform(smooth, [0.3, 0.55], [0.5, 1]);
  const opacity = useTransform(smooth, [0.3, 0.45, 0.82, 0.95], [0, 1, 1, 0]);

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
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.4,
  });

  const scale = useTransform(smooth, [0, 0.35, 0.65, 1], [0.5, 1, 1.08, 0.88]);

  const borderRadius = useTransform(
    smooth,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "20px",
      "50% 30% 60% 40% / 40% 60% 40% 60%",
      "50%",
      "40% 60% 55% 45% / 55% 45% 60% 40%",
      "32px",
    ]
  );

  const rotate = useTransform(smooth, [0, 1], [-12, 20]);

  const background = useTransform(
    smooth,
    [0, 0.35, 0.65, 1],
    [
      "linear-gradient(135deg, #a8d4ff 0%, #7eb8f7 50%, #4fc3f7 100%)",
      "linear-gradient(160deg, #67e8f9 0%, #38bdf8 50%, #818cf8 100%)",
      "linear-gradient(135deg, #34d399 0%, #22d3ee 50%, #60a5fa 100%)",
      "linear-gradient(160deg, #a5f3fc 0%, #67e8f9 50%, #93c5fd 100%)",
    ]
  );

  const boxShadow = useTransform(
    smooth,
    [0, 0.5, 1],
    [
      "0 20px 60px rgba(100,180,255,0.18)",
      "0 40px 120px rgba(34,211,238,0.32)",
      "0 30px 100px rgba(129,140,248,0.28)",
    ]
  );

  const glowScale = useTransform(smooth, [0, 1], [0.7, 1.6]);
  const glowOpacity = useTransform(smooth, [0, 0.5, 1], [0.12, 0.38, 0.18]);

  const titleOpacity = useTransform(smooth, [0, 0.08, 0.35], [0, 1, 0]);
  const titleY = useTransform(smooth, [0, 0.08, 0.35], [20, 0, -16]);

  const hintOpacity = useTransform(smooth, [0, 0.08, 0.32], [0, 1, 0]);
  const shapeOpacity = useTransform(smooth, [0, 0.06, 0.9, 1], [0, 1, 1, 0]);

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
            <m.span className="morph-hint" style={{ opacity: hintOpacity }}>
              scroll ↓
            </m.span>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default MorphSection;
