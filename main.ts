// bring-the-humans-03 — "Bring the humans with a TikTok ad" (v1).
//
// The ad itself lives on TikTok; this repo only carries a pointer to it.
// The grader runs this file with Node 22. It checks VIDEO.json holds a real
// TikTok video URL, then copies it byte-for-byte into the output directory
// so the score can be read off the live post.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

const source = join(botDir, "VIDEO.json");
const raw = await readFile(source, "utf8");
const { url } = JSON.parse(raw) as { url: string };

// Full video URL only: short links (vm.tiktok.com, vt.tiktok.com,
// tiktok.com/t/) are refused, and the all-zeros id is the placeholder.
const match = /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/(\d+)$/.exec(url ?? "");
if (!match) {
  throw new Error(`VIDEO.json does not hold a full TikTok video URL: ${url}`);
}
if (/^0+$/.test(match[1])) {
  throw new Error(
    "VIDEO.json still holds the placeholder id — replace it with the live TikTok post URL before submitting.",
  );
}

await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "VIDEO.json"), raw);
console.log(`VIDEO.json copied to ${join(outDir, "VIDEO.json")}`);
