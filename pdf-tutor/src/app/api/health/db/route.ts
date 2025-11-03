import { NextResponse } from "next/server";
import { db } from "@/server/db";
export const runtime = "nodejs";


export async function GET() {
  try {
    const [ping] = await db.$queryRawUnsafe<any[]>("SELECT 1 as ok");
    const users = await db.user.count();
    return NextResponse.json({ ok: true, ping: !!ping?.ok, userCount: users });
  } catch (e: any) {
    console.error("DB health error:", e);
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  }
}

