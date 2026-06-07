# QL轻旅

QL轻旅是一个轻量旅行灵感 Web App 课程项目。它不是正式订票或旅游预订产品，而是帮助用户从旅行偏好出发，生成目的地灵感、行程草稿、收藏内容和手记草稿。

## 技术栈

- React + Vite + TypeScript
- Tailwind CSS
- React Router
- Supabase Auth + 可选云端同步
- localStorage 本地演示兜底
- Netlify 静态部署
- PWA，可添加到手机主屏幕

## 本地运行

```bash
npm install
npm run dev
```

本地构建：

```bash
npm run build
npm run preview
```

## 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

说明：

- 这两个变量都是 Vite 前端变量，必须以 `VITE_` 开头。
- `VITE_SUPABASE_ANON_KEY` 只能填写 Supabase anon public key。
- 不要提交真实密钥，不要把 `service_role` key 放到前端项目。
- 如果不配置 Supabase，公开 Demo 页面仍可运行，但登录/注册功能会显示“当前未配置 Supabase”。

## Supabase Auth

本项目使用 Supabase Email + Password Auth：

1. 在 Supabase 后台创建项目。
2. 进入 Authentication，确认 Email provider 已开启。
3. 如需用户注册后立刻登录，可以关闭 Confirm email；如保留邮箱确认，注册后用户需要先去邮箱确认。
4. 在 Netlify 后台添加 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`。

当前受保护页面：

- `/profile`
- `/profile/collections`
- `/profile/decision-history`
- `/profile/notes`
- `/profile/drafts`
- `/profile/notifications`
- `/profile/language`
- `/profile/preferences`

公开页面仍可直接访问：

- `/decision`
- `/explore`
- `/destination/:id`
- `/trips`
- `/trip/:tripId`
- `/assistant`
- `/profile/about`
- `/profile/legal`

## Supabase 数据表初始化

如果需要云端同步收藏、手记和行程历史，先在 Supabase SQL Editor 执行：

```text
supabase/migrations/20260408120000_ql_qinglv_schema.sql
```

然后检查：

- `locations`、`trip_history`、`user_settings`、`journals` 表已创建。
- RLS 策略已启用。
- 如需保留匿名演示同步，Authentication 中需要允许 Anonymous 登录。

## Netlify 部署

仓库已经包含 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

这保证 React Router 子页面刷新后不会 404。

部署步骤：

1. 在 Netlify 导入 GitHub 仓库。
2. Build command 使用 `npm run build`。
3. Publish directory 使用 `dist`。
4. 在 Environment variables 中添加 Supabase 变量。
5. 触发 Deploy。

## 手机添加到主屏幕

iPhone：

1. 用 Safari 打开 Netlify 链接。
2. 点击分享按钮。
3. 选择“添加到主屏幕”。

Android：

1. 用 Chrome 打开 Netlify 链接。
2. 点击右上角菜单。
3. 选择“添加到主屏幕”或“安装应用”。

## 项目结构

```text
src/
  components/       通用 UI、布局、图片组件
  context/          主题和语言等应用上下文
  data/             演示目的地、信息流、行程数据
  features/         按功能组织的页面、组件和状态
  hooks/            可复用 React hooks
  lib/              本地 store、格式化、推荐规则
  services/         Supabase 与 localStorage 服务
  types/            领域类型
```

## 当前定位

这个项目适合作为作品集里的学生友好型 Web Coding 项目展示：

- 有完整用户路径：偏好输入 -> 推荐结果 -> 行程草稿 -> 收藏/手记 -> 个人页查看。
- 有前端工程结构：类型、服务层、组件复用、路由拆分。
- 有部署能力：Netlify、PWA、SPA fallback。
- 有演示兜底：即使没有 Supabase，也可以靠本地数据体验公开页面。
