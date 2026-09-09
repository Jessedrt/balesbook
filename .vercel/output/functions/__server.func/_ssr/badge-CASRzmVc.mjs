import { t as cn } from "./utils-DhFUnFCj.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-CASRzmVc.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "neutral", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", tone === "neutral" && "bg-surface-2 text-muted", tone === "good" && "bg-primary-soft text-primary", tone === "warn" && "bg-warn-soft text-warn", tone === "danger" && "bg-danger-soft text-danger", className),
		children
	});
}
//#endregion
export { Badge as t };
