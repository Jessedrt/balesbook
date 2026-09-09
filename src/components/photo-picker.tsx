import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClothPhoto } from "./cloth-photo";

export async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const max = 720;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read photo");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.72);
}

export function PhotoPicker({
  value,
  onChange,
  color,
  category,
}: {
  value: string | null;
  onChange: (dataUrl: string) => void;
  color?: string;
  category?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      onClick={() => ref.current?.click()}
      className={cn(
        "relative flex aspect-[3/4] w-full max-w-48 flex-col items-center justify-center overflow-hidden rounded-2xl bg-surface-2 text-muted",
      )}
    >
      {value ? (
        <ClothPhoto photo={value} color={color} category={category} className="h-full w-full" />
      ) : (
        <>
          <Camera className="size-8" strokeWidth={1.5} />
          <span className="mt-2 text-sm font-semibold">
            {busy ? "Saving photo…" : "Take photo"}
          </span>
        </>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          try {
            onChange(await compressImage(file));
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
    </button>
  );
}
