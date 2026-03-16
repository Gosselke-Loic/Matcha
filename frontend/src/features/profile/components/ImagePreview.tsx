import { useState, useEffect } from "react";

import type { ImageData } from "../schemas/images-schema";

const UPLOADS_URL = ""; // To do, fill with correct path for shared folder

interface ImagePreviewProps {
  image: File | ImageData;
  onDelete: () => void;
  setAsProfile: (id: number) => void;
  error?: string;
};

export default function ImagePreview({
  image,
  onDelete,
  setAsProfile,
  error
}: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState("");

  const isExistingImage = !(image instanceof File);
  const isProfile = isExistingImage && image.isPrimary;

  useEffect(() => {
    let objectUrl = "";

    if (image instanceof File) {
      objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(`${UPLOADS_URL}/${image.filename}`);
    };

    return (() => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      };
    });
  }, [image]);

  return (
    <div className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all
      ${ isProfile ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200' }
      ${ error ? 'border-red-500' : 'border-gray-200' }`}
    >
      <img
        src={previewUrl}
        onClick={onDelete}
        className="w-full h-32 object-cover rounded"
      />
    
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
        transition-opacity flex flex-col items-center justify-center gap-2 p-2"
      >
        {isExistingImage && !isProfile && (
          <button
            type="button"
            onClick={() => setAsProfile(image.id)}
            className="bg-white text-gray-900 text-[10px] font-bold px-2 py-1 rounded hover:bg-blue-50 transition-colors uppercase tracking-wider"
          >
            Set as profile image
          </button>
        )}

        {isProfile && (
          <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase shadow-sm">
            Profile image
          </span>
        )}
        
        <button
          type="button"
          onClick={onDelete}
          className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase hover:bg-red-700 transition-colors"
        >
          Remove
        </button>
      </div>

      {error && (
        <span className="absolute bottom-0 left-0 right-0 text-[10px] text-white bg-red-500 font-medium p-1 text-center">
          { error }
        </span>
      )}
    </div>
  );
};
