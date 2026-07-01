interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`flex flex-col items-center w-full min-h-full p-6 gap-11.5 rounded-[40px] bg-white shadow-[0_0_50px_0_rgba(22,53,164,0.08)] ${className}`}
    >
      {children}
    </div>
  );
};
