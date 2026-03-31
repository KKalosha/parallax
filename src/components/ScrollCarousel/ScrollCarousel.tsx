import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import "./ScrollCarousel.scss";

export type Card = {
  id: number;
  title: string;
  subtitle: string;
    scene: number;
};

type Props = {
  cards: Card[];
};

export const Carousel = ({ cards }: Props) => {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <section className="carousel">
      <h2>Interactive Cards</h2>

      <div className="carousel__viewport">
        <AnimatePresence mode="wait">
          <m.div
            key={cards[index].id}
            className="carousel__card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
              data-scene={cards[index].scene}
          >
            <h3>{cards[index].title}</h3>
            <p>{cards[index].subtitle}</p>
          </m.div>
        </AnimatePresence>
      </div>

      <div className="carousel__controls">
        <button onClick={prev}>←</button>
        <button onClick={next}>→</button>
      </div>

      <div className="carousel__dots">
        {cards.map((_, i) => (
          <span
            key={i}
            className={i === index ? "active" : ""}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
};