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

-- ================================================
-- Incomes table
-- Run this migration in the Supabase SQL Editor
-- ================================================
create table public.incomes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(15,2) not null check (amount > 0),
  description text not null,
  notes text,
  date date not null default current_date,
  source text,
  is_recurring boolean not null default false,
  recurring_interval text check (recurring_interval in ('daily','weekly','monthly','yearly')),
  recurring_next_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.incomes enable row level security;

create policy "Users manage own incomes"
  on public.incomes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index idx_incomes_user_date on public.incomes(user_id, date desc);

-- ================================================
-- Bills (contas mensais) tables
-- Run this migration in the Supabase SQL Editor
-- ================================================
create table public.bills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(15,2) not null check (amount > 0),
  due_day int not null check (due_day between 1 and 31),
  category_id uuid references public.categories(id) on delete set null,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.bills enable row level security;

create policy "Users manage own bills"
  on public.bills for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index idx_bills_user on public.bills(user_id);

create table public.bill_payments (
  id uuid primary key default uuid_generate_v4(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  year int not null,
  month int not null check (month between 1 and 12),
  paid boolean not null default false,
  paid_at timestamptz,
  amount_paid numeric(15,2),
  unique(bill_id, year, month)
);

alter table public.bill_payments enable row level security;

create policy "Users manage own bill payments"
  on public.bill_payments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index idx_bill_payments_user_month on public.bill_payments(user_id, year, month);
