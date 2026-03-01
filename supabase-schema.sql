-- ================================================
-- Meus Gastos - Supabase Database Schema
-- Execute this SQL in the Supabase SQL Editor
-- ================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ================================================
-- Categories table
-- ================================================
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#6366f1',
  icon text,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Users manage own categories"
  on public.categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index idx_categories_user on public.categories(user_id);

-- ================================================
-- Expenses table
-- ================================================
create table public.expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  amount numeric(12,2) not null check (amount > 0),
  description text not null,
  notes text,
  date date not null default current_date,
  is_recurring boolean not null default false,
  recurring_interval text check (recurring_interval in ('daily','weekly','monthly','yearly')),
  recurring_next_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

create policy "Users manage own expenses"
  on public.expenses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index idx_expenses_user_date on public.expenses(user_id, date desc);
create index idx_expenses_category on public.expenses(category_id);

-- ================================================
-- Push subscriptions table
-- ================================================
create table public.push_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  keys_p256dh text not null,
  keys_auth text not null,
  created_at timestamptz not null default now(),
  unique(user_id, endpoint)
);

alter table public.push_subscriptions enable row level security;

create policy "Users manage own push subscriptions"
  on public.push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ================================================
-- Auto-create default categories for new users
-- ================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.categories (user_id, name, color, icon) values
    (new.id, 'Alimentação', '#ef4444', 'utensils'),
    (new.id, 'Transporte', '#3b82f6', 'car'),
    (new.id, 'Moradia', '#8b5cf6', 'home'),
    (new.id, 'Saúde', '#10b981', 'heart-pulse'),
    (new.id, 'Lazer', '#f59e0b', 'gamepad-2'),
    (new.id, 'Educação', '#06b6d4', 'graduation-cap'),
    (new.id, 'Outros', '#6b7280', 'ellipsis');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
