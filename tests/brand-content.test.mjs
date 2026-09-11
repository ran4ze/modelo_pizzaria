import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const siteDataUrl = new URL("../app/site-data.ts", import.meta.url);
const pageUrl = new URL("../app/page.tsx", import.meta.url);
const cssUrl = new URL("../app/globals.css", import.meta.url);

test("keeps the generic pizzeria identity and complete menu in source", async () => {
  const siteData = await readFile(siteDataUrl, "utf8");

  assert.match(siteData, /fullName: "Fatia & Fogo"/);
  assert.match(siteData, /whatsapp: ""/);
  assert.match(siteData, /schedule: "Terça a domingo/);

  for (const product of [
    "Margherita da Casa",
    "Calabresa Artesanal",
    "Chocolate & Morango",
    "Fritas Clássicas",
    "Coxinhas · 12 unidades",
    "Refrigerante · 1 litro",
  ]) {
    assert.match(siteData, new RegExp(`name: "${product}"`));
  }
});

test("uses GSAP, Lenis and three eight-slice pizza assets", async () => {
  const [page, css] = await Promise.all([
    readFile(pageUrl, "utf8"),
    readFile(cssUrl, "utf8"),
  ]);

  assert.match(page, /from "gsap"/);
  assert.match(page, /from "lenis"/);
  assert.match(page, /pizza-margherita\.webp/);
  assert.match(page, /pizza-calabresa\.webp/);
  assert.match(page, /pizza-chocolate\.webp/);
  assert.match(page, /Array\.from\(\{ length: 8 \}/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("connects every menu group and builder flavor to product imagery", async () => {
  const [siteData, page, css] = await Promise.all([
    readFile(siteDataUrl, "utf8"),
    readFile(pageUrl, "utf8"),
    readFile(cssUrl, "utf8"),
  ]);

  for (const asset of [
    "pizza-frango-cremoso.webp",
    "pizza-portuguesa.webp",
    "pizza-quatro-queijos.webp",
    "pizza-banana-canela.webp",
    "fritas-classicas.webp",
    "fritas-cheddar.webp",
    "coxinhas.webp",
    "refrigerante-cola.webp",
  ]) {
    assert.match(siteData, new RegExp(asset.replace(".", "\\.")));
  }

  assert.match(page, /function BuilderPizzaHalf/);
  assert.match(page, /flavor=\{firstFlavor\}/);
  assert.match(page, /flavor=\{secondFlavor\}/);
  assert.match(page, /src=\{flavor\.image\}/);
  assert.match(css, /builder-pizza-half\.first/);
  assert.match(css, /builder-pizza-half\.second/);
});
