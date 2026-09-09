-- BaleBook core schema. All per-user rows carry user_id text.

create table if not exists businesses (
  id          text primary key,
  user_id     text not null unique,
  name        text not null default 'My Shop',
  owner_name  text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists shops (
  id          text primary key,
  user_id     text not null,
  name        text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists shops_user_id_idx on shops (user_id);

create table if not exists bales (
  id              text primary key,
  user_id         text not null,
  shop_id         text not null,
  name            text not null,
  purchased_at    date not null,
  purchase_price  numeric not null,
  pieces          int not null,
  notes           text not null default '',
  photo           text,
  created_at      timestamptz not null default now()
);
create index if not exists bales_user_id_idx on bales (user_id);

create table if not exists clothes (
  id              text primary key,
  user_id         text not null,
  bale_id         text,
  shop_id         text not null,
  category        text not null,
  description     text not null,
  size            text not null default '',
  color           text not null default '',
  selling_price   numeric not null,
  cost            numeric not null default 0,
  status          text not null default 'available',
  photo           text,
  created_at      timestamptz not null default now(),
  sold_at         date
);
create index if not exists clothes_user_id_idx on clothes (user_id);
create index if not exists clothes_status_idx on clothes (user_id, shop_id, status);

create table if not exists customers (
  id          text primary key,
  user_id     text not null,
  name        text not null,
  phone       text not null default '',
  notes       text not null default '',
  created_at  timestamptz not null default now()
);
create index if not exists customers_user_id_idx on customers (user_id);

create table if not exists sales (
  id              text primary key,
  user_id         text not null,
  customer_id     text not null,
  shop_id         text not null,
  clothing_id     text not null,
  selling_price   numeric not null,
  sold_at         date not null,
  notes           text not null default '',
  created_at      timestamptz not null default now()
);
create index if not exists sales_user_id_idx on sales (user_id);
create index if not exists sales_sold_at_idx on sales (user_id, sold_at);

create table if not exists payments (
  id           text primary key,
  user_id      text not null,
  customer_id  text not null,
  sale_id      text,
  amount       numeric not null,
  paid_at      date not null,
  notes        text not null default '',
  created_at   timestamptz not null default now()
);
create index if not exists payments_user_id_idx on payments (user_id);
create index if not exists payments_customer_idx on payments (user_id, customer_id);

create table if not exists expenses (
  id          text primary key,
  user_id     text not null,
  shop_id     text,
  category    text not null,
  amount      numeric not null,
  spent_at    date not null,
  notes       text not null default '',
  created_at  timestamptz not null default now()
);
create index if not exists expenses_user_id_idx on expenses (user_id);
