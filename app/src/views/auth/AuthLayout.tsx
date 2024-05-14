//views/auth/AuthLayout.tsx;
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" px-10 flex flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
