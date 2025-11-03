import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // Upload the PDF to Vercel Blob
    const blob = await put(`pdfs/${file.name}`, file, { access: "public" });

    // Get user ID
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Store document record
    const doc = await db.document.create({
      data: {
        title: file.name,
        url: blob.url,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, doc });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
