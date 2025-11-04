import { m } from "framer-motion";
import "./Panel.scss";

type PanelProps = {
  id: string;
  scene?: number;
  children: React.ReactNode;
};

const Panel: React.FC<PanelProps> = ({ id, scene = 1, children }) => {
  return (
    <section id={id} className="panel" data-scene={scene}>
      <m.div
        className="panel__inner"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.6, once: false }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.div>
    </section>
  );
};

export default Panel;
