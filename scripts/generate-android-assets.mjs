#!/usr/bin/env node
/**
 * Generate every Android launcher icon and splash screen from one source.
 *
 * The artwork is the same BaleMark the app already draws in its header
 * (src/components/mark.tsx) — deep green bales on the cream ground — so the
 * launcher, the splash and the in-app logo are one identity rather than three
 * approximations of each other.
 *
 * Reproducible by design: the outputs are committed so an Android build works on
 * a fresh clone, and re-running this script is how you change them.
 *
 *   npm run assets:android
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RES = join(ROOT, "android/app/src/main/res");

/** Keep in sync with the @theme block in src/styles.css. */
const CREAM = "#F3EBDD";
const GREEN = "#1E5843";

/**
 * The BaleMark, verbatim from src/components/mark.tsx (three stacked bales),
 * on a transparent ground so it can be composited onto any background.
 */
function markSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect x="4" y="18" width="24" height="8" rx="2" fill="${GREEN}" opacity="0.35"/>
  <rect x="6" y="12" width="20" height="8" rx="2" fill="${GREEN}" opacity="0.65"/>
  <rect x="8" y="6" width="16" height="8" rx="2" fill="${GREEN}"/>
</svg>`;
}

/** A `size`×`size` transparent tile with the mark inside the adaptive safe zone. */
async function foreground(size) {
  // Adaptive icons crop a 108dp tile to a ~66dp circle/shape, so the mark's
  // 24-unit drawing width (inside its 32-unit viewBox) is scaled to 66/108.
  const markSize = Math.round((size * 66) / 108 / 0.75);
  const mark = await sharp(Buffer.from(markSvg(markSize))).png().toBuffer();
  const offset = Math.round((size - markSize) / 2);
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: mark, left: offset, top: offset }])
    .png()
    .toBuffer();
}

/** A `size`×`size` cream tile with the mark centred (legacy launcher icons). */
async function legacyIcon(size, { round = false } = {}) {
  const markSize = Math.round(size * 0.68);
  const mark = await sharp(Buffer.from(markSvg(markSize))).png().toBuffer();
  const offset = Math.round((size - markSize) / 2);
  const base = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 243, g: 235, b: 221, alpha: 1 },
    },
  })
    .composite([{ input: mark, left: offset, top: offset }])
    .png();

  if (!round) return base.toBuffer();

  // Launchers on pre-API-26 devices mask round icons themselves on some skins,
  // but shipping a pre-circled image is what the platform expects for
  // ic_launcher_round.
  const circle = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  );
  const masked = await sharp(await base.toBuffer())
    .composite([{ input: circle, blend: "dest-in" }])
    .png()
    .toBuffer();
  return masked;
}

/** Cream ground with the mark centred — the splash screen. */
async function splash(width, height) {
  const markSize = Math.round(Math.min(width, height) * 0.34);
  const mark = await sharp(Buffer.from(markSvg(markSize))).png().toBuffer();
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 243, g: 235, b: 221, alpha: 1 },
    },
  })
    .composite([
      {
        input: mark,
        left: Math.round((width - markSize) / 2),
        top: Math.round((height - markSize) / 2),
      },
    ])
    .png()
    .toBuffer();
}

const DENSITIES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

/** Sizes the generated Capacitor project already declares, kept identical. */
const SPLASH_SIZES = {
  "drawable": [480, 320],
  "drawable-port-mdpi": [320, 480],
  "drawable-port-hdpi": [480, 800],
  "drawable-port-xhdpi": [720, 1280],
  "drawable-port-xxhdpi": [960, 1600],
  "drawable-port-xxxhdpi": [1280, 1920],
  "drawable-land-mdpi": [480, 320],
  "drawable-land-hdpi": [800, 480],
  "drawable-land-xhdpi": [1280, 720],
  "drawable-land-xxhdpi": [1600, 960],
  "drawable-land-xxxhdpi": [1920, 1280],
};

async function write(dir, name, buffer) {
  const target = join(RES, dir);
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, name), buffer);
  console.log(`  ${dir}/${name}`);
}

async function main() {
  console.log("[assets] launcher icons");
  for (const [density, scale] of Object.entries(DENSITIES)) {
    const dir = `mipmap-${density}`;
    await write(dir, "ic_launcher.png", await legacyIcon(Math.round(48 * scale)));
    await write(dir, "ic_launcher_round.png", await legacyIcon(Math.round(48 * scale), { round: true }));
    await write(dir, "ic_launcher_foreground.png", await foreground(Math.round(108 * scale)));
  }

  console.log("[assets] splash screens");
  for (const [dir, [w, h]] of Object.entries(SPLASH_SIZES)) {
    await write(dir, "splash.png", await splash(w, h));
  }

  console.log("[assets] adaptive icon background");
  writeFileSync(
    join(RES, "values/ic_launcher_background.xml"),
    `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${CREAM}</color>\n</resources>\n`,
  );
  writeFileSync(
    join(RES, "drawable/ic_launcher_background.xml"),
    `<?xml version="1.0" encoding="utf-8"?>\n<vector xmlns:android="http://schemas.android.com/apk/res/android"\n    android:width="108dp"\n    android:height="108dp"\n    android:viewportHeight="108"\n    android:viewportWidth="108">\n    <path\n        android:fillColor="${CREAM}"\n        android:pathData="M0,0h108v108h-108z" />\n</vector>\n`,
  );
  console.log("  values/ic_launcher_background.xml");
  console.log("  drawable/ic_launcher_background.xml");

  console.log("[assets] done");
}

main().catch((err) => {
  console.error("[assets] failed:", err);
  process.exit(1);
});
