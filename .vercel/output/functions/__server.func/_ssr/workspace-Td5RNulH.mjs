import { a as isoOffset, c as todayIso, o as nid } from "./utils-DhFUnFCj.mjs";
import { i as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { r as getSql } from "./db-CqJSH2c1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace-Td5RNulH.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function ensureWorkspace(userId, displayName) {
	const sql = await getSql();
	const existing = await sql`
    select id, name, owner_name from businesses where user_id = ${userId} limit 1
  `;
	if (existing[0]) {
		const shopRows = await sql`
      select id, name, sort_order from shops where user_id = ${userId} order by sort_order, name
    `;
		return {
			business: toBusiness(existing[0]),
			shops: shopRows.map(toShop)
		};
	}
	const businessId = nid();
	const shop1 = nid();
	const shop2 = nid();
	const owner = (displayName ?? "").trim();
	await sql`
    insert into businesses (id, user_id, name, owner_name)
    values (${businessId}, ${userId}, ${"Mama's Okrika"}, ${owner})
  `;
	await sql`
    insert into shops (id, user_id, name, sort_order)
    values
      (${shop1}, ${userId}, ${"Shop 1"}, ${1}),
      (${shop2}, ${userId}, ${"Shop 2"}, ${2})
  `;
	await seedSample(userId, shop1, shop2);
	return {
		business: {
			id: businessId,
			name: "Mama's Okrika",
			ownerName: owner
		},
		shops: [{
			id: shop1,
			name: "Shop 1",
			sortOrder: 1
		}, {
			id: shop2,
			name: "Shop 2",
			sortOrder: 2
		}]
	};
}
function toBusiness(row) {
	return {
		id: row.id,
		name: row.name,
		ownerName: row.owner_name
	};
}
function toShop(row) {
	return {
		id: row.id,
		name: row.name,
		sortOrder: row.sort_order
	};
}
async function seedSample(userId, shop1, shop2) {
	const sql = await getSql();
	const today = todayIso();
	const d = (n) => isoOffset(n);
	const bale1 = nid();
	const bale2 = nid();
	await sql`
    insert into bales (id, user_id, shop_id, name, purchased_at, purchase_price, pieces, notes)
    values
      (${bale1}, ${userId}, ${shop1}, ${"Bale #001"}, ${d(-8)}, ${25e4}, ${80},
        ${"Mixed ladies and gents from Cotonou. Opened at Shop 1."}),
      (${bale2}, ${userId}, ${shop2}, ${"Bale #002"}, ${d(-5)}, ${18e4}, ${60},
        ${"Ankara, kids and extras for Shop 2."})
  `;
	const cost1 = 3125;
	const cost2 = 3e3;
	const gown = nid();
	const top = nid();
	const jeans = nid();
	const shirt = nid();
	const jacket = nid();
	const skirt = nid();
	const ankara = nid();
	const kids = nid();
	const gown2 = nid();
	const top2 = nid();
	const yellow = nid();
	const trousers = nid();
	const greenTop = nid();
	const jeans2 = nid();
	const pinkKids = nid();
	const bag = nid();
	const clothes = [
		{
			id: gown,
			bale: bale1,
			shop: shop1,
			category: "Women's gown",
			description: "Royal blue maxi gown",
			size: "12",
			color: "Blue",
			price: 12e3,
			cost: cost1,
			status: "sold",
			photo: "/seed/gown-blue.jpg",
			soldAt: today
		},
		{
			id: top,
			bale: bale1,
			shop: shop1,
			category: "Women's top",
			description: "Black sleeveless blouse",
			size: "M",
			color: "Black",
			price: 8e3,
			cost: cost1,
			status: "available",
			photo: "/seed/top-black.jpg",
			soldAt: null
		},
		{
			id: jeans,
			bale: bale1,
			shop: shop1,
			category: "Jeans",
			description: "Faded mid-wash jeans",
			size: "32",
			color: "Blue",
			price: 18e3,
			cost: cost1,
			status: "sold",
			photo: "/seed/jeans-blue.jpg",
			soldAt: today
		},
		{
			id: shirt,
			bale: bale1,
			shop: shop1,
			category: "Men's shirt",
			description: "White oxford shirt",
			size: "L",
			color: "White",
			price: 12e3,
			cost: cost1,
			status: "sold",
			photo: "/seed/shirt-white.jpg",
			soldAt: today
		},
		{
			id: jacket,
			bale: bale1,
			shop: shop1,
			category: "Jacket",
			description: "Brown corduroy jacket",
			size: "L",
			color: "Brown",
			price: 15e3,
			cost: cost1,
			status: "sold",
			photo: "/seed/jacket-brown.jpg",
			soldAt: today
		},
		{
			id: skirt,
			bale: bale1,
			shop: shop1,
			category: "Women's skirt",
			description: "Burgundy pencil skirt",
			size: "12",
			color: "Red",
			price: 1e4,
			cost: cost1,
			status: "sold",
			photo: "/seed/skirt-burgundy.jpg",
			soldAt: today
		},
		{
			id: ankara,
			bale: bale2,
			shop: shop2,
			category: "Ankara / wrapper",
			description: "Teal and rust Ankara wrapper",
			size: "Free",
			color: "Ankara",
			price: 25e3,
			cost: cost2,
			status: "sold",
			photo: "/seed/ankara.jpg",
			soldAt: d(-3)
		},
		{
			id: kids,
			bale: bale2,
			shop: shop2,
			category: "Kids",
			description: "Coral floral kids dress",
			size: "8",
			color: "Pink",
			price: 8e3,
			cost: cost2,
			status: "sold",
			photo: "/seed/kids-dress.jpg",
			soldAt: today
		},
		{
			id: gown2,
			bale: bale1,
			shop: shop1,
			category: "Women's gown",
			description: "Navy flare gown",
			size: "14",
			color: "Blue",
			price: 2e4,
			cost: cost1,
			status: "sold",
			photo: null,
			soldAt: d(-6)
		},
		{
			id: top2,
			bale: bale1,
			shop: shop1,
			category: "Women's top",
			description: "Cream lace top",
			size: "M",
			color: "White",
			price: 13e3,
			cost: cost1,
			status: "sold",
			photo: null,
			soldAt: d(-4)
		},
		{
			id: yellow,
			bale: bale1,
			shop: shop1,
			category: "Women's gown",
			description: "Mustard shirt dress",
			size: "10",
			color: "Yellow",
			price: 11e3,
			cost: cost1,
			status: "available",
			photo: null,
			soldAt: null
		},
		{
			id: trousers,
			bale: bale1,
			shop: shop1,
			category: "Men's trousers",
			description: "Grey chinos",
			size: "34",
			color: "Grey",
			price: 9e3,
			cost: cost1,
			status: "available",
			photo: null,
			soldAt: null
		},
		{
			id: greenTop,
			bale: bale2,
			shop: shop2,
			category: "Women's top",
			description: "Forest green peplum top",
			size: "L",
			color: "Green",
			price: 7e3,
			cost: cost2,
			status: "available",
			photo: null,
			soldAt: null
		},
		{
			id: jeans2,
			bale: bale2,
			shop: shop2,
			category: "Jeans",
			description: "Dark skinny jeans",
			size: "10",
			color: "Blue",
			price: 14e3,
			cost: cost2,
			status: "available",
			photo: null,
			soldAt: null
		},
		{
			id: pinkKids,
			bale: bale2,
			shop: shop2,
			category: "Kids",
			description: "Pink party dress",
			size: "6",
			color: "Pink",
			price: 6e3,
			cost: cost2,
			status: "available",
			photo: null,
			soldAt: null
		},
		{
			id: bag,
			bale: bale2,
			shop: shop2,
			category: "Bag",
			description: "Tan tote bag",
			size: "Free",
			color: "Brown",
			price: 9500,
			cost: cost2,
			status: "available",
			photo: null,
			soldAt: null
		}
	];
	for (const c of clothes) await sql`
      insert into clothes (
        id, user_id, bale_id, shop_id, category, description, size, color,
        selling_price, cost, status, photo, sold_at
      ) values (
        ${c.id}, ${userId}, ${c.bale}, ${c.shop}, ${c.category}, ${c.description},
        ${c.size}, ${c.color}, ${c.price}, ${c.cost}, ${c.status}, ${c.photo}, ${c.soldAt}
      )
    `;
	const aisha = nid();
	const chinedu = nid();
	const ngozi = nid();
	const funke = nid();
	await sql`
    insert into customers (id, user_id, name, phone, notes) values
      (${aisha}, ${userId}, ${"Aisha"}, ${"0803 441 2291"}, ${"Regular. Prefers gowns."}),
      (${chinedu}, ${userId}, ${"Chinedu"}, ${"0812 776 0190"}, ${"Pays in bits after market day."}),
      (${ngozi}, ${userId}, ${"Ngozi"}, ${"0701 558 3344"}, ${""}),
      (${funke}, ${userId}, ${"Funke"}, ${"0902 110 8876"}, ${"Pays in full."})
  `;
	const sales = [
		{
			cloth: gown,
			customer: aisha,
			shop: shop1,
			price: 12e3,
			paid: 7e3,
			when: today
		},
		{
			cloth: jacket,
			customer: aisha,
			shop: shop1,
			price: 15e3,
			paid: 15e3,
			when: today
		},
		{
			cloth: ankara,
			customer: aisha,
			shop: shop2,
			price: 25e3,
			paid: 15e3,
			when: d(-3)
		},
		{
			cloth: gown2,
			customer: aisha,
			shop: shop1,
			price: 2e4,
			paid: 2e4,
			when: d(-6)
		},
		{
			cloth: top2,
			customer: aisha,
			shop: shop1,
			price: 13e3,
			paid: 3e3,
			when: d(-4)
		},
		{
			cloth: jeans,
			customer: chinedu,
			shop: shop1,
			price: 18e3,
			paid: 3e3,
			when: today
		},
		{
			cloth: shirt,
			customer: chinedu,
			shop: shop1,
			price: 12e3,
			paid: 12e3,
			when: today
		},
		{
			cloth: skirt,
			customer: ngozi,
			shop: shop1,
			price: 1e4,
			paid: 0,
			when: today
		},
		{
			cloth: kids,
			customer: funke,
			shop: shop2,
			price: 8e3,
			paid: 8e3,
			when: today
		}
	];
	for (const s of sales) {
		const saleId = nid();
		await sql`
      insert into sales (id, user_id, customer_id, shop_id, clothing_id, selling_price, sold_at)
      values (${saleId}, ${userId}, ${s.customer}, ${s.shop}, ${s.cloth}, ${s.price}, ${s.when})
    `;
		if (s.paid > 0) await sql`
        insert into payments (id, user_id, customer_id, sale_id, amount, paid_at, notes)
        values (${nid()}, ${userId}, ${s.customer}, ${saleId}, ${s.paid}, ${s.when}, ${"Paid at sale"})
      `;
	}
	await sql`
    insert into expenses (id, user_id, shop_id, category, amount, spent_at, notes) values
      (${nid()}, ${userId}, ${shop1}, ${"Transport"}, ${8e3}, ${today}, ${"Kekes from Mile 12"}),
      (${nid()}, ${userId}, ${shop2}, ${"Packaging"}, ${4500}, ${today}, ${"Nylon and hangers"}),
      (${nid()}, ${userId}, ${shop1}, ${"Shop rent"}, ${15e3}, ${d(-5)}, ${"September balance"}),
      (${nid()}, ${userId}, ${shop2}, ${"Light / power"}, ${3e3}, ${d(-2)}, ${"NEPA and fuel"})
  `;
}
//#endregion
export { ensureWorkspace as n, createServerRpc as t };
