-- ============================================================
-- 小鱼家的点餐系统 (H5) — Supabase 数据库结构
-- 用法：Supabase 后台 → SQL Editor → 全选本文件 → Run
-- 执行一次即可（已做幂等处理，重复执行安全）
-- ============================================================

-- 1. 分类表
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  icon        text        default '🍽️',
  sort        int         default 0,
  created_at  timestamptz default now()
);

-- 2. 菜品表
create table if not exists dishes (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name        text        not null,
  description text        default '',
  price       numeric     default 0,
  tags        text[]      default '{}',
  image_url   text        default '',
  status      text        default 'on' check (status in ('on','off')),
  sort        int         default 0,
  created_at  timestamptz default now()
);

-- 3. 订单表
create table if not exists orders (
  id          uuid primary key default gen_random_uuid(),
  order_no    text        not null,
  items       jsonb       not null default '[]',
  status      text        default 'pending' check (status in ('pending','preparing','done','cancelled')),
  table_no    text        default '',
  note        text        default '',
  total       numeric     default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists idx_dishes_category on dishes(category_id);
create index if not exists idx_orders_created  on orders(created_at desc);
create index if not exists idx_orders_no       on orders(order_no);

-- ============================================================
-- 4. 行级安全（RLS）
-- 家庭自用场景：开启 RLS 后允许匿名（anon）完全访问。
--   优点：前端用公开的 anon key 即可读写，无需自建后端。
--   风险：anon key 本就公开，任何拿到的人都能读写本库。
--   如需收紧：在 Supabase 控制台把策略改为「仅登录用户」或加更细条件。
-- ============================================================
alter table categories enable row level security;
alter table dishes      enable row level security;
alter table orders      enable row level security;

drop policy if exists "categories_anon_all" on categories;
create policy "categories_anon_all" on categories for all to anon using (true) with check (true);

drop policy if exists "dishes_anon_all" on dishes;
create policy "dishes_anon_all" on dishes for all to anon using (true) with check (true);

drop policy if exists "orders_anon_all" on orders;
create policy "orders_anon_all" on orders for all to anon using (true) with check (true);

-- ============================================================
-- 5. 开启 Realtime（订单实时推送，看板免轮询）
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table orders;
  end if;
end $$;

-- ============================================================
-- 6. 初始化示例数据（首次使用，可跳过）
--    想从空白菜单开始，直接删掉这一节即可
-- ============================================================
insert into categories (name, icon, sort)
select '热菜', '🍲', 1
where not exists (select 1 from categories);

insert into dishes (category_id, name, description, price, tags, status, sort)
select c.id, '宫保鸡丁', '经典川菜，花生配鸡丁', 38, array['招牌','微辣'], 'on', 1
from categories c
where c.name = '热菜'
  and not exists (select 1 from dishes where name = '宫保鸡丁');

-- 说明：菜品图标统一用 emoji 存储，直接写入 dishes 表的 image_url 列（文本字段），
--       不再使用真实图片地址。管理端「Emoji 图标」输入框即对应此列。
