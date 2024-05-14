import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/auth";
import { AppDispatch } from "../../redux/store";
import Input from "../ui/Input";

const LoginForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <Input
          id="username"
          name="username"
          label="Username"
          type="text"
          required
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      <div>
        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
