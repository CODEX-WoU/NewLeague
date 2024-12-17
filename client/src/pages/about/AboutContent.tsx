import { useState } from "react";
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
  const [videoId, setVideoId] = useState<string | null>(null); // State to manage the video ID to display in the modal

  // Function to open the video modal
  const openVideoModal = (id: string) => {
    setVideoId(id);
  };

  // Function to close the video modal
  const closeVideoModal = () => {
    setVideoId(null);
  };

  const videoData = [
    {
      id: "aRGdDy18qfY",
      thumbnail: "https://img.youtube.com/vi/aRGdDy18qfY/hqdefault.jpg",
    },
    {
      id: "F0GQ0l2NfHA",
      thumbnail: "https://img.youtube.com/vi/F0GQ0l2NfHA/hqdefault.jpg",
    },
    {
      id: "0EEJM4S5w38",
      thumbnail: "https://img.youtube.com/vi/0EEJM4S5w38/hqdefault.jpg",
    },
  ];

  return (
    <div className="relative font-plain h-screen xl:h-[85vh]  w-full overflow-hidden shadow-2xl">
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
      <div className="relative z-5 h-full flex flex-col justify-center items-start px-16 2xl:px-72">
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight max-w-2xl">
          {title}
        </h1>
        <p className="text-lg  text-gray-200 max-w-2xl mb-10 leading-relaxed">
          {description}
        </p>

        <button
          onClick={onGetStarted}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-full text-lg font-semibold hover:bg-red-700 hover:scale-105 transition-transform"
        >
          <div className="text-white flex items-center justify-center gap-3">
            <div className="">Get Started</div>
            <div className=" bg-black p-2 rounded-full flex items-center justify-center font-semibold">
              <FiArrowRight className="w-10 h-6" />
            </div>
          </div>
        </button>
        {/*Video thumbnails */}
        <div className="z-5 mt-20 flex flex-wrap justify-center gap-8">
          {videoData.map((video, index) => (
            <div
              key={index}
              className="cursor-pointer hover:scale-105 transition-transform w-[240px] sm:w-[300px] lg:w-[350px] aspect-video rounded-badge overflow-hidden shadow-xl"
              onClick={() => openVideoModal(video.id)} // Open the video modal when a thumbnail is clicked
            >
              <img
                src={video.thumbnail}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {videoId && (
        <div
          className="fixed inset-0 backdrop-blur-sm drop-shadow-2xl opacity-100 pointer-events-auto flex items-center justify-center z-10"
          onClick={closeVideoModal} // Close on clicking the background
        >
          <div
            className="relative w-[70vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
            <button
              onClick={closeVideoModal} // Close button for the video modal
              className="fixed top-14 right-60 text-white font-bold text-2xl"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutContent;
