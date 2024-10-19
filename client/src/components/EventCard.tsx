import React from 'react';

// Define the types for the props
interface EventCardProps {
  eventName: string;
  trainedBy: string;
  info: string;
  price: number;
  image: string;
}

const EventCard: React.FC<EventCardProps> = ({ eventName, trainedBy, info, price, image }) => {
  return (
    <div className="relative rounded-s-md shadow-xl p-6 m-3 pt-1 pl-0 pr-0 bg-white">
        <img src={image} className="w-full h-48 md:h-60 lg:h-72 object-cover rounded-t-lg" />
        <h3 className="text-2xl text-left pl-4 font-bold font-sans mb-2 mt-4">{eventName}</h3>
        <p className="text-customColor text-lg text-left pl-4 font-bold mb-4">
          Trained by - <span className="text-black font-sans font-semibold">{trainedBy}</span>
        </p>
        <p className="text-slate-800 text-lg text-left pl-4">{info}</p>
        <span className="bg-red-500 text-white font-bold flex items-center justify-center w-14 h-14 rounded-full absolute left-72 bottom-12 md:bottom-20 lg:bottom-24">
          {price}
        </span>
    </div>
  );
};

export default EventCard;
