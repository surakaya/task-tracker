import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { roomMembership } from "@/lib/room";
import { prisma } from "@/lib/prisma";

function unauthorized() { return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 }); }

export async function OPTIONS() { return new NextResponse(null, { status: 204 }); }

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser(request);
    if (!user) return unauthorized();
    const roomId = request.nextUrl.searchParams.get("roomId");
    if (!roomId) return NextResponse.json(await prisma.task.findMany({ where: { userId: user.id, roomId: null }, orderBy: { createdAt: "desc" } }));
    const parsedRoomId = Number(roomId);
    if (!Number.isInteger(parsedRoomId) || !(await roomMembership(parsedRoomId, user.id))) return NextResponse.json({ error: "Odaya erişiminiz yok." }, { status: 403 });
    return NextResponse.json(await prisma.task.findMany({ where: { roomId: parsedRoomId }, orderBy: { createdAt: "desc" } }));
  } catch (error) { console.error(error); return NextResponse.json({ error: "Görevler alınamadı." }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser(request);
    if (!user) return unauthorized();
    const { title, description, isImportant, reminderAt, roomId } = await request.json();
    if (!title?.trim()) return NextResponse.json({ error: "Başlık zorunludur." }, { status: 400 });
    const reminder = reminderAt ? new Date(reminderAt) : null;
    if (reminder && Number.isNaN(reminder.getTime())) return NextResponse.json({ error: "Hatırlatma zamanı geçersiz." }, { status: 400 });
    const parsedRoomId = roomId === undefined || roomId === null ? null : Number(roomId);
    if (parsedRoomId !== null && (!Number.isInteger(parsedRoomId) || !(await roomMembership(parsedRoomId, user.id)))) return NextResponse.json({ error: "Odaya erişiminiz yok." }, { status: 403 });
    const task = await prisma.task.create({ data: { title: title.trim(), description: description?.trim() || null, isImportant: Boolean(isImportant), reminderAt: reminder, ...(parsedRoomId === null ? { userId: user.id } : { roomId: parsedRoomId }) } });
    return NextResponse.json(task, { status: 201 });
  } catch (error) { console.error(error); return NextResponse.json({ error: "Görev eklenemedi." }, { status: 500 }); }
}
