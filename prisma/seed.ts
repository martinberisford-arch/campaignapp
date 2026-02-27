import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { awarenessDefaults } from "../utils/constants";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("admin12345", 10);

  await prisma.user.upsert({
    where: { email: "admin@charity.local" },
    update: {},
    create: {
      email: "admin@charity.local",
      name: "Admin User",
      role: "ADMIN",
      passwordHash
    }
  });

  await prisma.appSetting.upsert({
    where: { id: "default-setting" },
    update: {},
    create: { id: "default-setting", retentionYears: 3 }
  });

  await prisma.familyRecord.deleteMany({});
  await prisma.monthlyMetrics.deleteMany({});

  await prisma.familyRecord.createMany({
    data: [
      { dateJoined: new Date("2024-02-01"), referralSource: "FACEBOOK", attendedFirstSession: true, stillAttending: true, notes: "Parent feedback positive" },
      { dateJoined: new Date("2024-03-10"), referralSource: "WORD_OF_MOUTH", attendedFirstSession: true, stillAttending: false },
      { dateJoined: new Date("2024-04-05"), referralSource: "SCHOOL", attendedFirstSession: false, stillAttending: false },
      { dateJoined: new Date("2024-04-14"), referralSource: "SELF_REFERRAL", attendedFirstSession: true, stillAttending: true }
    ]
  });

  for (const event of awarenessDefaults) {
    const date = new Date(new Date().getFullYear(), event.month - 1, event.day);
    await prisma.awarenessEvent.upsert({
      where: { id: `${event.title}-${date.getFullYear()}` },
      update: {},
      create: {
        id: `${event.title}-${date.getFullYear()}`,
        title: event.title,
        eventDate: date,
        resourceLinks: []
      }
    });
  }
}

main().finally(async () => prisma.$disconnect());
