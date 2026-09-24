-- v5.1 评价功能 - 数据库迁移（半星精度 0.5 步进）
-- 在 Supabase SQL Editor 一次性运行即可；幂等，对已存在的表自动 ALTER 升级
--
-- 表若不存在 → 建表（含半星精度约束）
-- 表若已存在 → 列类型 int → numeric(2,1)，CHECK 约束改为支持 0.5 步进

do $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'reviews'
  ) then
    -- 全新建表（含半星精度）
    create table public.reviews (
      id uuid primary key default gen_random_uuid(),
      order_id uuid references public.orders(id) on delete cascade,
      order_no text not null,
      items jsonb not null default '[]'::jsonb,
      dish_rating numeric(2,1) not null
        check (dish_rating in (0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0)),
      service_rating numeric(2,1) not null
        check (service_rating in (0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0)),
      comment text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
    create unique index reviews_order_id_unique on public.reviews(order_id);
    create index reviews_created_at_idx on public.reviews(created_at desc);
  else
    -- 已存在表：升级到 numeric(2,1) 半星精度（兼容已有的 int 数据，会自动 ::numeric）
    alter table public.reviews
      alter column dish_rating type numeric(2,1) using dish_rating::numeric(2,1),
      alter column service_rating type numeric(2,1) using service_rating::numeric(2,1);
    alter table public.reviews drop constraint if exists reviews_dish_rating_check;
    alter table public.reviews drop constraint if exists reviews_service_rating_check;
    alter table public.reviews add constraint reviews_dish_rating_check
      check (dish_rating in (0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0));
    alter table public.reviews add constraint reviews_service_rating_check
      check (service_rating in (0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0));
  end if;
end $$;

-- RLS（无论新建还是升级都确保）
alter table public.reviews enable row level security;

drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews for select using (true);

drop policy if exists "reviews_public_insert" on public.reviews;
create policy "reviews_public_insert" on public.reviews for insert with check (true);

drop policy if exists "reviews_public_delete" on public.reviews;
create policy "reviews_public_delete" on public.reviews for delete using (true);

drop policy if exists "reviews_public_update" on public.reviews;
create policy "reviews_public_update" on public.reviews for update using (true);

-- 实时订阅（如未添加）
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'reviews'
  ) then
    alter publication supabase_realtime add table public.reviews;
  end if;
end $$;