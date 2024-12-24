import { FormInput, FormSelect } from "../../../components/common/FormInput";
import { Button } from "../../../components/common/Button";
import SignUpHeader from "./SignUpHeader";
import SignUpLinks from "./SignUpLinks";
import { useState } from "react";

interface FormProps {
  genderOptions: { value: string; label: string }[];
  courseOptions: { value: string; label: string }[];
  getBranchOptions: (courseId: string) => { value: string; label: string }[];
  validationRules: Record<
    string,
    { validate: (value: string) => boolean; message: string }
  >;
}

interface FormErrors {
  [key: string]: string;
}

interface FormData {
  [key: string]: string;
}

const SignUpForm = ({
  genderOptions,
  courseOptions,
  getBranchOptions,
  validationRules,
}: FormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    endYear: "",
    course: "",
    branch: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: string) => {
    if (name === "confirmPassword") {
      return value === formData.password ? "" : "Not the same as password";
    }

    const rule = validationRules[name as keyof typeof validationRules];
    if (!rule) return "";

    return rule.validate(value) ? "" : rule.message;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "course") {
      setFormData((prev) => ({ ...prev, branch: "" }));
    }

    if (name === "password") {
      const confirmPasswordError = formData.confirmPassword
        ? validateField("confirmPassword", formData.confirmPassword)
        : "";
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmPasswordError,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Handle successful form submission
      console.log("Form submitted:", formData);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear + i;
    return { value: year.toString(), label: year.toString() };
  });

  const branchOptions = getBranchOptions(formData.course);

  return (
    <div className="w-full max-w-3xl">
      <SignUpHeader />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            type="text"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
          />
          <FormInput
            type="text"
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.username}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
          />
          <FormInput
            type="tel"
            name="phone"
            label="Phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            name="gender"
            label="Gender"
            options={genderOptions}
            value={formData.gender}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.gender}
          />
          <FormSelect
            name="endYear"
            label="Course End Year"
            options={yearOptions}
            value={formData.endYear}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.endYear}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            name="course"
            label="Course"
            options={courseOptions}
            value={formData.course}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.course}
          />
          <FormSelect
            name="branch"
            label="Branch"
            options={branchOptions}
            value={formData.branch}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.branch}
            disabled={!formData.course}
            className={!formData.course ? "cursor-not-allowed opacity-50" : ""}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
          />
          <FormInput
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
          />
        </div>

        <Button type="submit">Create account</Button>
        <SignUpLinks />
      </form>
    </div>
  );
};

export default SignUpForm;
