"use client";

import { CATEGORIAS } from "@/lib/data";
import { useCart } from "@/context/cart-context";

type Props = {
  categoriaActiva: string;
  onChangeCategoria: (c: string) => void;
  onOpenCart: () => void;
};

export function Header({ categoriaActiva, onChangeCategoria, onOpenCart }: Props) {
  const { count } = useCart();

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "#141414",
        color: "white",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 0.4 }}>Pollería</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>pedidos rápidos • combos • delivery</div>
        </div>

        <button
          onClick={onOpenCart}
          style={{
            background: "#f25a2a",
            border: "none",
            padding: "10px 14px",
            borderRadius: 999,
            color: "white",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          🛒 Carrito
          <span
            style={{
              background: "rgba(0,0,0,0.25)",
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 13,
            }}
          >
            {count}
          </span>
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 12px 16px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 10, minWidth: "max-content" }}>
          {CATEGORIAS.map((c) => {
            const active = c === categoriaActiva;
            return (
              <button
                key={c}
                onClick={() => onChangeCategoria(c)}
                style={{
                  background: active ? "#f25a2a" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${active ? "#f25a2a" : "rgba(255,255,255,0.12)"}`,
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
