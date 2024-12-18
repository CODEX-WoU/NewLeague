import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

export const FormInput = ({ label, ...props }: FormInputProps) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        {...props}
        id={props.name}
        className="w-full input input-bordered focus:outline-none focus:border-primary h-12"
      />
    </div>
  );
};
