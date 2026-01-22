"use client";

import { useEffect, useMemo, useState } from "react";
import type { Producto } from "@/lib/data";
import { CATEGORIAS, normalizePrecio } from "@/lib/data";
import { isAdminAuthed, logoutAdmin, getAdminPin } from "@/lib/admin-auth";
import { AdminLogin } from "@/components/AdminLogin";

type FormState = {
  id?: number;
  nombre: string;
  desc: string;
  precio: string;
  categoria: string;
};

const emptyForm: FormState = {
  nombre: "",
  desc: "",
  precio: "",
  categoria: "Combos",
};

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const pin = getAdminPin();
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

export default function AdminProductsPage() {
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [products, setProducts] = useState<Producto[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthed(isAdminAuthed());
    setHydrated(true);
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Producto[]>("/api/admin/products");
      setProducts(data);
    } catch (e: any) {
      alert(e?.message || "Error cargando productos");
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
    if (!q) return products;
    return products.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
    );
  }, [products, query]);

  const isEditing = form.id != null;

  const resetForm = () => setForm(emptyForm);

  const onSubmit = async () => {
    const nombre = form.nombre.trim();
    const desc = form.desc.trim();
    const categoria = form.categoria || "Combos";
    const precioNum = normalizePrecio(form.precio);

    if (!nombre) return alert("El nombre es obligatorio");
    if (precioNum <= 0) return alert("El precio debe ser mayor a 0");

    setLoading(true);
    try {
      if (isEditing) {
        await apiFetch(`/api/admin/products/${form.id}`, {
          method: "PUT",
          body: JSON.stringify({ nombre, desc, categoria, precio: precioNum }),
        });
      } else {
        await apiFetch(`/api/admin/products`, {
          method: "POST",
          body: JSON.stringify({ nombre, desc, categoria, precio: precioNum }),
        });
      }

      resetForm();
      await load();
    } catch (e: any) {
      alert(e?.message || "Error guardando producto");
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (p: Producto) => {
    setForm({
      id: p.id,
      nombre: p.nombre,
      desc: p.desc,
      precio: String(p.precio),
      categoria: p.categoria,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;

    setLoading(true);
    try {
      await apiFetch(`/api/admin/products/${id}`, { method: "DELETE" });
      await load();
      if (form.id === id) resetForm();
    } catch (e: any) {
      alert(e?.message || "Error eliminando producto");
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <main style={{ maxWidth: 520, margin: "0 auto", padding: 16 }}>
        <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 18 }}>
          Cargando...
        </div>
      </main>
    );
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: 0 }}>Admin · Productos</h1>
          <p style={{ marginTop: 6, color: "#555" }}>
            CRUD real (SQLite + Prisma) {loading ? "• trabajando..." : ""}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/" style={secondaryBtn}>← Volver</a>
          <button onClick={load} style={secondaryBtn} disabled={loading}>
            Recargar
          </button>
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

      {/* FORM */}
      <div style={cardStyle}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>
          {isEditing ? "Editar producto" : "Nuevo producto"}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <Label text="Nombre" />
            <input
              style={inputStyle}
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <Label text="Descripción" />
            <input
              style={inputStyle}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </div>

          <div>
            <Label text="Precio (Bs.)" />
            <input
              style={inputStyle}
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
            />
          </div>

          <div>
            <Label text="Categoría" />
            <select
              style={{ ...inputStyle, cursor: "pointer" }}
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button onClick={onSubmit} style={primaryBtn} disabled={loading}>
            {isEditing ? "Guardar cambios" : "Crear producto"}
          </button>
          {isEditing && (
            <button onClick={resetForm} style={secondaryBtn} disabled={loading}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontWeight: 900 }}>Productos ({filtered.length})</div>
        <input
          style={{ ...inputStyle, maxWidth: 320 }}
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {filtered.map((p) => (
          <div key={p.id} style={listItemStyle}>
            <div>
              <div style={{ fontWeight: 900 }}>{p.nombre}</div>
              <div style={{ fontSize: 12, color: "#666" }}>
                {p.categoria} • {p.desc || "Sin descripción"}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ fontWeight: 900 }}>{p.precio.toFixed(2)} Bs.</div>
              <button onClick={() => onEdit(p)} style={secondaryBtn} disabled={loading}>Editar</button>
              <button onClick={() => onDelete(p.id)} style={dangerBtn} disabled={loading}>Eliminar</button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: 16, border: "1px dashed #ddd", borderRadius: 14 }}>
            No hay productos.
          </div>
        )}
      </div>
    </main>
  );
}

function Label({ text }: { text: string }) {
  return <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 6 }}>{text}</div>;
}

const cardStyle: React.CSSProperties = {
  marginTop: 14,
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

const primaryBtn: React.CSSProperties = {
  background: "#f25a2a",
  color: "white",
  border: "none",
  padding: "12px 14px",
  borderRadius: 12,
  fontWeight: 900,
  cursor: "pointer",
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
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};
