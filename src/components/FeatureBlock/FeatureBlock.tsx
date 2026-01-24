import {
  m,
  Variants,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import "./FeatureBlock.scss";

type Direction = "left" | "right" | "top" | "bottom";

type Tile = {
  id: string;
  label: string;
  direction: Direction;
  color: string;
  position: CSSProperties; 
};

const TILES: Tile[] = [
  {
    id: "t1",
    label: "React",
    direction: "left",
    color: "linear-gradient(135deg, #ffd6a5, #ff9f1c)",
    position: { top: "10%", left: "5%" },
  },
  {
    id: "t2",
    label: "TypeScript",
    direction: "right",
    color: "linear-gradient(135deg, #a5d8ff, #4361ee)",
    position: { top: "25%", right: "8%" },
  },
  {
    id: "t3",
    label: "Motion",
    direction: "top",
    color: "linear-gradient(135deg, #b8f2e6, #2ec4b6)",
    position: { top: "45%", left: "18%" },
  },
  {
    id: "t4",
    label: "Architecture",
    direction: "bottom",
    color: "linear-gradient(135deg, #ffafcc, #e5383b)",
    position: { bottom: "12%", left: "8%" },
  },
  {
    id: "t5",
    label: "Theming",
    direction: "left",
    color: "linear-gradient(135deg, #e0c3fc, #8e9aaf)",
    position: { bottom: "20%", right: "22%" },
  },
  {
    id: "t6",
    label: "Performance",
    direction: "right",
    color: "linear-gradient(135deg, #f8f9fa, #dee2ff)",
    position: { top: "12%", right: "32%" },
  },
];


const cloudVariants: Variants = {
  hidden: (rm: boolean) => ({
    opacity: rm ? 0 : 1,
    transition: rm
      ? { duration: 0 }
      : {
          staggerChildren: 0.12,
          staggerDirection: -1, 
        },
  }),
  visible: (rm: boolean) => ({
    opacity: 1,
    transition: rm
      ? { duration: 0.3 }
      : {
          delayChildren: 0.05,
          staggerChildren: 0.12, 
          staggerDirection: 1,
        },
  }),
};


const tileVariants: Variants = {
  hidden: (direction: Direction) => {
    const d = 60;
    switch (direction) {
      case "left":
        return { opacity: 0, x: -d, y: 0, scale: 0.95 };
      case "right":
        return { opacity: 0, x: d, y: 0, scale: 0.95 };
      case "top":
        return { opacity: 0, x: 0, y: -d, scale: 0.95 };
      case "bottom":
      default:
        return { opacity: 0, x: 0, y: d, scale: 0.95 };
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const FeatureBlock = () => {
  const prefersReducedMotion = useReducedMotion();
  const cloudRef = useRef<HTMLDivElement | null>(null);

  const [isActive, setIsActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cloudRef,

    offset: ["start 90%", "start 10%"],
  });

  useEffect(() => {
    const ENTER_T = 0.3;
    const EXIT_T = 0.22;  

    const unsubscribe = scrollYProgress.on("change", (value) => {
      setIsActive((prev) => {
      
        if (!prev && value > ENTER_T) {
          return true;
        }

        
        if (prev && value < EXIT_T) {
          return false;
        }

   
        return prev;
      });
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section className="feature-block">
      <m.div
        ref={cloudRef}
        className="feature-block__cloud"
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
        variants={cloudVariants}
        custom={prefersReducedMotion}
      >
        {TILES.map((tile) => (
          <m.div
            key={tile.id}
            className="feature-block__tile"
            variants={prefersReducedMotion ? undefined : tileVariants}
            custom={tile.direction}
            style={{
              ...tile.position,
              background: tile.color,
            }}
          >
            <span className="feature-block__tile-label">{tile.label}</span>
          </m.div>
        ))}
      </m.div>
    </section>
  );
};
