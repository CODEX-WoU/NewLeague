import React from "react";
import { FormInput } from "../../../components/common/FormInput";
import { LoginLinks } from "./LoginLinks";
import { Button } from "../../../components/common/Button";
import { LoginHeader } from "./LoginHeader";

const LoginForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="w-full max-w-md">
      <LoginHeader />
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput type="text" name="username" label="Username" />
        <FormInput type="password" name="password" label="Password" />
        <Button type="submit">Login</Button>
        <LoginLinks />
      </form>
    </div>
  );
};

export default LoginForm;
