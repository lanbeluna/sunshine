# QL轻旅（原型演示 / 移动端优先）

[License: MIT](https://opensource.org/licenses/MIT)
[React](https://react.dev/)
[Vite](https://vite.dev/)
[TypeScript](https://www.typescriptlang.org/)
[Tailwind CSS](https://tailwindcss.com/)
[Supabase](https://supabase.com/)

**QL轻旅** 是基于 Web 的旅行灵感与行程原型：采集用户偏好，使用前端规则引擎与演示数据生成决策与行程视图；可选接入 **Supabase** 同步手账等数据，并与浏览器 **localStorage** 降级缓存协同。桌面浏览器中以约 **390px** 宽居中呈现，便于甲方按手机视口预览。

`[Screenshot Placeholder]`

---

## 目录

- [功能特性](#功能特性)
- [技术架构](#技术架构)
- [快速开始](#快速开始)
- [数据库设计](#数据库设计)
- [项目结构](#项目结构)
- [部署指南](#部署指南)
- [路线图](#路线图)
- [许可证与免责声明](#许可证与免责声明)

---

## 功能特性

- 采集出行偏好：时长、预算档位、心情标签、同行人数、是否携带宠物。
- 基于标签与约束从 `locations` 拉取或回退本地种子数据，生成多条可浏览的旅行方案（含时间线、预估花费、交通与匹配度等展示字段）。
- 方案详情页展示地点元数据、模拟天气与人流文案、规则生成的打包清单（非实时外部 API）。
- 将行程单导出为 PNG 图片（`html-to-image`）。
- 行程历史与反馈：支持写入 `trip_history`；个人偏好支持读写 `user_settings`。
- 未配置 Supabase 或网络不可用时，地点与部分状态依赖本地数据与 **Zustand** `persist` 至 **localStorage**。

---

## 技术架构

### 推荐管线（当前实现）

推荐引擎为**基于多维度标签的前端规则匹配算法**：按 `category`、`budget`、`duration`、`group_size`、`pet_friendly` 等字段筛选 POI，辅以加权评分与随机组合，**非大语言模型（LLM）推理**。实现位于 `src/utils/aiRecommend.ts`。天气、人流与清单文案来自应用内模拟或静态数据，非权威实时数据源。

### 扩展位

未来可通过 **Supabase Edge Functions**（边缘函数）代理外部 **LLM API**、气象或地图服务，将结构化 POI 与用户偏好交由服务端编排，再返回前端渲染；当前仓库未包含此类函数。

### 后端与认证

**Supabase** 提供托管 **PostgreSQL** 与 **Auth（身份认证）**。客户端使用 **anon（匿名）公钥** 与 **RLS（Row Level Security，行级安全策略）** 限制数据访问；**严禁**将 `service_role` 密钥嵌入前端。

### 依赖版本（摘自 `package.json`）

- **Node.js**：>= 18.0.0（推荐使用当前 LTS）
- **react** / **react-dom**：^19.2.0
- **vite**：^7.2.4
- **typescript**：~5.9.3
- **tailwindcss**：^3.4.19
- **zustand**：^5.0.12
- **@supabase/supabase-js**：^2.101.1

UI 组件基于 **Radix UI** 原语与 **shadcn/ui** 风格目录 `src/components/ui/`。包管理器以 **npm** 为准。

---

## 快速开始

### 前置条件

- **Node.js** >= 18.0.0  
- **Git**  
- **Supabase** 账号及空项目（若需云端同步）

### 安装与运行

```bash
git clone https://github.com/YOUR_ORG/qlapp.git
cd qlapp
npm install
```

在项目根目录创建 `**.env.local**`（勿提交版本库），内容见下一节。

```bash
npm run dev
```

默认开发服务器：`http://localhost:5173/`（以终端输出为准）。

生产构建与本地预览：

```bash
npm run build
npm run preview
```

构建输出目录：`**dist/**`（静态 SPA 资源）。

### 环境变量模板（`.env.local`）

```bash
# Supabase 项目 URL（Dashboard → Project Settings → API → Project URL）
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# 匿名（anon）公钥；仅用于配合 RLS 的前端访问，禁止提交 service_role
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

未设置上述变量时，应用仍可通过本地演示数据与 **localStorage** 运行，但无法写入云端 `journals` / `trip_history` / `user_settings`。

### Supabase 初始化检查清单

1. 在 **SQL Editor** 中执行 **`supabase/migrations/20260408120000_ql_qinglv_schema.sql`**（建表 + RLS；详细步骤见 **`supabase/IMPORT.md`**）。
2. 确认 **Table Editor** 的 `public` 下存在：`locations`、`trip_history`、`user_settings`、`journals`。
3. **Authentication → Providers** 启用 **Anonymous**（匿名登录），以便前端以 `auth.uid()` 写入私有表。
4. 确认各表 **RLS** 已启用（迁移脚本默认开启）。
5. 在浏览器中完成一次手账/行程相关写入后，检查 **`journals`** 或 **`trip_history`** 是否出现新行以验证策略与密钥。

---

## 数据库设计

### 文字版实体关系（ER）

- `**auth.users`（Supabase Auth）**：身份根实体。  
- `**trip_history`**：多行历史记录，每行通过 `**user_id` → `auth.users.id`** 外键关联，`ON DELETE CASCADE`。  
- `**user_settings**`：每用户至多一行，`**user_id**` 为主键且外键引用 `**auth.users**`。  
- `**locations**`：POI 内容表，**不**被 `trip_history` / `user_settings` / `journals` 以外键引用；应用层将方案中的地点与 `locations.id` 对应。业务上可理解为「内容目录」与「用户私有数据」两个域。
- `**journals**`：手账；`user_id` → `auth.users.id`，`pages` 为 JSONB，与前端 `Journal` 类型一致。

### 表：`locations`


| 字段                  | 类型               | NULL | 默认值     | 说明     |
| ------------------- | ---------------- | ---- | ------- | ------ |
| `id`                | text             | NO   | —       | 主键     |
| `city`              | text             | NO   | `'上海'`  | 城市过滤   |
| `name`              | text             | NO   | —       | 名称     |
| `description`       | text             | NO   | `''`    | 描述     |
| `category`          | text[]           | NO   | —       | 标签     |
| `budget`            | text             | NO   | —       | 预算档    |
| `duration`          | text[]           | NO   | —       | 适用时长   |
| `group_size`        | text[]           | NO   | —       | 适用人数   |
| `pet_friendly`      | boolean          | NO   | `false` | 宠物友好   |
| `address`           | text             | YES  | —       | 地址     |
| `metro_station`     | text             | YES  | —       | 地铁站    |
| `metro_line`        | text             | YES  | —       | 线路     |
| `bus_routes`        | text[]           | YES  | —       | 公交     |
| `lat`               | double precision | NO   | —       | 纬度     |
| `lng`               | double precision | NO   | —       | 经度     |
| `opening_hours`     | text             | NO   | `''`    | 营业时间说明 |
| `ticket_price`      | text             | YES  | —       | 票价说明   |
| `hidden_gem`        | boolean          | NO   | `false` | 小众标记   |
| `sustainable_score` | int              | NO   | `8`     | 可持续相关分 |
| `crowd_level`       | text             | NO   | —       | 人流档位   |
| `best_time`         | text             | YES  | —       | 建议时段   |
| `tips`              | text[]           | NO   | `'{}'`  | 提示     |
| `nearby_food`       | text[]           | NO   | `'{}'`  | 周边餐饮   |
| `images`            | text[]           | NO   | `'{}'`  | 图片路径   |


**索引**：`locations_city_idx`（`city`）。

### 表：`trip_history`


| 字段          | 类型          | NULL | 默认值                 | 说明                |
| ----------- | ----------- | ---- | ------------------- | ----------------- |
| `id`        | uuid        | NO   | `gen_random_uuid()` | 主键                |
| `user_id`   | uuid        | NO   | —                   | FK → `auth.users` |
| `plan_id`   | text        | NO   | —                   | 前端方案 ID           |
| `title`     | text        | NO   | —                   | 标题                |
| `trip_date` | timestamptz | NO   | `now()`             | 记录时间              |
| `completed` | boolean     | YES  | —                   | 是否成行              |
| `rating`    | int         | YES  | —                   | 评分                |
| `feedback`  | text        | YES  | —                   | 文字反馈              |


**索引**：`trip_history_user_id_idx`（`user_id` DESC），`trip_history_trip_date_idx`（`trip_date` DESC）。

### 表：`user_settings`


| 字段               | 类型          | NULL | 默认值     | 说明                   |
| ---------------- | ----------- | ---- | ------- | -------------------- |
| `user_id`        | uuid        | NO   | —       | PK，FK → `auth.users` |
| `default_budget` | text        | YES  | —       | 默认预算                 |
| `favorite_areas` | text[]      | YES  | —       | 偏好区域                 |
| `disliked_types` | text[]      | YES  | —       | 不感兴趣类型               |
| `default_city`   | text        | YES  | —       | 默认城市                 |
| `updated_at`     | timestamptz | NO   | `now()` | 更新时间                 |


### RLS 策略摘要

> `**locations`**：`SELECT` 对角色 `anon`、`authenticated` 允许（`using (true)`），即 公开只读。**  
> `****trip_history`**：`SELECT` / `INSERT` / `UPDATE` / `DELETE` 均要求 `**auth.uid() = user_id`**，角色为 `**authenticated**`（含匿名用户会话）。  
> `**user_settings**`：`SELECT` / `INSERT` / `UPDATE` 要求 `**auth.uid() = user_id**`。

### 数据同步策略（客户端）

1. **localStorage**：**Zustand** `persist`（键名 `ai-travel-planner-storage`）在首屏之前恢复偏好、历史与设置的快照。
2. **Supabase**：在 `**persist` hydration（持久化恢复）完成** 后调用 `syncUserDataFromSupabase()`。
3. **权威顺序**：在远端查询成功的前提下，**以 Supabase 返回数据为准**：
  - `**trip_history`**：若远端数组长度大于 0，则 `**setTripHistory` 整体替换** 当前内存状态；随后由 persist 将新状态写回 **localStorage**（对历史列表形成单向覆盖）。  
  - `**user_settings`**：远端返回的非空字段通过 `**setUserSettings` 合并** 入 store；未出现在响应中的键保留本次 rehydrate 后的本地值（实现为部分字段覆盖）。
4. **离线降级**：无环境变量、匿名登录失败或网络错误时，仅依赖 **localStorage**；恢复在线后下一次同步仍以成功拉取的云端结果按上款规则覆盖。

> ⚠️ **Warning**：匿名账号与会话令牌绑定当前浏览器环境。清除站点数据、隐私模式、或更换设备后，**可能无法恢复同一匿名身份**，云端 `trip_history` / `user_settings` 在旧身份下将无法由新会话访问，造成**感知上的记录丢失**。生产环境若需强绑定用户，应引入邮箱 / **OAuth** 等正式登录与账号合并策略。

---

## 项目结构

```
.
├── dist/                          # 生产构建输出
├── LICENSE                        # MIT 许可证全文
├── scripts/
│   └── export-supabase-seed.ts    # 自 locations 数据生成 SQL 种子
├── supabase/migrations/          # 建表、索引、RLS、种子数据
├── src/
│   ├── App.tsx
│   ├── main.tsx                   # hydration 完成后触发远端同步
│   ├── components/ui/             # shadcn/ui 风格组件
│   ├── data/locations.ts          # 本地 POI 与模拟天气回退
│   ├── lib/                       # Supabase 客户端、匿名会话
│   ├── pages/                     # 页面级路由（由 store 切换）
│   ├── services/                  # `fetchLocations`、远端用户数据
│   ├── store/                     # Zustand 与 persist 配置
│   ├── types/                     # 领域类型
│   └── utils/aiRecommend.ts       # 规则推荐引擎
├── .env.example
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 部署指南

### 静态 SPA

```bash
npm run build
```

将 `**dist/**` 作为静态站点根目录；服务器需将所有未匹配路径回退至 `**index.html**`（SPA fallback）。

### Vercel

1. 导入 Git 仓库，Framework 选择 **Vite**。
2. **Build Command**：`npm run build`；**Output Directory**：`dist`。
3. 在 **Environment Variables** 配置 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`。

### Netlify

1. 构建命令 `**npm run build`**，发布目录 `**dist`**。
2. 配置同上环境变量。
3. 添加 SPA 重定向规则：`/*` → `/index.html`（HTTP 200）。

### Supabase 生产环境检查项

- 所有业务表 **RLS** 保持启用，并审计 `anon` / `authenticated` 策略。  
- **Anonymous** 提供者已开启且符合产品风险接受度。  
- 若前端与 API 跨域，确认 **CORS** 与 Supabase 项目允许的源一致（纯静态站托管通常不涉及自建 API CORS，但自定义 Edge Functions 时需单独配置）。

---

## 路线图

- **当前（MVP）**：前端规则引擎、上海 POI 种子与 Supabase `locations`、匿名登录、`trip_history` / `user_settings` 同步与导出图片。  
- **短期**：接入真实气象 API；扩展第二座城市 POI 与前端城市选择；通过 **Edge Functions** 接入 **LLM** 实现生成式推荐。  
- **长期**：正式 **OAuth** 登录、匿名与正式账号合并、社交分享与协作。

---

## 许可证与免责声明

- **许可证**：本项目以 **MIT License** 发布，见仓库根目录 [LICENSE](./LICENSE)。  
- **数据与版权**：示例 POI 与文案仅供演示；不保证实时性与准确性。媒体路径占位不隐含任何第三方授权；商用须自行取得许可。  
- **合规**：处理个人数据与认证信息时，须遵守适用司法辖区的隐私法律（如 GDPR、个人信息保护法）及 Supabase 服务条款，并向终端用户提供隐私政策与数据删除渠道。

