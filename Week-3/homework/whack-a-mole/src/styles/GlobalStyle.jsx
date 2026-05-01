import { Global, css } from "@emotion/react";
import dungGeunMo from "@/fonts/DungGeunMo.woff2";
import pretendard from "@/fonts/PretendardVariable.woff2";

function GlobalStyle() {
  return (
    <Global
      styles={css`
        @font-face {
          font-family: dunggeunmo;

          font-display: swap;
          src: url(${dungGeunMo}) format("woff2");
        }

        @font-face {
          font-family: pretendard;

          font-display: swap;
          src: url(${pretendard}) format("woff2");
        }

        body {
          box-sizing: border-box;
        }

        h1, h2, h3, h4, h5, h6, span, p {
          margin: 0;
          padding: 0;
        }
      `}
    />
  );
}

export default GlobalStyle;
