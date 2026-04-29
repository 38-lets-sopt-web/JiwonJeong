import { Global, css } from '@emotion/react';

function GlobalStyle() {
  return (
    <Global
      styles={css`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          min-height: 100%;
        }

        body {
          margin: 0;
          font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            sans-serif;
          text-rendering: optimizelegibility;

          -webkit-font-smoothing: antialiased;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        button {
          cursor: pointer;
          padding: 0;
          border: 0;
          background: none;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        ul,
        ol {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        img,
        picture,
        svg,
        video,
        canvas {
          display: block;
          max-width: 100%;
        }
      `}
    />
  );
}

export default GlobalStyle;
