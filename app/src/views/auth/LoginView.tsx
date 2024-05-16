//views/auth/LoginView.tsx;
import React from "react";
import AuthLayout from "./AuthLayout";
import LoginForm from "../../components/auth/LoginForm";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { IAuth } from "../../redux/types";
import Spinner from "../../components/ui/Spinner";

const LoginView: React.FC = () => {
  const authReducer = useSelector((state: IRootState) => state.auth) as IAuth;
  const { loading, error } = authReducer || {};

  return (
    <AuthLayout>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-8 lg:px-8">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white mb-20">
          Sign in to your account
        </h2>

        {!loading && (
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {error && (
              <div className="mt-4">
                <p className="text-sm text-red-500 text-center font-semibold mb-4">
                  {error}
                </p>
              </div>
            )}
            <LoginForm />

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{" "}
              <a
                href="/auth/register"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                register now
              </a>
            </p>
          </div>
        )}
        {loading && (
          <div className="flex w-full justify-center mt-20">
            <Spinner />
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default LoginView;
