import { r as createServerFn } from "./ssr.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-DFsrBw6e.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ledger-DEZuFrDL.js
var listCustomers = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ owingOnly: boolean().optional() })).handler(createSsrRpc("85058395fe13c37325048c2868aff83a83d51f74c0d38338da27d41a55f4a229"));
var getCustomer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("5f284996f7f7714b246e0edac5f128407e447933cc22d95d8bd85e7904db46b9"));
var upsertCustomer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().nullable(),
	name: string().min(1),
	phone: string(),
	notes: string()
})).handler(createSsrRpc("22d61da7a8f0a6922920a555280ac4265c128d93c0dc63592f603b60d18e1432"));
var recordSale = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clothingId: string(),
	customerId: string().nullable(),
	newCustomerName: string().nullable(),
	sellingPrice: number().nonnegative(),
	paid: number().nonnegative(),
	soldAt: string(),
	notes: string()
})).handler(createSsrRpc("fa385139d6cf031e3e3ab169362595d700d095af79169766a99d2099e5381973"));
var recordPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	customerId: string(),
	amount: number().positive(),
	paidAt: string(),
	notes: string()
})).handler(createSsrRpc("d771fa61aefc9cb340a1b8510e4dae4ffa33f6289a172e8dfa192e619486a3e7"));
var listExpenses = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ shopId: string().nullable() })).handler(createSsrRpc("df32213d9fcb48b1af9b8cc80cb5dd44c18740091c8f1fec49d14b8c52647cfe"));
var createExpense = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	shopId: string().nullable(),
	category: string(),
	amount: number().positive(),
	spentAt: string(),
	notes: string()
})).handler(createSsrRpc("d7dfaeab039562b86653483d100c1498ad00cf2ebb8e3eeb4385d3630376a258"));
var deleteExpense = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("a80f9a4975a5e9c258d9d0778685b58994e5a33a336f365706f1adcd237b5b70"));
var getShops = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("322a07f4d0f26c872dc56fc705c2e81e1d92b740d6b5b6461b2cb4671701e0a8"));
var updateBusiness = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	businessName: string().min(1),
	shops: array(object({
		id: string(),
		name: string().min(1)
	}))
})).handler(createSsrRpc("4428523b121aa7d9c6d14fcc6767f18f467c8a8b76ecd41f570b08f9dc687185"));
var getReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	period: _enum([
		"daily",
		"weekly",
		"monthly"
	]),
	shopId: string().nullable()
})).handler(createSsrRpc("a3a6409b9e6ea64dcaca586218ecf58d4b1522e38c72f89f9511254d98b5ab97"));
//#endregion
export { getShops as a, recordPayment as c, upsertCustomer as d, getReport as i, recordSale as l, deleteExpense as n, listCustomers as o, getCustomer as r, listExpenses as s, createExpense as t, updateBusiness as u };
