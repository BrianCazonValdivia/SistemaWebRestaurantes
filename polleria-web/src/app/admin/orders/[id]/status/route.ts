import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function assertAdmin(req: Request) {
  const pin = req.headers.get("x-admin-pin") || "";
  const serverPin = process.env.ADMIN_PIN || "1234";
  return pin === serverPin;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!assertAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = String(params.id || "").trim();
  if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const status = String(body?.status || "").toUpperCase();

  if (!["SOLD", "CANCELED"].includes(status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status: status as "SOLD" | "CANCELED" },
  });

  return NextResponse.json(updated);
}
