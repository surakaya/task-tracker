import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { roomMembership } from "@/lib/room";
import { prisma } from "@/lib/prisma";

function invalidId(id: string) { const parsed = Number(id); return Number.isInteger(parsed) && parsed > 0 ? parsed : null; }

export async function OPTIONS() { return new NextResponse(null, { status: 204 }); }

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await currentUser(request); if (!user) return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
    const id = invalidId((await params).id); if (!id) return NextResponse.json({ error: "Geçersiz görev kimliği." }, { status: 400 });
    const existing = await prisma.task.findUnique({ where: { id } });
    const mayAccess = existing && (existing.userId === user.id || (existing.roomId !== null && await roomMembership(existing.roomId, user.id)));
    if (!mayAccess) return NextResponse.json({ error: "Görev bulunamadı." }, { status: 404 });
    const { title, description, status, isImportant, reminderAt } = await request.json();
    if (title !== undefined && !title.trim()) return NextResponse.json({ error: "Başlık boş olamaz." }, { status: 400 });
    if (status !== undefined && !["pending", "in_progress", "done"].includes(status)) return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
    const reminder = reminderAt === undefined ? undefined : reminderAt ? new Date(reminderAt) : null;
    if (reminder instanceof Date && Number.isNaN(reminder.getTime())) return NextResponse.json({ error: "Hatırlatma zamanı geçersiz." }, { status: 400 });
    return NextResponse.json(await prisma.task.update({ where: { id }, data: { ...(title !== undefined && { title: title.trim() }), ...(description !== undefined && { description: description.trim() || null }), ...(status !== undefined && { status }), ...(isImportant !== undefined && { isImportant: Boolean(isImportant) }), ...(reminder !== undefined && { reminderAt: reminder }) } }));
  } catch (error) { console.error(error); return NextResponse.json({ error: "Görev güncellenemedi." }, { status: 500 }); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await currentUser(request); if (!user) return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
    const id = invalidId((await params).id); if (!id) return NextResponse.json({ error: "Geçersiz görev kimliği." }, { status: 400 });
    const task = await prisma.task.findUnique({ where: { id } });
    const mayAccess = task && (task.userId === user.id || (task.roomId !== null && await roomMembership(task.roomId, user.id)));
    if (!mayAccess) return NextResponse.json({ error: "Görev bulunamadı." }, { status: 404 });
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ message: "Görev silindi." });
  } catch (error) { console.error(error); return NextResponse.json({ error: "Görev silinemedi." }, { status: 500 }); }
}
