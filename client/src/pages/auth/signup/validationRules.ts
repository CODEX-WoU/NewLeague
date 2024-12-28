export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@woxsen\.edu\.in$/;
export const PHONE_REGEX = /^\d{10}$/;

export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export const validationRules = {
  name: {
    validate: (value: string) => value.trim().length > 0,
    message: "Name is required",
  },
  id: {
    validate: (value: string) => value.trim().length > 0,
    message: "Username is required",
  },
  email: {
    validate: (value: string) => EMAIL_REGEX.test(value),
    message: "Should be valid email with domain '@woxsen.edu.in'",
  },
  phone: {
    validate: (value: string) => PHONE_REGEX.test(value),
    message: "Should contain 10 digits only",
  },
  gender: {
    validate: (value: string) => value.trim().length > 0,
    message: "Gender is required",
  },
  endYear: {
    validate: (value: string) => value.trim().length > 0,
    message: "Course end year is required",
  },
  course: {
    validate: (value: string) => value.trim().length > 0,
    message: "Course is required",
  },
  branch: {
    validate: (value: string) => value.trim().length > 0,
    message: "Branch is required",
  },
  password: {
    validate: (value: string) => value.length >= 8,
    message: "Should be at least 8 characters",
  },
};
