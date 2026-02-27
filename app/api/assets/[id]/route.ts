import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_: Request, context: { params: { id?: string } }) {
  const id = context.params?.id;

  if (!id) {
    return NextResponse.json({ error: "Asset id is required" }, { status: 400 });
  }

  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset || asset.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(asset.fileData), {
    headers: {
      "Content-Type": asset.mimeType,
      "Content-Disposition": `attachment; filename="${asset.fileName}"`
    }
  });
}
