-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Transactions table
create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('income', 'expense')),
  amount numeric(12,2) not null check (amount > 0),
  category_id text not null,
  date date not null,
  note text,
  created_at timestamptz default now()
);

-- Budget limits table (for Phase 2)
create table if not exists public.budget_limits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id text not null,
  month text not null, -- format: YYYY-MM
  amount numeric(12,2) not null check (amount > 0),
  unique(user_id, category_id, month)
);

-- Savings goals table (for Phase 2)
create table if not exists public.savings_goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  target_amount numeric(12,2) not null check (target_amount > 0),
  current_amount numeric(12,2) not null default 0,
  target_date date,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.transactions enable row level security;
alter table public.budget_limits enable row level security;
alter table public.savings_goals enable row level security;

-- RLS Policies: users can only access their own data
create policy "Users can manage own transactions"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own budget limits"
  on public.budget_limits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own savings goals"
  on public.savings_goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
