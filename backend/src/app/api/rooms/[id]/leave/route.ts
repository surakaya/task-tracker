import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await currentUser(request);
    if (!user) return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
    const roomId = Number((await params).id);
    if (!Number.isInteger(roomId) || roomId < 1) return NextResponse.json({ error: "Geçersiz oda kimliği." }, { status: 400 });
    const room = await prisma.room.findUnique({ where: { id: roomId }, include: { members: { orderBy: { createdAt: "asc" } } } });
    const membership = room?.members.find((member) => member.userId === user.id);
    if (!room || !membership) return NextResponse.json({ error: "Oda üyeliği bulunamadı." }, { status: 404 });
    const remaining = room.members.filter((member) => member.userId !== user.id);
    await prisma.$transaction(async (tx) => {
      if (room.ownerId === user.id && remaining.length) {
        const nextOwner = remaining[0];
        await tx.room.update({ where: { id: roomId }, data: { ownerId: nextOwner.userId } });
        await tx.roomMember.update({ where: { roomId_userId: { roomId, userId: nextOwner.userId } }, data: { role: "owner" } });
      }
      await tx.roomMember.delete({ where: { roomId_userId: { roomId, userId: user.id } } });
      if (!remaining.length) await tx.room.delete({ where: { id: roomId } });
    });
    return NextResponse.json({ message: "Odadan ayrıldınız." });
  } catch (error) { console.error(error); return NextResponse.json({ error: "Odadan ayrılamadınız." }, { status: 500 }); }
}
