import katex from "katex";
import React, { useCallback, useMemo } from "react";

export interface LatexProps extends React.HTMLAttributes<HTMLDivElement> {
  tex: string;
}
type Token = { type: "text"; value: string } | { type: "latex"; value: string };

const parseLatex = (src: string): Token[] => {
  let i = 0;
  const out: Token[] = [];
  let isLatex: boolean = false;
  let buf: string = "";

  while (i < src.length) {
    if (isLatex && src[i] === "\\" && src[i + 1] === ")") {
      out.push({ type: "latex", value: buf });
      buf = "";
      isLatex = false;
      i += 2;
    } else if (!isLatex && src[i] === "\\" && src[i + 1] === "(") {
      out.push({ type: "text", value: buf });
      buf = "";
      isLatex = true;
      i += 2;
    } else {
      buf += src[i];
      i++;
    }
  }

  if (buf.length > 0) {
    out.push({ type: "text", value: buf });
  }
  console.log("out:", out);
  return out;
};

export function Latex({ tex, ...props }: LatexProps) {
  const tokens: Token[] = useMemo(() => parseLatex(tex), [tex]);

  return (
    <div {...props}>
      {tokens.map((token, i) =>
        token.type === "text" ? (
          <span key={i}>{token.value}</span>
        ) : (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(token.value, {
                throwOnError: false,
              }),
            }}
          />
        )
      )}
    </div>
  );
}
