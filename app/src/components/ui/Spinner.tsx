import React from "react";
interface SpinnerProps {
  text?: string;
  color?: string;
}

const Spinner: React.FC = ({
  text = "Loading...",
  color = "primary",
}: SpinnerProps) => {
  return (
    <div
      className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-${color} motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        {text}
      </span>
    </div>
  );
};

export default Spinner;
