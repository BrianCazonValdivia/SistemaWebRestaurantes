import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function assertAdmin(req: Request) {
  const pin = req.headers.get("x-admin-pin") || "";
  const serverPin = process.env.ADMIN_PIN || "1234";
  return pin === serverPin;
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params; // ✅ Next 15 happy
  const orderId = String(id || "").trim();

  const body = await req.json().catch(() => ({}));
  const status = String(body?.status || "").toUpperCase();

  if (!orderId) return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  if (!["SOLD", "CANCELED"].includes(status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as "SOLD" | "CANCELED" },
  });

  return NextResponse.json(updated);
}
