import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  month: z.string(),
  facebookFollowers: z.number().int().nonnegative(),
  facebookEngagement: z.number().int().nonnegative().optional(),
  sessionsDelivered: z.number().int().nonnegative(),
  familiesAttendingSessions: z.number().int().nonnegative(),
  volunteerCount: z.number().int().nonnegative(),
  fundingApplicationsSubmitted: z.number().int().nonnegative(),
  fundingAwarded: z.number().nonnegative()
});

export async function POST(req: Request) {
  const json = await req.json();
  const data = schema.parse(json);
  const month = new Date(`${data.month}-01`);
  await prisma.monthlyMetrics.upsert({
    where: { month },
    create: { ...data, month, facebookEngagement: data.facebookEngagement ?? 0 },
    update: { ...data, facebookEngagement: data.facebookEngagement ?? 0 }
  });
  return Response.json({ ok: true });
}
