import { m } from "framer-motion";
import "@/components/Panel/Panel.scss";

type PanelProps = {
  id: string;
  scene?: number;
  children: React.ReactNode;
};

const Panel: React.FC<PanelProps> = ({ id, scene = 1, children }) => {
  return (
    <m.section
      id={id}
      className="panel"
      data-scene={scene}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "transform, opacity" }}
    >
      <div className="panel__inner">{children}</div>
    </m.section>
  );
};

export default Panel;
