import { t as cn } from "./utils-DhFUnFCj.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { o as Shirt } from "../_libs/lucide-react.mjs";
import { r as COLOR_SWATCH } from "./constants-CSFo1eyC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cloth-photo-I59xF1t-.js
var import_jsx_runtime = require_jsx_runtime();
function ClothPhoto({ photo, color, category, className, alt }) {
	if (photo) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: photo,
		alt: alt ?? category ?? "",
		className: cn("object-cover", className)
	});
	const fill = color && COLOR_SWATCH[color] || "#6F675C";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative grid place-items-center overflow-hidden", className),
		style: { background: fill },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/25" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, {
			className: "relative size-8 text-surface",
			strokeWidth: 1.5
		})]
	});
}
//#endregion
export { ClothPhoto as t };
