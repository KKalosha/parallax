import React, { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import "./ScrollCarousel.scss";

type CarouselCard = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
};

const CARDS: CarouselCard[] = [
  {
    id: "parallax",
    title: "Parallax Scene",
    subtitle: "Multi-layer motion",
    description:
      "Demonstrates layered parallax background driven by scroll and pointer movement.",
    tech: ["React", "Framer Motion", "CSS Variables"],
  },
  {
    id: "orbs",
    title: "Energy Orbs",
    subtitle: "Soft glowing blobs",
    description:
      "Animated background blobs using motion values and smooth easing curves.",
    tech: ["Framer Motion", "SCSS", "Blur effects"],
  },
  {
    id: "panels",
    title: "Panel Transitions",
    subtitle: "Scroll-driven panels",
    description:
      "Animated transitions between content panels with shared motion variants.",
    tech: ["React", "TypeScript", "Framer Motion"],
  },
];

export const ScrollCarousel: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

 
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-200%"]);

  return (
    <section ref={sectionRef} className="scroll-carousel">
      <div className="scroll-carousel__sticky">
        <div className="scroll-carousel__header">
          <span className="scroll-carousel__eyebrow">Scene 02</span>
          <h2 className="scroll-carousel__title">Interactive Motion Cards</h2>
          <p className="scroll-carousel__subtitle">
            Vertical scroll drives a horizontal card carousel.
          </p>
        </div>

        <m.div className="scroll-carousel__track" style={{ x }}>
          {CARDS.map((card) => (
            <article key={card.id} className="scroll-carousel__card">
              <header className="scroll-carousel__card-header">
                <h3>{card.title}</h3>
                <p>{card.subtitle}</p>
              </header>

              <p className="scroll-carousel__card-description">
                {card.description}
              </p>

              <ul className="scroll-carousel__card-tech">
                {card.tech.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </m.div>
      </div>
    </section>
  );
};
