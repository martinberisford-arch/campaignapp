import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      error: "This project now uses cookie sessions and no longer uses NextAuth. Use /login."
    },
    { status: 410 }
  );
}

export async function POST() {
  return GET();
}
