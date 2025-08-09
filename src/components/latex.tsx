import katex from "katex";
import { useEffect, useRef } from "react";

export interface LatexProps {
  tex: string;
}

export function Latex({ tex }: LatexProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false });
    }
  }, [tex]);

  return <div ref={ref} />;
}
