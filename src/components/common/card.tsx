interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`flex min-h-full w-full flex-col items-center gap-8 overflow-hidden rounded-[24px] bg-white p-4 shadow-[0_0_50px_0_rgba(22,53,164,0.08)] md:gap-11.5 md:rounded-[40px] md:p-6 ${className}`}
    >
      {children}
    </div>
  );
};
