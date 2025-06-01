"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: Props) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!file || !title.trim()) return alert("Title and file required");

    setLoading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, file);

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setLoading(false);
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      alert("Auth session missing. Please log in again.");
      setLoading(false);
      return;
    }

    const token = session.access_token;

    const res = await fetch("/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        image_path: uploadData?.path,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const err = await res.json();
      return alert("Post creation failed: " + err.error);
    }

    // Reset state & notify
    setTitle("");
    setFile(null);
    onUploadSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl mb-4 font-bold">Upload Photo</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mb-4 w-full"
        />

        <input
          type="text"
          placeholder="Title"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
