import React from "react";
import Input from "../ui/Input";

interface ConfidentialInformationFormProps {
  formData: {
    newPassword: string;
    confirmNewPassword: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userError: string;
}

const ConfidentialInformationForm: React.FC<
  ConfidentialInformationFormProps
> = ({ formData, handleChange, userError }) => (
  <div className="border-b border-gray-400/10 pb-12">
    <h2 className="text-base font-semibold leading-7 text-white">
      Confidential Information
    </h2>
    <p className="mt-1 text-sm leading-6 text-gray-600">
      Be careful if you change your password, we cannot recover it.
    </p>
    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <Input
        id="newPassword"
        name="newPassword"
        label="New password"
        type="password"
        autoComplete="new-password"
        required
        value={formData.newPassword}
        onChange={handleChange}
        className="sm:col-span-4"
      />
      <Input
        id="confirmNewPassword"
        name="confirmNewPassword"
        label="Confirm new password"
        type="password"
        autoComplete="confirm-new-password"
        required
        value={formData.confirmNewPassword}
        onChange={handleChange}
        className="sm:col-span-4"
      />
    </div>
    {userError && <div className="mt-4 text-red-500 text-sm">{userError}</div>}
  </div>
);

export default ConfidentialInformationForm;
