import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";

export const Hero = () => {
  return (
    <div className="hidden lg:block lg:w-[75%] relative min-h-screen overflow-hidden">
      <HeroBackground />
      <HeroContent />
    </div>
  );
};
