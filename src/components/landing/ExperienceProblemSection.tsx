import PhotosIcon from "@/assets/appicon/Frame 1707495235.svg";
import InstagramIcon from "@/assets/appicon/Frame 1707495233.svg";
import NotesIcon from "@/assets/appicon/notes.svg";
import NotionIcon from "@/assets/appicon/Frame 1707495241.svg";
import KakaoTalkIcon from "@/assets/appicon/Frame 1707495240.svg";
import GoogleDriveIcon from "@/assets/appicon/Frame 1707495236.svg";
import ExperienceCurve from "@/assets/appicon/experience_curve.svg";

export function ExperienceProblemSection() {
  return (
    <section className="flex w-full max-w-[1440px] flex-col items-center justify-center gap-6 overflow-hidden px-64.5 pt-30 pb-35">
      <h2 className="w-full text-center text-5xl leading-[160%] font-bold tracking-[-0.48px] text-grey-900">
        자소서가 어려운 이유는
        <br />
        경험이 없어서가 아니에요.
      </h2>

      <p className="w-full text-center text-xl leading-8 font-normal tracking-[-0.2px] text-grey-700 [text-shadow:0_0_20px_rgba(0,0,0,0.10)]">
        경험은 이미 충분해요.
        <br />
        흩어진 경험을 찾고 연결하는 일이 어려울 뿐이에요.
      </p>

      <div
        className="relative h-[358px] w-[1440px] shrink-0"
        aria-label="여러 앱에 흩어진 경험"
      >
        <ExperienceCurve
          className="absolute top-36.75 left-1/2 h-[167px] w-[878px] -translate-x-1/2"
          aria-hidden="true"
        />

        <PhotosIcon className="absolute top-69 left-60 size-20.5" />
        <InstagramIcon className="absolute top-44 left-104 size-20.5" />
        <span className="absolute top-28.25 left-148 inline-flex size-20.5 aspect-square items-center justify-end overflow-hidden rounded-3xl border-[1.351px] border-grey-100 bg-white">
          <NotesIcon className="size-20.5 shrink-0" />
        </span>
        <NotionIcon className="absolute top-28.25 left-192 size-20.5" />
        <KakaoTalkIcon className="absolute top-44 left-235.5 size-20.5" />
        <GoogleDriveIcon className="absolute top-69 left-279.5 size-20.5" />
      </div>
    </section>
  );
}
