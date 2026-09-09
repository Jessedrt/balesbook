import type { ReactNode } from "react";
import type { Shop } from "@/lib/types";
import { useShopFilter } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export function ShopPills({ shops }: { shops: Shop[] }) {
  const shopId = useShopFilter((s) => s.shopId);
  const setShopId = useShopFilter((s) => s.setShopId);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Pill active={shopId === null} onClick={() => setShopId(null)}>
        All shops
      </Pill>
      {shops.map((shop) => (
        <Pill
          key={shop.id}
          active={shopId === shop.id}
          onClick={() => setShopId(shop.id)}
        >
          {shop.name}
        </Pill>
      ))}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors duration-150",
        active ? "bg-primary text-primary-fg" : "bg-surface text-ink shadow-[var(--shadow-card)]",
      )}
    >
      {children}
    </button>
  );
}
