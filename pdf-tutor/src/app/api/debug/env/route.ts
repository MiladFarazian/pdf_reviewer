export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET() {
  const raw = process.env.DATABASE_URL ?? "";
  const masked = raw
    ? raw.replace(/:.+@/, "://***:***@").replace(/\?.*$/, "?…")
    : "(unset)";
  return NextResponse.json({
    DATABASE_URL: masked,
    NODE_VERSION: process.version,
    RUNTIME: process.env.NEXT_RUNTIME || "node",
  });
}
