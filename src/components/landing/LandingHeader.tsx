import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/button";
import { LandingLogo } from "./LandingLogo";

export function LandingHeader() {
  const navigate = useNavigate();

  return (
    <header className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 py-3 sm:h-20 sm:px-8 sm:py-7">
      <LandingLogo />
      <Button
        label="로그인"
        size="compact"
        className="shrink-0"
        onClick={() => navigate("/login")}
      />
    </header>
  );
}
