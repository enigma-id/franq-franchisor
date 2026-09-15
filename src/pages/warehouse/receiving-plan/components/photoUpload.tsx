/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { useUpload, uploadFileToS3 } from "@/services/upload/hooks";
import { logger } from "@/utils/logger";

interface PhotoUploadProps {
  photos?: string[];
  maxPhotos?: number;
  disabled?: boolean;
  onPhotosChange?: (photos: string[]) => void;
}

/**
 * Upload multi foto (presigned URL → S3), dipakai form penerimaan.
 * Logika sama dengan `components/ui/image-upload`, tapi menyimpan array URL.
 */
export function PhotoUpload({
  photos = [],
  maxPhotos = 3,
  disabled = false,
  onPhotosChange,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const { getPresignedURL, getPresignedURLResult } = useUpload();

  useEffect(() => {
    const uploadToS3 = async () => {
      if (!getPresignedURLResult?.isSuccess || !pendingFile) return;

      const presignedUrl = getPresignedURLResult.data?.data?.upload_url;
      if (!presignedUrl) {
        setIsUploading(false);
        setPendingFile(null);
        return;
      }

      try {
        const fileUrl = await uploadFileToS3(presignedUrl, pendingFile);
        onPhotosChange?.([...photos, fileUrl]);
      } catch (error) {
        logger.error("Failed to upload to S3", error);
      } finally {
        setIsUploading(false);
        setPendingFile(null);
      }
    };

    uploadToS3();
  }, [getPresignedURLResult?.isSuccess]);

  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      setIsUploading(true);
      setPendingFile(file);

      await getPresignedURL({
        filename: file.name,
        content_type: file.type,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > maxPhotos) {
      alert(`Maksimal ${maxPhotos} foto`);
      return;
    }

    uploadFiles(Array.from(files));

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    onPhotosChange?.(photos.filter((_, i) => i !== index));
  };

  return (
    <div className='flex flex-col gap-2'>
      <span className='text-sm font-medium text-slate-700'>Foto</span>
      <div className='flex flex-wrap gap-2'>
        {photos.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className='relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm'
          >
            <img
              src={url}
              alt={`Foto ${index + 1}`}
              className='w-full h-full object-cover'
            />
            <button
              type='button'
              onClick={() => handleRemove(index)}
              disabled={disabled}
              className='absolute top-0 right-0 m-1 flex items-center justify-center w-5 h-5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors'
            >
              <X className='w-3 h-3' />
            </button>
          </div>
        ))}
        {photos.length < maxPhotos && (
          <label className='w-24 h-24 rounded-lg border-2 border-dashed border-slate-200 hover:border-emerald-400 flex items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/30'>
            {isUploading ? (
              <span className='loading loading-spinner loading-sm text-emerald-500' />
            ) : (
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
                Tambah Foto
              </span>
            )}
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              multiple
              className='hidden'
              onChange={handleFileChange}
              disabled={disabled || isUploading}
            />
          </label>
        )}
      </div>
      <span className='text-[10px] text-slate-400 italic'>
        * Maksimal {maxPhotos} foto (JPG, PNG, WEBP).
      </span>
    </div>
  );
}

export default PhotoUpload;
