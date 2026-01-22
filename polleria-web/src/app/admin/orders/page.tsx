"use client";

import { useEffect, useMemo, useState } from "react";
import { isAdminAuthed, logoutAdmin, getAdminPin } from "@/lib/admin-auth";
import { AdminLogin } from "@/components/AdminLogin";

type OrderStatus = "SOLD" | "CANCELED";
type PaymentMethod = "QR" | "CASH";
type DeliveryType = "DELIVERY" | "PICKUP";

type OrderItem = {
  id: string;
  orderId: string;
  productId: number;
  qty: number;
  price: number;
  nameSnap: string;
};

type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;

  customerName: string;
  customerPhone: string;

  deliveryType: DeliveryType;
  deliveryFee: number;
  direccion: string | null;
  referencia: string | null;

  paymentMethod: PaymentMethod;

  subtotal: number;
  total: number;

  items: OrderItem[];
};

async function adminFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const pin = getAdminPin() || "1234";
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-admin-pin": pin,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `Error ${res.status}`);
  }
  return res.json();
}

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminOrdersPage() {
  const [hydrated, setHydrated] = useState(false);
  const [authed, setAuthed] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setAuthed(isAdminAuthed());
    setHydrated(true);
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminFetch<Order[]>("/api/admin/orders");
      setOrders(data);
    } catch (e: any) {
      alert(e?.message || "Error cargando ventas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hydrated) return;
    if (!authed) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, authed]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "ALL" && o.status !== filter) return false;
      if (!q) return true;

      // Buscar en: id, nombre, teléfono, dirección, items
      const hay =
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q) ||
        (o.direccion || "").toLowerCase().includes(q) ||
        (o.items || []).some((it) => (it.nameSnap || "").toLowerCase().includes(q));

      return hay;
    });
  }, [orders, filter, query]);

  const stats = useMemo(() => {
    const sold = filtered.filter((o) => o.status === "SOLD");
    const canceled = filtered.filter((o) => o.status === "CANCELED");

    const totalSold = sold.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const totalCanceled = canceled.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

    return {
      count: filtered.length,
      soldCount: sold.length,
      canceledCount: canceled.length,
      totalSold,
      totalCanceled,
    };
  }, [filtered]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setStatus = async (id: string, status: OrderStatus) => {
    setLoading(true);
    try {
      await adminFetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (e: any) {
      alert(e?.message || "Error actualizando estado");
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
        <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 18 }}>Cargando…</div>
      </main>
    );
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: 0 }}>Admin · Ventas</h1>
          <p style={{ marginTop: 6, color: "#555" }}>
            Reporte (SQLite + Prisma) {loading ? "• trabajando..." : ""}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/" style={secondaryBtn}>← Volver</a>
          <button onClick={load} style={secondaryBtn} disabled={loading}>Recargar</button>
          <button
            onClick={() => {
              logoutAdmin();
              setAuthed(false);
            }}
            style={secondaryBtn}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ ...cardStyle, marginTop: 14 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={pill(filter === "ALL")} onClick={() => setFilter("ALL")}>Todos</button>
            <button style={pill(filter === "SOLD")} onClick={() => setFilter("SOLD")}>Vendido</button>
            <button style={pill(filter === "CANCELED")} onClick={() => setFilter("CANCELED")}>Cancelado</button>
          </div>

          <input
            style={{ ...inputStyle, maxWidth: 360 }}
            placeholder="Buscar (nombre, teléfono, producto, dirección...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 18, flexWrap: "wrap", color: "#444" }}>
          <strong>Total pedidos:</strong> {stats.count}
          <strong>Vendidos:</strong> {stats.soldCount} ({stats.totalSold.toFixed(2)} Bs.)
          <strong>Cancelados:</strong> {stats.canceledCount} ({stats.totalCanceled.toFixed(2)} Bs.)
        </div>
      </div>

      {/* Lista */}
      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {filtered.map((o) => {
          const isOpen = !!expanded[o.id];

          return (
            <div key={o.id} style={listItemStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ minWidth: 260 }}>
                  <div style={{ fontWeight: 900, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <span>{o.customerName}</span>
                    <span style={badge(o.status)}>
                      {o.status === "SOLD" ? "Vendido" : "Cancelado"}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                    {formatDateTime(o.createdAt)} • {o.customerPhone} •{" "}
                    {o.deliveryType === "DELIVERY" ? "Delivery" : "Recojo"} •{" "}
                    {o.paymentMethod === "CASH" ? "Efectivo" : "QR"}
                  </div>

                  {o.deliveryType === "DELIVERY" && (
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                      📍 {o.direccion || "-"} {o.referencia ? `(${o.referencia})` : ""}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>{Number(o.total).toFixed(2)} Bs.</div>

                  <button onClick={() => toggleExpanded(o.id)} style={secondaryBtn}>
                    {isOpen ? "Ocultar" : "Ver detalle"}
                  </button>

                  <button
                    onClick={() => setStatus(o.id, "SOLD")}
                    style={o.status === "SOLD" ? primaryBtn : secondaryBtn}
                    disabled={loading}
                  >
                    Vendido
                  </button>

                  <button
                    onClick={() => setStatus(o.id, "CANCELED")}
                    style={o.status === "CANCELED" ? dangerBtn : secondaryBtn}
                    disabled={loading}
                  >
                    Cancelado
                  </button>
                </div>
              </div>

              {isOpen && (
                <div style={{ marginTop: 10, borderTop: "1px solid #eee", paddingTop: 10 }}>
                  <div style={{ display: "grid", gap: 8 }}>
                    {(o.items || []).map((it) => (
                      <div
                        key={it.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                          padding: 10,
                          border: "1px solid #eee",
                          borderRadius: 12,
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 900 }}>{it.nameSnap}</div>
                          <div style={{ fontSize: 12, color: "#666" }}>
                            {it.qty} × {Number(it.price).toFixed(2)} Bs.
                          </div>
                        </div>

                        <div style={{ fontWeight: 900 }}>{(it.qty * Number(it.price)).toFixed(2)} Bs.</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                    <Row label="Subtotal" value={`${Number(o.subtotal).toFixed(2)} Bs.`} />
                    <Row label="Delivery" value={`${Number(o.deliveryFee).toFixed(2)} Bs.`} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 16 }}>
                      <div>Total</div>
                      <div>{Number(o.total).toFixed(2)} Bs.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ padding: 16, border: "1px dashed #ddd", borderRadius: 14 }}>
            No hay ventas con esos filtros.
          </div>
        )}
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

const cardStyle: React.CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: 12,
  border: "1px solid #eee",
  outline: "none",
};

const secondaryBtn: React.CSSProperties = {
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

const dangerBtn: React.CSSProperties = {
  background: "#ffecec",
  border: "1px solid #ffbcbc",
  color: "#b10000",
  padding: "12px 14px",
  borderRadius: 12,
  fontWeight: 900,
  cursor: "pointer",
};

const listItemStyle: React.CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 12,
  display: "block",
};

const pill = (active: boolean): React.CSSProperties => ({
  borderRadius: 999,
  padding: "10px 12px",
  border: `1px solid ${active ? "#f25a2a" : "#eee"}`,
  background: active ? "rgba(242,90,42,0.12)" : "white",
  fontWeight: 900,
  cursor: "pointer",
});

const badge = (status: OrderStatus): React.CSSProperties => ({
  fontSize: 12,
  fontWeight: 900,
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid #eee",
  background: status === "SOLD" ? "rgba(20,160,80,0.12)" : "rgba(200,0,0,0.10)",
});
