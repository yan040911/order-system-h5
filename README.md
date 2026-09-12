# 小鱼家的点餐系统 · H5 网页版

与微信小程序同款功能的 **H5 网页应用**：顾客点餐（**不显示价格**）+ 管理端**实时订单看板**，后端使用 **Supabase（PostgreSQL + Realtime）**，完全免费、无需服务器、无需备案。

> 本工程与小程序版本（`~/WeChatProjects/小鱼家的点餐系统`）相互独立，互不影响。

## 功能
- **顾客端**：分类切换、菜品卡片（无价格）、加入购物车、填桌号/备注下单、我的订单状态查询
- **管理端**：密码登录、实时订单看板（下单即推送，免轮询）、订单状态流转（待制作→制作中→已完成/取消）、菜品增删改 + 上下架、分类管理
- **数据全在云端**：订单/菜品/分类存 Supabase，换设备/刷新不丢；顾客端不显示价格，价格仅管理端可见

## 一、本地运行（开发）
```bash
# 1. 安装依赖
npm install

# 2. 配置 Supabase（复制模板后填入你的真实值）
cp .env.example .env.local
#   编辑 .env.local：
#   VITE_SUPABASE_URL=https://xxxx.supabase.co
#   VITE_SUPABASE_ANON_KEY=你的 anon public key
#   VITE_ADMIN_PWD=xiaoyu2026   # 可选，管理端密码

# 3. 在 Supabase 后台 SQL Editor 执行 supabase/schema.sql（建表 + RLS + Realtime + 示例数据）

# 4. 启动
npm run dev
# 浏览器打开 http://localhost:5173
```

## 二、部署（免费，推荐 GitHub Pages）

### 方案 A：GitHub Actions 自动部署（推荐，push 即上线）
工程已内置 `.github/workflows/deploy.yml`，push 到 GitHub 后会**自动构建并发布**，你以后改完代码只需再 push 一次。

**① 在 GitHub 新建一个空仓库**（不要勾选 README/.gitignore，保持空）。
**② 在本机终端把代码推上去**（仓库地址换成你自己的）：
```bash
cd ~/Desktop/小鱼家的点餐系统-H5
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```
**③ 配置仓库 Secrets**（构建时需要，路径：仓库 Settings → Secrets and variables → Actions → New repository secret）：
| Name | Secret 值 |
|---|---|
| `VITE_SUPABASE_URL` | `https://utbxzruvoqyjfytinkgl.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_LVtugK0q_In4KwYQURC_rg_ecExQpTO` |
| `VITE_ADMIN_PWD` | `xiaoyu2026` |

**④ 开启 Pages**：仓库 Settings → Pages → Source 选 **GitHub Actions**。
**⑤ 等 1~2 分钟**，Actions 跑完即可在 `https://你的用户名.github.io/你的仓库名/` 打开。

> 因为是普通网页（非小程序），**不需要 ICP 备案、不需要微信审核**。

### 方案 B：手动构建后上传（无需 git）
```bash
npm install
npm run build          # 产物在 dist/，资源用相对路径，可直接托管
```
把 `dist/` 文件夹拖到 Netlify Drop（app.netlify.com/drop）或上传到任意静态托管即可。
> 注意：手动方案需要在 `.env.local` 里先填好 Supabase 配置再 build，否则页面读不到后端。

## 三、Supabase 配置要点
- 建表/权限/Realtime 都在 `supabase/schema.sql` 里，一条 SQL 跑完即可。
- RLS 策略默认允许匿名（anon）完全访问——家庭自用足够；若想收紧，到 Supabase 控制台改 policies。
- 管理端密码：默认 `xiaoyu2026`，可在 `.env.local` 的 `VITE_ADMIN_PWD` 覆盖（注意：前端可见，仅作简单门禁，非高安全）。

## 四、目录结构
```
小鱼家的点餐系统-H5/
├── index.html / vite.config.ts / tailwind.config.js
├── .env.example            # 复制为 .env.local 后填值
├── supabase/schema.sql     # 数据库结构（一次性执行）
└── src/
    ├── lib/supabase.ts     # Supabase 客户端 + 配置探测
    ├── lib/myOrders.ts     # 本机订单号记录（我的订单页用）
    ├── types.ts
    ├── context/CartContext.tsx
    ├── components/         # Header/BottomNav/DishCard/CartBar/OrderCard/CheckoutSheet/...
    ├── pages/              # CustomerMenu / MyOrders
    └── pages/admin/        # Login / Dashboard / Dishes / Categories
```

## 五、与你小程序版本的区别
| | 小程序版 | 本 H5 版 |
|---|---|---|
| 入口 | 微信扫码/体验版 | 浏览器链接 / 主屏幕图标 |
| 后端 | 微信云开发 | Supabase（PostgreSQL + Realtime） |
| 实时看板 | 2.5s 轮询 | **Realtime 真推送** |
| 备案/审核 | 体验版免，正式发布需 | **完全不需要** |
| 数据库 | 文档型 | **关系型 SQL** |
