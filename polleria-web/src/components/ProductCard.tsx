"use client";

import type { Producto } from "@/lib/data";
import { useCart } from "@/context/cart-context";

export function ProductCard({ p }: { p: Producto }) {
  const { add } = useCart();
  const formatBs = (n: number) => `${n.toFixed(2)} Bs.`;

  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 18,
        overflow: "hidden",
        background: "white",
        boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ height: 170, background: "#f3f3f3" }} />

      <div style={{ padding: 14, display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 900, fontSize: 20 }}>{p.nombre}</div>
          <div style={{ color: "#666", fontSize: 13, marginTop: 6 }}>{p.desc}</div>
          <div style={{ marginTop: 10, fontWeight: 900, fontSize: 16 }}>{formatBs(p.precio)}</div>
        </div>

        <button
          onClick={() => add(p)}
          style={{
            width: 46,
            height: 46,
            borderRadius: 999,
            background: "#f25a2a",
            color: "white",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            fontWeight: 900,
            flex: "0 0 auto",
          }}
          title="Agregar al carrito"
        >
          +
        </button>
      </div>
    </div>
  );
}
