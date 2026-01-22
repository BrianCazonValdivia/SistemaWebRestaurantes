"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductGrid } from "@/components/ProductGrid";
import type { Producto } from "@/lib/data";
import { loadProducts } from "@/lib/products-store";

export default function Home() {
  const [categoriaActiva, setCategoriaActiva] = useState("Combos");
  const [cartOpen, setCartOpen] = useState(false);

  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProductos(data);
    })();
  }, []);


  const productosFiltrados = useMemo(
    () => productos.filter((p) => p.categoria === categoriaActiva),
    [productos, categoriaActiva]
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <Header
        categoriaActiva={categoriaActiva}
        onChangeCategoria={setCategoriaActiva}
        onOpenCart={() => setCartOpen(true)}
      />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
        <ProductGrid productos={productosFiltrados} />
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
