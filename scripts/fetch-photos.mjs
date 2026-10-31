// Run on a machine that can reach breezeblock.co.za:  npm run fetch-photos
//
// Downloads photographs the cafe has already published on its own website
// (plus the logo) into /public, and writes public/photos/manifest.json so the
// site picks them up. Nothing here is third-party imagery. Photos uploaded
// through the admin always take priority over these.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://breezeblock.co.za/wp-content/uploads";
const out = path.resolve("public/photos");
const brand = path.resolve("public/brand");
await mkdir(out, { recursive: true });
await mkdir(brand, { recursive: true });

const files = [
  // slot = which place on the site it fills; gallery = also add to the gallery page
  { url: `${BASE}/2018/10/6H4A5108.jpg`, file: "coffee-1.jpg", slot: "coffee", gallery: ["coffee", "Coffee being prepared at Breezeblock Cafe"] },
  { url: `${BASE}/2018/09/IMG_8637-1.jpg`, file: "coffee-2.jpg", slot: "coffeeSecondary", gallery: ["coffee", "A cup of coffee at Breezeblock Cafe"] },
  { url: `${BASE}/2017/04/IMG-20170422-WA0000.jpg`, file: "meppel-pancake.jpg", slot: "dish:Meppel Pancakes", gallery: ["food", "Meppel pancake with roast tomatoes, mushrooms and herb cream cheese"] },
  { url: `${BASE}/2018/10/20181017_024056.jpg`, file: "canape-1.jpg", gallery: ["events", "Creamy mushroom and thyme bouchees, served at events"] },
  { url: `${BASE}/2018/10/IMG-20181016-WA0015.jpg`, file: "canape-2.jpg", gallery: ["events", "Prawn tartar and avocado crostini, served at events"] },
  { url: `${BASE}/2018/10/IMG-20181016-WA0036.jpg`, file: "canape-3.jpg", gallery: ["events", "Roasted tomato and ricotta crostini, served at events"] },
  { url: `${BASE}/2018/10/IMG-20181016-WA0023.jpg`, file: "canape-4.jpg", gallery: ["events", "Smoked salmon, cream cheese and dill bouchees, served at events"] },
];

const manifest = { slots: {}, gallery: [] };
for (const f of files) {
  const res = await fetch(f.url);
  if (!res.ok) { console.warn(`skip ${f.url} (${res.status})`); continue; }
  await writeFile(path.join(out, f.file), Buffer.from(await res.arrayBuffer()));
  if (f.slot) manifest.slots[f.slot] = f.file;
  if (f.gallery) manifest.gallery.push({ file: f.file, category: f.gallery[0], alt: f.gallery[1] });
  console.log("ok  ", f.file);
}
await writeFile(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2));

// The cafe's existing logo (do not redesign it). White version for the green header.
const logo = await fetch(`${BASE}/2020/09/Breeze-Block_FINALwhite.png`);
if (logo.ok) {
  await writeFile(path.join(brand, "logo-white.png"), Buffer.from(await logo.arrayBuffer()));
  console.log("ok   logo-white.png");
} else console.warn("logo not found, keeping the text wordmark");
console.log("\nDone. Courtyard and interior photos still need to come from the cafe: upload them in /keystatic.");
