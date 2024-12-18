import { Checkbox } from "../common/Checkbox";

export const LoginLinks = () => {
  return (
    <div className="space-y-8">
      {/* Remember me and Forgot password on the same line */}
      <div className="flex items-center justify-between text-sm">
        <Checkbox label="Remember me" />
        <a href="#" className="text-primary hover:underline">
          Forgot password?
        </a>
      </div>

      {/* Create account link on a separate line with more spacing */}
      <div className="text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <a href="#" className="text-primary hover:underline">
          Create One
        </a>
      </div>
    </div>
  );
};
