import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function assertAdmin(req: Request) {
  const pin = req.headers.get("x-admin-pin") || "";
  const serverPin = process.env.ADMIN_PIN || "1234";
  return pin === serverPin;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!assertAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const body = await req.json();
  const nombre = String(body?.nombre || "").trim();
  const desc = String(body?.desc || "").trim();
  const categoria = String(body?.categoria || "").trim();
  const precio = Number(body?.precio);

  if (!nombre) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  if (!categoria) return NextResponse.json({ error: "Categoría requerida" }, { status: 400 });
  if (!Number.isFinite(precio) || precio <= 0) return NextResponse.json({ error: "Precio inválido" }, { status: 400 });

  const updated = await prisma.product.update({
    where: { id },
    data: { nombre, desc, categoria, precio },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!assertAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
