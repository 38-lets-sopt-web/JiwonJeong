import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          [
            '@emotion/babel-plugin',
            {
              "autoLabel": "always",        // 모든 컴포넌트에 라벨 자동 추가
              "labelFormat": "[local]",    // 클래스명 앞에 변수명(컴포넌트명)을 붙임
              "sourceMap": true            // 디버깅 시 스타일이 정의된 위치 추적
            }
          ]
        ],
      },
    }),
  ],
});