import Header from "@/components/Header/Header";
import "@/styles/index.scss";
import BackgroundStage from "@/components/BackgroundStage/BackgroundStage";
import Panel from "@/components/Panel/Panel";
import Hero from "@/components/Hero/Hero";
import { lazy } from "react";
import Deferred from "@/components/Deferred/Deferred";

import PanelTransition from "@/components/PanelTransition/PanelTransition";

const LazyHero = lazy(() => import("@/components/Hero/Hero"));
const EnergyOrb = lazy(() => import("@/components/EnergyOrb/EnergyOrb"));

export default function App() {
  return (
    <>
      <BackgroundStage />
      <Header />

      <PanelTransition
        id="intro-to-projects"
        slot1={<Hero />}
        slot2={<EnergyOrb size={420} />}
        heightVh={210}
      />

      <Panel id="projects-1" scene={2}>
        <Deferred>
          <LazyHero />
        </Deferred>
      </Panel>

      <Panel id="projects-2" scene={3}>
        <Deferred>
          <LazyHero />
        </Deferred>
      </Panel>

      <Panel id="contact" scene={4}>
        <Deferred>
          <LazyHero />
        </Deferred>
      </Panel>
    </>
  );
}
