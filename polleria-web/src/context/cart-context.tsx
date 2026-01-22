"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Producto } from "@/lib/data";

type CartItem = { producto: Producto; qty: number };

type CartContextType = {
  items: CartItem[];
  add: (p: Producto) => void;
  setQty: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "polleria_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (p: Producto) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.producto.id === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { producto: p, qty: 1 }];
    });
  };

  const setQty = (productId: number, qty: number) => {
    setItems((prev) =>
      prev
        .map((x) => (x.producto.id === productId ? { ...x, qty } : x))
        .filter((x) => x.qty > 0)
    );
  };

  const remove = (productId: number) => {
    setItems((prev) => prev.filter((x) => x.producto.id !== productId));
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((acc, i) => acc + i.qty, 0), [items]);
  const total = useMemo(() => items.reduce((acc, i) => acc + i.producto.precio * i.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
