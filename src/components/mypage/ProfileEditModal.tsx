import { useEffect, useRef, useState } from 'react';
import AddIcon from '@/assets/add10.svg';
import CloseIcon from '@/assets/close.svg';
import { Button } from '@/components/common/button';
import { useEscapeKey } from '@/components/memo/hooks/useEscapeKey';
import { useModalFocus } from '@/components/memo/hooks/useModalFocus';
import { ProfileImageCropModal } from '@/components/mypage/ProfileImageCropModal';

interface ProfileEditModalProps {
  isOpen: boolean;
  nickname: string;
  email: string;
  profileImageUrl: string | null;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (nickname: string, email: string, profileImage?: File) => void;
  onLogout: () => void;
  onWithdraw: () => void;
}

export const ProfileEditModal = ({
  isOpen,
  nickname,
  email,
  profileImageUrl,
  isSaving = false,
  onClose,
  onSubmit,
  onLogout,
  onWithdraw,
}: ProfileEditModalProps) => {
  const [draftNickname, setDraftNickname] = useState(nickname);
  const [draftEmail, setDraftEmail] = useState(email);
  const [profileImage, setProfileImage] = useState<File>();
  const [cropSourceFile, setCropSourceFile] = useState<File>();
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string>();
  const [imageError, setImageError] = useState<string | null>(null);
  const previewUrlRef = useRef<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useModalFocus<HTMLFormElement>();

  useEscapeKey(onClose);

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  if (!isOpen) return null;

  const normalizedNickname = draftNickname.trim();
  const normalizedEmail = draftEmail.trim();
  const initial = normalizedNickname.charAt(0) || '나';
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const isDirty = normalizedNickname !== nickname
    || normalizedEmail !== email
    || Boolean(profileImage);

  const selectProfileImage = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setImageError('JPG, PNG, WEBP 파일만 선택할 수 있습니다.');
      return;
    }

    setCropSourceFile(file);
    setImageError(null);
  };

  const applyCroppedImage = (file: File) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextPreviewUrl;
    setProfileImage(file);
    setProfilePreviewUrl(nextPreviewUrl);
    setCropSourceFile(undefined);
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-grey-950/55 px-5"
      onMouseDown={onClose}
    >
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-edit-title"
        tabIndex={-1}
        className="relative flex h-[572px] max-h-[calc(100dvh-40px)] w-full max-w-[480px] flex-col overflow-y-auto rounded-[40px] bg-white p-8 outline-none"
        onMouseDown={event => event.stopPropagation()}
        onSubmit={event => {
          event.preventDefault();
          if (normalizedNickname && isEmailValid && isDirty) {
            onSubmit(normalizedNickname, normalizedEmail, profileImage);
          }
        }}
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute top-6 right-6 cursor-pointer text-grey-400"
        >
          <CloseIcon className="size-4" />
        </button>

        <h2 id="profile-edit-title" className="text-title1 text-grey-900">회원정보 수정</h2>

        <div className="mt-8 flex flex-col items-center">
          <div className="relative size-[70px]">
            <button
              type="button"
              aria-label="프로필 이미지 변경"
              onClick={() => fileInputRef.current?.click()}
              className="grid size-full place-items-center overflow-hidden rounded-full bg-primary-gradient text-[20px] leading-[28px] font-bold tracking-[-0.2px] text-white"
            >
              {profilePreviewUrl || profileImageUrl ? (
                <img src={profilePreviewUrl ?? profileImageUrl ?? ''} alt="프로필 미리보기" className="size-full object-cover" />
              ) : initial}
            </button>
            <span className="pointer-events-none absolute right-0 bottom-0 flex size-6 items-center justify-center rounded-full border border-grey-100 bg-white/80 p-[5px] text-grey-700">
              <AddIcon aria-hidden className="size-2.5 shrink-0" />
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={event => {
              selectProfileImage(event.target.files);
              event.currentTarget.value = '';
            }}
          />
          {imageError && <p role="alert" className="mt-2 text-caption1 text-error-text">{imageError}</p>}
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sub2-sb text-grey-900">이름</span>
            <input
              value={draftNickname}
              maxLength={20}
              onChange={event => setDraftNickname(event.target.value)}
              className="rounded-[14px] border border-grey-100 px-4 py-3 text-body-reading2-md text-grey-900 outline-none transition-colors focus:border-primary-500"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sub2-sb text-grey-900">이메일</span>
            <input
              type="email"
              value={draftEmail}
              onChange={event => setDraftEmail(event.target.value)}
              className="rounded-[14px] border border-grey-100 px-4 py-3 text-body-reading2-md text-grey-900 outline-none transition-colors focus:border-primary-500"
            />
          </label>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 items-center justify-center gap-5 text-label2-md text-grey-500 underline underline-offset-2">
            <button type="button" onClick={onLogout}>로그아웃</button>
            <button type="button" onClick={onWithdraw}>회원탈퇴</button>
          </div>

          <Button
            type="submit"
            label="저장"
            disabled={!normalizedNickname || !isEmailValid || !isDirty || isSaving}
          />
        </div>

        {cropSourceFile && (
          <ProfileImageCropModal
            file={cropSourceFile}
            onCancel={() => setCropSourceFile(undefined)}
            onSave={applyCroppedImage}
          />
        )}
      </form>
    </div>
  );
};
