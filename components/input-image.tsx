'use client';

import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useRef } from 'react';

interface InputImageProps {
  value: File | undefined | null;
  setValue: (value: File | null) => void;
  error?: string;
}

export const InputImage = (props: InputImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      props.setValue(file);
    },
    [props],
  );

  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (props.value) {
        props.setValue(null);
      }
      fileInputRef.current?.click();
    },
    [props],
  );

  return (
    <div className="relative mb-2 flex flex-col items-center justify-center">
      <div
        className="relative cursor-pointer"
        onClick={handleEditClick}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {props.value ? (
          <Image
            src={URL.createObjectURL(props.value)}
            width={150}
            height={150}
            alt="تصویر انتخاب شده"
            unoptimized
            className="rounded-2xl border border-gray-200 bg-gray-50 object-cover"
          />
        ) : (
          <div className="flex w-full items-center justify-center">
            <div className="flex size-[150px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
              <ImageIcon className="size-10 stroke-gray-400" />
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      {props.error && (
        <p className="text-xsp mt-4 text-red-500">{props.error}</p>
      )}
    </div>
  );
};
