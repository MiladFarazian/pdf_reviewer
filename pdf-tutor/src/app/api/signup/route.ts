import { NextResponse } from "next/server";
import { db } from "@/server/db";
import bcrypt from "bcrypt";
export const runtime = "nodejs";


export async function POST(req: Request) {
  console.log("Database URL:", process.env.DATABASE_URL);
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const exists = await db.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: { email, passwordHash, name: name ?? null },
  });
  return NextResponse.json({ id: user.id });
}
