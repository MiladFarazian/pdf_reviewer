"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfViewerPage({ params }: { params: { id: string } }) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    async function fetchDoc() {
      const res = await fetch(`/api/document?id=${params.id}`);
      const data = await res.json();
      setFileUrl(data.url);
    }
    fetchDoc();
  }, [params.id]);

  if (!fileUrl) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Loading PDF...
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Left: PDF */}
      <div className="w-2/3 bg-gray-50 overflow-auto flex flex-col items-center p-4">
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          <Page pageNumber={pageNumber} renderTextLayer={false} />
        </Document>

        <div className="mt-4 flex items-center space-x-4">
          <button
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            ← Prev
          </button>
          <span>
            Page {pageNumber} / {numPages}
          </span>
          <button
            onClick={() =>
              setPageNumber((p) =>
                numPages ? Math.min(p + 1, numPages) : p
              )
            }
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Right: placeholder chat panel */}
      <div className="w-1/3 border-l bg-white flex flex-col">
        <div className="p-4 border-b font-semibold">AI Tutor Chat</div>
        <div className="flex-1 overflow-y-auto p-4 text-gray-500">
          Chat will appear here.
        </div>
        <div className="p-4 border-t">
          <input
            placeholder="Ask about this page..."
            className="w-full border rounded p-2"
          />
        </div>
      </div>
    </div>
  );
}
