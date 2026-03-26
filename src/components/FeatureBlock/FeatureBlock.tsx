import { m, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { Variants } from "framer-motion";
import "./FeatureBlock.scss";

const EASE = [0.16, 1, 0.3, 1] as const;

const fromBottom: Variants = {
  hidden: { opacity: 0, y: 70 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const fromRight: Variants = {
  hidden: { opacity: 0, x: 160 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
};

const fromLeft: Variants = {
  hidden: { opacity: 0, x: -160 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
};

const IN_VIEW_OPTIONS = { once: true, margin: "0px 0px -220px 0px" } as const;

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, IN_VIEW_OPTIONS);
  return { ref, animate: isInView ? "visible" : "hidden" } as const;
}

const FeatureBlock = () => {
  const prefersReducedMotion = useReducedMotion();

  const title     = useReveal();
  const rowFirst  = useReveal();
  const rowSecond = useReveal();
  const wide      = useReveal();
  const highlight = useReveal();

  const v = (variants: Variants) =>
    prefersReducedMotion ? undefined : variants;

  return (
    <section
      className="feature-block"
      aria-label="Key technologies and focus areas"
    >
      <div className="feature-block__container">

        <m.h2
          ref={title.ref}
          className="feature-block__title"
          variants={v(fromBottom)}
          initial="hidden"
          animate={title.animate}
        >
          Built with motion in mind
        </m.h2>

        <m.div
          ref={rowFirst.ref}
          className="feature-block__row"
          variants={v(fromRight)}
          initial="hidden"
          animate={rowFirst.animate}
        >
          <div className="feature-block__visual">
            <div className="mock-svg" />
          </div>
          <div className="feature-block__text">
            <h3>React & TypeScript</h3>
            <p>
              Structured component architecture with strict typing, clean
              separation of concerns, and scalable design patterns.
            </p>
          </div>
        </m.div>

        <m.div
          ref={rowSecond.ref}
          className="feature-block__row feature-block__row--reverse"
          variants={v(fromLeft)}
          initial="hidden"
          animate={rowSecond.animate}
        >
          <div className="feature-block__text">
            <h3>Framer Motion</h3>
            <p>
              Every transition is intentional — scroll-driven reveals,
              directional slides, and easing curves crafted for feel.
            </p>
          </div>
          <div className="feature-block__visual">
            <div className="mock-svg" />
          </div>
        </m.div>


        <m.div
          ref={wide.ref}
          className="feature-block__wide"
          variants={v(fromBottom)}
          initial="hidden"
          animate={wide.animate}
        >
          <h3>SCSS & CSS Variables</h3>
          <p>
            Theme-aware styling with design tokens, responsive layouts,
            and consistent visual language across every component.
          </p>
        </m.div>


        <m.div
          ref={highlight.ref}
          className="feature-block__highlight"
          variants={v(fromBottom)}
          initial="hidden"
          animate={highlight.animate}
        >
          <p>React · TypeScript · Framer Motion · SCSS</p>
        </m.div>

      </div>
    </section>
  );
};

export default FeatureBlock;
