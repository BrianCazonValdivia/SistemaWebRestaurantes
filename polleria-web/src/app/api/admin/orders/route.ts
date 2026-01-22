import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function assertAdmin(req: Request) {
  const pin = req.headers.get("x-admin-pin") || "";
  const serverPin = process.env.ADMIN_PIN || "1234";
  return pin === serverPin;
}

export async function GET(req: Request) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return NextResponse.json(orders);
}
