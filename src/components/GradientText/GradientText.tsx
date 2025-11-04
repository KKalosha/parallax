import { useEffect, useRef } from "react";
import "./GradientText.scss";

interface GradientTextProps {
  children: React.ReactNode;
  colors?: string[];
  animationSpeed?: number; 
  showBorder?: boolean;
  className?: string;
}

export default function GradientText({
  children,
  colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
  animationSpeed = 6,
  showBorder = false,
  className = "",
}: GradientTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;
    ref.current.style.setProperty("--gradient-colors", gradient);
    ref.current.style.setProperty("--animation-speed", `${animationSpeed}s`);
  }, [colors, animationSpeed]);

  return (
    <div
      ref={ref}
      className={`gradient-text ${showBorder ? "gradient-text--bordered" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
