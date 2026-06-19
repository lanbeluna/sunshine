# QL轻旅

QL轻旅是一个移动端优先的旅行灵感 Web App。用户可以输入旅行偏好，获得目的地推荐、行程草稿，并把喜欢的内容保存到收藏或旅行手记中。

在线预览：[https://qlapp.netlify.app](https://qlapp.netlify.app)

## 功能亮点

- 旅行偏好输入与目的地灵感推荐
- 探索页图文内容流、点赞、收藏和评论
- AI 轻旅行助手，提供行前准备、住宿区域、美食和路线建议
- 行程草稿、收藏夹、旅行手记和个人页
- Supabase Auth 邮箱登录/注册
- PWA 支持，可添加到手机主屏幕
- localStorage fallback，未配置云端时也可浏览公开页面

## 技术栈

- React + Vite + TypeScript
- Tailwind CSS
- React Router
- Supabase Auth
- Netlify + SPA fallback
- vite-plugin-pwa

## 本地运行

```bash
npm install
npm run dev
```

构建检查：

```bash
npm run lint
npm run build
```

## 环境变量

复制 `.env.example` 为 `.env.local`，然后填写：

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

注意：不要提交真实密钥，也不要把 Supabase `service_role` key 放到前端项目中。

## Netlify 部署

项目已包含 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

部署时在 Netlify 后台添加同样的环境变量：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Supabase Auth 设置

如果启用邮箱验证，请在 Supabase 后台配置：

- Site URL: `https://qlapp.netlify.app`
- Redirect URLs:
  - `https://qlapp.netlify.app/auth/callback`
  - `https://qlapp.netlify.app/**`

如需快速体验登录流程，也可以在 Supabase Authentication 设置中关闭邮箱确认。

## 项目结构

```text
src/
  components/   通用 UI、布局和媒体组件
  context/      应用级上下文
  data/         目的地、内容流和示例行程数据
  features/     按业务模块组织的页面和组件
  hooks/        可复用 React hooks
  lib/          本地存储、格式化和业务工具
  services/     Supabase 与数据服务
  types/        领域类型定义
```
