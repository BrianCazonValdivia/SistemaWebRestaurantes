"use client";

import type { Producto } from "@/lib/data";
import { ADMIN_PRODUCTS_KEY, PRODUCTOS } from "@/lib/data";

export function loadProducts(): Producto[] {
  try {
    const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    if (!raw) return PRODUCTOS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return PRODUCTOS;
    return parsed;
  } catch {
    return PRODUCTOS;
  }
}

export function saveProducts(products: Producto[]) {
  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
}

export function nextId(products: Producto[]) {
  const max = products.reduce((acc, p) => Math.max(acc, p.id), 0);
  return max + 1;
}
