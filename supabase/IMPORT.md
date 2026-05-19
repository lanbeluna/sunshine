# QL轻旅 — Supabase 如何导入

本文说明如何把 **`migrations/20260408120000_ql_qinglv_schema.sql`** 导入到你的 Supabase 项目（网页控制台即可，无需安装 CLI）。

---

## 一、新建或打开项目

1. 打开 [https://supabase.com/dashboard](https://supabase.com/dashboard) 并登录。  
2. **New project**（或打开已有空项目），记下：  
   - **Project URL**（形如 `https://xxxx.supabase.co`）  
   - **anon public** key（`Project Settings` → `API`）

---

## 二、开启匿名登录（与前端手账同步一致）

1. 左侧 **Authentication** → **Providers**。  
2. 找到 **Anonymous**，打开 **Enable**。  
3. 保存。

前端使用匿名用户后，`journals` / `trip_history` / `user_settings` 的 RLS 才能以 `auth.uid()` 写入。

---

## 三、在 SQL Editor 执行迁移脚本

Supabase 新版界面里**不一定有「New query」字样**，新建查询用下面任一方式即可：

1. 进入左侧 **SQL Editor**。  
2. **新建空白查询**：  
   - 在左侧「Search queries…」输入框**右侧**有一个 **「+」** 小方按钮，点它；或  
   - 在**上方已打开的标签页右侧**还有一个 **「+」**，点它也会新开一页。  
3. 在本仓库打开文件：  
   `supabase/migrations/20260408120000_ql_qinglv_schema.sql`  
4. **全选复制** SQL 内容，粘贴到中间编辑区（也可以先清空当前标签里旧内容再粘贴）。  
5. 点击右下角绿色 **Run**（或 **`Ctrl + Enter`**）。  
6. 成功时底部 **Results** 区域应显示 **Success**，无红色报错。

> **说明**：脚本使用 `CREATE TABLE IF NOT EXISTS` 与 `DROP POLICY IF EXISTS`，在**已有同名表**的项目上再次执行一般可重复执行；若你曾手动改过表结构，请先对照 `Table Editor` 或备份后再执行。

---

## 四、导入后自检

1. 左侧 **Table Editor**，`schema` 选 **public**，应能看到：  
   - `locations`  
   - `trip_history`  
   - `user_settings`  
   - `journals`  
2. 点开 **`journals`** → **Definition**，确认列包含：`id`, `user_id`, `title`, `pages` (jsonb), `cover_image`, `created_at`, `updated_at`。  
3. **Authentication** → **Policies**（或在每张表详情里）确认 **RLS** 策略已存在。

---

## 五、接回前端（本地 `.env.local`）

在项目根目录创建或编辑 **`.env.local`**：

```bash
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon公钥
```

保存后执行 `npm run dev`，在应用里触发一次手账同步，再到 **Table Editor → journals** 看是否出现新行。

---

## 六、可选：用 Supabase CLI（进阶）

若已安装 [Supabase CLI](https://supabase.com/docs/guides/cli) 并 `supabase link` 到该项目：

```bash
supabase db push
```

会把 `supabase/migrations/` 下尚未应用的迁移推送到远端（与在网页执行 SQL 等价，由迁移历史管理）。

---

## 七、`locations` 没有数据？

本迁移**只建表与策略**，不包含 POI 种子。应用在未配置 Supabase 时会用本地 `src/data/destinations.ts` 等数据；若要在云端 `locations` 里看到数据，可自行在 **Table Editor** 插入行，或使用你们自己的种子 SQL / `npm run db:gen-seed`（若仓库脚本仍可用）生成 `INSERT`。
