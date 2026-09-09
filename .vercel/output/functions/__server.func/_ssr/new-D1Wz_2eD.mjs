import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DhFUnFCj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { m as ArrowLeft, p as Camera } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Route$4 } from "./router-v_4pl9av.mjs";
import { a as SIZES, n as COLORS, t as CLOTHING_CATEGORIES } from "./constants-CSFo1eyC.mjs";
import { t as ClothPhoto } from "./cloth-photo-I59xF1t-.mjs";
import { t as Button } from "./button-CDvKYGyv.mjs";
import { n as createCloth, o as listBales } from "./inventory-CRzQucNw.mjs";
import { a as getShops } from "./ledger-DEZuFrDL.mjs";
import { n as Input, r as NativeSelect, t as Field } from "./input-DOqfzTzL.mjs";
import { t as useShopFilter } from "./shop-store-LfrQ1e4d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-D1Wz_2eD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function compressImage(file) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 720 / Math.max(bitmap.width, bitmap.height));
	const w = Math.round(bitmap.width * scale);
	const h = Math.round(bitmap.height * scale);
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Could not read photo");
	ctx.drawImage(bitmap, 0, 0, w, h);
	return canvas.toDataURL("image/jpeg", .72);
}
function PhotoPicker({ value, onChange, color, category }) {
	const ref = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => ref.current?.click(),
		className: cn("relative flex aspect-[3/4] w-full max-w-48 flex-col items-center justify-center overflow-hidden rounded-2xl bg-surface-2 text-muted"),
		children: [value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClothPhoto, {
			photo: value,
			color,
			category,
			className: "h-full w-full"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
			className: "size-8",
			strokeWidth: 1.5
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-2 text-sm font-semibold",
			children: busy ? "Saving photo…" : "Take photo"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref,
			type: "file",
			accept: "image/*",
			capture: "environment",
			className: "hidden",
			onChange: async (e) => {
				const file = e.target.files?.[0];
				if (!file) return;
				setBusy(true);
				try {
					onChange(await compressImage(file));
				} finally {
					setBusy(false);
					e.target.value = "";
				}
			}
		})]
	});
}
function NewCloth() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const shopFilter = useShopFilter((s) => s.shopId);
	const shops = useQuery({
		queryKey: ["shops"],
		queryFn: () => getShops()
	});
	const bales = useQuery({
		queryKey: ["bales", null],
		queryFn: () => listBales({ data: { shopId: null } })
	});
	const search = Route$4.useSearch();
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [category, setCategory] = (0, import_react.useState)(CLOTHING_CATEGORIES[0]);
	const [description, setDescription] = (0, import_react.useState)("");
	const [size, setSize] = (0, import_react.useState)("M");
	const [color, setColor] = (0, import_react.useState)("Blue");
	const [price, setPrice] = (0, import_react.useState)("");
	const [shopId, setShopId] = (0, import_react.useState)(shopFilter ?? "");
	const [baleId, setBaleId] = (0, import_react.useState)(search.bale ?? "");
	const selectedBale = bales.data?.find((b) => b.id === baleId);
	const avgCost = selectedBale && selectedBale.pieces > 0 ? selectedBale.purchasePrice / selectedBale.pieces : 0;
	const resolvedShop = (0, import_react.useMemo)(() => {
		if (selectedBale) return selectedBale.shopId;
		return shopId || shops.data?.shops[0]?.id || "";
	}, [
		selectedBale,
		shopId,
		shops.data
	]);
	const mut = useMutation({
		mutationFn: () => createCloth({ data: {
			baleId: baleId || null,
			shopId: resolvedShop,
			category,
			description,
			size,
			color,
			sellingPrice: Number(price) || 0,
			cost: avgCost,
			photo
		} }),
		onSuccess: async () => {
			await qc.invalidateQueries();
			toast.success("Cloth added");
			navigate({ to: "/clothes" });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mx-auto flex max-w-lg flex-col gap-4",
		onSubmit: (e) => {
			e.preventDefault();
			mut.mutate();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/clothes",
					className: "grid size-11 place-items-center rounded-full bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: "Add clothing"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoPicker, {
				value: photo,
				onChange: setPhoto,
				color,
				category
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "What is it?",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
					value: category,
					onChange: (e) => setCategory(e.target.value),
					children: CLOTHING_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Short description",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: description,
					onChange: (e) => setDescription(e.target.value),
					placeholder: "Blue women's gown",
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Size",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
						value: size,
						onChange: (e) => setSize(e.target.value),
						children: SIZES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Colour",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
						value: color,
						onChange: (e) => setColor(e.target.value),
						children: COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Selling price (₦)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					inputMode: "numeric",
					value: price,
					onChange: (e) => setPrice(e.target.value.replace(/[^\d]/g, "")),
					placeholder: "12000",
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "From which bale?",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: baleId,
					onChange: (e) => setBaleId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Not sure"
					}), bales.data?.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: b.id,
						children: [
							b.name,
							" · ",
							b.shopName
						]
					}, b.id))]
				})
			}),
			!selectedBale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Which shop?",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
					value: resolvedShop,
					onChange: (e) => setShopId(e.target.value),
					children: shops.data?.shops.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s.id,
						children: s.name
					}, s.id))
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Goes to ",
					selectedBale.shopName,
					". Estimated cost from bale: ₦",
					Math.round(avgCost).toLocaleString("en-NG")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				disabled: mut.isPending || !description || !resolvedShop,
				children: mut.isPending ? "Saving…" : "Save clothing"
			})
		]
	});
}
//#endregion
export { NewCloth as component };
