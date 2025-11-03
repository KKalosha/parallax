import Header from "@/components/Header/Header";
import "@/styles/index.scss";
import BackgroundStage from "@/components/BackgroundStage/BackgroundStage";
import Panel from "@/components/Panel/Panel";

export default function App() {
  return (
    <>
      <BackgroundStage />
      <Header />
      <Panel id="hero" scene={1}>
        <h1>Hello 1</h1>
      </Panel>
      <Panel id="hero" scene={2}>
        <h1>Hello 2</h1>
      </Panel>
      <Panel id="hero" scene={3}>
        <h1>Hello 3</h1>
      </Panel>
      <Panel id="hero" scene={4}>
        <h1>Hello 4</h1>
      </Panel>
    </>
  );
}
