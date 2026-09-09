import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type {
  Customer,
  ExpenseRow,
  PaymentRow,
  ReportData,
  ReportPeriod,
  SaleRow,
  ShopStats,
} from "@/lib/types";
import { isoOffset, nid, num, todayIso } from "@/lib/utils";
import { ensureWorkspace } from "./workspace";

type CustomerRow = {
  id: string;
  name: string;
  phone: string;
  notes: string;
  purchases: unknown;
  paid: unknown;
};

function mapCustomer(r: CustomerRow): Customer {
  const purchases = num(r.purchases);
  const paid = num(r.paid);
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    notes: r.notes,
    purchases,
    paid,
    outstanding: Math.max(0, purchases - paid),
  };
}

export const listCustomers = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ owingOnly: z.boolean().optional() }))
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const rows = await sql<CustomerRow>`
      select c.id, c.name, c.phone, c.notes,
        coalesce((select sum(selling_price) from sales where customer_id = c.id and user_id = c.user_id), 0) as purchases,
        coalesce((select sum(amount) from payments where customer_id = c.id and user_id = c.user_id), 0) as paid
      from customers c
      where c.user_id = ${context.userId}
      order by c.name
    `;
    const list = rows.map(mapCustomer);
    return data.owingOnly ? list.filter((c) => c.outstanding > 0) : list;
  });

export const getCustomer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const rows = await sql<CustomerRow>`
      select c.id, c.name, c.phone, c.notes,
        coalesce((select sum(selling_price) from sales where customer_id = c.id and user_id = c.user_id), 0) as purchases,
        coalesce((select sum(amount) from payments where customer_id = c.id and user_id = c.user_id), 0) as paid
      from customers c
      where c.user_id = ${context.userId} and c.id = ${data.id}
      limit 1
    `;
    if (!rows[0]) return null;
    const customer = mapCustomer(rows[0]);
    const sales = await sql<{
      id: string;
      customer_id: string;
      customer_name: string;
      shop_id: string;
      shop_name: string;
      clothing_id: string;
      item: string;
      photo: string | null;
      selling_price: unknown;
      sold_at: string;
      notes: string;
    }>`
      select s.id, s.customer_id, ${customer.name} as customer_name, s.shop_id, sh.name as shop_name,
        s.clothing_id, cl.description as item, cl.photo, s.selling_price, s.sold_at, s.notes
      from sales s
      join shops sh on sh.id = s.shop_id
      join clothes cl on cl.id = s.clothing_id
      where s.user_id = ${context.userId} and s.customer_id = ${data.id}
      order by s.sold_at desc, s.created_at desc
    `;
    const payments = await sql<{
      id: string;
      customer_id: string;
      amount: unknown;
      paid_at: string;
      notes: string;
    }>`
      select id, customer_id, amount, paid_at, notes
      from payments
      where user_id = ${context.userId} and customer_id = ${data.id}
      order by paid_at desc, created_at desc
    `;
    return {
      customer,
      sales: sales.map(
        (r): SaleRow => ({
          id: r.id,
          customerId: r.customer_id,
          customerName: r.customer_name,
          shopId: r.shop_id,
          shopName: r.shop_name,
          clothingId: r.clothing_id,
          item: r.item,
          photo: r.photo,
          sellingPrice: num(r.selling_price),
          soldAt: r.sold_at,
          notes: r.notes,
        }),
      ),
      payments: payments.map(
        (r): PaymentRow => ({
          id: r.id,
          customerId: r.customer_id,
          amount: num(r.amount),
          paidAt: r.paid_at,
          notes: r.notes,
        }),
      ),
    };
  });

export const upsertCustomer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().nullable(),
      name: z.string().min(1),
      phone: z.string(),
      notes: z.string(),
    }),
  )
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    if (data.id) {
      await sql`
        update customers set name = ${data.name.trim()}, phone = ${data.phone.trim()}, notes = ${data.notes.trim()}
        where id = ${data.id} and user_id = ${context.userId}
      `;
      return { id: data.id };
    }
    const id = nid();
    await sql`
      insert into customers (id, user_id, name, phone, notes)
      values (${id}, ${context.userId}, ${data.name.trim()}, ${data.phone.trim()}, ${data.notes.trim()})
    `;
    return { id };
  });

