"use client";

import { useState } from "react";
import { loginAdmin } from "@/lib/admin-auth";

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    setError("");
    const ok = loginAdmin(pin.trim());
    if (!ok) {
      setError("PIN incorrecto. Intenta de nuevo.");
      return;
    }
    onSuccess();
  };

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: 16 }}>
      <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 18 }}>
        <h1 style={{ margin: 0 }}>🔒 Admin Login</h1>
        <p style={{ marginTop: 6, color: "#555" }}>
          Ingresa el PIN para acceder al panel de productos.
        </p>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 6 }}>PIN</div>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={inputStyle}
            placeholder="Ej: 1234"
            type="password"
            inputMode="numeric"
          />
          {error && <div style={{ marginTop: 10, color: "#b10000", fontWeight: 900 }}>{error}</div>}

          <button onClick={submit} style={primaryBtn}>
            Entrar
          </button>

          <a href="/" style={linkStyle}>
            ← Volver a la tienda
          </a>
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid #eee",
  outline: "none",
};

const primaryBtn: React.CSSProperties = {
  marginTop: 12,
  width: "100%",
  background: "#f25a2a",
  color: "white",
  border: "none",
  padding: "12px 14px",
  borderRadius: 12,
  fontWeight: 900,
  cursor: "pointer",
};

const linkStyle: React.CSSProperties = {
  display: "inline-block",
  marginTop: 12,
  color: "#f25a2a",
  fontWeight: 900,
  textDecoration: "none",
};
