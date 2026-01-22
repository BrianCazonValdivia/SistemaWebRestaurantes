// src/lib/orders-store.ts

import type { Producto } from "@/lib/data";

/* =========================
   TIPOS
========================= */

export type PedidoEstado = "Vendido" | "Cancelado";

export type PedidoItem = {
  producto: Producto;
  qty: number;
};

export type ClienteInfo = {
  nombre: string;
  celular: string;
};

export type EntregaInfo =
  | {
      tipo: "recojo";
      fee: number;
    }
  | {
      tipo: "delivery";
      direccion: string;
      referencia?: string;
      fee: number;
    };

export type PagoInfo = {
  metodo: "qr" | "efectivo";
};

export type Pedido = {
  id: string;
  items: PedidoItem[];
  subtotal: number;
  entrega: EntregaInfo;
  pago: PagoInfo;
  total: number;
  estado: PedidoEstado;
  cliente: ClienteInfo;
  createdAt: number;
};

/* =========================
   STORAGE
========================= */

const STORAGE_KEY = "polleria_orders";

/* =========================
   HELPERS
========================= */

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveOrders(orders: Pedido[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

/* =========================
   API PUBLICA
========================= */

/**
 * Cargar pedidos (ventas)
 */
export function loadOrders(): Pedido[] {
  if (typeof window === "undefined") return [];
  return safeParse<Pedido[]>(localStorage.getItem(STORAGE_KEY), []);
}

/**
 * Crear un nuevo pedido (por defecto: Vendido)
 */
export function addOrder(input: {
  items: PedidoItem[];
  subtotal: number;
  entrega: EntregaInfo;
  pago: PagoInfo;
  cliente: ClienteInfo;
}): Pedido[] {
  const orders = loadOrders();

  const total = input.subtotal + input.entrega.fee;

  const nuevo: Pedido = {
    id: crypto.randomUUID(),
    items: input.items,
    subtotal: input.subtotal,
    entrega: input.entrega,
    pago: input.pago,
    total,
    estado: "Vendido", // 👈 por defecto cuenta como venta
    cliente: input.cliente,
    createdAt: Date.now(),
  };

  const next = [nuevo, ...orders];
  saveOrders(next);
  return next;
}

/**
 * Cambiar estado: Vendido / Cancelado
 */
export function updateOrderStatus(
  id: string,
  estado: PedidoEstado
): Pedido[] {
  const orders = loadOrders();

  const next = orders.map((o) =>
    o.id === id ? { ...o, estado } : o
  );

  saveOrders(next);
  return next;
}

/**
 * Eliminar un pedido puntual
 */
export function removeOrder(id: string): Pedido[] {
  const orders = loadOrders();
  const next = orders.filter((o) => o.id !== id);
  saveOrders(next);
  return next;
}

/**
 * Limpiar TODO el historial (reporte)
 */
export function clearOrders() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
