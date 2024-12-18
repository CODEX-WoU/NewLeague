import { BiShield } from "react-icons/bi";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <BiShield className="w-8 h-8 text-primary" />
      <span className="text-xl font-bold">League</span>
    </div>
  );
};

export default Logo;
