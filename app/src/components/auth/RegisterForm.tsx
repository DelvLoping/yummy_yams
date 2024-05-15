import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../redux/slices/auth";
import { AppDispatch } from "../../redux/store";
import Input from "../ui/Input";

const RegisterForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
    passwordConfirm: string;
  }>({
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [isPasswordEqual, setIsPasswordEqual] = useState(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      setIsPasswordEqual(false);
      return;
    }
    dispatch(register(formData));
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Input
        id="username"
        name="username"
        label="Username"
        type="text"
        required
        value={formData.username}
        onChange={handleChange}
      />

      <div className=" flex flex-col gap-2">
        <Input
          id="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
        />

        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          label="Confirm Password"
          placeholder="Confirm your password"
          type="password"
          required
          value={formData.passwordConfirm}
          onChange={handleChange}
        />
        {!isPasswordEqual && (
          <div className="mt-2">
            <p className="text-sm text-red-500 text-center font-semibold">
              Passwords do not match
            </p>
          </div>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
