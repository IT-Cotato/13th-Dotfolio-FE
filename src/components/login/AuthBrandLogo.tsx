import LogoEllipse from "@/assets/logo_Ellipse.svg";
import LogoRectangle from "@/assets/logo_Rectangle 33479.svg";

export function AuthBrandLogo() {
  return (
    <div className="flex size-28 items-center justify-center gap-10 p-9 text-grey-0">
      <div className="flex size-20 shrink-0 items-start justify-between">
        <LogoEllipse className="size-3 shrink-0" />
        <span
          aria-hidden="true"
          className="h-20 w-2.5 shrink-0 bg-grey-0 shadow-[inset_0_-0.576px_0.576px_0_rgba(255,255,255,0.15)]"
        />
        <LogoRectangle className="h-20 w-12 shrink-0" />
      </div>
    </div>  
  );
}