export const recordSale = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      clothingId: z.string(),
      customerId: z.string().nullable(),
      newCustomerName: z.string().nullable(),
      sellingPrice: z.number().nonnegative(),
      paid: z.number().nonnegative(),
      soldAt: z.string(),
      notes: z.string(),
    }),
  )
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const item = await sql<{ id: string; shop_id: string; status: string }>`
      select id, shop_id, status from clothes
      where id = ${data.clothingId} and user_id = ${context.userId}
    `;
    if (!item[0]) throw new Error("Cloth not found");
    if (item[0].status !== "available") throw new Error("This cloth is already sold");

    let customerId = data.customerId;
    if (!customerId) {
      const name = (data.newCustomerName ?? "").trim();
      if (!name) throw new Error("Choose a customer or type a name");
      customerId = nid();
      await sql`
        insert into customers (id, user_id, name) values (${customerId}, ${context.userId}, ${name})
      `;
    } else {
      const owned = await sql<{ id: string }>`
        select id from customers where id = ${customerId} and user_id = ${context.userId}
      `;
      if (!owned[0]) throw new Error("Customer not found");
    }

    const saleId = nid();
    await sql`
      insert into sales (id, user_id, customer_id, shop_id, clothing_id, selling_price, sold_at, notes)
      values (
        ${saleId}, ${context.userId}, ${customerId}, ${item[0].shop_id},
        ${data.clothingId}, ${data.sellingPrice}, ${data.soldAt}, ${data.notes.trim()}
      )
    `;
    await sql`
      update clothes set status = 'sold', sold_at = ${data.soldAt}, selling_price = ${data.sellingPrice}
      where id = ${data.clothingId} and user_id = ${context.userId}
    `;
    if (data.paid > 0) {
      await sql`
        insert into payments (id, user_id, customer_id, sale_id, amount, paid_at, notes)
        values (
          ${nid()}, ${context.userId}, ${customerId}, ${saleId}, ${data.paid},
          ${data.soldAt}, ${"Paid at sale"}
        )
      `;
    }
    return { id: saleId, customerId, outstanding: Math.max(0, data.sellingPrice - data.paid) };
  });

export const recordPayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      customerId: z.string(),
      amount: z.number().positive(),
      paidAt: z.string(),
      notes: z.string(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql<{ id: string }>`
      select id from customers where id = ${data.customerId} and user_id = ${context.userId}
    `;
    if (!owned[0]) throw new Error("Customer not found");
    await sql`
      insert into payments (id, user_id, customer_id, amount, paid_at, notes)
      values (
        ${nid()}, ${context.userId}, ${data.customerId}, ${data.amount},
        ${data.paidAt}, ${data.notes.trim()}
      )
    `;
    return { ok: true };
  });

export const listExpenses = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ shopId: z.string().nullable() }))
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    const rows = data.shopId
      ? await sql<{
          id: string;
          shop_id: string | null;
          shop_name: string | null;
          category: string;
          amount: unknown;
          spent_at: string;
          notes: string;
        }>`
          select e.id, e.shop_id, sh.name as shop_name, e.category, e.amount, e.spent_at, e.notes
          from expenses e left join shops sh on sh.id = e.shop_id
          where e.user_id = ${context.userId} and e.shop_id = ${data.shopId}
          order by e.spent_at desc, e.created_at desc
        `
      : await sql<{
          id: string;
          shop_id: string | null;
          shop_name: string | null;
          category: string;
          amount: unknown;
          spent_at: string;
          notes: string;
        }>`
          select e.id, e.shop_id, sh.name as shop_name, e.category, e.amount, e.spent_at, e.notes
          from expenses e left join shops sh on sh.id = e.shop_id
          where e.user_id = ${context.userId}
          order by e.spent_at desc, e.created_at desc
        `;
    return rows.map(
      (r): ExpenseRow => ({
        id: r.id,
        shopId: r.shop_id,
        shopName: r.shop_name,
        category: r.category,
        amount: num(r.amount),
        spentAt: r.spent_at,
        notes: r.notes,
      }),
    );
  });

