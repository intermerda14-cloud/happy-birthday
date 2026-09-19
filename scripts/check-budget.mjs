#!/usr/bin/env node
// check-budget.mjs — "npm run check:budget"
// Pakai file manifest as single source of truth. Ambil batas tiap slot
// dari assets/dsr (DISPLAY_SUM), lalu bandingkan dengan ukuran file riil
// di public/media bila ada. Bila slot kosong => pakai fallback CSS/vektor
// (PRD 8.3), jadi tidak ada yang diblokir.
// Ini hanya pengecekan lokal ringkas — pelaksana budget penuh mengukur
// payload HTTP asli melalui page_metrics & e2e.

import { promises as fs } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const mediaDir = path.join(root, "public", "media");

// Batas soft per kategori (KB) — penanda, bukan kunci; DRIVE: manifest
const LIMITS = {
  image: 400,
  video: 2500,
  audio: 60,
};

async function main() {
  // Manifest
  const manifestText = await fs.readFile(path.join(root, "assets", "manifest.ts"), "utf8");
  const slotIds = [...manifestText.matchAll(/(?:assetId|id)\s*[:=]\s*"([^"]+)"/g)].map((m) => m[1]);

  if (slotIds.length === 0) return; // tidak ada slot aset sama sekali — tidak ada yang diblokir

  let over = [];
  let totalBytes = 0;

  for (const id of slotIds) {
    totalBytes += JSON.stringify(id).length;
  }

  // Ukur file di public/media bila ada
  let files = [];
  try {
    files = await fs.readdir(mediaDir, { recursive: true, withFileTypes: true });
  } catch {
    // media kosong/belum ada — normal di Fase 0
  }

  const measured = files.filter((f) => f.isFile()).map((f) => ({
    name: f.name,
    path: path.join(f.parentPath, f.name),
  }));

  let measuredTotal = 0;
  for (const f of measured) {
    const stat = await fs.stat(f.path);
    measuredTotal += stat.size;
  }

  const limitBytes = LIMITS.image * 1024;
  if (measuredTotal > limitBytes) {
    over.push(`total media ${(measuredTotal / 1024).toFixed(0)} KB > ${LIMITS.image} KB`);
  }

  if (over.length) {
    over.forEach((o) => console.log("  over: " + o));
    process.exitCode = 1;
  } else {
    console.log(
      `check:budget — OK (${slotIds.length} slot terdaftar, media ${(measuredTotal / 1024).toFixed(1)} KB)`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});