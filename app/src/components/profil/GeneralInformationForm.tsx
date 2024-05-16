import React from "react";
import Input from "../ui/Input";
interface GeneralInformationFormProps {
  formData: {
    username: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GeneralInformationForm: React.FC<GeneralInformationFormProps> = ({
  formData,
  handleChange,
}) => (
  <div className="border-b border-gray-400/10 pb-12">
    <h2 className="text-base font-semibold leading-7 text-white">
      General Information
    </h2>
    <p className="mt-1 text-sm leading-6 text-gray-600">
      You can update your general information here.
    </p>
    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <Input
        id="username"
        name="username"
        label="Username"
        type="text"
        required
        value={formData.username}
        onChange={handleChange}
        className="sm:col-span-4"
      />
    </div>
  </div>
);

export default GeneralInformationForm;
