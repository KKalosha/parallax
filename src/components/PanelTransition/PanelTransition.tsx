import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import "./PanelTransition.scss";

type PanelTransitionProps = {
  slot1: React.ReactNode; 
  slot2: React.ReactNode;
  heightVh?: number;
  id?: string;
  dataScene?: number;
};

export default function PanelTransition({
  slot1,
  slot2,
  heightVh = 220,
  id,
  dataScene,
}: PanelTransitionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);
  
const slot2Opacity = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);
const slot2Y = useTransform(scrollYProgress, [0.15, 0.6], [100, 0]);


  const rm = prefersReduced;

  return (
    <section
      id={id}
      ref={sectionRef}
      data-scene={dataScene}
      className="pt-section"
      style={{ height: `${heightVh}vh` }}
    >
      <div className="pt-stage">
        <m.div
          className="pt-slot1"
          style={
            rm
              ? {}
              : {
                  scale,
                  opacity,
                  willChange: "transform,opacity",
                }
          }
        >
          {slot1}
        </m.div>

        <m.div
          className="pt-slot2"
          style={
            rm
              ? {}
              : {
                  opacity: slot2Opacity,
                  y: slot2Y,
                  willChange: "transform,opacity",
                }
          }
        >
          {slot2}
        </m.div>
      </div>
    </section>
  );
}
