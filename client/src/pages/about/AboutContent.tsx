import { FiArrowRight } from "react-icons/fi";

interface AboutProps {
  title: string;
  description: string;
  backgroundGif: string;
  onGetStarted?: () => void;
}

const AboutContent: React.FC<AboutProps> = ({
  title,
  description,
  backgroundGif,
  onGetStarted,
}) => {
  return (
    <div className="relative font-plain h-[500px] lg:h-[80vh]  w-full overflow-hidden shadow-2xl">
      {/* Background GIF with lazy loading */}
      <div className="absolute inset-0">
        <img
          src={backgroundGif}
          alt="Background"
          loading="lazy"
          className="h-full w-full object-cover scale-110 transform transition-transform duration-1500"
        />
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br  from-black/95 via-black/85 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-5 h-full flex flex-col justify-center px-16 lg:px-96">
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight max-w-2xl">
          {title}
        </h1>
        <p className="text-lg  text-gray-200 max-w-2xl mb-10 leading-relaxed">
          {description}
        </p>

        <button
          onClick={onGetStarted}
          className="btn btn-primary text-white w-fit gap-2 px-8 text-lg font-semibold hover:scale-105 transition-transform duration-200"
        >
          Get Started
          <FiArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AboutContent;
