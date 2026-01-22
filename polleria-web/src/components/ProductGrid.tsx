"use client";

import { ProductCard } from "@/components/ProductCard";
import type { Producto } from "@/lib/data";

export function ProductGrid({ productos }: { productos: Producto[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
      {productos.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
