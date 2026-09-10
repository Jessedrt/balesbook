/**
 * Clothing photos are stored in `clothes.photo` as a base64 data URL.
 *
 * Sending that blob inside every list response costs hundreds of kilobytes per
 * screen on exactly the networks this app is used on, so list/detail responses
 * carry a cacheable `/photos/<id>` URL instead (see `src/routes/photos/$id.ts`)
 * and the bytes are fetched once per image — then served from the WebView cache.
 *
 * Rows written before that change, and anything holding a plain path, are passed
 * through untouched.
 */
export function photoSrc(clothingId: string, photo: string | null): string | null {
  if (!photo) return null;
  if (!photo.startsWith("data:")) return photo;
  return `/photos/${encodeURIComponent(clothingId)}`;
}
