import GradientText from "@/components/GradientText/GradientText";
import { GravityText } from "@/components/GravityText/GravityText";
import PulsingText from "@/components/PulsingText/PulsingText";
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

      <PulsingText
        text="Made with motion — and a bit of love"
        gradientWords={[3, 9]}
        className="large"
        intensity={0.07}
        duration={4}
        glow
      />
    </section>
  );
}
