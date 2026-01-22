export default function NotFound() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 18 }}>
        <h1 style={{ margin: 0 }}>404 - Página no encontrada</h1>
        <p style={{ marginTop: 8, color: "#555" }}>
          Esa ruta no existe. Revisa la URL.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <a href="/" style={btn}>Ir a la tienda</a>
          <a href="/admin/products" style={btn}>Admin Productos</a>
          <a href="/admin/orders" style={btn}>Admin Ventas</a>
        </div>
      </div>
    </main>
  );
}

const btn: React.CSSProperties = {
  background: "white",
  border: "1px solid #eee",
  padding: "12px 14px",
  borderRadius: 12,
  fontWeight: 900,
  textDecoration: "none",
  color: "#111",
};
