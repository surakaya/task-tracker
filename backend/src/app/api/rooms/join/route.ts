import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser(request);
    if (!user) return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
    const { code } = await request.json();
    const room = await prisma.room.findUnique({ where: { joinCode: code?.trim().toUpperCase() } });
    if (!room) return NextResponse.json({ error: "Geçersiz oda kodu." }, { status: 404 });
    const membership = await prisma.roomMember.upsert({ where: { roomId_userId: { roomId: room.id, userId: user.id } }, update: {}, create: { roomId: room.id, userId: user.id } });
    const count = await prisma.roomMember.count({ where: { roomId: room.id } });
    const taskCount = await prisma.task.count({ where: { roomId: room.id } });
    return NextResponse.json({ ...room, role: membership.role, _count: { members: count, tasks: taskCount } });
  } catch (error) { console.error(error); return NextResponse.json({ error: "Odaya katılınamadı." }, { status: 500 }); }
}
