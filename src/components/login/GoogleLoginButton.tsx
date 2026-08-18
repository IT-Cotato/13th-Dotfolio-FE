import GoogleIcon from "@/assets/Group.svg";
import { getGoogleAuthorizationUrl } from "@/api/auth";

interface GoogleLoginButtonProps {
  label?: string;
}

export function GoogleLoginButton({ label = "Google로 시작하기" }: GoogleLoginButtonProps) {
  const handleClick = () => {
    window.location.assign(getGoogleAuthorizationUrl());
  };

  return (
    <button
      className="w-full h-[52px] px-5 py-2.5 rounded-xl border border-grey-100 bg-white flex justify-center items-center gap-2 text-body2-md text-grey-900"
      onClick={handleClick}
      type="button"
    >
      <GoogleIcon
        aria-hidden="true"
        className="w-[17.38px] h-[18px] shrink-0"
      />
      {label}
    </button>
  );
}
