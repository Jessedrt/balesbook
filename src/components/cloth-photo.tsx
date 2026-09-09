import { Shirt } from "lucide-react";
import { COLOR_SWATCH } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ClothPhoto({
  photo,
  color,
  category,
  className,
  alt,
}: {
  photo: string | null;
  color?: string;
  category?: string;
  className?: string;
  alt?: string;
}) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={alt ?? category ?? ""}
        className={cn("object-cover", className)}
      />
    );
  }
  const fill = (color && COLOR_SWATCH[color]) || "#6F675C";
  return (
    <div
      className={cn("relative grid place-items-center overflow-hidden", className)}
      style={{ background: fill }}
    >
      <div className="absolute inset-0 bg-ink/25" />
      <Shirt className="relative size-8 text-surface" strokeWidth={1.5} />
    </div>
  );
}
