import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const passwordHash = await bcrypt.hash("Demo12345", 12);

const users = await Promise.all([
  prisma.user.upsert({ where: { email: "ayse@demo.local" }, update: {}, create: { name: "Ayşe Yılmaz", email: "ayse@demo.local", passwordHash } }),
  prisma.user.upsert({ where: { email: "mehmet@demo.local" }, update: {}, create: { name: "Mehmet Kaya", email: "mehmet@demo.local", passwordHash } }),
]);

const samples = [
  [
    { title: "Sprint planını gözden geçir", description: "Yarınki ekip toplantısından önce notları düzenle.", status: "in_progress", isImportant: true },
    { title: "Tasarım geri bildirimi ver", description: "Yeni dashboard akışını incele.", status: "pending", isImportant: false },
    { title: "Haftalık raporu gönder", description: "", status: "done", isImportant: false },
  ],
  [
    { title: "Müşteri demosunu hazırla", description: "Canlı akışı iki cihazda test et.", status: "pending", isImportant: true },
    { title: "API dokümantasyonunu güncelle", description: "Yeni görev sahipliği uç noktalarını ekle.", status: "in_progress", isImportant: false },
    { title: "Ekip notlarını paylaş", description: "", status: "done", isImportant: false },
  ],
];

for (const [index, user] of users.entries()) {
  if (await prisma.task.count({ where: { userId: user.id } }) === 0) {
    await prisma.task.createMany({ data: samples[index].map((task) => ({ ...task, userId: user.id })) });
  }
}

const team = await prisma.room.upsert({
  where: { joinCode: "STAJ-EKIP-01" },
  update: {},
  create: {
    name: "Staj Ekibi",
    joinCode: "STAJ-EKIP-01",
    ownerId: users[0].id,
    members: { create: [{ userId: users[0].id, role: "owner" }, { userId: users[1].id, role: "member" }] },
  },
});

if (await prisma.task.count({ where: { roomId: team.id } }) === 0) {
  await prisma.task.createMany({
    data: [
      { title: "Haftalık ekip kontrolü", description: "Herkes ilerleme notunu toplantıdan önce eklesin.", status: "pending", isImportant: true, roomId: team.id },
      { title: "Ortak sunum akışı", description: "Bölümleri gözden geçirip sıraya koyun.", status: "in_progress", isImportant: false, roomId: team.id },
    ],
  });
}

await prisma.$disconnect();
