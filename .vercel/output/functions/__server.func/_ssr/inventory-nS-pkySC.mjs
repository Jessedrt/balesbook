import { o as nid, s as num } from "./utils-DhFUnFCj.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { D as _enum, F as object, P as number, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as getSql } from "./db-CqJSH2c1.mjs";
import { t as authMiddleware } from "./middleware-DFsrBw6e.mjs";
import { n as ensureWorkspace, t as createServerRpc } from "./workspace-Td5RNulH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-nS-pkySC.js
var ShopFilter = object({ shopId: string().nullable() });
function mapBale(r) {
	return {
		id: r.id,
		shopId: r.shop_id,
		shopName: r.shop_name,
		name: r.name,
		purchasedAt: r.purchased_at,
		purchasePrice: num(r.purchase_price),
		pieces: r.pieces,
		notes: r.notes,
		photo: r.photo,
		recorded: r.recorded,
		sold: r.sold,
		available: r.available
	};
}
function mapCloth(r) {
	return {
		id: r.id,
		baleId: r.bale_id,
		baleName: r.bale_name,
		shopId: r.shop_id,
		shopName: r.shop_name,
		category: r.category,
		description: r.description,
		size: r.size,
		color: r.color,
		sellingPrice: num(r.selling_price),
		cost: num(r.cost),
		status: r.status,
		photo: r.photo,
		createdAt: r.created_at,
		soldAt: r.sold_at
	};
}
var listBales_createServerFn_handler = createServerRpc({
	id: "3e15eb9f0fc8cf4c99c033ea430d39ee11f9346aa7c45694bb01152a21eb2878",
	name: "listBales",
	filename: "src/lib/server/inventory.ts"
}, (opts) => listBales.__executeServer(opts));
var listBales = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(ShopFilter).handler(listBales_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	const sql = await getSql();
	return (data.shopId ? await sql`
          select b.id, b.shop_id, sh.name as shop_name, b.name, b.purchased_at, b.purchase_price,
            b.pieces, b.notes, b.photo,
            (select count(*)::int from clothes c where c.bale_id = b.id) as recorded,
            (select count(*)::int from clothes c where c.bale_id = b.id and c.status = 'sold') as sold,
            (select count(*)::int from clothes c where c.bale_id = b.id and c.status = 'available') as available
          from bales b join shops sh on sh.id = b.shop_id
          where b.user_id = ${context.userId} and b.shop_id = ${data.shopId}
          order by b.purchased_at desc, b.created_at desc
        ` : await sql`
          select b.id, b.shop_id, sh.name as shop_name, b.name, b.purchased_at, b.purchase_price,
            b.pieces, b.notes, b.photo,
            (select count(*)::int from clothes c where c.bale_id = b.id) as recorded,
            (select count(*)::int from clothes c where c.bale_id = b.id and c.status = 'sold') as sold,
            (select count(*)::int from clothes c where c.bale_id = b.id and c.status = 'available') as available
          from bales b join shops sh on sh.id = b.shop_id
          where b.user_id = ${context.userId}
          order by b.purchased_at desc, b.created_at desc
        `).map(mapBale);
});
var getBale_createServerFn_handler = createServerRpc({
	id: "5de08909d06fa24b981f6b6e93e15881288b7ca47009d19ce75624d32570acbf",
	name: "getBale",
	filename: "src/lib/server/inventory.ts"
}, (opts) => getBale.__executeServer(opts));
var getBale = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(getBale_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	const sql = await getSql();
	const rows = await sql`
      select b.id, b.shop_id, sh.name as shop_name, b.name, b.purchased_at, b.purchase_price,
        b.pieces, b.notes, b.photo,
        (select count(*)::int from clothes c where c.bale_id = b.id) as recorded,
        (select count(*)::int from clothes c where c.bale_id = b.id and c.status = 'sold') as sold,
        (select count(*)::int from clothes c where c.bale_id = b.id and c.status = 'available') as available
      from bales b join shops sh on sh.id = b.shop_id
      where b.user_id = ${context.userId} and b.id = ${data.id}
      limit 1
    `;
	const bale = rows[0] ? mapBale(rows[0]) : null;
	if (!bale) return {
		bale: null,
		clothes: []
	};
	return {
		bale,
		clothes: (await sql`
      select cl.id, cl.bale_id, b.name as bale_name, cl.shop_id, sh.name as shop_name,
        cl.category, cl.description, cl.size, cl.color, cl.selling_price, cl.cost,
        cl.status, cl.photo, cl.created_at::text as created_at, cl.sold_at
      from clothes cl
      join shops sh on sh.id = cl.shop_id
      left join bales b on b.id = cl.bale_id
      where cl.user_id = ${context.userId} and cl.bale_id = ${data.id}
      order by cl.created_at desc
    `).map(mapCloth)
	};
});
var createBale_createServerFn_handler = createServerRpc({
	id: "933b3071d4ab2ce95deef9ccc310899153679e553c623ce372a72e9a759d4e3f",
	name: "createBale",
	filename: "src/lib/server/inventory.ts"
}, (opts) => createBale.__executeServer(opts));
var createBale = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	shopId: string(),
	name: string().min(1),
	purchasedAt: string(),
	purchasePrice: number().nonnegative(),
	pieces: number().int().positive(),
	notes: string()
})).handler(createBale_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	const sql = await getSql();
	if (!(await sql`
      select id from shops where id = ${data.shopId} and user_id = ${context.userId}
    `)[0]) throw new Error("Shop not found");
	const id = nid();
	await sql`
      insert into bales (id, user_id, shop_id, name, purchased_at, purchase_price, pieces, notes)
      values (
        ${id}, ${context.userId}, ${data.shopId}, ${data.name.trim()},
        ${data.purchasedAt}, ${data.purchasePrice}, ${data.pieces}, ${data.notes.trim()}
      )
    `;
	return { id };
});
var listClothes_createServerFn_handler = createServerRpc({
	id: "8e5a960c6b602a8535619b237a1ca474fd4abfd61a950a36604b8f6a1a1a02bd",
	name: "listClothes",
	filename: "src/lib/server/inventory.ts"
}, (opts) => listClothes.__executeServer(opts));
var listClothes = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	shopId: string().nullable(),
	status: _enum([
		"all",
		"available",
		"sold"
	]),
	search: string().optional()
})).handler(listClothes_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	const sql = await getSql();
	const q = `%${(data.search ?? "").trim().toLowerCase()}%`;
	const hasSearch = (data.search ?? "").trim().length > 0;
	return (await sql`
      select cl.id, cl.bale_id, b.name as bale_name, cl.shop_id, sh.name as shop_name,
        cl.category, cl.description, cl.size, cl.color, cl.selling_price, cl.cost,
        cl.status, cl.photo, cl.created_at::text as created_at, cl.sold_at
      from clothes cl
      join shops sh on sh.id = cl.shop_id
      left join bales b on b.id = cl.bale_id
      where cl.user_id = ${context.userId}
        and (${data.shopId}::text is null or cl.shop_id = ${data.shopId})
        and (${data.status} = 'all' or cl.status = ${data.status})
        and (
          ${!hasSearch} or
          lower(cl.description) like ${q} or
          lower(cl.category) like ${q} or
          lower(cl.color) like ${q}
        )
      order by cl.status asc, cl.created_at desc
    `).map(mapCloth);
});
var getCloth_createServerFn_handler = createServerRpc({
	id: "ee6cf93442410b2b2f658a02e453ba601e741ec31f6ec3ea571234827f6074fc",
	name: "getCloth",
	filename: "src/lib/server/inventory.ts"
}, (opts) => getCloth.__executeServer(opts));
var getCloth = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(getCloth_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	const rows = await (await getSql())`
      select cl.id, cl.bale_id, b.name as bale_name, cl.shop_id, sh.name as shop_name,
        cl.category, cl.description, cl.size, cl.color, cl.selling_price, cl.cost,
        cl.status, cl.photo, cl.created_at::text as created_at, cl.sold_at
      from clothes cl
      join shops sh on sh.id = cl.shop_id
      left join bales b on b.id = cl.bale_id
      where cl.user_id = ${context.userId} and cl.id = ${data.id}
      limit 1
    `;
	return rows[0] ? mapCloth(rows[0]) : null;
});
var createCloth_createServerFn_handler = createServerRpc({
	id: "2fbfcf504a2567cfd2e0514a9cb77e503400c410999d4a0aee6a0e0ecf54bb87",
	name: "createCloth",
	filename: "src/lib/server/inventory.ts"
}, (opts) => createCloth.__executeServer(opts));
var createCloth = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	baleId: string().nullable(),
	shopId: string(),
	category: string(),
	description: string().min(1),
	size: string(),
	color: string(),
	sellingPrice: number().nonnegative(),
	cost: number().nonnegative(),
	photo: string().nullable()
})).handler(createCloth_createServerFn_handler, async ({ context, data }) => {
	await ensureWorkspace(context.userId);
	const sql = await getSql();
	if (!(await sql`
      select id from shops where id = ${data.shopId} and user_id = ${context.userId}
    `)[0]) throw new Error("Shop not found");
	let cost = data.cost;
	let shopId = data.shopId;
	if (data.baleId) {
		const bale = await sql`
        select shop_id, purchase_price, pieces from bales
        where id = ${data.baleId} and user_id = ${context.userId}
      `;
		if (!bale[0]) throw new Error("Bale not found");
		shopId = bale[0].shop_id;
		if (!cost && bale[0].pieces > 0) cost = num(bale[0].purchase_price) / bale[0].pieces;
	}
	const id = nid();
	await sql`
      insert into clothes (
        id, user_id, bale_id, shop_id, category, description, size, color,
        selling_price, cost, status, photo
      ) values (
        ${id}, ${context.userId}, ${data.baleId}, ${shopId}, ${data.category},
        ${data.description.trim()}, ${data.size}, ${data.color},
        ${data.sellingPrice}, ${cost}, ${"available"}, ${data.photo}
      )
    `;
	return { id };
});
var updateCloth_createServerFn_handler = createServerRpc({
	id: "82fdc9690ad206e26a32b376f4f47362385a3dfe47671d512ea9c7986c9dd25c",
	name: "updateCloth",
	filename: "src/lib/server/inventory.ts"
}, (opts) => updateCloth.__executeServer(opts));
var updateCloth = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	category: string(),
	description: string().min(1),
	size: string(),
	color: string(),
	sellingPrice: number().nonnegative(),
	shopId: string(),
	photo: string().nullable()
})).handler(updateCloth_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      update clothes set
        category = ${data.category},
        description = ${data.description.trim()},
        size = ${data.size},
        color = ${data.color},
        selling_price = ${data.sellingPrice},
        shop_id = ${data.shopId},
        photo = coalesce(${data.photo}, photo)
      where id = ${data.id} and user_id = ${context.userId} and status = 'available'
    `;
	return { ok: true };
});
var deleteCloth_createServerFn_handler = createServerRpc({
	id: "23a081607c49d373a883e70ae38837287be5d96b101dfb6e2ae21d2366108d69",
	name: "deleteCloth",
	filename: "src/lib/server/inventory.ts"
}, (opts) => deleteCloth.__executeServer(opts));
var deleteCloth = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(deleteCloth_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      delete from clothes
      where id = ${data.id} and user_id = ${context.userId} and status = 'available'
    `;
	return { ok: true };
});
//#endregion
export { createBale_createServerFn_handler, createCloth_createServerFn_handler, deleteCloth_createServerFn_handler, getBale_createServerFn_handler, getCloth_createServerFn_handler, listBales_createServerFn_handler, listClothes_createServerFn_handler, updateCloth_createServerFn_handler };
