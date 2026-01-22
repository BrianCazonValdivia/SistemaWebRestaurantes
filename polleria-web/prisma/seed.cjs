const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const productos = [
    { id: 1, nombre: "Combo Clásico", desc: "1/4 pollo + papas + ensalada", precio: 35, categoria: "Combos" },
    { id: 2, nombre: "1/2 Pollo", desc: "Incluye papas y ensalada", precio: 55, categoria: "Pollos" },
    { id: 3, nombre: "Coca-Cola 500ml", desc: "Bien fría", precio: 10, categoria: "Bebidas" },
    { id: 4, nombre: "Promo 2x1 Alitas", desc: "Solo hoy", precio: 28, categoria: "Promos" },
    { id: 5, nombre: "Postre Helado", desc: "Chocolate/Vainilla", precio: 12, categoria: "Postres" }
  ];

  for (const p of productos) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        nombre: p.nombre,
        desc: p.desc,
        precio: p.precio,
        categoria: p.categoria
      },
      create: p
    });
  }

  console.log("✅ Seed completado: productos cargados/actualizados.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
