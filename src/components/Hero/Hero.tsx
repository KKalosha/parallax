import GradientText from "@/components/GradientText/GradientText";
import { GravityText } from "@/components/GravityText/GravityText";
import "@/components/Hero/Hero.scss";
export default function Hero() {
  return (
    <section className="hero">
      <GradientText
        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
        animationSpeed={10}
        showBorder={false}
      >
        <h1>Motion Playground</h1>
      </GradientText>
      <p className="large">
        <GravityText
          text="Made with motion — and a bit of love"
          maxWords={8}
          threshold={70}
          once
        />
      </p>
    </section>
  );
}
