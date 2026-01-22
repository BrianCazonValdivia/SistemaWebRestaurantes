export type Producto = {
  id: number;
  nombre: string;
  desc: string;
  precio: number; // Bs.
  categoria: string;
};

export const CATEGORIAS = ["Promos", "Combos", "Pollos", "Bebidas", "Postres"] as const;

export const PRODUCTOS: Producto[] = [
  { id: 1, nombre: "Combo Clásico", desc: "1/4 pollo + papas + ensalada", precio: 35, categoria: "Combos" },
  { id: 2, nombre: "1/2 Pollo", desc: "Incluye papas y ensalada", precio: 55, categoria: "Pollos" },
  { id: 3, nombre: "Coca-Cola 500ml", desc: "Bien fría", precio: 10, categoria: "Bebidas" },
  { id: 4, nombre: "Promo 2x1 Alitas", desc: "Solo hoy", precio: 28, categoria: "Promos" },
  { id: 5, nombre: "Postre Helado", desc: "Chocolate/Vainilla", precio: 12, categoria: "Postres" },
];

export const ADMIN_PRODUCTS_KEY = "polleria_admin_products_v1";

export function normalizePrecio(value: string): number {
  // acepta "10", "10.5", "10,5"
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
