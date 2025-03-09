import { Hero } from "../../../components/auth/Hero";
import Logo from "../../../components/common/Logo";
import SignUpForm from "./SignUpForm";
import { validationRules } from "./validationRules";
// TODO: replace with options from back-end
import {
  genderOptions,
  courseOptions,
  getBranchOptions,
} from "./placeholderData";

const SignUp = () => {
  return (
    <div className="min-h-screen flex">
      {/* Hero section - 40% width */}
      <Hero />

      {/* Form section - 60% width */}
      <div className="lg:w-[60%] min-h-screen p-12 relative">
        {/* Logo positioned absolutely at top-left */}
        <div className="absolute top-12 left-12">
          <Logo />
        </div>

        {/* Center the form vertically */}
        <div className="h-full flex items-center justify-center pt-20">
          <SignUpForm
            courseOptions={courseOptions}
            genderOptions={genderOptions}
            getBranchOptions={getBranchOptions}
            validationRules={validationRules}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
