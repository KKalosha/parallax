import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "@/app/App";
import { ThemeProvider } from "./context/ThemeContext";
import { LazyMotion, domAnimation } from "framer-motion";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <LazyMotion features={domAnimation} strict>
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </LazyMotion>
    </ThemeProvider>
  </StrictMode>
);
