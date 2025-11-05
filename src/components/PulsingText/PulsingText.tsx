import { ElementType, useMemo } from "react";
import { m, useReducedMotion } from "framer-motion";
import "./PulsingText.scss";

type PulsingTextProps<T extends ElementType = "p"> = {
  text: string;
  as?: T;
  className?: string;
  gradientWords?: number[];
  intensity?: number;
  duration?: number;
  glow?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children">;

export function PulsingText<T extends ElementType = "p">({
  text,
  as,
  className,
  gradientWords = [5, 8],
  intensity = 0.06,
  duration = 3,
  glow = true,
  ...rest
}: PulsingTextProps<T>) {
  const Tag = (as || "p") as ElementType;
  const reduce = useReducedMotion();

  const words = useMemo(() => text.split(" "), [text]);

  if (reduce) {
    return (
      <Tag
        className={["pulsing-text", className].filter(Boolean).join(" ")}
        {...rest}
      >
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      className={["pulsing-text", glow ? "pulsing-text--glow" : "", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {words.map((word, i) => {
        const index = i + 1;
        const isGradient = gradientWords.includes(index);

        return (
          <m.span
            key={`${word}-${i}`}
            className={[
              "pulsing-text__inner",
              isGradient ? "pulsing-text__inner--gradient" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            animate={{
              scale: [1, 1 + intensity, 1],
              opacity: [1, 0.97, 1],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.05,
            }}
            style={{ marginRight: "0.35ch" }}
          >
            {word}
          </m.span>
        );
      })}
    </Tag>
  );
}

export default PulsingText;
