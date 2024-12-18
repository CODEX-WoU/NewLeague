import LoginForm from "../../../components/auth/LoginForm";
import Logo from "../../../components/common/Logo";
import { Hero } from "./Hero";

const SignInForm = () => {
  return (
    <div className="min-h-screen flex">
      {/* Hero section - 40% width */}
      <Hero />

      {/* Form section - 60% width */}
      <div className="w-full min-h-screen p-12 relative">
        {/* Logo positioned absolutely at top-left */}
        <div className="absolute top-12 left-12">
          <Logo />
        </div>

        {/* Center the form vertically */}
        <div className="h-full flex items-center justify-center pt-20">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
