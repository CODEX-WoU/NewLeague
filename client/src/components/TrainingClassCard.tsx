import React from "react";

interface EventCardProps {
  eventName: string;
  trainedBy: string;
  info: string;
  price: number;
  image: string;
}

const EventCard: React.FC<EventCardProps> = ({
  eventName,
  trainedBy,
  info,
  price,
  image,
}) => {
  return (
    <div className="relative rounded-md shadow-xl p-6 m-3 pt-1 pl-0 pr-0 pb-4 bg-white">
      <img
        src={image}
        className="w-full h-48 md:h-60 lg:h-72 object-cover rounded-t-lg"
        alt={eventName}
      />

      {/* Flexbox applied to the event name and price */}
      <div className="flex items-center justify-between mt-4 px-4">
        <h3 className="text-2xl font-bold font-sans">{eventName}</h3>
        <span className="bg-red-500 text-white font-bold flex items-center justify-center w-14 h-14 rounded-full">
          {price} /-
        </span>
      </div>

      <p className="text-slate-500 text-lg text-left pl-4 font-bold mb-4">
        Trained by -{" "}
        <span className="text-black font-sans font-semibold">{trainedBy}</span>
      </p>
      <p className="text-slate-500 content-center text-lg p-3">{info}</p>
    </div>
  );
};

export default EventCard;
