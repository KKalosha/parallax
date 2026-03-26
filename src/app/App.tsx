import Header from "@/components/Header/Header";
import "@/styles/index.scss";
import BackgroundStage from "@/components/BackgroundStage/BackgroundStage";
import Panel from "@/components/Panel/Panel";
import Hero from "@/components/Hero/Hero";
import { lazy } from "react";
import Deferred from "@/components/Deferred/Deferred";

import PanelTransition from "@/components/PanelTransition/PanelTransition";

import MorphSection from "@/components/MorphSection/MorphSection";

const LazyHero = lazy(() => import("@/components/Hero/Hero"));
const FeatureBlock = lazy(
  () => import("@/components/FeatureBlock/FeatureBlock"),
);
const EnergyOrb = lazy(() => import("@/components/EnergyOrb/EnergyOrb"));

import { Carousel, Card } from "@/components/ScrollCarousel/ScrollCarousel";

const CARDS: Card[] = [
  { id: 1, title: "Parallax Scene", subtitle: "Multi-layer motion", scene: 1 },
  { id: 2, title: "Energy Orbs", subtitle: "Soft glowing blobs", scene: 2 },
  { id: 3, title: "Panel Transitions", subtitle: "Scroll panels", scene: 3 },
  { id: 4, title: "Scroll Morph", subtitle: "Shape transformation", scene: 4 },
];

export default function App() {
  return (
    <>
      <BackgroundStage />
      <Header />

      <PanelTransition
        id="intro-to-projects"
        slot1={<Hero />}
        slot2={<FeatureBlock />}
        heightVh={210}
      />

      <Panel id="scene-2" scene={2}>
        <Deferred>
          <MorphSection />
        </Deferred>
      </Panel>

      <Panel id="scene-3" scene={3}>
        <Deferred>
          <Carousel cards={CARDS} />
        </Deferred>
      </Panel>

      <Panel id="scene-3" scene={4}>
        <Deferred>
          <EnergyOrb size={420} />
        </Deferred>
      </Panel>
    </>
  );
}
