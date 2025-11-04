import { useEffect, useRef, useState } from "react";

type Props = { rootMargin?: string; children: React.ReactNode };

export default function Deferred({ rootMargin = "200px", children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ready]);

  return <div ref={ref}>{ready ? children : null}</div>;
}
