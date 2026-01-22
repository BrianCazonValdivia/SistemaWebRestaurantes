"use client";

import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";


type Props = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: Props) {
  
  const router = useRouter();
  const { items, setQty, remove, clear, count, total } = useCart();
  const formatBs = (n: number) => `${n.toFixed(2)} Bs.`;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 50,
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(420px, 92vw)",
          background: "white",
          zIndex: 60,
          transform: open ? "translateX(0)" : "translateX(110%)",
          transition: "transform 0.25s ease",
          boxShadow: "-20px 0 50px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>Tu carrito</div>
            <div style={{ fontSize: 12, color: "#666" }}>{count} items</div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "1px solid #eee",
              background: "white",
              borderRadius: 10,
              padding: "8px 10px",
              cursor: "pointer",
              fontWeight: 800,
            }}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        <div style={{ padding: 16, overflow: "auto", flex: 1 }}>
          {items.length === 0 ? (
            <div style={{ padding: 18, border: "1px dashed #ddd", borderRadius: 14, color: "#666" }}>
              Tu carrito está vacío. Agrega productos con el botón <b>+</b>.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item) => (
                <div
                  key={item.producto.id}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 14,
                    padding: 12,
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: 56, height: 56, background: "#f3f3f3", borderRadius: 12, flex: "0 0 auto" }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 900 }}>{item.producto.nombre}</div>
                    <div style={{ color: "#666", fontSize: 12 }}>{formatBs(item.producto.precio)}</div>

                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={() => setQty(item.producto.id, item.qty - 1)}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          border: "1px solid #eee",
                          background: "white",
                          cursor: "pointer",
                          fontWeight: 900,
                        }}
                      >
                        −
                      </button>

                      <div style={{ minWidth: 26, textAlign: "center", fontWeight: 900 }}>{item.qty}</div>

                      <button
                        onClick={() => setQty(item.producto.id, item.qty + 1)}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          border: "1px solid #eee",
                          background: "white",
                          cursor: "pointer",
                          fontWeight: 900,
                        }}
                      >
                        +
                      </button>

                      <button
                        onClick={() => remove(item.producto.id)}
                        style={{
                          marginLeft: "auto",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          color: "#d11",
                          fontWeight: 900,
                        }}
                        title="Eliminar"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div style={{ fontWeight: 900 }}>{formatBs(item.producto.precio * item.qty)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: 16, borderTop: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, marginBottom: 10 }}>
            <div>Total</div>
            <div>{formatBs(total)}</div>
          </div>

          <button
            disabled={items.length === 0}
            onClick={() => router.push("/checkout")}
            style={{
              width: "100%",
              background: items.length === 0 ? "#ddd" : "#f25a2a",
              border: "none",
              padding: "12px 14px",
              borderRadius: 14,
              color: "white",
              fontWeight: 900,
              cursor: items.length === 0 ? "not-allowed" : "pointer",
              marginBottom: 10,
            }}
          >
            Continuar (Checkout)
          </button>

          <button
            disabled={items.length === 0}
            onClick={clear}
            style={{
              width: "100%",
              background: "white",
              border: "1px solid #eee",
              padding: "12px 14px",
              borderRadius: 14,
              color: "#111",
              fontWeight: 900,
              cursor: items.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </>
  );
}
