import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useUpload, uploadFileToS3 } from "@/services/upload/hooks";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  maxSize?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  maxSize = 2 * 1024 * 1024,
}) => {
  const { getPresignedURL, getPresignedURLResult } = useUpload();
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Handle presigned URL success - upload to S3
  useEffect(() => {
    const uploadToS3 = async () => {
      if (!getPresignedURLResult?.isSuccess) return;

      const presignedUrl = getPresignedURLResult.data?.data?.upload_url;

      if (!presignedUrl) {
        return;
      }

      try {
        if (pendingFile) {
          const fileUrl = await uploadFileToS3(presignedUrl, pendingFile);

          // Add uploaded photo to parent state
          onChange(fileUrl);
        }
      } finally {
        setUploading(false);
      }
    };

    uploadToS3();
  }, [getPresignedURLResult?.isSuccess]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      alert("Ukuran file terlalu besar, maksimal 2MB");
      return;
    }

    setUploading(true);
    setPendingFile(file);
    try {
      await getPresignedURL({
        filename: file.name,
        content_type: file.type,
      });
    } catch {
      alert("Gagal upload gambar");
    }
  };

  const handleRemove = () => onChange("");

  return (
    <div className="flex flex-col items-center gap-3 p-6">
      {value ? (
        <div className="relative group w-55 aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="p-2 bg-white text-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <Plus size={18} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
                disabled={uploading}
              />
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ) : (
        <label className="w-55 aspect-square border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 transition-all group">
          {uploading ? (
            <span className="loading loading-spinner loading-md text-emerald-500" />
          ) : (
            <>
              <Plus className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600">
                Upload Gambar
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
      )}
      <p className="text-[10px] text-slate-400 text-center leading-tight">
        Maks. 2MB (JPG, PNG, WEBP)
      </p>
    </div>
  );
};
