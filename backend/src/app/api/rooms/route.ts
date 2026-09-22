import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { joinCode } from "@/lib/room";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await currentUser(request);
  if (!user) return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
  const memberships = await prisma.roomMember.findMany({
    where: { userId: user.id },
    include: { room: { include: { _count: { select: { members: true, tasks: true } } } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(memberships.map(({ role, room }) => ({ ...room, role })));
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser(request);
    if (!user) return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
    const { name } = await request.json();
    if (!name?.trim()) return NextResponse.json({ error: "Oda adı zorunludur." }, { status: 400 });
    const room = await prisma.room.create({
      data: { name: name.trim(), joinCode: joinCode(), ownerId: user.id, members: { create: { userId: user.id, role: "owner" } } },
    });
    return NextResponse.json({ ...room, role: "owner", _count: { members: 1, tasks: 0 } }, { status: 201 });
  } catch (error) { console.error(error); return NextResponse.json({ error: "Oda oluşturulamadı." }, { status: 500 }); }
}
