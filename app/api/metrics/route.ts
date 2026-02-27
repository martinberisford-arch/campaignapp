import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const schema = z.object({ month: z.string(), facebookFollowers: z.number(), sessionsDelivered: z.number(), familiesAttendingSessions: z.number(), volunteerCount: z.number(), fundingApplicationsSubmitted: z.number(), fundingAwarded: z.number(), facebookEngagement: z.number().optional() });

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const month = new Date(`${body.month}-01`);
  await prisma.monthlyMetrics.upsert({ where: { month }, create: { ...body, month }, update: body });
  return Response.json({ ok: true });
}
