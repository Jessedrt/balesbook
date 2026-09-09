import { a as isoOffset, c as todayIso, o as nid, s as num } from "./utils-DhFUnFCj.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { r as getSql } from "./db-CqJSH2c1.mjs";
import { t as authMiddleware } from "./middleware-DFsrBw6e.mjs";
import { n as ensureWorkspace, t as createServerRpc } from "./workspace-Td5RNulH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ledger-DFWVxSCf.js
function mapCustomer(r) {
	const purchases = num(r.purchases);
	const paid = num(r.paid);
	return {
		id: r.id,
		name: r.name,
		phone: r.phone,
		notes: r.notes,
		purchases,
		paid,
		outstanding: Math.max(0, purchases - paid)
	};
}
var listCustomers_createServerFn_handler = createServerRpc({
	id: "85058395fe13c37325048c2868aff83a83d51f74c0d38338da27d41a55f4a229",
	name: "listCustomers",
	filename: "src/lib/server/ledger.ts"
}, (opts) => listCustomers.__executeServer(opts));
var listCustomers = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ owingOnly: boolean().optional() })).handler(listCustomers_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	const list = (await (await getSql())`
      select c.id, c.name, c.phone, c.notes,
        coalesce((select sum(selling_price) from sales where customer_id = c.id and user_id = c.user_id), 0) as purchases,
        coalesce((select sum(amount) from payments where customer_id = c.id and user_id = c.user_id), 0) as paid
      from customers c
      where c.user_id = ${context.userId}
      order by c.name
    `).map(mapCustomer);
	return data.owingOnly ? list.filter((c) => c.outstanding > 0) : list;
});
var getCustomer_createServerFn_handler = createServerRpc({
	id: "5f284996f7f7714b246e0edac5f128407e447933cc22d95d8bd85e7904db46b9",
	name: "getCustomer",
	filename: "src/lib/server/ledger.ts"
}, (opts) => getCustomer.__executeServer(opts));
var getCustomer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(getCustomer_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	const sql = await getSql();
	const rows = await sql`
      select c.id, c.name, c.phone, c.notes,
        coalesce((select sum(selling_price) from sales where customer_id = c.id and user_id = c.user_id), 0) as purchases,
        coalesce((select sum(amount) from payments where customer_id = c.id and user_id = c.user_id), 0) as paid
      from customers c
      where c.user_id = ${context.userId} and c.id = ${data.id}
      limit 1
    `;
	if (!rows[0]) return null;
	const customer = mapCustomer(rows[0]);
	const sales = await sql`
      select s.id, s.customer_id, ${customer.name} as customer_name, s.shop_id, sh.name as shop_name,
        s.clothing_id, cl.description as item, cl.photo, s.selling_price, s.sold_at, s.notes
      from sales s
      join shops sh on sh.id = s.shop_id
      join clothes cl on cl.id = s.clothing_id
      where s.user_id = ${context.userId} and s.customer_id = ${data.id}
      order by s.sold_at desc, s.created_at desc
    `;
	const payments = await sql`
      select id, customer_id, amount, paid_at, notes
      from payments
      where user_id = ${context.userId} and customer_id = ${data.id}
      order by paid_at desc, created_at desc
    `;
	return {
		customer,
		sales: sales.map((r) => ({
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
			notes: r.notes
		})),
		payments: payments.map((r) => ({
			id: r.id,
			customerId: r.customer_id,
			amount: num(r.amount),
			paidAt: r.paid_at,
			notes: r.notes
		}))
	};
});
var upsertCustomer_createServerFn_handler = createServerRpc({
	id: "22d61da7a8f0a6922920a555280ac4265c128d93c0dc63592f603b60d18e1432",
	name: "upsertCustomer",
	filename: "src/lib/server/ledger.ts"
}, (opts) => upsertCustomer.__executeServer(opts));
var upsertCustomer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().nullable(),
	name: string().min(1),
	phone: string(),
	notes: string()
})).handler(upsertCustomer_createServerFn_handler, async ({ context, data }) => {
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
var recordSale_createServerFn_handler = createServerRpc({
	id: "fa385139d6cf031e3e3ab169362595d700d095af79169766a99d2099e5381973",
	name: "recordSale",
	filename: "src/lib/server/ledger.ts"
}, (opts) => recordSale.__executeServer(opts));
var recordSale = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clothingId: string(),
	customerId: string().nullable(),
	newCustomerName: string().nullable(),
	sellingPrice: number().nonnegative(),
	paid: number().nonnegative(),
	soldAt: string(),
	notes: string()
})).handler(recordSale_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	const sql = await getSql();
	const item = await sql`
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
	} else if (!(await sql`
        select id from customers where id = ${customerId} and user_id = ${context.userId}
      `)[0]) throw new Error("Customer not found");
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
	if (data.paid > 0) await sql`
        insert into payments (id, user_id, customer_id, sale_id, amount, paid_at, notes)
        values (
          ${nid()}, ${context.userId}, ${customerId}, ${saleId}, ${data.paid},
          ${data.soldAt}, ${"Paid at sale"}
        )
      `;
	return {
		id: saleId,
		customerId,
		outstanding: Math.max(0, data.sellingPrice - data.paid)
	};
});
var recordPayment_createServerFn_handler = createServerRpc({
	id: "d771fa61aefc9cb340a1b8510e4dae4ffa33f6289a172e8dfa192e619486a3e7",
	name: "recordPayment",
	filename: "src/lib/server/ledger.ts"
}, (opts) => recordPayment.__executeServer(opts));
var recordPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	customerId: string(),
	amount: number().positive(),
	paidAt: string(),
	notes: string()
})).handler(recordPayment_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (!(await sql`
      select id from customers where id = ${data.customerId} and user_id = ${context.userId}
    `)[0]) throw new Error("Customer not found");
	await sql`
      insert into payments (id, user_id, customer_id, amount, paid_at, notes)
      values (
        ${nid()}, ${context.userId}, ${data.customerId}, ${data.amount},
        ${data.paidAt}, ${data.notes.trim()}
      )
    `;
	return { ok: true };
});
var listExpenses_createServerFn_handler = createServerRpc({
	id: "df32213d9fcb48b1af9b8cc80cb5dd44c18740091c8f1fec49d14b8c52647cfe",
	name: "listExpenses",
	filename: "src/lib/server/ledger.ts"
}, (opts) => listExpenses.__executeServer(opts));
var listExpenses = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ shopId: string().nullable() })).handler(listExpenses_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	const sql = await getSql();
	return (data.shopId ? await sql`
          select e.id, e.shop_id, sh.name as shop_name, e.category, e.amount, e.spent_at, e.notes
          from expenses e left join shops sh on sh.id = e.shop_id
          where e.user_id = ${context.userId} and e.shop_id = ${data.shopId}
          order by e.spent_at desc, e.created_at desc
        ` : await sql`
          select e.id, e.shop_id, sh.name as shop_name, e.category, e.amount, e.spent_at, e.notes
          from expenses e left join shops sh on sh.id = e.shop_id
          where e.user_id = ${context.userId}
          order by e.spent_at desc, e.created_at desc
        `).map((r) => ({
		id: r.id,
		shopId: r.shop_id,
		shopName: r.shop_name,
		category: r.category,
		amount: num(r.amount),
		spentAt: r.spent_at,
		notes: r.notes
	}));
});
var createExpense_createServerFn_handler = createServerRpc({
	id: "d7dfaeab039562b86653483d100c1498ad00cf2ebb8e3eeb4385d3630376a258",
	name: "createExpense",
	filename: "src/lib/server/ledger.ts"
}, (opts) => createExpense.__executeServer(opts));
var createExpense = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	shopId: string().nullable(),
	category: string(),
	amount: number().positive(),
	spentAt: string(),
	notes: string()
})).handler(createExpense_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	const sql = await getSql();
	if (data.shopId) {
		if (!(await sql`
        select id from shops where id = ${data.shopId} and user_id = ${context.userId}
      `)[0]) throw new Error("Shop not found");
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
var deleteExpense_createServerFn_handler = createServerRpc({
	id: "a80f9a4975a5e9c258d9d0778685b58994e5a33a336f365706f1adcd237b5b70",
	name: "deleteExpense",
	filename: "src/lib/server/ledger.ts"
}, (opts) => deleteExpense.__executeServer(opts));
var deleteExpense = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(deleteExpense_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`delete from expenses where id = ${data.id} and user_id = ${context.userId}`;
	return { ok: true };
});
var getShops_createServerFn_handler = createServerRpc({
	id: "322a07f4d0f26c872dc56fc705c2e81e1d92b740d6b5b6461b2cb4671701e0a8",
	name: "getShops",
	filename: "src/lib/server/ledger.ts"
}, (opts) => getShops.__executeServer(opts));
var getShops = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(getShops_createServerFn_handler, async ({ context }) => {
	return await ensureWorkspace(context.userId);
});
var updateBusiness_createServerFn_handler = createServerRpc({
	id: "4428523b121aa7d9c6d14fcc6767f18f467c8a8b76ecd41f570b08f9dc687185",
	name: "updateBusiness",
	filename: "src/lib/server/ledger.ts"
}, (opts) => updateBusiness.__executeServer(opts));
var updateBusiness = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	businessName: string().min(1),
	shops: array(object({
		id: string(),
		name: string().min(1)
	}))
})).handler(updateBusiness_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await sql`
      update businesses set name = ${data.businessName.trim()}
      where user_id = ${context.userId}
    `;
	for (const shop of data.shops) await sql`
        update shops set name = ${shop.name.trim()}
        where id = ${shop.id} and user_id = ${context.userId}
      `;
	return { ok: true };
});
var getReport_createServerFn_handler = createServerRpc({
	id: "a3a6409b9e6ea64dcaca586218ecf58d4b1522e38c72f89f9511254d98b5ab97",
	name: "getReport",
	filename: "src/lib/server/ledger.ts"
}, (opts) => getReport.__executeServer(opts));
var getReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	period: _enum([
		"daily",
		"weekly",
		"monthly"
	]),
	shopId: string().nullable()
})).handler(getReport_createServerFn_handler, async ({ context, data }) => {
	const { shops } = await ensureWorkspace(context.userId);
	const sql = await getSql();
	const to = todayIso();
	const from = data.period === "daily" ? to : data.period === "weekly" ? isoOffset(-6) : monthStart();
	const sales = data.shopId ? await sql`
          select coalesce(sum(selling_price), 0) as n, count(*)::int as items
          from sales where user_id = ${context.userId} and sold_at >= ${from} and sold_at <= ${to}
            and shop_id = ${data.shopId}
        ` : await sql`
          select coalesce(sum(selling_price), 0) as n, count(*)::int as items
          from sales where user_id = ${context.userId} and sold_at >= ${from} and sold_at <= ${to}
        `;
	const collected = data.shopId ? await sql`
          select coalesce(sum(p.amount), 0) as n from payments p
          left join sales s on s.id = p.sale_id
          where p.user_id = ${context.userId} and p.paid_at >= ${from} and p.paid_at <= ${to}
            and (${data.shopId}::text is null or s.shop_id = ${data.shopId} or p.sale_id is null)
        ` : await sql`
          select coalesce(sum(amount), 0) as n from payments
          where user_id = ${context.userId} and paid_at >= ${from} and paid_at <= ${to}
        `;
	const expenses = data.shopId ? await sql`
          select coalesce(sum(amount), 0) as n from expenses
          where user_id = ${context.userId} and spent_at >= ${from} and spent_at <= ${to}
            and shop_id = ${data.shopId}
        ` : await sql`
          select coalesce(sum(amount), 0) as n from expenses
          where user_id = ${context.userId} and spent_at >= ${from} and spent_at <= ${to}
        `;
	const cogs = data.shopId ? await sql`
          select coalesce(sum(c.cost), 0) as n from sales s
          join clothes c on c.id = s.clothing_id
          where s.user_id = ${context.userId} and s.sold_at >= ${from} and s.sold_at <= ${to}
            and s.shop_id = ${data.shopId}
        ` : await sql`
          select coalesce(sum(c.cost), 0) as n from sales s
          join clothes c on c.id = s.clothing_id
          where s.user_id = ${context.userId} and s.sold_at >= ${from} and s.sold_at <= ${to}
        `;
	const cats = data.shopId ? await sql`
          select cl.category, count(*)::int as count, coalesce(sum(s.selling_price), 0) as sales
          from sales s join clothes cl on cl.id = s.clothing_id
          where s.user_id = ${context.userId} and s.sold_at >= ${from} and s.sold_at <= ${to}
            and s.shop_id = ${data.shopId}
          group by cl.category
          order by count desc, sales desc
        ` : await sql`
          select cl.category, count(*)::int as count, coalesce(sum(s.selling_price), 0) as sales
          from sales s join clothes cl on cl.id = s.clothing_id
          where s.user_id = ${context.userId} and s.sold_at >= ${from} and s.sold_at <= ${to}
          group by cl.category
          order by count desc, sales desc
        `;
	const byDaySales = data.shopId ? await sql`
          select sold_at::text as day, coalesce(sum(selling_price), 0) as n
          from sales
          where user_id = ${context.userId} and sold_at >= ${from} and sold_at <= ${to}
            and shop_id = ${data.shopId}
          group by sold_at order by sold_at
        ` : await sql`
          select sold_at::text as day, coalesce(sum(selling_price), 0) as n
          from sales
          where user_id = ${context.userId} and sold_at >= ${from} and sold_at <= ${to}
          group by sold_at order by sold_at
        `;
	const byDayExp = data.shopId ? await sql`
          select spent_at::text as day, coalesce(sum(amount), 0) as n
          from expenses
          where user_id = ${context.userId} and spent_at >= ${from} and spent_at <= ${to}
            and shop_id = ${data.shopId}
          group by spent_at order by spent_at
        ` : await sql`
          select spent_at::text as day, coalesce(sum(amount), 0) as n
          from expenses
          where user_id = ${context.userId} and spent_at >= ${from} and spent_at <= ${to}
          group by spent_at order by spent_at
        `;
	const dayMap = /* @__PURE__ */ new Map();
	for (const r of byDaySales) dayMap.set(r.day, {
		sales: num(r.n),
		expenses: 0
	});
	for (const r of byDayExp) {
		const cur = dayMap.get(r.day) ?? {
			sales: 0,
			expenses: 0
		};
		cur.expenses = num(r.n);
		dayMap.set(r.day, cur);
	}
	const shopStats = [];
	for (const shop of shops) {
		const sSales = await sql`
        select coalesce(sum(selling_price), 0) as n from sales
        where user_id = ${context.userId} and shop_id = ${shop.id}
          and sold_at >= ${from} and sold_at <= ${to}
      `;
		const sExp = await sql`
        select coalesce(sum(amount), 0) as n from expenses
        where user_id = ${context.userId} and shop_id = ${shop.id}
          and spent_at >= ${from} and spent_at <= ${to}
      `;
		const sCogs = await sql`
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
			profit: salesN - num(sCogs[0]?.n) - expN
		});
	}
	const outstandingRows = await sql`
      select
        coalesce((select sum(selling_price) from sales where user_id = ${context.userId}), 0) as purchases,
        coalesce((select sum(amount) from payments where user_id = ${context.userId}), 0) as paid
    `;
	const salesN = num(sales[0]?.n);
	const expN = num(expenses[0]?.n);
	const cogsN = num(cogs[0]?.n);
	return {
		period: data.period,
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
			sales: num(c.sales)
		})),
		byDay: [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([day, v]) => ({
			day,
			sales: v.sales,
			expenses: v.expenses
		})),
		shopStats
	};
});
function monthStart() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}
//#endregion
export { createExpense_createServerFn_handler, deleteExpense_createServerFn_handler, getCustomer_createServerFn_handler, getReport_createServerFn_handler, getShops_createServerFn_handler, listCustomers_createServerFn_handler, listExpenses_createServerFn_handler, recordPayment_createServerFn_handler, recordSale_createServerFn_handler, updateBusiness_createServerFn_handler, upsertCustomer_createServerFn_handler };
