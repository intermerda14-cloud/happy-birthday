#!/usr/bin/env node
// scripts/check-content.mjs — "npm run check:content"
// Dipanggil otomatis di `next build` (package.json). Gagal (exit 1) bila masih
// ada TODO: di content/ — sesuai PRD Bagian 10.1.
// `--allow-todo`: hanya memperingatkan (dipakai saat develop Fase 0).

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const contentDir = path.join(root, "content");
const allowTodo = process.argv.includes("--allow-todo");
const RE_TODO = /\bTODO\s*:/g;

async function collect(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await collect(full)));
    else if (e.isFile() && /\.(ts|tsx)$/.test(e.name)) out.push(full);
  }
  return out;
}

const files = await collect(contentDir);
let bad = 0;
let total = 0 