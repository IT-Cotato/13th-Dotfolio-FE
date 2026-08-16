import { useEffect, useState } from 'react';
import BackIcon from '@/assets/backicon.svg';
import CloseIcon from '@/assets/close.svg';
import { useEscapeKey } from '@/components/memo/hooks/useEscapeKey';

interface ProfileImageCropModalProps {
  file: File;
  onCancel: () => void;
  onSave: (file: File) => void | Promise<void>;
}

const CROP_SIZE = 512;

const cropImageToSquare = (file: File, sourceUrl: string) => new Promise<File>((resolve, reject) => {
  const image = new Image();

  image.onload = () => {
    const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
    const sourceX = (image.naturalWidth - sourceSize) / 2;
    const sourceY = (image.naturalHeight - sourceSize) / 2;
    const canvas = document.createElement('canvas');
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;

    const context = canvas.getContext('2d');
    if (!context) {
      reject(new Error('이미지를 자를 수 없습니다.'));
      return;
    }

    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      CROP_SIZE,
      CROP_SIZE,
    );

    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error('이미지를 자를 수 없습니다.'));
        return;
      }

      resolve(new File([blob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      }));
    }, file.type, 0.92);
  };

  image.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'));
  image.src = sourceUrl;
});

export const ProfileImageCropModal = ({ file, onCancel, onSave }: ProfileImageCropModalProps) => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEscapeKey(onCancel);

  useEffect(() => {
    const reader = new FileReader();
    let isCancelled = false;

    reader.onload = () => {
      if (!isCancelled && typeof reader.result === 'string') {
        setSourceUrl(reader.result);
      }
    };
    reader.onerror = () => {
      if (!isCancelled) setError('이미지를 불러오지 못했습니다.');
    };
    reader.readAsDataURL(file);

    return () => {
      isCancelled = true;
      if (reader.readyState === FileReader.LOADING) reader.abort();
    };
  }, [file]);

  const saveCroppedImage = async () => {
    if (!sourceUrl || isSaving) return;

    setIsSaving(true);
    setError(null);
    try {
      await onSave(await cropImageToSquare(file, sourceUrl));
    } catch (cropError) {
      setError(cropError instanceof Error ? cropError.message : '이미지를 자를 수 없습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-crop-title"
      className="fixed inset-0 z-70 flex flex-col bg-[rgba(28,28,26,0.9)] text-white"
    >
      <header className="relative flex h-16 shrink-0 items-center justify-center px-6">
        <button type="button" aria-label="이전" onClick={onCancel} className="absolute left-6">
          <BackIcon className="size-4 brightness-0 invert" />
        </button>
        <h2 id="profile-crop-title" className="text-sub1-sb">자르기</h2>
        <button type="button" aria-label="닫기" onClick={onCancel} className="absolute right-6 text-white">
          <CloseIcon className="size-4" />
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-16">
        <div className="relative aspect-square w-full max-w-[512px] overflow-hidden bg-grey-950">
          {sourceUrl && (
            <img
              src={sourceUrl}
              alt="선택한 프로필 사진"
              className="size-full object-cover"
            />
          )}
          <div className="pointer-events-none absolute inset-0 rounded-full border border-white/70 shadow-[0_0_0_9999px_rgba(28,28,26,0.52)]" />
        </div>

        {error && <p role="alert" className="text-body3-r text-error-text">{error}</p>}

        <button
          type="button"
          disabled={!sourceUrl || isSaving}
          onClick={() => void saveCroppedImage()}
          className="min-w-20 rounded-full bg-white px-6 py-2 text-label2-sb text-grey-900 disabled:cursor-not-allowed disabled:bg-grey-300"
        >
          저장
        </button>
      </div>
    </div>
  );
};
