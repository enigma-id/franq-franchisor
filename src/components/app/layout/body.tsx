import clsx from "clsx";
import type { FC, ReactNode } from "react";

interface BodyProps {
  children: ReactNode;
  className?: string;
}

const Body: FC<BodyProps> = ({ className, children }) => {
  return (
    <div className={clsx("p-4 lg:p-6 flex-1 overflow-y-auto min-h-0", className)}>
      {children}
    </div>
  );
};

export default Body;
