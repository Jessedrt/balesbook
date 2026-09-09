import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { DashboardData, SaleRow, ShopStats } from "@/lib/types";
import { firstName, num, todayIso } from "@/lib/utils";
import { ensureWorkspace } from "./workspace";

const Filter = z.object({
  shopId: z.string().nullable(),
});

export const getDashboard = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(Filter)
  .handler(async ({ context, data }): Promise<DashboardData> => {
    const { business, shops } = await ensureWorkspace(context.userId);
    const sql = await getSql();
    const shopId = data.shopId;
    const today = todayIso();

    const salesToday = shopId
      ? await sql<{ n: unknown }>`
          select coalesce(sum(selling_price), 0) as n from sales
          where user_id = ${context.userId} and sold_at = ${today} and shop_id = ${shopId}
        `
      : await sql<{ n: unknown }>`
          select coalesce(sum(selling_price), 0) as n from sales
          where user_id = ${context.userId} and sold_at = ${today}
        `;

    const collectedToday = shopId
      ? await sql<{ n: unknown }>`
          select coalesce(sum(p.amount), 0) as n
          from payments p
          join sales s on s.id = p.sale_id
          where p.user_id = ${context.userId} and p.paid_at = ${today} and s.shop_id = ${shopId}
        `
      : await sql<{ n: unknown }>`
          select coalesce(sum(amount), 0) as n from payments
          where user_id = ${context.userId} and paid_at = ${today}
        `;

    const expensesToday = shopId
      ? await sql<{ n: unknown }>`
          select coalesce(sum(amount), 0) as n from expenses
          where user_id = ${context.userId} and spent_at = ${today} and shop_id = ${shopId}
        `
      : await sql<{ n: unknown }>`
          select coalesce(sum(amount), 0) as n from expenses
          where user_id = ${context.userId} and spent_at = ${today}
        `;

    const cogsToday = shopId
      ? await sql<{ n: unknown }>`
          select coalesce(sum(c.cost), 0) as n
          from sales s join clothes c on c.id = s.clothing_id
          where s.user_id = ${context.userId} and s.sold_at = ${today} and s.shop_id = ${shopId}
        `
      : await sql<{ n: unknown }>`
          select coalesce(sum(c.cost), 0) as n
          from sales s join clothes c on c.id = s.clothing_id
          where s.user_id = ${context.userId} and s.sold_at = ${today}
        `;

    const available = shopId
      ? await sql<{ n: number }>`
          select count(*)::int as n from clothes
          where user_id = ${context.userId} and status = 'available' and shop_id = ${shopId}
        `
      : await sql<{ n: number }>`
          select count(*)::int as n from clothes
          where user_id = ${context.userId} and status = 'available'
        `;

    const balances = await sql<{ id: string; name: string; purchases: unknown; paid: unknown }>`
      select c.id, c.name,
        coalesce((select sum(selling_price) from sales where customer_id = c.id and user_id = c.user_id), 0) as purchases,
        coalesce((select sum(amount) from payments where customer_id = c.id and user_id = c.user_id), 0) as paid
      from customers c
      where c.user_id = ${context.userId}
    `;

    const owing = balances
      .map((r) => ({
        id: r.id,
        name: r.name,
        outstanding: Math.max(0, num(r.purchases) - num(r.paid)),
      }))
      .filter((r) => r.outstanding > 0)
      .sort((a, b) => b.outstanding - a.outstanding);

    const shopStats: ShopStats[] = [];
    for (const shop of shops) {
      const sSales = await sql<{ n: unknown }>`
        select coalesce(sum(selling_price), 0) as n from sales
        where user_id = ${context.userId} and shop_id = ${shop.id}
      `;
      const sExp = await sql<{ n: unknown }>`
        select coalesce(sum(amount), 0) as n from expenses
        where user_id = ${context.userId} and shop_id = ${shop.id}
      `;
      const sCogs = await sql<{ n: unknown }>`
        select coalesce(sum(c.cost), 0) as n
        from sales s join clothes c on c.id = s.clothing_id
        where s.user_id = ${context.userId} and s.shop_id = ${shop.id}
      `;
      const salesN = num(sSales[0]?.n);
      const expN = num(sExp[0]?.n);
      const cogsN = num(sCogs[0]?.n);
      shopStats.push({
        id: shop.id,
        name: shop.name,
        sales: salesN,
        expenses: expN,
        profit: salesN - cogsN - expN,
      });
    }

    const recentRows = shopId
      ? await sql<{
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
          join customers cu on cu.id = s.customer_id
          join shops sh on sh.id = s.shop_id
          join clothes cl on cl.id = s.clothing_id
          where s.user_id = ${context.userId} and s.shop_id = ${shopId}
          order by s.sold_at desc, s.created_at desc
          limit 6
        `
      : await sql<{
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
          join customers cu on cu.id = s.customer_id
          join shops sh on sh.id = s.shop_id
          join clothes cl on cl.id = s.clothing_id
          where s.user_id = ${context.userId}
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
      photo: r.photo,
      sellingPrice: num(r.selling_price),
      soldAt: r.sold_at,
      notes: r.notes,
    }));

    const todaySales = num(salesToday[0]?.n);
    const todayExpenses = num(expensesToday[0]?.n);
    const todayCogs = num(cogsToday[0]?.n);

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
