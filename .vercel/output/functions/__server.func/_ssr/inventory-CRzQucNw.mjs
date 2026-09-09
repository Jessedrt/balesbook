import { r as createServerFn } from "./ssr.mjs";
import { D as _enum, F as object, P as number, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-DFsrBw6e.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-CRzQucNw.js
var ShopFilter = object({ shopId: string().nullable() });
var listBales = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(ShopFilter).handler(createSsrRpc("3e15eb9f0fc8cf4c99c033ea430d39ee11f9346aa7c45694bb01152a21eb2878"));
var getBale = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("5de08909d06fa24b981f6b6e93e15881288b7ca47009d19ce75624d32570acbf"));
var createBale = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	shopId: string(),
	name: string().min(1),
	purchasedAt: string(),
	purchasePrice: number().nonnegative(),
	pieces: number().int().positive(),
	notes: string()
})).handler(createSsrRpc("933b3071d4ab2ce95deef9ccc310899153679e553c623ce372a72e9a759d4e3f"));
var listClothes = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	shopId: string().nullable(),
	status: _enum([
		"all",
		"available",
		"sold"
	]),
	search: string().optional()
})).handler(createSsrRpc("8e5a960c6b602a8535619b237a1ca474fd4abfd61a950a36604b8f6a1a1a02bd"));
var getCloth = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("ee6cf93442410b2b2f658a02e453ba601e741ec31f6ec3ea571234827f6074fc"));
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
})).handler(createSsrRpc("2fbfcf504a2567cfd2e0514a9cb77e503400c410999d4a0aee6a0e0ecf54bb87"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	category: string(),
	description: string().min(1),
	size: string(),
	color: string(),
	sellingPrice: number().nonnegative(),
	shopId: string(),
	photo: string().nullable()
})).handler(createSsrRpc("82fdc9690ad206e26a32b376f4f47362385a3dfe47671d512ea9c7986c9dd25c"));
var deleteCloth = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("23a081607c49d373a883e70ae38837287be5d96b101dfb6e2ae21d2366108d69"));
//#endregion
export { getCloth as a, getBale as i, createCloth as n, listBales as o, deleteCloth as r, listClothes as s, createBale as t };
