import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        require("tailwindcss"), // 使用 tailwindcss v3
        require("autoprefixer"),
      ],
    },
  },
  resolve: {
    alias: {
      // 确保 Ace 的 Worker 文件可以被正确解析
      "ace-builds": path.resolve(__dirname, "node_modules/ace-builds"),
    },
  },
  // 配置静态资源服务
  server: {
    fs: {
      allow: ["."], // 允许访问项目根目录下的文件
    },
  },
  base: "./",
});