import Header from "@/components/Header/Header";
import "@/styles/index.scss";
import BackgroundStage from "@/components/BackgroundStage/BackgroundStage";
import Panel from "@/components/Panel/Panel";

import Hero from "@/components/Hero/Hero";


export default function App() {
  return (
    <>
      <BackgroundStage />
      <Header />

      <Panel id="intro" scene={1}>
        <Hero />
      </Panel>
      <Panel id="projects" scene={2}>
          <Hero />
      </Panel>
      <Panel id="projects" scene={3}>
          <Hero />
      </Panel>

      <Panel id="contact" scene={4}>
        <Hero />
      </Panel>
    </>
  );
}
