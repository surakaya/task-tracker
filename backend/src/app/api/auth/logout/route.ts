import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (token) await prisma.session.deleteMany({ where: { token } });
  return NextResponse.json({ message: "Çıkış yapıldı." });
}
