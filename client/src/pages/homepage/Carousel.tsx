import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import HomePageImage from "../../assets/HomePage/HomePageLeague.webp";
import { useNavigate } from "react-router-dom";

type SlideContent = {
  heading?: string;
  bodyText?: string;
  imageSrc: string;
  onImageClickLink?: string;
  button1?: { text: string; link: string };
  button2?: { text: string; link: string };
};

const defaultSlideContent: SlideContent[] = [
  {
    imageSrc: HomePageImage,
    heading: "Welcome to Sports Academy",
    button1: { text: "Book", link: "" },
    button2: { text: "Learn More", link: "" },
  },
];

const HomePageCarousel = (props: { slideContent: SlideContent[] }) => {
  var slideContent = props.slideContent;

  if (slideContent.length == 0) {
    slideContent = defaultSlideContent;
  }

  const sliderSettings: Settings = {
    slidesToShow: 1,
    slidesPerRow: 1,
    slidesToScroll: 1,
    infinite: slideContent.length >= 2,
    speed: 1000,
    lazyLoad: "anticipated",
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
  };

  return (
    <div>
      <Slider {...sliderSettings}>
        {slideContent.map((slide) => (
          <FullHeightSection {...slide} />
        ))}
      </Slider>
    </div>
  );
};

const FullHeightSection = (props: SlideContent) => {
  const buttonStyle1 =
    "btn btn-outline text-lg font-light btn-primary rounded-lg";
  const buttonStyle2 =
    "btn btn-link font-light text-lg hover:no-underline hover:text-primary font-plain text-white no-underline";

  function onButtonClick(url?: string) {
    if (url) {
      const navigate = useNavigate();

      if (url.startsWith("http") || url.startsWith("www")) {
        // External link
        window.location.href = url;
      } else {
        // Internal link
        navigate(url);
      }
    }
  }

  return (
    <div className="relative h-[85vh] w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${props.imageSrc})`,
          filter:
            props.bodyText || props.heading
              ? "brightness(0.35)"
              : "brighness(1)", // No dimming if no body text or heading
        }}
      ></div>

      {/* Optional Overlay Text */}
      <div
        className={`relative z-10 flex bg-[#171819] ${
          props.bodyText || props.heading ? "bg-opacity-60" : ""
        } flex-col h-full items-center justify-center text-white`}
      >
        <div>
          {props.heading && (
            <h1 className="text-5xl text-center font-bold font-plain">
              {props.heading}
            </h1>
          )}
        </div>
        {props.bodyText && <div className="my-12">{props.bodyText}</div>}
        <div className="my-8 flex gap-x-4">
          {props.button1 && (
            <button
              onClick={() => onButtonClick(props.button1?.link)}
              className={props.button2 ? buttonStyle2 : buttonStyle1}
            >
              {props.button1.text}
            </button>
          )}
          {props.button2 && (
            <button
              onClick={() => onButtonClick(props.button2?.link)}
              className={buttonStyle1}
            >
              {props.button2.text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePageCarousel;
