import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DhFUnFCj.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function nid() {
	return crypto.randomUUID();
}
function num(value) {
	if (typeof value === "number") return Number.isFinite(value) ? value : 0;
	if (typeof value === "string") {
		const n = Number(value);
		return Number.isFinite(n) ? n : 0;
	}
	return 0;
}
function todayIso() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function isoOffset(days) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + days);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function formatNaira(amount) {
	const rounded = Math.round(amount);
	return `${rounded < 0 ? "-" : ""}₦${Math.abs(rounded).toLocaleString("en-NG")}`;
}
function greetingForHour(hour) {
	if (hour < 12) return "Good morning";
	if (hour < 17) return "Good afternoon";
	return "Good evening";
}
function firstName(name) {
	if (!name) return "";
	return name.trim().split(/\s+/)[0] ?? "";
}
//#endregion
export { isoOffset as a, todayIso as c, greetingForHour as i, firstName as n, nid as o, formatNaira as r, num as s, cn as t };
