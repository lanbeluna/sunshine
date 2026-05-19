import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  /** 使用根路径，避免 IDE/隧道预览、子路径下模块 404 导致白屏 */
  base: '/',
  server: {
    /** 监听 0.0.0.0，手机与电脑同一 WiFi 时可用「Network」里的地址访问 */
    host: true,
    port: 5173,
  },
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
