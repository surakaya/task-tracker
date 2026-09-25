import bcrypt from "bcryptjs";

import { NextRequest, NextResponse } from "next/server";

import { newSessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = await request.json();

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      password.length < 8
    ) {
      return NextResponse.json(
        {
          error:
            "Ad, geçerli e-posta ve en az 8 karakterli parola zorunludur.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      return NextResponse.json(
        {
          error: "Geçerli bir e-posta girin.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: await bcrypt.hash(
          password,
          12
        ),
        phone: phone?.trim() || null,
      },
    });

    const token = newSessionToken();

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(
          Date.now() +
            1000 * 60 * 60 * 24 * 7
        ),
      },
    });

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (
      (error as { code?: string }).code ===
      "P2002"
    ) {
      return NextResponse.json(
        {
          error: "Bu e-posta zaten kayıtlı.",
        },
        { status: 409 }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        error: "Kayıt oluşturulamadı.",
      },
      { status: 500 }
    );
  }
}