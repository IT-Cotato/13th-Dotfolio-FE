import PhotosIcon from "@/assets/appicon/Frame 1707495235.svg";
import InstagramIcon from "@/assets/appicon/Frame 1707495233.svg";
import NotesIcon from "@/assets/appicon/notes.svg";
import NotionIcon from "@/assets/appicon/Frame 1707495241.svg";
import KakaoTalkIcon from "@/assets/appicon/Frame 1707495240.svg";
import GoogleDriveIcon from "@/assets/appicon/Frame 1707495236.svg";
import ExperienceCurve from "@/assets/appicon/experience_curve.svg";

export function ExperienceProblemSection() {
  return (
    <section className="flex w-full max-w-[1440px] flex-col items-center justify-center gap-5 overflow-hidden px-4 py-20 sm:gap-6 sm:px-64.5 sm:pb-35 sm:pt-30 min-[1440px]:px-[258px]!">
      <h2 className="w-full text-center text-3xl leading-[150%] font-bold tracking-[-0.48px] text-grey-900 sm:text-5xl sm:leading-[160%] min-[1440px]:text-[48px]! min-[1440px]:leading-[76.8px]!">
        자소서가 어려운 이유는
        <br />
        경험이 없어서가 아니에요.
      </h2>

      <p className="w-full text-center text-base leading-7 font-normal tracking-[-0.2px] text-grey-700 [text-shadow:0_0_20px_rgba(0,0,0,0.10)] sm:text-xl sm:leading-8 min-[1440px]:text-[20px]! min-[1440px]:leading-[32px]!">
        경험은 이미 충분해요.
        <br />
        흩어진 경험을 찾고 연결하는 일이 어려울 뿐이에요.
      </p>

      <div
        className="relative h-[190px] w-full shrink-0 sm:h-[358px] sm:w-[1440px]"
        aria-label="여러 앱에 흩어진 경험"
      >
        <ExperienceCurve
          className="absolute left-1/2 top-8 h-auto w-[320px] -translate-x-1/2 sm:top-36.75 sm:h-[167px] sm:w-[878px]"
          aria-hidden="true"
        />

        <PhotosIcon className="absolute top-69 left-60 hidden size-20.5 sm:block" />
        <InstagramIcon className="absolute top-44 left-104 hidden size-20.5 sm:block" />
        <span className="absolute top-28.25 left-148 hidden size-20.5 aspect-square items-center justify-end overflow-hidden rounded-3xl border-[1.351px] border-grey-100 bg-white sm:inline-flex">
          <NotesIcon className="size-20.5 shrink-0" />
        </span>
        <NotionIcon className="absolute top-28.25 left-192 hidden size-20.5 sm:block" />
        <KakaoTalkIcon className="absolute top-44 left-235.5 hidden size-20.5 sm:block" />
        <GoogleDriveIcon className="absolute top-69 left-279.5 hidden size-20.5 sm:block" />
      </div>
    </section>
  );
}
