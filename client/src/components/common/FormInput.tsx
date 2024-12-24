import React, { useState } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const FormInput = ({
  label,
  error,
  className = "",
  onBlur,
  ...props
}: FormInputProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e);
    if (error) {
      setShowTooltip(true);
    }
  };

  const handleFocus = () => {
    setShowTooltip(false);
  };

  return (
    <div className="space-y-2 relative">
      <label
        htmlFor={props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        {...props}
        id={props.name}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={`w-full input input-bordered focus:outline-none focus:border-primary h-12 ${
          error ? "input-error" : ""
        } ${className}`}
      />
      {error && showTooltip && (
        <div className="absolute right-0 top-full mt-1 z-10">
          <div className="bg-error text-error-content text-xs rounded px-2 py-1">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export const FormSelect = ({
  label,
  options,
  error,
  className = "",
  ...props
}: FormSelectProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleBlur = () => {
    if (error) {
      setShowTooltip(true);
    }
  };

  const handleFocus = () => {
    setShowTooltip(false);
  };

  return (
    <div className="space-y-2 relative">
      <label
        htmlFor={props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        {...props}
        id={props.name}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={`w-full select select-bordered focus:outline-none focus:border-primary h-12 ${
          error ? "input-error" : ""
        } ${className}`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && showTooltip && (
        <div className="absolute right-0 top-full mt-1 z-10">
          <div className="bg-error text-error-content text-xs rounded px-2 py-1">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};
