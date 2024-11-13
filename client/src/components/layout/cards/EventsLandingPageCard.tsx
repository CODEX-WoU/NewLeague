import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

type socialMediaName = "x" | "insta" | "facebook" | "linkedIn";
type socialLink = {
  name: socialMediaName;
  url: string;
};

type CardProps = {
  imageUrl: string;
  title: string;
  sport: string;
  socialLinks?: socialLink[];
};

const EventsLandingPageCard = (props: CardProps) => {
  const { imageUrl, title, sport } = props;
  var socialLinks = props.socialLinks;

  if (!socialLinks) socialLinks = [];

  const iconColumnCount = Math.ceil(socialLinks.length / 2);

  function getIconElement(iconName: socialMediaName) {
    switch (iconName) {
      case "facebook":
        return <FaFacebookF className="hover:text-primary" />;

      case "insta":
        return <FaInstagram className="hover:text-primary" />;

      case "linkedIn":
        return <FaLinkedin className="hover:text-primary" />;

      case "x":
        return <FaXTwitter className="hover:text-primary" />;
    }
  }

  return (
    <div
      className="lg:w-2/12 md:w-6/12"
      data-aos="fade-up"
      data-aos-delay="700"
    >
      <div className="shadow-lg rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt="Trainer"
          className="w-full h-60 object-cover"
        />

        <div className="p-4  grid grid-cols-5 gap-4">
          {/* Title and Subtitle: spans 3 columns */}
          <div className="col-span-3">
            <h3 className="text-xl font-semibold">{title}</h3>
            <span className="text-gray-500">{sport}</span>
          </div>

          {/* Icons: spans the remaining 2 columns */}
          <div className="col-span-2 p-2 py-0">
            <div
              className={`grid grid-cols-${iconColumnCount} gap-x-4 p-2 justify-end`}
            >
              {socialLinks.map((socialLink, index) => (
                <div key={index} className="flex mb-2">
                  <a href={socialLink.url}>{getIconElement(socialLink.name)}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsLandingPageCard;
