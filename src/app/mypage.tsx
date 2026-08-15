import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@/assets/add10.svg';
import MyPageVectorIcon from '@/assets/mypage_vector.svg';
import { logout, withdraw } from '@/api/auth';
import { ApiError } from '@/api/client';
import {
  getMyPageProfile,
  getProfileImagePresignedUrl,
  updateDesiredJob,
  updateMyPageProfile,
  uploadProfileImage,
} from '@/api/mypage';
import { Card } from '@/components/common/card';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Toast } from '@/components/common/Toast';
import { JobSelectModal, type JobOption } from '@/components/mypage/JobSelectModal';
import { ProfileEditModal } from '@/components/mypage/ProfileEditModal';
import { ProfileImageCropModal } from '@/components/mypage/ProfileImageCropModal';
import { useToast } from '@/hooks/useToast';
import { clearAuthTokens } from '@/utils/authTokens';

interface MyPageProfile {
  nickname: string;
  email: string;
  profileImageUrl: string | null;
  desiredJobId: string | null;
  desiredJobName: string | null;
}

export default function MyPage() {
  const navigate = useNavigate();
  const { toast, fireToast } = useToast();
  const [profile, setProfile] = useState<MyPageProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingProfileImage, setIsSavingProfileImage] = useState(false);
  const [profileImageToCrop, setProfileImageToCrop] = useState<File>();
  const [isSavingJob, setIsSavingJob] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [accountAction, setAccountAction] = useState<'logout' | 'withdraw' | null>(null);
  const [isProcessingAccountAction, setIsProcessingAccountAction] = useState(false);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  const jobs: JobOption[] = (
    profile?.desiredJobId && profile.desiredJobName
      ? [{ id: profile.desiredJobId, name: profile.desiredJobName }]
      : []
  );

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await getMyPageProfile();
      setProfile({
        nickname: response.data.name,
        email: response.data.email,
        profileImageUrl: response.data.profileImageUrl,
        desiredJobId: response.data.desiredJobId,
        desiredJobName: response.data.desiredJob,
      });
    } catch (error) {
      setLoadError(error instanceof ApiError ? error.message : '마이페이지 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAccountAction = (action: 'logout' | 'withdraw') => {
    setIsProfileModalOpen(false);
    setAccountAction(action);
  };

  const handleAccountAction = async () => {
    if (!accountAction || isProcessingAccountAction) return;

    setIsProcessingAccountAction(true);
    try {
      if (accountAction === 'logout') await logout();
      else await withdraw();

      clearAuthTokens();
      navigate('/login', { replace: true });
    } catch (error) {
      fireToast(
        error instanceof ApiError
          ? error.message
          : accountAction === 'logout'
            ? '로그아웃하지 못했습니다.'
            : '회원탈퇴를 완료하지 못했습니다.',
        undefined,
        'error',
      );
    } finally {
      setIsProcessingAccountAction(false);
    }
  };

  const selectProfileImage = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      fireToast('JPG, PNG, WEBP 파일만 선택할 수 있습니다.', undefined, 'error');
      return;
    }

    setProfileImageToCrop(file);
  };

  const saveProfileImage = async (file: File) => {
    setIsSavingProfileImage(true);
    try {
      const presignedUrlResponse = await getProfileImagePresignedUrl(file.name);
      await uploadProfileImage(presignedUrlResponse.data.presignedUrl, file);
      await updateMyPageProfile({ profileImageUrl: presignedUrlResponse.data.s3Key });
      setProfileImageToCrop(undefined);
      await loadProfile();
      fireToast('프로필 사진이 수정되었습니다.');
    } catch (error) {
      fireToast(
        error instanceof ApiError ? error.message : '프로필 사진을 수정하지 못했습니다.',
        undefined,
        'error',
      );
      throw error;
    } finally {
      setIsSavingProfileImage(false);
    }
  };

  useEffect(() => {
    const fetchInitialProfile = async () => {
      await loadProfile();
    };
    void fetchInitialProfile();
  }, [loadProfile]);

  if (isLoading) {
    return (
      <Card className="items-stretch gap-8!">
        <h1 className="text-title1 text-grey-900">마이페이지</h1>
        <section className="flex min-h-64 items-center justify-center text-body2-r text-grey-500" aria-live="polite">
          마이페이지 정보를 불러오는 중...
        </section>
      </Card>
    );
  }

  if (loadError || !profile) {
    return (
      <Card className="items-stretch gap-8!">
        <h1 className="text-title1 text-grey-900">마이페이지</h1>
        <section className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
          <p role="alert" className="text-body2-r text-error-text">{loadError ?? '마이페이지 정보가 없습니다.'}</p>
          <button
            type="button"
            onClick={() => void loadProfile()}
            className="rounded-xl border border-primary-500 px-4 py-2 text-body2-md text-primary-500"
          >
            다시 시도
          </button>
        </section>
      </Card>
    );
  }

  const initial = profile.nickname.trim().charAt(0) || '나';

  return (
    <Card className="items-stretch gap-8!">
      <header className="w-full">
        <h1 className="text-title1 text-grey-900">마이페이지</h1>
      </header>

      <section className="flex w-full items-center justify-between rounded-2xl border border-grey-100 p-6">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            aria-label="프로필 이미지 수정"
            disabled={isSavingProfileImage}
            onClick={() => profileFileInputRef.current?.click()}
            className="relative size-[70px] shrink-0 rounded-full"
          >
            <div className="grid size-full place-items-center overflow-hidden rounded-full bg-primary-gradient text-[20px] leading-[28px] font-bold tracking-[-0.2px] text-white">
              {profile.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="프로필" className="size-full object-cover" />
              ) : initial}
            </div>
            <span className="absolute right-0 bottom-0 flex size-6 items-center justify-center rounded-full border border-grey-100 bg-white/80 p-[5px] text-grey-700">
              <AddIcon aria-hidden className="size-2.5 shrink-0" />
            </span>
          </button>
          <input
            ref={profileFileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={event => {
              selectProfileImage(event.target.files);
              event.currentTarget.value = '';
            }}
          />
          <div className="min-w-0">
            <strong className="block truncate text-sub1-sb text-grey-900">{profile.nickname}</strong>
            <span className="mt-1 block truncate text-body2-md text-grey-700">{profile.email}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsProfileModalOpen(true)}
          className="shrink-0 rounded-xl border-[1.5px] border-primary-500 px-3 py-2 text-sub2-sb text-primary-500 transition-colors hover:bg-primary-50"
        >
          회원정보 수정
        </button>
      </section>

      <section className="w-full rounded-2xl border border-grey-100 p-6">
        <h2 className="text-sub2-sb text-grey-900">희망 직무 설정</h2>
        <div className="mt-6 border-t border-grey-100 pt-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-body3-r text-grey-600">현재 희망 직무</span>
              <strong className="mt-1 block text-sub2-sb text-grey-900">
                {profile.desiredJobName ?? '-'}
              </strong>
            </div>
            <button
              type="button"
              onClick={() => setIsJobModalOpen(true)}
              className="flex items-center gap-1.5 text-body2-md text-primary-500"
            >
              변경
              <MyPageVectorIcon aria-hidden className="h-3 w-1.5 shrink-0 text-primary-500 [&_path]:fill-current" />
            </button>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => navigate('/template-all', { state: { from: '/mypage' } })}
        className="flex w-full items-center justify-between rounded-2xl border border-grey-100 p-6 text-left transition-colors hover:border-primary-200 hover:bg-primary-50/40"
      >
        <span>
          <strong className="block text-sub2-sb text-grey-900">템플릿 관리</strong>
          <span className="mt-2 block text-body3-r text-grey-600">기록 템플릿을 수정하거나 삭제할 수 있습니다.</span>
        </span>
        <MyPageVectorIcon aria-hidden className="h-3 w-1.5 shrink-0 text-grey-600 [&_path]:fill-current" />
      </button>

      {isProfileModalOpen && (
        <ProfileEditModal
          isOpen
          nickname={profile.nickname}
          email={profile.email}
          profileImageUrl={profile.profileImageUrl}
          isSaving={isSavingProfile}
          onClose={() => setIsProfileModalOpen(false)}
          onLogout={() => openAccountAction('logout')}
          onWithdraw={() => openAccountAction('withdraw')}
          onSubmit={async (nickname, email, profileImage) => {
            if (email !== profile.email) {
              fireToast('현재 서버에서 이메일 변경을 지원하지 않습니다.', undefined, 'error');
              return;
            }

            setIsSavingProfile(true);
            try {
              let profileImageKey: string | undefined;
              if (profileImage) {
                const presignedUrlResponse = await getProfileImagePresignedUrl(profileImage.name);
                await uploadProfileImage(presignedUrlResponse.data.presignedUrl, profileImage);
                profileImageKey = presignedUrlResponse.data.s3Key;
              }

              await updateMyPageProfile({
                ...(nickname !== profile.nickname ? { name: nickname } : {}),
                ...(profileImageKey ? { profileImageUrl: profileImageKey } : {}),
              });
              setIsProfileModalOpen(false);
              await loadProfile();
              fireToast('회원정보가 수정되었습니다.');
            } catch (error) {
              fireToast(error instanceof ApiError ? error.message : '회원정보를 수정하지 못했습니다.', undefined, 'error');
            } finally {
              setIsSavingProfile(false);
            }
          }}
        />
      )}

      {profileImageToCrop && (
        <ProfileImageCropModal
          file={profileImageToCrop}
          onCancel={() => setProfileImageToCrop(undefined)}
          onSave={saveProfileImage}
        />
      )}

      {isJobModalOpen && (
        <JobSelectModal
          isOpen
          jobs={jobs}
          selectedJobId={profile.desiredJobId}
          isSaving={isSavingJob}
          onClose={() => setIsJobModalOpen(false)}
          onSubmit={async jobId => {
            setIsSavingJob(true);
            try {
              await updateDesiredJob(jobId);
              const job = jobs.find(item => item.id === jobId);
              setProfile(current => current ? ({
                ...current,
                desiredJobId: jobId,
                desiredJobName: job?.name ?? null,
              }) : current);
              setIsJobModalOpen(false);
              fireToast('희망 직무가 변경되었습니다.');
            } catch (error) {
              fireToast(error instanceof ApiError ? error.message : '희망 직무를 변경하지 못했습니다.', undefined, 'error');
            } finally {
              setIsSavingJob(false);
            }
          }}
        />
      )}

      <ConfirmModal
        isOpen={accountAction === 'logout'}
        title="로그아웃 하시겠습니까?"
        description="언제든지 다시 로그인할 수 있습니다."
        confirmLabel="로그아웃"
        isConfirming={isProcessingAccountAction}
        onConfirm={() => void handleAccountAction()}
        onCancel={() => setAccountAction(null)}
      />

      <ConfirmModal
        isOpen={accountAction === 'withdraw'}
        title="회원탈퇴 하시겠습니까?"
        description={'회원을 탈퇴하면 모든 활동 기록과 데이터가\n영구적으로 삭제되며 복구할 수 없습니다.'}
        confirmLabel="회원탈퇴"
        isConfirming={isProcessingAccountAction}
        onConfirm={() => void handleAccountAction()}
        onCancel={() => setAccountAction(null)}
      />

      {toast && (
        <div className="fixed top-4 left-1/2 z-100 -translate-x-1/2">
          <Toast message={toast.message} variant={toast.variant} />
        </div>
      )}
    </Card>
  );
}
