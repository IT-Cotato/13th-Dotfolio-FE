import ClockIcon from "@/assets/schedule.svg";
import TemplateIcon from "@/assets/auto_awesome_mosaic.svg";
import QuestionIcon from "@/assets/psychology_alt.svg";
import { PainPointCard } from "./PainPointCard";

const PAIN_POINTS = [
  {
    icon: ClockIcon,
    title: "활동 직후 기록의 어려움",
    description:
      "바쁜 하루 속에서 경험을 그 순간 기록하는 일은\n생각보다 쉽지 않아요. 지금 기록하지 않으면\n그 경험은 곧 기억에서 사라져요.",
  },
  {
    icon: TemplateIcon,
    title: "대학생용 기록 템플릿의 부재",
    description:
      "대학생과 사회초년생을 위한 기록 양식이 부족\n해요. 백지 앞에서 매번 처음부터 고민하는 대신\n정리된 틀에서 시작하는 것이 더 쉬워요.",
  },
  {
    icon: QuestionIcon,
    title: "방치되는 기록",
    description:
      "노션이나 메모 앱 어딘가에 적어두었지만, 정작\n자소서를 쓸 때는 찾지도 떠올리지도 못해요.\n결국 또 처음부터 기억을 떠올리게 돼요.",
  },
];

export function PainPointsSection() {
  return (
    <section className="flex w-full max-w-[1440px] flex-col items-start gap-2.5 p-30">
      <div className="flex w-full flex-col items-start gap-20">
        <div className="flex flex-col items-center gap-7.5">
          <p className="w-full text-xl leading-7 font-semibold tracking-[-0.2px] text-primary-500">
            PAIN POINTS
          </p>
          <h2 className="text-5xl leading-18 font-bold tracking-[-0.48px] text-grey-900">
            대학생이라면 한 번쯤 겪어봤을 고민
            <br />
            이제 그만
          </h2>
        </div>

        <div className="flex w-full items-center gap-6">
          {PAIN_POINTS.map(({ icon, title, description }) => (
            <PainPointCard key={title} icon={icon} title={title}>
              {description}
            </PainPointCard>
          ))}
        </div>
      </div>
    </section>
  );
}
