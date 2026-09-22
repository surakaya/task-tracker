import { prisma } from "./prisma";

export async function roomMembership(roomId: number, userId: number) {
  return prisma.roomMember.findUnique({ where: { roomId_userId: { roomId, userId } } });
}

export function joinCode() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
}
