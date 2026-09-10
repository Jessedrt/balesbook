import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { DashboardData, OwingCustomer, SaleRow, ShopStats } from "@/lib/types";
import { firstName, num, todayIso } from "@/lib/utils";
import { photoSrc } from "./photos";
import { ensureWorkspace } from "./workspace";

const Filter = z.object({
  shopId: z.string().nullable(),
});

/**
 * Every join below repeats the owner predicate (`x.user_id = s.user_id`).
 * The outer `where user_id = ${context.userId}` already isolates the tenant, so
 * this is defence in depth: no row from another business can ever be pulled in
 * through an id that happens to collide or a stale foreign key.
 *
 * "Today" is the Lagos business day (`todayIso`), not the server's UTC day —
 * otherwise a 00:30 sale is booked against yesterday.
 */
export const getDashboard = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(Filter)
  .handler(async ({ context, data }): Promise<DashboardData> => {
    const { business, shops } = await ensureWorkspace(context.userId);
    const sql = await getSql();
    const shopId = data.shopId;
    const today = todayIso();

    // Revenue and cloth cost for today in one pass (LEFT JOIN so a sale whose
    // clothing row was removed still counts as revenue).
    const todayRow = await sql<{ n: unknown; cogs: unknown }>`
      select coalesce(sum(s.selling_price), 0) as n, coalesce(sum(c.cost), 0) as cogs
      from sales s
      left join clothes c on c.id = s.clothing_id and c.user_id = s.user_id
      where s.user_id = ${context.userId} and s.sold_at = ${today}
        and (${shopId}::text is null or s.shop_id = ${shopId})
    `;

    // Cash actually collected today. With a shop selected, only payments tied to
    // that shop's sales count — a payment recorded against a person (no sale)
    // cannot be attributed to one shop.
    const collectedToday = await sql<{ n: unknown }>`
      select coalesce(sum(p.amount), 0) as n
      from payments p
      left join sales s on s.id = p.sale_id and s.user_id = p.user_id
      where p.user_id = ${context.userId} and p.paid_at = ${today}
        and (${shopId}::text is null or s.shop_id = ${shopId})
    `;

    const expensesToday = await sql<{ n: unknown }>`
      select coalesce(sum(amount), 0) as n from expenses
      where user_id = ${context.userId} and spent_at = ${today}
        and (${shopId}::text is null or shop_id = ${shopId})
    `;

    const available = await sql<{ n: number }>`
      select count(*)::int as n from clothes
      where user_id = ${context.userId} and status = 'available'
        and (${shopId}::text is null or shop_id = ${shopId})
    `;

    // Who owes what. Shop-scoped when a shop is selected, so the number on the
    // dashboard matches the shop the seller is looking at.
    const balances = await sql<{
      id: string;
      name: string;
      purchases: unknown;
      paid: unknown;
    }>`
      select c.id, c.name,
        coalesce((
          select sum(s.selling_price) from sales s
          where s.customer_id = c.id and s.user_id = c.user_id
            and (${shopId}::text is null or s.shop_id = ${shopId})
        ), 0) as purchases,
        coalesce((
          select sum(p.amount) from payments p
          left join sales s on s.id = p.sale_id and s.user_id = p.user_id
          where p.customer_id = c.id and p.user_id = c.user_id
            and (${shopId}::text is null or s.shop_id = ${shopId})
        ), 0) as paid
      from customers c
      where c.user_id = ${context.userId}
    `;

    const owing: OwingCustomer[] = balances
      .map((r) => ({
        id: r.id,
        name: r.name,
        outstanding: Math.max(0, num(r.purchases) - num(r.paid)),
      }))
      .filter((r) => r.outstanding > 0)
      .sort((a, b) => b.outstanding - a.outstanding);

    // Shop-by-shop totals: two grouped queries instead of one round trip per
    // shop per metric (a phone on a slow connection waits for all of them).
    const shopSalesRows = await sql<{ shop_id: string; n: unknown; cogs: unknown }>`
      select s.shop_id, coalesce(sum(s.selling_price), 0) as n, coalesce(sum(c.cost), 0) as cogs
      from sales s
      left join clothes c on c.id = s.clothing_id and c.user_id = s.user_id
      where s.user_id = ${context.userId}
      group by s.shop_id
    `;
    const shopExpenseRows = await sql<{ shop_id: string; n: unknown }>`
      select shop_id, coalesce(sum(amount), 0) as n from expenses
      where user_id = ${context.userId} and shop_id is not null
      group by shop_id
    `;
    const salesByShop = new Map(shopSalesRows.map((r) => [r.shop_id, r]));
    const expensesByShop = new Map(shopExpenseRows.map((r) => [r.shop_id, r]));

    const shopStats: ShopStats[] = shops.map((shop) => {
      const s = salesByShop.get(shop.id);
      const salesN = num(s?.n);
      const expN = num(expensesByShop.get(shop.id)?.n);
      return {
        id: shop.id,
        name: shop.name,
        sales: salesN,
        expenses: expN,
        profit: salesN - num(s?.cogs) - expN,
      };
    });

    const recentRows = await sql<{
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
      select s.id, s.customer_id, cu.name as customer_name, s.shop_id, sh.name as shop_name,
        s.clothing_id, cl.description as item, cl.photo, s.selling_price, s.sold_at, s.notes
      from sales s
      join customers cu on cu.id = s.customer_id and cu.user_id = s.user_id
      join shops sh on sh.id = s.shop_id and sh.user_id = s.user_id
      join clothes cl on cl.id = s.clothing_id and cl.user_id = s.user_id
      where s.user_id = ${context.userId}
        and (${shopId}::text is null or s.shop_id = ${shopId})
      order by s.sold_at desc, s.created_at desc
      limit 6
    `;

    const recentSales: SaleRow[] = recentRows.map((r) => ({
      id: r.id,
      customerId: r.customer_id,
      customerName: r.customer_name,
      shopId: r.shop_id,
      shopName: r.shop_name,
      clothingId: r.clothing_id,
      item: r.item,
      photo: photoSrc(r.clothing_id, r.photo),
      sellingPrice: num(r.selling_price),
      soldAt: r.sold_at,
      notes: r.notes,
    }));

    const todaySales = num(todayRow[0]?.n);
    const todayExpenses = num(expensesToday[0]?.n);
    const todayCogs = num(todayRow[0]?.cogs);

    return {
      business,
      shops,
      greetingName: firstName(business.ownerName) || business.name,
      todaySales,
      todayCollected: num(collectedToday[0]?.n),
      todayExpenses,
      todayCogs,
      todayProfit: todaySales - todayCogs - todayExpenses,
      outstanding: owing.reduce((a, b) => a + b.outstanding, 0),
      clothesAvailable: available[0]?.n ?? 0,
      owing,
      shopStats,
      recentSales,
    };
  });
