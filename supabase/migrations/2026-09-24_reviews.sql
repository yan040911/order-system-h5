-- v5 评价功能 - 数据库迁移
-- 在 Supabase SQL Editor 一次性运行即可

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  order_no text not null,
  items jsonb not null default '[]'::jsonb,  -- 冗余存储该订单当时点的菜品，避免订单被删后丢失
  dish_rating int not null check (dish_rating between 1 and 5),
  service_rating int not null check (service_rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 一个订单只能评一次
create unique index if not exists reviews_order_id_unique on public.reviews(order_id);

-- 用于按时间倒序查评价
create index if not exists reviews_created_at_idx on public.reviews(created_at desc);

-- 启用实时订阅（让主页左上角实时更新）
alter publication supabase_realtime add table public.reviews;

-- RLS：任何人可读（公开评价），任何人可写（家庭内部信任，免登录）
alter table public.reviews enable row level security;

drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (true);

drop policy if exists "reviews_public_insert" on public.reviews;
create policy "reviews_public_insert" on public.reviews
  for insert with check (true);

drop policy if exists "reviews_public_delete" on public.reviews;
create policy "reviews_public_delete" on public.reviews
  for delete using (true);

drop policy if exists "reviews_public_update" on public.reviews;
create policy "reviews_public_update" on public.reviews
  for update using (true);
