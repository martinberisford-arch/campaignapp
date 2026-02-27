import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("admin12345", 10);
  await prisma.user.upsert({
    where: { email: "admin@charity.local" },
    update: {},
    create: { email: "admin@charity.local", name: "Admin User", passwordHash, role: "ADMIN" }
  });
}

main().finally(async () => prisma.$disconnect());
