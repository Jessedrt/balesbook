import { createFileRoute } from "@tanstack/react-router";
import { assertSameSiteRequest } from "@/lib/auth/isolation.server";
import { getSessionUser } from "@/lib/auth/verify.server";
import { getSql } from "@/lib/db";

/**
 * Clothing photo bytes, scoped to the signed-in seller.
 *
 * Photos are stored as base64 data URLs on `clothes.photo`. Putting them in
 * list responses means every "My clothes" screen downloads the whole wardrobe
 * before it can paint — brutal on the networks this app is used on. Instead the
 * responses carry `/photos/<id>` (see `src/lib/server/photos.ts`) and the bytes
 * are fetched per visible image, then cached by the browser/WebView.
 *
 * `<img src>` sends cookies but no auth middleware runs here, so the session is
 * resolved from the request directly and the row is read with the owner
 * predicate — a guessed id from another business returns 404, not an image.
 */
export const Route = createFileRoute("/photos/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          assertSameSiteRequest();
        } catch {
          return notFound();
        }
        const user = await getSessionUser();
        if (!user) return notFound();

        const sql = await getSql();
        const rows = await sql<{ photo: string | null }>`
          select photo from clothes where id = ${params.id} and user_id = ${user.id} limit 1
        `;
        const photo = rows[0]?.photo;
        if (!photo || !photo.startsWith("data:")) return notFound();

        const comma = photo.indexOf(",");
        const meta = comma === -1 ? "" : photo.slice(5, comma);
        const body = comma === -1 ? "" : photo.slice(comma + 1);
        const mime = /^(image\/[a-z0-9.+-]+);base64$/i.exec(meta)?.[1];
        if (!mime) return notFound();

        let bytes: Uint8Array;
        try {
          bytes = Buffer.from(body, "base64");
        } catch {
          return notFound();
        }

        return new Response(new Uint8Array(bytes), {
          headers: {
            "content-type": mime,
            // Per-user content: never shared-cached. The photo column is only
            // ever written on insert, so a week is safe.
            "cache-control": "private, max-age=604800, immutable",
            "content-length": String(bytes.byteLength),
            "x-content-type-options": "nosniff",
          },
        });
      },
    },
  },
});

function notFound(): Response {
  // 404 (not 401/403) so the response cannot be used to probe which ids exist.
  return new Response(null, { status: 404, headers: { "cache-control": "no-store" } });
}