export const createExpense = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      shopId: z.string().nullable(),
      category: z.string(),
      amount: z.number().positive(),
      spentAt: z.string(),
      notes: z.string(),
    }),
  )
  .handler(async ({ context, data }) => {
    await ensureWorkspace(context.userId);
    const sql = await getSql();
    if (data.shopId) {
      const owned = await sql<{ id: string }>`
        select id from shops where id = ${data.shopId} and user_id = ${context.userId}
      `;
      if (!owned[0]) throw new Error("Shop not found");
    }
    const id = nid();
    await sql`
      insert into expenses (id, user_id, shop_id, category, amount, spent_at, notes)
      values (
        ${id}, ${context.userId}, ${data.shopId}, ${data.category},
        ${data.amount}, ${data.spentAt}, ${data.notes.trim()}
      )
    `;
    return { id };
  });

export const deleteExpense = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`delete from expenses where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true };
  });

export const getShops = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const ws = await ensureWorkspace(context.userId);
    return ws;
  });

export const updateBusiness = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      businessName: z.string().min(1),
      shops: z.array(z.object({ id: z.string(), name: z.string().min(1) })),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update businesses set name = ${data.businessName.trim()}
      where user_id = ${context.userId}
    `;
    for (const shop of data.shops) {
      await sql`
        update shops set name = ${shop.name.trim()}
        where id = ${shop.id} and user_id = ${context.userId}
      `;
    }
    return { ok: true };
  });

