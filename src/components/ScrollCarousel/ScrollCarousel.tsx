import  { useState } from "react";
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

  const paginate = (direction: number) => {
    setIndex((prev) => (prev + direction + cards.length) % cards.length);
  };

  return (
    <section className="carousel">
      <div className="carousel__header">
        <h2>Interactive Cards</h2>
      </div>

      <div className="carousel__viewport">
        <AnimatePresence mode="wait">
          <m.div
            key={index}
            className="carousel__card"
            data-scene={cards[index].scene}
            initial={{ x: 120, opacity: 0, scale: 0.92 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -120, opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -100) paginate(1);
              if (info.offset.x > 100) paginate(-1);
            }}
          >
            <h3>{cards[index].title}</h3>
            <p>{cards[index].subtitle}</p>
          </m.div>
        </AnimatePresence>
      </div>

      {/* <div className="carousel__controls">
        <button onClick={() => paginate(-1)}>←</button>
        <button onClick={() => paginate(1)}>→</button>
      </div> */}

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

