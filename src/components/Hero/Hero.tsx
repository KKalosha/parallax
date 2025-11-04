import GradientText from "@/components/GradientText/GradientText";

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
    </section>
  );
}
