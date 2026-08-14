const BRAND_STORY_GRAPHIC_URL = new URL(
  "../../assets/landing_brandstory/landing_brandstory.png",
  import.meta.url,
).href;

export function BrandStoryGraphic() {
  return (
    <img
      src={BRAND_STORY_GRAPHIC_URL}
      alt="흩어진 점들이 하나의 형태로 연결되는 그래픽"
      className="h-auto w-[505px] shrink-0"
    />
  );
}
