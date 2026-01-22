import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function assertAdmin(req: Request) {
  const pin = req.headers.get("x-admin-pin") || "";
  const serverPin = process.env.ADMIN_PIN || "1234";
  return pin === serverPin;
}

export async function GET(req: Request) {
  if (!assertAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  if (!assertAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const nombre = String(body?.nombre || "").trim();
  const desc = String(body?.desc || "").trim();
  const categoria = String(body?.categoria || "").trim();
  const precio = Number(body?.precio);

  if (!nombre) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  if (!categoria) return NextResponse.json({ error: "Categoría requerida" }, { status: 400 });
  if (!Number.isFinite(precio) || precio <= 0) return NextResponse.json({ error: "Precio inválido" }, { status: 400 });

  const created = await prisma.product.create({
    data: { nombre, desc, categoria, precio },
  });

  return NextResponse.json(created);
}
