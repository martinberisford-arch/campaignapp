import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const asset = await prisma.asset.findUnique({ where: { id: params.id } });
  if (!asset || asset.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(Buffer.from(asset.fileData), {
    headers: {
      "Content-Type": asset.mimeType,
      "Content-Disposition": `attachment; filename="${asset.fileName}"`
    }
  });
}