export const getReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      period: z.enum(["daily", "weekly", "monthly"]),
      shopId: z.string().nullable(),
    }),
  )
  .handler(async ({ context, data }): Promise<ReportData> => {
    const { shops } = await ensureWorkspace(context.userId);
    const sql = await getSql();
    const to = todayIso();
    const from =
      data.period === "daily" ? to : data.period === "weekly" ? isoOffset(-6) : monthStart();

    const sales = data.shopId
      ? await sql<{ n: unknown; items: number }>`
          select coalesce(sum(selling_price), 0) as n, count(*)::int as items
          from sales where user_id = ${context.userId} and sold_at >= ${from} and sold_at <= ${to}
            and shop_id = ${data.shopId}
        `
      : await sql<{ n: unknown; items: number }>`
          select coalesce(sum(selling_price), 0) as n, count(*)::int as items
          from sales where user_id = ${context.userId} and sold_at >= ${from} and sold_at <= ${to}
        `;
    const collected = data.shopId
      ? await sql<{ n: unknown }>`
          select coalesce(sum(p.amount), 0) as n from payments p
          left join sales s on s.id = p.sale_id
          where p.user_id = ${context.userId} and p.paid_at >= ${from} and p.paid_at <= ${to}
            and (${data.shopId}::text is null or s.shop_id = ${data.shopId} or p.sale_id is null)
        `
      : await sql<{ n: unknown }>`
          select coalesce(sum(amount), 0) as n from payments
          where user_id = ${context.userId} and paid_at >= ${from} and paid_at <= ${to}
        `;
    const expenses = data.shopId
      ? await sql<{ n: unknown }>`
          select coalesce(sum(amount), 0) as n from expenses
          where user_id = ${context.userId} and spent_at >= ${from} and spent_at <= ${to}
            and shop_id = ${data.shopId}
        `
      : await sql<{ n: unknown }>`
          select coalesce(sum(amount), 0) as n from expenses
          where user_id = ${context.userId} and spent_at >= ${from} and spent_at <= ${to}
        `;
    const cogs = data.shopId
      ? await sql<{ n: unknown }>`
          select coalesce(sum(c.cost), 0) as n from sales s
          join clothes c on c.id = s.clothing_id
          where s.user_id = ${context.userId} and s.sold_at >= ${from} and s.sold_at <= ${to}
            and s.shop_id = ${data.shopId}
        `
      : await sql<{ n: unknown }>`
          select coalesce(sum(c.cost), 0) as n from sales s
          join clothes c on c.id = s.clothing_id
          where s.user_id = ${context.userId} and s.sold_at >= ${from} and s.sold_at <= ${to}
        `;

    const cats = data.shopId
      ? await sql<{ category: string; count: number; sales: unknown }>`
          select cl.category, count(*)::int as count, coalesce(sum(s.selling_price), 0) as sales
          from sales s join clothes cl on cl.id = s.clothing_id
          where s.user_id = ${context.userId} and s.sold_at >= ${from} and s.sold_at <= ${to}
            and s.shop_id = ${data.shopId}
          group by cl.category
          order by count desc, sales desc
        `
      : await sql<{ category: string; count: number; sales: unknown }>`
          select cl.category, count(*)::int as count, coalesce(sum(s.selling_price), 0) as sales
          from sales s join clothes cl on cl.id = s.clothing_id
          where s.user_id = ${context.userId} and s.sold_at >= ${from} and s.sold_at <= ${to}
          group by cl.category
          order by count desc, sales desc
        `;

    const byDaySales = data.shopId
      ? await sql<{ day: string; n: unknown }>`
          select sold_at::text as day, coalesce(sum(selling_price), 0) as n
          from sales
          where user_id = ${context.userId} and sold_at >= ${from} and sold_at <= ${to}
            and shop_id = ${data.shopId}
          group by sold_at order by sold_at
        `
      : await sql<{ day: string; n: unknown }>`
          select sold_at::text as day, coalesce(sum(selling_price), 0) as n
          from sales
          where user_id = ${context.userId} and sold_at >= ${from} and sold_at <= ${to}
          group by sold_at order by sold_at
        `;
    const byDayExp = data.shopId
      ? await sql<{ day: string; n: unknown }>`
          select spent_at::text as day, coalesce(sum(amount), 0) as n
          from expenses
          where user_id = ${context.userId} and spent_at >= ${from} and spent_at <= ${to}
            and shop_id = ${data.shopId}
          group by spent_at order by spent_at
        `
      : await sql<{ day: string; n: unknown }>`
          select spent_at::text as day, coalesce(sum(amount), 0) as n
          from expenses
          where user_id = ${context.userId} and spent_at >= ${from} and spent_at <= ${to}
          group by spent_at order by spent_at
        `;

    const dayMap = new Map<string, { sales: number; expenses: number }>();
    for (const r of byDaySales) {
      dayMap.set(r.day, { sales: num(r.n), expenses: 0 });
    }
    for (const r of byDayExp) {
      const cur = dayMap.get(r.day) ?? { sales: 0, expenses: 0 };
      cur.expenses = num(r.n);
      dayMap.set(r.day, cur);
    }

    const shopStats: ShopStats[] = [];
    for (const shop of shops) {
      const sSales = await sql<{ n: unknown }>`
        select coalesce(sum(selling_price), 0) as n from sales
        where user_id = ${context.userId} and shop_id = ${shop.id}
          and sold_at >= ${from} and sold_at <= ${to}
      `;
      const sExp = await sql<{ n: unknown }>`
        select coalesce(sum(amount), 0) as n from expenses
        where user_id = ${context.userId} and shop_id = ${shop.id}
          and spent_at >= ${from} and spent_at <= ${to}
      `;
      const sCogs = await sql<{ n: unknown }>`
        select coalesce(sum(c.cost), 0) as n from sales s
        join clothes c on c.id = s.clothing_id
        where s.user_id = ${context.userId} and s.shop_id = ${shop.id}
          and s.sold_at >= ${from} and s.sold_at <= ${to}
      `;
      const salesN = num(sSales[0]?.n);
      const expN = num(sExp[0]?.n);
      shopStats.push({
        id: shop.id,
        name: shop.name,
        sales: salesN,
        expenses: expN,
        profit: salesN - num(sCogs[0]?.n) - expN,
      });
    }

    const outstandingRows = await sql<{ purchases: unknown; paid: unknown }>`
      select
        coalesce((select sum(selling_price) from sales where user_id = ${context.userId}), 0) as purchases,
        coalesce((select sum(amount) from payments where user_id = ${context.userId}), 0) as paid
    `;

    const salesN = num(sales[0]?.n);
    const expN = num(expenses[0]?.n);
    const cogsN = num(cogs[0]?.n);

    return {
      period: data.period as ReportPeriod,
      from,
      to,
      sales: salesN,
      collected: num(collected[0]?.n),
      expenses: expN,
      cogs: cogsN,
      profit: salesN - cogsN - expN,
      itemsSold: sales[0]?.items ?? 0,
      outstanding: Math.max(0, num(outstandingRows[0]?.purchases) - num(outstandingRows[0]?.paid)),
      categories: cats.map((c) => ({
        category: c.category,
        count: c.count,
        sales: num(c.sales),
      })),
      byDay: [...dayMap.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, v]) => ({ day, sales: v.sales, expenses: v.expenses })),
      shopStats,
    };
  });

function monthStart(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}
