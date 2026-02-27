import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const asset = await prisma.asset.findUnique({ where: { id: params.id } });
  if (!asset || asset.deletedAt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(new Uint8Array(asset.fileData), { headers: { "Content-Type": asset.mimeType, "Content-Disposition": `attachment; filename=\"${asset.fileName}\"` } });
}
