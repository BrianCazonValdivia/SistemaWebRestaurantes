import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/orders
 * (opcional, útil para debug o reportes simples)
 */
export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return NextResponse.json(orders);
}

/**
 * POST /api/orders
 * Crear un pedido desde Checkout
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const customerName = String(body?.customerName || "").trim();
    const customerPhone = String(body?.customerPhone || "").trim();

    const deliveryType = body?.deliveryType as "DELIVERY" | "PICKUP";
    const deliveryFee = Number(body?.deliveryFee) || 0;
    const direccion = body?.direccion ? String(body.direccion).trim() : null;
    const referencia = body?.referencia ? String(body.referencia).trim() : null;

    const paymentMethod = body?.paymentMethod as "QR" | "CASH";

    const items = body?.items as Array<{ productId: number; qty: number }>;

    // 🔒 Validaciones básicas
    if (!customerName) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }

    if (!customerPhone) {
      return NextResponse.json({ error: "Celular requerido" }, { status: 400 });
    }

    if (!["DELIVERY", "PICKUP"].includes(deliveryType)) {
      return NextResponse.json({ error: "Tipo de entrega inválido" }, { status: 400 });
    }

    if (!["QR", "CASH"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Método de pago inválido" }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    // 🔎 Traer productos reales desde BD
    const ids = items
      .map((i) => Number(i.productId))
      .filter((n) => Number.isFinite(n));

    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;

    const orderItems = items.map((i) => {
      const productId = Number(i.productId);
      const qty = Math.max(1, Number(i.qty) || 1);
      const product = productMap.get(productId);

      if (!product) {
        throw new Error(`Producto no existe: ${productId}`);
      }

      subtotal += product.precio * qty;

      return {
        productId: product.id,
        qty,
        price: product.precio,
        nameSnap: product.nombre, // snapshot histórico
      };
    });

    const total = subtotal + (deliveryType === "DELIVERY" ? deliveryFee : 0);

    // 💾 Crear pedido
    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        deliveryType,
        deliveryFee: deliveryType === "DELIVERY" ? deliveryFee : 0,
        direccion: deliveryType === "DELIVERY" ? direccion || "" : null,
        referencia,
        paymentMethod,
        subtotal,
        total,
        status: "SOLD", // o PENDING si luego quieres flujo extra
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("❌ Error creando pedido:", error);
    return NextResponse.json(
      { error: "Error interno creando pedido" },
      { status: 500 }
    );
  }
}
