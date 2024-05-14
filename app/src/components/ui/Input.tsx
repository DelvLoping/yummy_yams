import React, { useState } from "react";
import { BsEyeSlash } from "react-icons/bs";
import { TbEyeDiscount } from "react-icons/tb";

interface InputProps {
  id: string;
  name: string;
  label: string;
  type: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  label,
  type,
  autoComplete,
  placeholder,
  required,
  value,
  onChange,
  className = "flex flex-col items-start",
}) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  const isPassword = type === "password";
  return (
    <>
      <div className={className}>
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-white"
        >
          {label}
        </label>

        <div className={`mt-2 w-full ${isPassword ? "relative" : ""}`}>
          <input
            id={id}
            name={name}
            type={isPassword ? (passwordShown ? "text" : "password") : type}
            autoComplete={autoComplete}
            placeholder={placeholder}
            required={required}
            className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-background-secondary"
            value={value}
            onChange={onChange}
          />
          <div className="absolute right-0 top-0 mt-2 mr-2">
            {passwordShown && isPassword ? (
              <BsEyeSlash onClick={togglePasswordVisiblity} />
            ) : (
              <TbEyeDiscount onClick={togglePasswordVisiblity} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Input;
