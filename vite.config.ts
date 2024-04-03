import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: "src/pages/content/index.tsx",
      },
      output: {
        dir: "dist",
        format: "esm",
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "content") {
            return "content.js"; // 'content' 엔트리 파일의 경우 'content.js'로 이름 지정
          }
          if (chunkInfo.name === "popup") {
            return "popup.js"; // 'popup' 엔트리 파일의 경우 'popup.js'로 이름 지정
          }

          return "[name].js"; // 나머지 파일은 기본 이름 패턴 사용
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.type === "asset" && assetInfo.name === "content.css") {
            return "content.css"; // 'index.css' 파일의 경우 'content.css'로 이름 지정
          }

          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});
