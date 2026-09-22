import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { newSessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const user = await prisma.user.findUnique({ where: { email: email?.trim().toLowerCase() } });
    if (!user || !(await bcrypt.compare(password ?? "", user.passwordHash))) {
      return NextResponse.json({ error: "E-posta veya parola hatalı." }, { status: 401 });
    }
    const token = newSessionToken();
    await prisma.session.create({ data: { token, userId: user.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) } });
    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Giriş yapılamadı." }, { status: 500 });
  }
}
