import { server } from "../../../config/axiosConfig";
import React, { useState } from "react";
import { FormInput } from "../../../components/common/FormInput";
import { LoginLinks } from "./LoginLinks";
import { Button } from "../../../components/common/Button";
import { LoginHeader } from "./LoginHeader";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await server.post("/auth/users/signin", formData);

      if (response.status === 200 && response.data.success) {
        const { token, expiresAtMs, role } = response.data.data;

        // Save token, expiration, and role in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("expiresAtMs", expiresAtMs.toString());
        localStorage.setItem("role", role);

        setSuccess("Login successful! Redirecting...");

        // Redirect after 1.5 seconds
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="w-full max-w-md">
      <LoginHeader />
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          type="email"
          name="email"
          label="Email"
          onChange={handleChange}
        />
        <FormInput
          type="password"
          name="password"
          label="Password"
          onChange={handleChange}
        />
        <Button type="submit">Login</Button>
        <LoginLinks />
      </form>
    </div>
  );
};

export default LoginForm;
