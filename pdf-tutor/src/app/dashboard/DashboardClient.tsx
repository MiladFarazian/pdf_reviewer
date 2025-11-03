"use client";

import { useState } from "react";
import Link from "next/link";

export default function DashboardClient() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);

  async function upload() {
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (data.doc) {
      setUploadedDocs((prev) => [...prev, data.doc]);
    } else {
      alert("Upload failed: " + (data.error || "unknown error"));
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 rounded"
        />
        <button
          disabled={!file || uploading}
          onClick={upload}
          className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

      <ul className="space-y-2 mt-6">
        {uploadedDocs.map((d) => (
          <li key={d.id}>
            <Link
              href={`/viewer/${d.id}`}
              className="text-blue-600 hover:underline"
            >
              {d.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
