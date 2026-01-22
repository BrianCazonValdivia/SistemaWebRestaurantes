"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";

type DeliveryType = "delivery" | "recojo";
type PaymentType = "efectivo" | "qr";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();

  // Form
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("efectivo");

  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const deliveryFee = useMemo(() => (deliveryType === "delivery" ? 8 : 0), [deliveryType]);
  const totalFinal = useMemo(() => total + deliveryFee, [total, deliveryFee]);

  // Adaptación segura de items: aseguramos productId + qty
  const orderItems = useMemo(() => {
    return items.map((it: any) => {
      const p = it.producto ?? it.product ?? it.item ?? it;
      return {
        productId: p?.id,
        qty: it.qty ?? it.cantidad ?? 1,
      };
    });
  }, [items]);

  const validate = () => {
    if (!items?.length) return "Tu carrito está vacío.";
    if (!nombre.trim()) return "Tu nombre es obligatorio.";
    if (!celular.trim()) return "Tu celular es obligatorio.";
    if (deliveryType === "delivery" && !direccion.trim()) return "La dirección es obligatoria para delivery.";

    // Validar que cada item tenga productId
    for (const it of orderItems) {
      if (!it.productId) return "Hay productos inválidos en el carrito (sin ID).";
      if (!it.qty || it.qty <= 0) return "Cantidad inválida en el carrito.";
    }

    return null;
  };

  const onConfirm = async () => {
    const err = validate();
    if (err) return alert(err);

    setSaving(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: nombre.trim(),
          customerPhone: celular.trim(),
          deliveryType: deliveryType === "delivery" ? "DELIVERY" : "PICKUP",
          deliveryFee,
          direccion: deliveryType === "delivery" ? direccion.trim() : null,
          referencia: referencia.trim() || null,
          paymentMethod: paymentType === "qr" ? "QR" : "CASH",
          items: orderItems.map((it) => ({
            productId: Number(it.productId),
            qty: Number(it.qty) || 1,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return alert(data?.error || "Error guardando pedido");
      }

      clear();
      setSubmitted(true);
    } catch (e: any) {
      alert(e?.message || "Error guardando pedido");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Auto-redirect 4s después de submit
  useEffect(() => {
    if (!submitted) return;

    const t = setTimeout(() => {
      router.push("/");
    }, 4000);

    return () => clearTimeout(t);
  }, [submitted, router]);

  // ✅ Pantalla de éxito (sin botón admin)
  if (submitted) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 16,
            padding: 22,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48 }}>✅</div>

          <h1 style={{ margin: "10px 0 0" }}>Pedido registrado</h1>

          <p style={{ marginTop: 8, color: "#555" }}>
            Tu pedido se guardó correctamente.
            <br />
            Serás redirigido a la tienda en unos segundos…
          </p>

          <p style={{ marginTop: 10, fontSize: 13, color: "#999" }}>Gracias por tu compra 🍗</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Checkout</h1>
          <p style={{ marginTop: 6, color: "#555" }}>Completa tus datos y confirma tu pedido.</p>
        </div>

        <a href="/" style={btn}>
          ← Volver
        </a>
      </div>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* RESUMEN */}
        <section style={card}>
          <h2 style={{ marginTop: 0 }}>Resumen</h2>

          {items.length === 0 ? (
            <div style={{ color: "#666" }}>Tu carrito está vacío.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {items.map((it: any) => {
                const p = it.product ?? it.producto;
                const qty = it.qty ?? it.cantidad ?? 1;
                const precio = p?.precio ?? 0;

                return (
                  <div
                    key={p?.id ?? `${p?.nombre}-${Math.random()}`}
                    style={{
                      border: "1px solid #eee",
                      borderRadius: 12,
                      padding: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 900 }}>{p?.nombre ?? "Producto"}</div>
                      <div style={{ color: "#666", fontSize: 12 }}>
                        {qty} × {precio.toFixed(2)} Bs.
                      </div>
                    </div>

                    <div style={{ fontWeight: 900 }}>{(qty * precio).toFixed(2)} Bs.</div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 14, borderTop: "1px solid #eee", paddingTop: 12, display: "grid", gap: 6 }}>
            <Row label="Subtotal" value={`${total.toFixed(2)} Bs.`} />
            <Row label="Delivery" value={`${deliveryFee.toFixed(2)} Bs.`} />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 16 }}>
              <div>Total</div>
              <div>{totalFinal.toFixed(2)} Bs.</div>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section style={card}>
          <h2 style={{ marginTop: 0 }}>Datos</h2>

          <Label text="Nombre" />
          <input style={input} value={nombre} onChange={(e) => setNombre(e.target.value)} />

          <div style={{ height: 10 }} />

          <Label text="Celular" />
          <input style={input} value={celular} onChange={(e) => setCelular(e.target.value)} />

          <div style={{ height: 14 }} />

          <Label text="Entrega" />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setDeliveryType("delivery")} style={pill(deliveryType === "delivery")}>
              Delivery
            </button>
            <button type="button" onClick={() => setDeliveryType("recojo")} style={pill(deliveryType === "recojo")}>
              Recojo
            </button>
          </div>

          {deliveryType === "delivery" && (
            <>
              <div style={{ height: 12 }} />

              <Label text="Dirección" />
              <input style={input} value={direccion} onChange={(e) => setDireccion(e.target.value)} />

              <div style={{ height: 10 }} />

              <Label text="Referencia (opcional)" />
              <input style={input} value={referencia} onChange={(e) => setReferencia(e.target.value)} />
            </>
          )}

          <div style={{ height: 14 }} />

          <Label text="Pago" />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setPaymentType("efectivo")} style={pill(paymentType === "efectivo")}>
              Efectivo
            </button>
            <button type="button" onClick={() => setPaymentType("qr")} style={pill(paymentType === "qr")}>
              QR
            </button>
          </div>

          <button
            type="button"
            onClick={onConfirm}
            disabled={saving || items.length === 0}
            style={{
              ...primaryBtn,
              marginTop: 16,
              width: "100%",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Guardando..." : "Confirmar pedido"}
          </button>

          <button
            type="button"
            onClick={clear}
            disabled={saving}
            style={{ ...btn, marginTop: 10, width: "100%", textAlign: "center", opacity: saving ? 0.7 : 1 }}
          >
            Vaciar carrito
          </button>
        </section>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", color: "#444" }}>
      <div>{label}</div>
      <div style={{ fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 6 }}>{text}</div>;
}

const card: React.CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: 12,
  border: "1px solid #eee",
  outline: "none",
};

const btn: React.CSSProperties = {
  background: "white",
  border: "1px solid #eee",
  padding: "12px 14px",
  borderRadius: 12,
  fontWeight: 900,
  cursor: "pointer",
  textDecoration: "none",
  color: "#111",
};

const primaryBtn: React.CSSProperties = {
  background: "#f25a2a",
  color: "white",
  border: "none",
  padding: "12px 14px",
  borderRadius: 12,
  fontWeight: 900,
  cursor: "pointer",
};

const pill = (active: boolean): React.CSSProperties => ({
  borderRadius: 999,
  padding: "10px 12px",
  border: `1px solid ${active ? "#f25a2a" : "#eee"}`,
  background: active ? "rgba(242,90,42,0.12)" : "white",
  fontWeight: 900,
  cursor: "pointer",
});
