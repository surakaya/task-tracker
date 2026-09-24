import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor." },
        { status: 401 }
      );
    }

    const roomId = Number((await params).id);
    if (!Number.isInteger(roomId) || roomId < 1) {
      return NextResponse.json(
        { error: "Geçersiz oda kimliği." },
        { status: 400 }
      );
    }

    const { userId } = await request.json();

    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json(
        { error: "Geçersiz kullanıcı kimliği." },
        { status: 400 }
      );
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        members: true,
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Oda bulunamadı." },
        { status: 404 }
      );
    }

    if (room.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Bu işlem için oda sahibi olmalısınız." },
        { status: 403 }
      );
    }

    if (room.ownerId === userId) {
      return NextResponse.json(
        { error: "Oda sahibi kendisini çıkaramaz." },
        { status: 400 }
      );
    }

    const member = room.members.find(
      (item) => item.userId === userId
    );

    if (!member) {
      return NextResponse.json(
        { error: "Kullanıcı bu odanın üyesi değil." },
        { status: 404 }
      );
    }

    await prisma.roomMember.delete({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
    });

    return NextResponse.json({
      message: "Üye odadan çıkarıldı.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Üye odadan çıkarılamadı." },
      { status: 500 }
    );
  }
}
